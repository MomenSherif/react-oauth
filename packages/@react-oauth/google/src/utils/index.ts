export function extractClientId(credential: string): string | undefined {
  try {
    const payload = JSON.parse(atob(credential.split('.')[1]));
    if (!payload.aud) {
      return undefined;
    }

    return payload.aud;
  } catch {
    return undefined;
  }
}
