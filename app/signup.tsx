import { Stack } from 'expo-router';
import { Text } from 'tamagui';

import { Container } from '~/components/Container';

export default function Details() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sign Up' }} />
      <Container>
        <Text>Sign Up</Text>
      </Container>
    </>
  );
}
