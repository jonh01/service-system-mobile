import { Stack, Link } from 'expo-router';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sign In' }} />
      <Container>
        <Link href={{ pathname: '/signup' }} asChild>
          <Button title="Show Sign Up" />
        </Link>
      </Container>
    </>
  );
}
