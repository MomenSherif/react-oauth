import { GoogleCredentialResponse } from '../types';

export function extractClientId(
  credentialResponse: GoogleCredentialResponse,
): string | undefined {
  const clientId =
    credentialResponse?.clientId ?? credentialResponse?.client_id;
  return clientId;
}
