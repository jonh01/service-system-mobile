import { Stack } from 'expo-router';

export default function ServiceLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="my-services" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
