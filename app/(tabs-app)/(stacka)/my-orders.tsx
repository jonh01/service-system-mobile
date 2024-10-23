import { FontAwesome6 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Button, Text } from 'tamagui';

import { TabsContainer } from '~/app/components/TabsContainer';
import { exitstsRatingByUserIdAndServiceId, updateRating } from '~/app/services/ServicesAPI';

export default function Search() {
  return (
    <TabsContainer>
      <Stack.Screen
        options={{
          title: 'Minhas Ordens',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/(stacka)')}>
              <FontAwesome6 name="repeat" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <Text>My service</Text>
      <Button
        onPress={() => {
          exitstsRatingByUserIdAndServiceId(
            '7dee0fc4-f14f-478a-a5c8-0db736108f2c',
            '1a8b64b7-6e4c-4c62-9b79-5e94ae1b8e25'
          ).then((response) => {
            response.data == true ? console.log('deu bom ao atualizar!') : console.log('deu ruim!');
          });
        }}>
        clique aqui
      </Button>
    </TabsContainer>
  );
}
