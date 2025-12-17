import type React from 'react';
import { GitHubLoginButton } from './GitHubLoginButton';
import type { UseGitHubLoginOptions } from './useGitHubLogin';
/**
 * Props for the GitHubLogin component
 */
export type GitHubLoginProps = UseGitHubLoginOptions & {
  /** Custom React node to render as the button content */
  children?: React.ReactNode;
  /** Additional CSS class names for the button */
  className?: string;
};

/**
 * A modern React component for GitHub OAuth authentication
 *
 * This component provides a button that opens a popup window for GitHub OAuth
 * authentication. It handles the OAuth flow and calls the appropriate callbacks
 * when authentication succeeds or fails.
 *
 * The component uses the `useGitHubLogin` hook internally. You can customize
 * it with className and children, or use the hook directly for complete control.
 *
 * @example
 * ```tsx
 * import { GitHubLogin } from '@react-oauth/github';
 *
 * function App() {
 *   return (
 *     <GitHubLogin
 *       clientId="your-client-id"
 *       redirectUri="http://localhost:3000/callback"
 *       onSuccess={(response) => {
 *         console.log('Authorization code:', response.code);
 *       }}
 *       onError={(error) => {
 *         console.error('Authentication failed:', error);
 *       }}
 *       className="px-4 py-2 bg-gray-900 text-white rounded"
 *     >
 *       Sign in with GitHub
 *     </GitHubLogin>
 *   );
 * }
 * ```
 */
export const GitHubLogin: React.FC<GitHubLoginProps> = ({
  children = 'Sign in with GitHub',
  className,
  ...options
}) => (
  <GitHubLoginButton className={className} {...options}>
    {children}
  </GitHubLoginButton>
);

export default GitHubLogin;
