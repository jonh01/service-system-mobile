import { Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';

export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      </Stack>
      <Toast position="top" topOffset={40} />
    </>
  );
}
