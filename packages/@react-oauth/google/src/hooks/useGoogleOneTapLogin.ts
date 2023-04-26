import { useEffect, useRef } from 'react';

import { useGoogleOAuth } from '../GoogleOAuthProvider';
import { extractClientId } from '../utils';
import {
  CredentialResponse,
  GoogleCredentialResponse,
  MomentListener,
} from '../types';

interface UseGoogleOneTapLoginOptions {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError?: () => void;
  promptMomentNotification?: MomentListener;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  state_cookie_domain?: string;
  hosted_domain?: string;
  disabled?: boolean;
}

export default function useGoogleOneTapLogin({
  onSuccess,
  onError,
  promptMomentNotification,
  cancel_on_tap_outside,
  prompt_parent_id,
  state_cookie_domain,
  hosted_domain,
  disabled,
}: UseGoogleOneTapLoginOptions): void {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const promptMomentNotificationRef = useRef(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;

  useEffect(() => {
    if (!scriptLoadedSuccessfully) return;

    if (disabled) {
      window?.google?.accounts?.id?.cancel();
      return;
    }

    window?.google?.accounts?.id?.initialize({
      client_id: clientId,
      callback: (credentialResponse: GoogleCredentialResponse) => {
        if (!credentialResponse?.credential) {
          return onErrorRef.current?.();
        }

        const { credential, select_by } = credentialResponse;
        onSuccessRef.current({
          credential,
          clientId: extractClientId(credentialResponse),
          select_by,
        });
      },
      hosted_domain,
      cancel_on_tap_outside,
      prompt_parent_id,
      state_cookie_domain,
    });

    window?.google?.accounts?.id?.prompt(promptMomentNotificationRef.current);

    return () => {
      window?.google?.accounts?.id?.cancel();
    };
  }, [
    clientId,
    scriptLoadedSuccessfully,
    cancel_on_tap_outside,
    prompt_parent_id,
    state_cookie_domain,
    hosted_domain,
    disabled,
  ]);
}
