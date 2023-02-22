import {
  IdConfiguration,
  MomentListener,
  GsiButtonConfiguration,
  TokenClientConfig,
  OverridableTokenClientConfig,
  CodeClientConfig,
  TokenResponse,
} from './types';
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (input: IdConfiguration) => void;
          prompt: (momentListener?: MomentListener) => void;
          renderButton: (
            parent: HTMLElement,
            options: GsiButtonConfiguration,
          ) => void;
          disableAutoSelect: () => void;
          storeCredential: (
            credential: { id: string; password: string },
            callback?: () => void,
          ) => void;
          cancel: () => void;
          onGoogleLibraryLoad: Function;
          revoke: (accessToken: string, done: () => void) => void;
        };
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => {
            requestAccessToken: (
              overridableClientConfig?: OverridableTokenClientConfig,
            ) => void;
          };
          initCodeClient: (config: CodeClientConfig) => {
            requestCode: () => void;
          };
          hasGrantedAnyScope: (
            tokenResponse: TokenResponse,
            firstScope: string,
            ...restScopes: string[]
          ) => boolean;
          hasGrantedAllScopes: (
            tokenResponse: TokenResponse,
            firstScope: string,
            ...restScopes: string[]
          ) => boolean;
          revoke: (accessToken: string, done?: () => void) => void;
        };
      };
    };
  }
}
