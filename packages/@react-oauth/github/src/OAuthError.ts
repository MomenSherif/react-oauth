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
} as const;

export type OAuthErrorCode = typeof OAuthErrorCode[keyof typeof OAuthErrorCode];

/**
 * Custom error class for OAuth-related errors with error codes
 */
export class OAuthError extends Error {
  /** The error code (e.g., "OA001") */
  readonly code: OAuthErrorCode;
  /** The original error message */
  readonly originalMessage: string;

  constructor(code: OAuthErrorCode, message: string) {
    const errorMessage = `${code} ${message}`;
    super(errorMessage);
    this.name = 'OAuthError';
    this.code = code;
    this.originalMessage = message;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OAuthError);
    }
  }

  /**
   * Creates an OAuthError for when the popup is closed
   */
  static popupClosed(): OAuthError {
    return new OAuthError(OAuthErrorCode.POPUP_CLOSED, 'The Popup Closed');
  }

  /**
   * Creates an OAuthError for when the popup is blocked
   */
  static popupBlocked(): OAuthError {
    return new OAuthError(
      OAuthErrorCode.POPUP_BLOCKED,
      'Popup Blocked By Browser',
    );
  }

  /**
   * Creates an OAuthError for state mismatch
   */
  static stateMismatch(): OAuthError {
    return new OAuthError(OAuthErrorCode.STATE_MISMATCH, 'State Mismatch');
  }
}
