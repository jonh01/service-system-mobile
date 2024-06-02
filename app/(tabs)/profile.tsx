import { Stack } from 'expo-router';
import { Text } from 'tamagui';

import { Container } from '~/components/Container';

export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ title: 'tabs' }} />
      <Container>
        <Text>Profile</Text>
      </Container>
    </>
  );
}
