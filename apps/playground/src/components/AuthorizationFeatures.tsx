import { useState } from 'react';
import {
  Button,
  Flex,
  List,
  ListIcon,
  ListItem,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import { SmallAddIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { Feature } from '../types';
import ImplicitFlow from './ImplicitFlow';
import CodeFlow from './CodeFlow';

const implicitFlowFeatures: Feature[] = [
  {
    label: 'User info',
    available: true,
  },
  {
    label: 'Access token',
    available: true,
  },
  {
    label: 'ID token (JWT)',
    available: false,
  },
  {
    label: 'Refresh token',
    available: false,
  },
  {
    label: 'Backend required',
    available: false,
  },
];

const authorizationCodeFlowFeatures: Feature[] = [
  { label: 'Backend required', available: true },
  { label: 'User info', available: true },
  { label: 'Access token', available: true },
  { label: 'ID token (JWT)', available: true },
  { label: 'Refresh token', available: true },
];

export default function AuthorizationFeatures() {
  const [flow, setFlow] = useState<'implict' | 'code' | null>(null);
  return (
    <>
      {!flow && (
        <Stack
          direction={['column', 'row']}
          spacing={['5', '10']}
          divider={<StackDivider borderColor="gray.700" />}
          mt="5"
        >
          <Flex direction="column" align="center">
            <List mb="5">
              {implicitFlowFeatures.map(feat => (
                <ListItem key={feat.label} textTransform="capitalize">
                  <ListIcon
                    as={feat.available ? SmallAddIcon : SmallCloseIcon}
                    color={feat.available ? 'green.500' : 'red.500'}
                  />
                  {feat.label}
                </ListItem>
              ))}
            </List>
            <Button
              colorScheme="blue"
              mt="auto"
              onClick={() => setFlow('implict')}
            >
              Implicit Flow
            </Button>
          </Flex>
          <Flex direction="column" align="center">
            <List mb="5">
              {authorizationCodeFlowFeatures.map(feat => (
                <ListItem key={feat.label} textTransform="capitalize">
                  <ListIcon
                    as={feat.available ? SmallAddIcon : SmallCloseIcon}
                    color={feat.available ? 'green.500' : 'red.500'}
                  />
                  {feat.label}
                </ListItem>
              ))}
            </List>
            <Button
              mt="auto"
              colorScheme="green"
              onClick={() => setFlow('code')}
            >
              Authorization Code Flow
            </Button>
          </Flex>
        </Stack>
      )}
      {flow === 'implict' && <ImplicitFlow />}
      {flow === 'code' && <CodeFlow />}
    </>
  );
}
