import { useCallback, useEffect, useRef } from 'react';
import { useGoogleOAuth } from '../GoogleOAuthProvider';
import {
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
  extends Omit<IdConfiguration, 'client_id' | 'scope' | 'callback'> {
  onSuccess?: CredentialOnSuccess;
  onError?: CredentialOnError;
  onNonOAuthError?: (nonOAuthError: NonOAuthError) => void;
  scope?: CodeResponse['scope'];
  overrideScope?: boolean;
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
  scope = '',
  onSuccess,
  onError,
  onNonOAuthError,
  overrideScope,
  state,
  ...props
}: UseGoogleLoginOptions): unknown {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const clientRef = useRef<any>();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const onNonOAuthErrorRef = useRef(onNonOAuthError);
  onNonOAuthErrorRef.current = onNonOAuthError;

  const promptMomentNotificationRef = useRef(
    (props as UseGoogleLoginOptionsCredentialFlow).promptMomentNotification,
  );
  promptMomentNotificationRef.current = (
    props as UseGoogleLoginOptionsCredentialFlow
  ).promptMomentNotification;

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
        ...props,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, scriptLoadedSuccessfully, flow, scope, state]);

  const loginImplicitFlow = useCallback(
    (overrideConfig?: OverridableTokenClientConfig) =>
      clientRef.current?.requestAccessToken(overrideConfig),
    [],
  );

  const loginAuthCodeFlow = useCallback(
    () => clientRef.current?.requestCode(),
    [],
  );

  const loginCredentialFlow = useCallback(() => {
    console.log(scriptLoadedSuccessfully, flow);

    if (!scriptLoadedSuccessfully) return;
    if (flow !== 'credential') return;

    window?.google?.accounts?.id?.initialize({
      client_id: clientId,
      callback: (credentialResponse: GoogleCredentialResponse) => {
        console.log(credentialResponse);

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
    });

    console.log('will prompt', window?.google?.accounts?.id?.prompt);
    window?.google?.accounts?.id?.prompt(promptMomentNotificationRef.current);
  }, [clientId, scriptLoadedSuccessfully, flow]);

  switch (flow) {
    case 'implicit':
      return loginImplicitFlow;
    case 'auth-code':
      return loginAuthCodeFlow;
    case 'credential':
      return loginCredentialFlow;
  }
}
