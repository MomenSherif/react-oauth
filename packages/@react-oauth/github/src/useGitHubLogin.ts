import { useCallback, useMemo, useRef, useState } from 'react';
import { OAuthError } from './OAuthError';
import {
  openPopupWindow,
  type OAuthResponse,
  type PopupWindowOptions,
  type PopupWindowPromise,
} from './PopupWindow';

/**
 * Configuration options for the useGitHubLogin hook
 */
export type UseGitHubLoginOptions = {
  /** GitHub OAuth App Client ID (required) */
  clientId: string;
  /** Registered redirect URI for your GitHub OAuth App */
  redirectUri?: string;
  /** OAuth scopes to request (default: "user:email") */
  scope?: string;
  /** Options for configuring the popup window */
  popupOptions?: PopupWindowOptions;
  /** State parameter for CSRF protection (auto-generated if not provided) */
  state?: string;
  /** Whether to allow signup during authentication */
  allowSignup?: boolean;
  /** Callback function called when authentication succeeds */
  onSuccess: (response: OAuthResponse) => void;
  /** Callback function called when authentication fails */
  onError: (error: Error) => void;
  /** Optional callback function called when OAuth flow is initiated */
  onRequest?: () => void;
};

/**
 * Return type of the useGitHubLogin hook
 */
export type UseGitHubLoginReturn = {
  /** Function to initiate the GitHub OAuth flow */
  initiateGitHubLogin: () => void;
  /** Whether the OAuth flow is currently in progress */
  isLoading: boolean;
};

/**
 * Generates a random state string for CSRF protection
 * @returns A random state string
 */
function generateState(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Custom React hook for GitHub OAuth authentication
 *
 * This hook provides a simplified and flexible way to integrate GitHub OAuth into your application.
 * All configuration options, including callbacks, are passed in a single options object.
 * The state parameter for CSRF protection is automatically generated if not provided.
 *
 * @param options - Configuration options including callbacks
 * @returns An object containing the `initiateGitHubLogin` function and `isLoading` state
 *
 * @example
 * ```tsx
 * import { useGitHubLogin } from '@react-oauth/github';
 *
 * function CustomLoginButton() {
 *   const { initiateGitHubLogin, isLoading } = useGitHubLogin({
 *     clientId: 'your-client-id',
 *     redirectUri: 'http://localhost:3000/callback',
 *     onSuccess: (response) => {
 *       console.log('Success:', response.code);
 *     },
 *     onError: (error) => {
 *       console.error('Error:', error);
 *     },
 *   });
 *
 *   return (
 *     <button onClick={initiateGitHubLogin} disabled={isLoading}>
 *       {isLoading ? 'Loading...' : 'Sign in with GitHub'}
 *     </button>
 *   );
 * }
 * ```
 */

export function useGitHubLogin(
  options: UseGitHubLoginOptions,
): UseGitHubLoginReturn {
  const popupRef = useRef<PopupWindowPromise | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract individual options to avoid dependency on the whole options object
  const {
    clientId,
    redirectUri = '',
    scope = 'user:email',
    popupOptions = {},
    allowSignup = true,
    onSuccess,
    onError,
    onRequest,
  } = options;

  // Use refs for callbacks to avoid requiring users to memoize them
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const onRequestRef = useRef(onRequest);
  onRequestRef.current = onRequest;

  // Generate state if not provided (for CSRF protection)
  const state = useMemo(
    () => options.state || generateState(),
    [options.state],
  );

  const initiateGitHubLogin = useCallback(() => {
    // Validate required props
    if (!clientId) {
      const error = new Error('clientId is required');
      onErrorRef.current(error);
      return;
    }

    // Prevent multiple simultaneous login attempts
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    // Build the OAuth authorization URL
    const url = `https://github.com/login/oauth/authorize?${new URLSearchParams(
      {
        client_id: clientId,
        scope,
        redirect_uri: redirectUri,
        state,
        ...(allowSignup ? {} : { allow_signup: 'false' }),
      },
    )}`;

    try {
      // Call onRequest callback if provided
      onRequestRef.current?.();

      // Open popup window
      const popup = openPopupWindow(
        'github-oauth-authorize',
        url,
        popupOptions,
      );

      popupRef.current = popup;

      // Handle successful authentication
      popup
        .then((data: OAuthResponse) => {
          setIsLoading(false);

          // Verify state matches (CSRF protection)
          if (data.state && data.state !== state) {
            onErrorRef.current(OAuthError.stateMismatch());
            return;
          }

          if (!data.code) {
            onErrorRef.current(OAuthError.missingCode());
            return;
          }
          onSuccessRef.current(data);
        })
        .catch((error: Error) => {
          setIsLoading(false);
          onErrorRef.current(
            error instanceof Error ? error : new Error(String(error)),
          );
        });
    } catch (error) {
      setIsLoading(false);
      onErrorRef.current(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }, [
    clientId,
    redirectUri,
    scope,
    popupOptions,
    allowSignup,
    state,
    isLoading,
  ]);

  return {
    initiateGitHubLogin,
    isLoading,
  };
}
