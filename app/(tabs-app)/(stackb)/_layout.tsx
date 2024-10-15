import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          animation: 'none',
          headerBackVisible: false,
        }}
      />
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
