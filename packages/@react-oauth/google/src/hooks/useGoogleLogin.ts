import { useCallback, useEffect, useRef } from 'react';
import { useGoogleOAuth } from '../GoogleOAuthProvider';
import type {
  CodeClientConfig,
  CodeResponse,
  CredentialResponse,
  GoogleCredentialResponse,
  IdConfiguration,
  MomentListener,
  NonOAuthError,
  OverridableTokenClientConfig,
  TokenClientConfig,
  TokenResponse,
} from '../types';
import { extractClientId } from '../utils';

type ImplicitOnError = (
  onError: Pick<TokenResponse, 'error' | 'error_description' | 'error_uri'>,
) => void;
interface ImplicitFlowOptions
  extends Omit<TokenClientConfig, 'client_id' | 'scope' | 'callback'> {
  onSuccess?: (
    tokenResponse: Omit<
      TokenResponse,
      'error' | 'error_description' | 'error_uri'
    >,
  ) => void;
  onError?: ImplicitOnError;
  onNonOAuthError?: (nonOAuthError: NonOAuthError) => void;
  scope?: TokenClientConfig['scope'];
  overrideScope?: boolean;
}

type AuthCodeOnError = (
  onError: Pick<TokenResponse, 'error' | 'error_description' | 'error_uri'>,
) => void;
interface AuthCodeFlowOptions
  extends Omit<CodeClientConfig, 'client_id' | 'scope' | 'callback'> {
  onSuccess?: (
    codeResponse: Omit<
      CodeResponse,
      'error' | 'error_description' | 'error_uri'
    >,
  ) => void;
  onError?: AuthCodeOnError;
  onNonOAuthError?: (nonOAuthError: NonOAuthError) => void;
  scope?: CodeResponse['scope'];
  overrideScope?: boolean;
}

type CredentialOnSuccess = (
  credentialResponse: Omit<
    CredentialResponse,
    'error' | 'error_description' | 'error_uri'
  >,
) => void;
type CredentialOnError = () => void;
interface CredentialFlowOptions
  extends Omit<IdConfiguration, 'client_id' | 'callback'> {
  onSuccess?: CredentialOnSuccess;
  onError?: CredentialOnError;
  state?: never;
  promptMomentNotification?: MomentListener;
}

export type UseGoogleLoginOptionsImplicitFlow = {
  flow?: 'implicit';
} & ImplicitFlowOptions;

export type UseGoogleLoginOptionsAuthCodeFlow = {
  flow?: 'auth-code';
} & AuthCodeFlowOptions;

export type UseGoogleLoginOptionsCredentialFlow = {
  flow?: 'credential';
} & CredentialFlowOptions;

export type UseGoogleLoginOptions =
  | UseGoogleLoginOptionsImplicitFlow
  | UseGoogleLoginOptionsAuthCodeFlow
  | UseGoogleLoginOptionsCredentialFlow;

export default function useGoogleLogin(
  options: UseGoogleLoginOptionsImplicitFlow,
): (overrideConfig?: OverridableTokenClientConfig) => void;
export default function useGoogleLogin(
  options: UseGoogleLoginOptionsAuthCodeFlow,
): () => void;
export default function useGoogleLogin(
  options: UseGoogleLoginOptionsCredentialFlow,
): () => void;

export default function useGoogleLogin({
  flow = 'implicit',
  onSuccess,
  onError,
  state,
  ...props
}: UseGoogleLoginOptions): unknown {
  const {
    scope = '',
    onNonOAuthError,
    overrideScope,
    ...implicitOrAuthProps
  } = props as
    | UseGoogleLoginOptionsImplicitFlow
    | UseGoogleLoginOptionsAuthCodeFlow;

  const { promptMomentNotification, ...credentialsProps } =
    props as UseGoogleLoginOptionsCredentialFlow;

  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const clientRef = useRef<any>();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const onNonOAuthErrorRef = useRef(onNonOAuthError);
  onNonOAuthErrorRef.current = onNonOAuthError;

  const promptMomentNotificationRef = useRef(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;

  useEffect(() => {
    if (!scriptLoadedSuccessfully) return;

    if (flow !== 'credential') {
      const clientMethod =
        flow === 'implicit' ? 'initTokenClient' : 'initCodeClient';

      clientRef.current = window?.google?.accounts.oauth2[clientMethod]({
        client_id: clientId,
        scope: overrideScope ? scope : `openid profile email ${scope}`,
        callback: (response: TokenResponse | CodeResponse) => {
          if (response.error)
            return (onErrorRef.current as ImplicitOnError | AuthCodeOnError)?.(
              response,
            );

          onSuccessRef.current?.(response as any);
        },
        error_callback: (nonOAuthError: NonOAuthError) => {
          onNonOAuthErrorRef.current?.(nonOAuthError);
        },
        state,
        ...implicitOrAuthProps,
      });
    } else {
      window?.google?.accounts?.id?.initialize({
        client_id: clientId,
        callback: (credentialResponse: GoogleCredentialResponse) => {
          if (!credentialResponse?.credential) {
            return (onErrorRef.current as CredentialOnError)?.();
          }

          const { credential, select_by } = credentialResponse;
          (onSuccessRef.current as CredentialOnSuccess)?.({
            credential,
            clientId: extractClientId(credentialResponse),
            select_by,
          });
        },
        ...credentialsProps,
      });

      clientRef.current = window?.google?.accounts?.id;
    }
  }, [
    clientId,
    credentialsProps,
    flow,
    implicitOrAuthProps,
    overrideScope,
    scope,
    scriptLoadedSuccessfully,
    state,
  ]);

  const loginImplicitFlow = useCallback(
    (overrideConfig?: OverridableTokenClientConfig) =>
      clientRef.current?.requestAccessToken(overrideConfig),
    [],
  );

  const loginAuthCodeFlow = useCallback(
    () => clientRef.current?.requestCode(),
    [],
  );

  const loginCredentialFlow = useCallback(
    () => clientRef.current?.prompt(promptMomentNotificationRef.current),
    [],
  );

  switch (flow) {
    case 'implicit':
      return loginImplicitFlow;
    case 'auth-code':
      return loginAuthCodeFlow;
    case 'credential':
      return loginCredentialFlow;
  }
}
