import { Heading, Flex, Img, Text } from '@chakra-ui/react';

export default function Header() {
  return (
    <>
      <Heading
        as="h1"
        transition="0.1s ease-in-out"
        _hover={{ color: 'blue.300' }}
        fontSize={['2xl', '4xl']}
      >
        <a href="https://github.com/MomenSherif/react-oauth">
          @react-oauth/google
        </a>
      </Heading>
      <Text mt="3" textAlign="center">
        Google OAuth2 using the new Google Identity Services SDK for React 🚀
      </Text>

      <Flex direction={['column', 'row']}>
        <Img src="/images/react-logo.svg" alt="React logo" w={['32', '56']} />
        <Img src="/images/google-logo.png" alt="Google logo" w={['32', '48']} />
      </Flex>
    </>
  );
}
