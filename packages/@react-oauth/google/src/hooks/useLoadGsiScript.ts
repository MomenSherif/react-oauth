import { useState, useEffect, useMemo, useRef } from 'react';

export interface UseLoadGsiScriptOptions {
  /**
   * Nonce applied to GSI script tag. Propagates to GSI's inline style tag
   */
  nonce?: string;
  /**
   * ISO-639 code of [locale](https://developers.google.com/identity/gsi/web/reference/js-reference#locale) to use for content
   */
  locale?: string;
  /**
   * Callback fires on load [gsi](https://accounts.google.com/gsi/client) script success
   */
  onScriptLoadSuccess?: () => void;
  /**
   * Callback fires on load [gsi](https://accounts.google.com/gsi/client) script failure
   */
  onScriptLoadError?: () => void;
}

export default function useLoadGsiScript(
  options: UseLoadGsiScriptOptions = {},
): boolean {
  const { nonce, locale, onScriptLoadSuccess, onScriptLoadError } = options;
  const request = useMemo(() => ({ nonce, locale }), [nonce, locale]);
  const [loadedRequest, setLoadedRequest] = useState<typeof request | null>(
    null,
  );

  const onScriptLoadSuccessRef = useRef(onScriptLoadSuccess);
  onScriptLoadSuccessRef.current = onScriptLoadSuccess;

  const onScriptLoadErrorRef = useRef(onScriptLoadError);
  onScriptLoadErrorRef.current = onScriptLoadError;

  useEffect(() => {
    const { nonce, locale } = request;
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://accounts.google.com/gsi/client';
    if (locale) scriptTag.src += `?hl=${locale}`;
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.nonce = nonce;

    scriptTag.onload = () => {
      setLoadedRequest(request);
      onScriptLoadSuccessRef.current?.();
    };

    scriptTag.onerror = () => {
      setLoadedRequest(null);
      onScriptLoadErrorRef.current?.();
    };

    document.body.appendChild(scriptTag);

    return () => {
      scriptTag.onload = null;
      scriptTag.onerror = null;
      scriptTag.remove();
    };
  }, [request]);

  // A locale or nonce change makes the new request pending during render.
  return loadedRequest === request;
}
