import { useMemo, useState } from 'react';
import { Link, Stack, Text, VStack } from '@chakra-ui/react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

import CodeBlock from './CodeBlock';

const code = `
<GoogleLogin
onSuccess={(credentialResponse) => {
  console.log(credentialResponse);
}}
onError={() => {
  console.log('Login Failed');
}}
/>
`;

export default function SignInFlows() {
  const [credentialResponse, setCredentialResponse] =
    useState<CredentialResponse | null>();

  const user = useMemo(() => {
    if (!credentialResponse?.credential) return;
    return jwtDecode(credentialResponse.credential);
  }, [credentialResponse]);

  return (
    <VStack spacing="5">
      <Link
        href="https://github.com/MomenSherif/react-oauth#googlelogin"
        color="blue.600"
        fontWeight="semibold"
        target="_blank"
        rel="noopener noreferrer"
      >
        GoogleLogin Props
      </Link>
      <Stack direction={['column', 'column', 'row']} align="center" spacing="2">
        <GoogleLogin
          onSuccess={credentialResponse => {
            setCredentialResponse(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        <GoogleLogin
          theme="filled_black"
          shape="pill"
          onSuccess={credentialResponse => {
            setCredentialResponse(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
        <GoogleLogin
          type="icon"
          theme="filled_blue"
          shape="square"
          onSuccess={credentialResponse => {
            setCredentialResponse(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </Stack>
      <CodeBlock imgSrc="/images/GoogleLogin-snap.png" code={code} />
      <CodeBlock
        imgSrc="/images/CredentialResponse-snap.png"
        code={
          credentialResponse
            ? JSON.stringify(credentialResponse, null, 2)
            : undefined
        }
      />
      <Text fontWeight="bold">Decode Credential (JWT) to get user info</Text>
      <CodeBlock
        imgSrc="/images/Decoded-snap.png"
        code={user ? JSON.stringify(user, null, 2) : undefined}
      />
    </VStack>
  );
}
