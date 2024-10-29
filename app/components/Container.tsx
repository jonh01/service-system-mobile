import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, YStackProps, ScrollView } from 'tamagui';

type ContainerProps = YStackProps & {
  children: React.ReactNode;
};

export const Container = ({ children, ...rest }: ContainerProps) => {
  const { left, top, right } = useSafeAreaInsets();

  return (
    <>
      <StatusBar translucent={Platform.OS !== 'android'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack
          flex={1}
          paddingTop={top}
          paddingLeft={left + 4}
          paddingRight={right + 4}
          paddingBottom="$4"
          bg="$background"
          {...rest}>
          {children}
        </YStack>
      </ScrollView>
    </>
  );
};
