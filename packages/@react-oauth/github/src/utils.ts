// Regex pattern for query string parsing (moved to top level for performance)
const QUERY_PREFIX_REGEX = /^\??\//;

/**
 * Utility function to merge class names
 * Similar to clsx/classnames but simpler - inspired by shadcn/ui
 */
export function cn(
  ...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]
): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) {
      continue;
    }

    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) {
        classes.push(inner);
      }
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

/**
 * Parses a query string into a params object
 * @param query - The query string (e.g., "key1=value1&key2=value2")
 * @returns An object with key-value pairs from the query string
 * @example
 * ```ts
 * const params = parseQueryString('code=abc123&state=xyz');
 * // { code: 'abc123', state: 'xyz' }
 * ```
 */
export function parseQueryString(query: string): Record<string, string> {
  const q = query.replace(QUERY_PREFIX_REGEX, '');

  return q.split('&').reduce((values, param) => {
    const [key, value] = param.split('=');
    if (key) {
      values[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    return values;
  }, {} as Record<string, string>);
}

/**
 * Builds a query string from a params object
 * @param params - An object with key-value pairs
 * @param delimiter - The delimiter to use between parameters (default: '&')
 * @returns A query string
 * @example
 * ```ts
 * const query = buildQueryString({ client_id: '123', scope: 'user:email' });
 * // "client_id=123&scope=user:email"
 * ```
 */
export function buildQueryString(
  params: Record<string, string | undefined>,
  delimiter = '&',
): string {
  const keys = Object.keys(params);

  return keys
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => {
      const value = params[key];
      if (value === undefined) {
        return '';
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(param => param !== '')
    .join(delimiter);
}
