import { useState } from 'react';
import { Button, Link, Text, VStack } from '@chakra-ui/react';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import axios from 'axios';

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

export default function ImplicitFlow() {
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>();
  const [user, setUser] = useState<any>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);

      setTokenResponse(tokenResponse);
      setUser(userInfo);
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

      <CodeBlock imgSrc="/images/Implicit-snap.png" code={code} />
      <CodeBlock
        imgSrc="/images/TokenResponse-snap.png"
        code={
          tokenResponse ? JSON.stringify(tokenResponse, null, 2) : undefined
        }
      />
      <Text fontWeight="bold" maxW="container.md">
        In Implicit Token flow, you can't get JWT but also you don't need to get
        it to get user profile info. Google gives you access_token to talk with
        their APIs
      </Text>
      <CodeBlock
        imgSrc="/images/userInfo-snap.png"
        code={user ? JSON.stringify(user, null, 2) : undefined}
      />
    </VStack>
  );
}
