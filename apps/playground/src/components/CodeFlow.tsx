import { useState } from 'react';
import { Button, Link, Text, VStack } from '@chakra-ui/react';
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';

import CodeBlock from './CodeBlock';

const code = `
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    console.log(tokenResponse);
    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: 'Bearer <tokenResponse.access_token>' } },
    );

    console.log(userInfo);
  },
  onError: errorResponse => console.log(errorResponse),
});
`;

export default function CodeFlow() {
  const [codeResponse, setCodeResponse] = useState<CodeResponse | null>();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async codeResponse => {
      setCodeResponse(codeResponse);
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
    <VStack spacing="5">
      <Link
        href="https://github.com/MomenSherif/react-oauth#usegooglelogin-both-implicit--authorization-code-flow"
        color="blue.600"
        fontWeight="semibold"
        target="_blank"
        rel="noopener noreferrer"
      >
        useGoogleLogin Props
      </Link>
      <Button colorScheme="blue" onClick={() => googleLogin()}>
        Login with Google 🚀
      </Button>

      <CodeBlock imgSrc="/images/Code-snap.png" code={code} />
      <CodeBlock
        imgSrc="/images/CodeResponse-snap.png"
        code={codeResponse ? JSON.stringify(codeResponse, null, 2) : undefined}
      />

      <Text fontWeight="bold" maxW="container.md">
        Exchange "code" for tokens from your backend
      </Text>

      <CodeBlock imgSrc="/images/serverTokens-snap.png" />

      <Link
        href="https://github.com/MomenSherif/react-oauth/issues/12#issuecomment-1131408898"
        target="_blank"
        rel="noopener noreferrer"
      >
        Check backend (express) implementation
      </Link>
    </VStack>
  );
}
