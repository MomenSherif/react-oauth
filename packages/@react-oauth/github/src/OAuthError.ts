/**
 * OAuth error codes
 */
export const OAuthErrorCode = {
  /** OA001: The popup window was closed by the user */
  POPUP_CLOSED: 'OA001',
  /** OA002: Popup window was blocked by the browser */
  POPUP_BLOCKED: 'OA002',
  /** OA003: State parameter mismatch - possible CSRF attack */
  STATE_MISMATCH: 'OA003',
  /** OA004: Authorization code not found in OAuth response */
  MISSING_CODE: 'OA004',
} as const;

export type OAuthErrorCode = typeof OAuthErrorCode[keyof typeof OAuthErrorCode];

/**
 * Error with OAuth error code attached
 */
export type OAuthError = Error & {
  code: OAuthErrorCode;
};

/**
 * Creates an OAuth error with the given code and message
 */
function createOAuthError(code: OAuthErrorCode, message: string): OAuthError {
  const error = new Error(`${code} ${message}`) as OAuthError;
  error.name = 'OAuthError';
  error.code = code;
  return error;
}

/**
 * OAuth error factory functions
 */
export const OAuthError = {
  /**
   * Creates an OAuthError for when the popup is closed
   */
  popupClosed: (): OAuthError =>
    createOAuthError(OAuthErrorCode.POPUP_CLOSED, 'The Popup Closed'),

  /**
   * Creates an OAuthError for when the popup is blocked
   */
  popupBlocked: (): OAuthError =>
    createOAuthError(OAuthErrorCode.POPUP_BLOCKED, 'Popup Blocked By Browser'),

  /**
   * Creates an OAuthError for state mismatch
   */
  stateMismatch: (): OAuthError =>
    createOAuthError(OAuthErrorCode.STATE_MISMATCH, 'State Mismatch'),

  /**
   * Creates an OAuthError for missing authorization code
   */
  missingCode: (): OAuthError =>
    createOAuthError(
      OAuthErrorCode.MISSING_CODE,
      'Authorization Code Not Found',
    ),

  /**
   * Type guard to check if an error is an OAuthError
   */
  isOAuthError: (error: unknown): error is OAuthError => {
    return (
      error instanceof Error &&
      'code' in error &&
      typeof (error as OAuthError).code === 'string' &&
      Object.values(OAuthErrorCode).includes((error as OAuthError).code)
    );
  },
};
