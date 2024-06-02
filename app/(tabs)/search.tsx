import { Stack } from 'expo-router';
import { Text } from 'tamagui';

import { Container } from '~/components/Container';

export default function Search() {
  return (
    <>
      <Stack.Screen options={{ title: 'tabs' }} />
      <Container>
        <Text>search</Text>
      </Container>
    </>
  );
}
