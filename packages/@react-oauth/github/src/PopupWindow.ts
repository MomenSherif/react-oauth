import { OAuthError } from './OAuthError';
import { parseQueryString } from './utils';

// Regex patterns for URL parsing (moved to top level for performance)
const QUERY_PREFIX_REGEX = /^\?/;
const HASH_PREFIX_REGEX = /^#/;

/**
 * Options for configuring the popup window
 */
export type PopupWindowOptions = {
  /** Height of the popup window in pixels */
  height?: number;
  /** Width of the popup window in pixels */
  width?: number;
  /** Left position of the popup window in pixels */
  left?: number;
  /** Top position of the popup window in pixels */
  top?: number;
};

/**
 * Response data from the OAuth popup
 */
export type OAuthResponse = {
  /** The authorization code returned by GitHub */
  code: string;
  /** Optional state parameter for CSRF protection */
  state?: string;
  /** Optional error message if authentication failed */
  error?: string;
  /** Optional error description */
  error_description?: string;
};

/**
 * A thenable object that represents a popup window OAuth flow
 * Can be used directly as a Promise with .then() and .catch()
 */
export type PopupWindowThenable = {
  /** Promise-like then method */
  then<TResult1 = OAuthResponse, TResult2 = never>(
    onfulfilled?: (value: OAuthResponse) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>,
  ): Promise<TResult1 | TResult2>;
  /** Promise-like catch method */
  catch<TResult = never>(
    onrejected?: (reason: unknown) => TResult | PromiseLike<TResult>,
  ): Promise<OAuthResponse | TResult>;
  /** Cleanup method to close the popup and stop polling */
  cleanup: () => void;
};

/**
 * Creates and launches a popup window for OAuth authentication
 *
 * This function handles opening a popup window, polling for the OAuth response,
 * and cleaning up when done. It returns a thenable object that resolves with the
 * OAuth response data or rejects with an error.
 *
 * @param id - Unique identifier for the popup window
 * @param url - The URL to open in the popup
 * @param options - Configuration options for the popup window
 * @returns A thenable object that can be used as a Promise
 *
 * @example
 * ```ts
 * const popup = openPopupWindow(
 *   'github-oauth',
 *   'https://github.com/login/oauth/authorize?...',
 *   { height: 1000, width: 600 }
 * );
 *
 * popup.then((data) => {
 *   console.log('Authorization code:', data.code);
 * }).catch((error) => {
 *   console.error('OAuth failed:', error);
 * });
 * ```
 */
export function openPopupWindow(
  id: string,
  url: string,
  options: PopupWindowOptions = {},
): PopupWindowThenable {
  // Closure state for managing the popup window
  let popupWindow: Window | null = null;
  let pollingIntervalId: number | null = null;
  let oauthPromise: Promise<OAuthResponse> = Promise.reject(
    new Error('Popup not initialized'),
  );

  // Normalize options with defaults
  const normalizedOptions: Required<PopupWindowOptions> = {
    height: 1000,
    width: 600,
    left: window.screen.width / 2 - 300,
    top: window.screen.height / 2 - 500,
    ...options,
  };

  /**
   * Stops the polling interval that checks for OAuth response
   */
  function stopPolling(): void {
    if (pollingIntervalId !== null) {
      window.clearInterval(pollingIntervalId);
      pollingIntervalId = null;
    }
  }

  /**
   * Checks if the popup is still on the initial or blank page
   */
  function isPopupOnInitialPage(popup: Window): boolean {
    return (
      popup.location.href === url ||
      popup.location.pathname === 'blank' ||
      popup.location.href === 'about:blank'
    );
  }

  /**
   * Extracts OAuth response from query parameters or hash fragment
   */
  function extractOAuthResponse(popup: Window): OAuthResponse | null {
    // Try query parameters first
    const queryParams = parseQueryString(
      popup.location.search.replace(QUERY_PREFIX_REGEX, ''),
    );

    if (queryParams.code) {
      return {
        code: queryParams.code,
        state: queryParams.state,
      };
    }

    // Try hash fragment
    if (popup.location.hash) {
      const hashParams = parseQueryString(
        popup.location.hash.replace(HASH_PREFIX_REGEX, ''),
      );
      if (hashParams.code) {
        return {
          code: hashParams.code,
          state: hashParams.state,
        };
      }
    }

    return null;
  }

  /**
   * Checks for OAuth errors in the URL parameters
   */
  function extractOAuthError(popup: Window): Error | null {
    const params = parseQueryString(
      popup.location.search.replace(QUERY_PREFIX_REGEX, ''),
    );

    if (params.error) {
      return new Error(
        params.error_description ||
          params.error ||
          'OAuth authentication failed',
      );
    }

    return null;
  }

  /**
   * Starts polling the popup window for the OAuth response
   *
   * This function checks the popup's location every 500ms to detect
   * when the OAuth flow completes. It resolves when it finds the
   * authorization code or rejects if the popup is closed.
   */
  function startPolling(): void {
    oauthPromise = new Promise<OAuthResponse>((resolve, reject) => {
      pollingIntervalId = window.setInterval(() => {
        try {
          const popup = popupWindow;

          if (!popup || popup.closed !== false) {
            cleanup();
            reject(OAuthError.popupClosed());
            return;
          }

          // Skip if still on the initial URL or blank page
          if (isPopupOnInitialPage(popup)) {
            return;
          }

          // Check for OAuth errors
          const error = extractOAuthError(popup);
          if (error) {
            cleanup();
            reject(error);
            return;
          }

          // Extract OAuth response
          const response = extractOAuthResponse(popup);
          if (response) {
            cleanup();
            resolve(response);
            return;
          }
        } catch (_error) {
          // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
          // This is expected when the popup is on a different domain (GitHub).
          // We'll keep polling until the popup redirects back to our domain.
        }
      }, 500);
    });
  }

  /**
   * Closes the popup window and stops polling
   */
  function cleanup(): void {
    stopPolling();
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close();
    }
  }

  /**
   * Launches the popup window and begins polling for OAuth response
   */
  function launchPopup(): void {
    // Format window.open options as comma-separated key=value pairs
    const windowOptions = [
      `height=${normalizedOptions.height}`,
      `width=${normalizedOptions.width}`,
      `left=${normalizedOptions.left}`,
      `top=${normalizedOptions.top}`,
    ].join(',');

    popupWindow = window.open(url, id, windowOptions);

    if (!popupWindow) {
      throw OAuthError.popupBlocked();
    }

    startPolling();
  }

  // Launch the popup immediately
  launchPopup();

  // Return a thenable object that can be used as a Promise
  const thenable = {
    // biome-ignore lint/suspicious/noThenProperty: PopupWindowThenable is intentionally thenable for Promise-like API
    then<TResult1 = OAuthResponse, TResult2 = never>(
      onfulfilled?: (value: OAuthResponse) => TResult1 | PromiseLike<TResult1>,
      onrejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>,
    ): Promise<TResult1 | TResult2> {
      return oauthPromise.then(onfulfilled, onrejected);
    },
    catch<TResult = never>(
      onrejected?: (reason: unknown) => TResult | PromiseLike<TResult>,
    ): Promise<OAuthResponse | TResult> {
      return oauthPromise.catch(onrejected);
    },
    cleanup,
  } as PopupWindowThenable;

  return thenable;
}
