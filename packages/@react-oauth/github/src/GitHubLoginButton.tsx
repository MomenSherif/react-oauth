import React from 'react';
import type { OAuthResponse } from './PopupWindow';
import { type UseGitHubLoginOptions, useGitHubLogin } from './useGitHubLogin';
import { cn } from './utils';

/**
 * Props for the GitHubLoginButton component
 *
 * The button handles the GitHub OAuth flow internally using the provided OAuth configuration.
 */
export type GitHubLoginButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'onError' | 'onSuccess'
> & {
  /** GitHub OAuth App Client ID */
  clientId: string;
  /** Callback function called when authentication succeeds */
  onSuccess: (response: OAuthResponse) => void;
  /** Callback function called when authentication fails */
  onError: (error: Error) => void;
  /** Registered redirect URI for your GitHub OAuth App */
  redirectUri?: string;
  /** OAuth scopes to request (default: "user:email") */
  scope?: string;
  /** Options for configuring the popup window */
  popupOptions?: UseGitHubLoginOptions['popupOptions'];
  /** State parameter for CSRF protection (auto-generated if not provided) */
  state?: string;
  /** Whether to allow signup during authentication */
  allowSignup?: boolean;
  /** Optional callback function called when OAuth flow is initiated */
  onRequest?: () => void;
  /** Custom React node to render as the button content */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
};

/**
 * A ready-to-use button component for GitHub OAuth login
 *
 * This component handles the GitHub OAuth flow internally. Simply provide OAuth configuration
 * props and the button will handle the rest. For custom implementations, use the `useGitHubLogin`
 * hook instead.
 *
 * The loading state is exposed via a `data-loading` attribute so you can style it with CSS.
 *
 * @example
 * ```tsx
 * import { GitHubLoginButton } from '@react-oauth/github';
 *
 * function App() {
 *   return (
 *     <GitHubLoginButton
 *       clientId="your-client-id"
 *       redirectUri="http://localhost:3000/callback"
 *       onSuccess={(response) => {
 *         console.log('Authorization code:', response.code);
 *       }}
 *       onError={(error) => {
 *         console.error('Authentication failed:', error);
 *       }}
 *       className="px-4 py-2 bg-gray-900 text-white rounded data-[loading=true]:opacity-50"
 *     >
 *       Sign in with GitHub
 *     </GitHubLoginButton>
 *   );
 * }
 * ```
 */
export const GitHubLoginButton = React.forwardRef<
  HTMLButtonElement,
  GitHubLoginButtonProps
>((props, ref) => {
  const {
    children = 'Sign in with GitHub',
    className,
    disabled,
    clientId,
    redirectUri,
    scope,
    popupOptions,
    state,
    allowSignup,
    onSuccess,
    onError,
    onRequest,
    ...buttonProps
  } = props;

  const { initiateGitHubLogin, isLoading } = useGitHubLogin({
    clientId,
    redirectUri,
    scope,
    popupOptions,
    state,
    allowSignup,
    onSuccess,
    onError,
    onRequest,
  });

  return (
    <button
      {...buttonProps}
      className={cn('github-login-button', className)}
      data-loading={isLoading}
      disabled={isLoading || disabled}
      onClick={initiateGitHubLogin}
      ref={ref}
      type="button"
    >
      {children}
    </button>
  );
});

GitHubLoginButton.displayName = 'GitHubLoginButton';

export default GitHubLoginButton;
