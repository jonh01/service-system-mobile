import { Stack } from 'expo-router';

export default function ServiceLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="my-orders" />
    </Stack>
  );
}
