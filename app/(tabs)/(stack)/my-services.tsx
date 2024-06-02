import { Stack } from 'expo-router';
import { Text } from 'tamagui';

import { Container } from '~/components/Container';

export default function Search() {
  return (
    <>
      <Stack.Screen options={{ title: 'stacks' }} />
      <Container>
        <Text>My service</Text>
      </Container>
    </>
  );
}
