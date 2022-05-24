import { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import Header from './components/Header';
import GoogleFeatures from './components/GoogleFeatures';
import SignInFlows from './components/SignInFlows';

import { Flows } from './types/enums';
import AuthorizationFeatures from './components/AuthorizationFeatures';

function App() {
  const [flow, setFlow] = useState<Flows | null>(null);

  return (
    <Flex
      minH="100vh"
      bg="gray.50"
      direction="column"
      align="center"
      py="10"
      px="4"
    >
      <Header />

      {!flow ? (
        <GoogleFeatures setFlow={setFlow} />
      ) : (
        <Button
          onClick={() => setFlow(null)}
          mb="5"
          variant="ghost"
          colorScheme="red"
          textTransform="uppercase"
        >
          Restart
        </Button>
      )}
      {flow === Flows.SignIn && <SignInFlows />}
      {flow === Flows.Authorization && <AuthorizationFeatures />}
    </Flex>
  );
}

export default App;
