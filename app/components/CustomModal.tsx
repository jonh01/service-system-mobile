import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, TouchableOpacity } from 'react-native';
import { YStack } from 'tamagui';

export default function CustomModal({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const closeModal = () => {
    router.dismiss();
  };

  return (
    <YStack flex={1} justifyContent="flex-end" ai="center">
      <Pressable style={{ height: '2%', width: '100%' }} onPress={closeModal} />
      <YStack
        w="100%"
        h="89%"
        ai="center"
        backgroundColor="white"
        borderTopStartRadius={30}
        borderTopEndRadius={30}
        elevation={200}>
        <TouchableOpacity onPress={closeModal} style={{ marginVertical: 20 }}>
          <FontAwesome5 name="arrow-circle-down" size={24} color="black" />
        </TouchableOpacity>
        {children}
      </YStack>
    </YStack>
  );
}
