import { FontAwesome5 } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { Pressable, TouchableOpacity } from 'react-native';
import { YStack } from 'tamagui';

export default function CustomModal({
  children,
  routeReturn,
}: Readonly<{ children: React.ReactNode; routeReturn: () => void }>) {

  return (
    <YStack flex={1} justifyContent="flex-end" ai="center">
      <Pressable style={{ height: '2%', width: '100%' }} onPress={routeReturn} />
      <YStack
        w="100%"
        h="89%"
        ai="center"
        backgroundColor="white"
        borderTopStartRadius={30}
        borderTopEndRadius={30}
        elevation={200}>
        <TouchableOpacity onPress={routeReturn} style={{ marginVertical: 20 }}>
          <FontAwesome5 name="arrow-circle-down" size={24} color="black" />
        </TouchableOpacity>
        {children}
      </YStack>
    </YStack>
  );
}
