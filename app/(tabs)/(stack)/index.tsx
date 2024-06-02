import { Stack, Link } from 'expo-router';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <Link href={{ pathname: '/my-services' }} asChild>
          <Button title="Show my services" />
        </Link>
      </Container>
    </>
  );
}
