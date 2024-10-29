import { Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';

export default function ServiceLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="my-orders" />
      </Stack>
      <Toast position="top" topOffset={40} />
    </>
  );
}
