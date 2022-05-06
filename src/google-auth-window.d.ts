interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (input: IdConfiguration) => void;
        prompt: (momentListener?: MomenListener) => void;
        renderButton: (
          parent: HTMLElement,
          options: GsiButtonConfiguration,
          clickHandler?: () => void,
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
          tokenRsponse: TokenResponse,
          ...scopes: string[]
        ) => void;
        hasGrantedAllScopes: (
          tokenRsponse: TokenResponse,
          ...scopes: string[]
        ) => void;
        revoke: (accessToken: string, done?: () => void) => void;
      };
    };
  };
}
