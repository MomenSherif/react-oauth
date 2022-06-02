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
import { Flows } from '../types/enums';

const signInFlowsFeatures: Feature[] = [
  {
    label: 'Simple authentication',
    available: true,
  },
  {
    label: 'Personalized button',
    available: true,
  },
  {
    label: 'One tap prompt',
    available: true,
  },
  {
    label: 'ID token (JWT)',
    available: true,
  },
  {
    label: 'Access token',
    available: false,
  },
  {
    label: 'Refresh token',
    available: false,
  },
  {
    label: 'Define extra scopes',
    available: false,
  },
  {
    label: 'Custom button',
    available: false,
  },
];

const authorizationFlowsFeatures: Feature[] = [
  { label: 'Custom button', available: true },
  { label: 'Authentication & Authorization', available: true },
  { label: 'Define extra scopes', available: true },
  { label: 'ID token (JWT)', available: true },
  { label: 'Access token', available: true },
  { label: 'Refresh token', available: true },
  {
    label: 'Personalized button',
    available: false,
  },
  {
    label: 'One tap prompt',
    available: false,
  },
];

type GoogleFeaturesProps = {
  setFlow: (flow: Flows) => void;
};

export default function GoogleFeatures({ setFlow }: GoogleFeaturesProps) {
  return (
    <Stack
      direction={['column', 'row']}
      spacing={['5', '10']}
      divider={<StackDivider borderColor="gray.700" />}
      mt="5"
    >
      <Flex direction="column" align="center">
        <List mb="5">
          {signInFlowsFeatures.map(feat => (
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
          onClick={() => setFlow(Flows.SignIn)}
        >
          Sign-in flows
        </Button>
      </Flex>
      <Flex direction="column" align="center">
        <List mb="5">
          {authorizationFlowsFeatures.map(feat => (
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
          onClick={() => setFlow(Flows.Authorization)}
        >
          Authorization
        </Button>
      </Flex>
    </Stack>
  );
}
