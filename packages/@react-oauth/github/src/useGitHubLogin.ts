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

  // Generate state if not provided (for CSRF protection)
  const state = useMemo(
    () => options.state || generateState(),
    [options.state],
  );

  const initiateGitHubLogin = useCallback(() => {
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

    // Validate required props
    if (!clientId) {
      const error = new Error('clientId is required');
      onError(error);
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
      onRequest?.();

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
            onError(OAuthError.stateMismatch());
            return;
          }

          if (!data.code) {
            onError(OAuthError.missingCode());
            return;
          }
          onSuccess(data);
        })
        .catch((error: Error) => {
          setIsLoading(false);
          onError(error instanceof Error ? error : new Error(String(error)));
        });
    } catch (error) {
      setIsLoading(false);
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [options, state, isLoading]);

  return {
    initiateGitHubLogin,
    isLoading,
  };
}
