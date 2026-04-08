import { useGoogleOAuth } from './GoogleOAuthProvider';
import { useCallback } from 'react';

export const useGoogleIdToken = ({onSuccess}:any) => {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();

  const login = useCallback(() => {
    if (!scriptLoadedSuccessfully) {
      console.error("Google script not loaded yet");
      return;
    }

    /* global google */
    (window?.google as any)?.accounts?.id?.initialize({
      client_id: clientId,
      callback: (response:any) => {
        if (response.credential) {
          onSuccess(response.credential);
        }
      },
    });

    // This opens the native Google selection prompt
    (window?.google as any)?.accounts?.id?.prompt();
  }, [clientId, scriptLoadedSuccessfully, onSuccess]);

  return login;
};
