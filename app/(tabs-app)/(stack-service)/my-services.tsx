import { FontAwesome6 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

import { TabsContainer } from '~/app/components/TabsContainer';

export default function Search() {
  return (
    <TabsContainer>
      <Stack.Screen
        options={{
          title: 'Meus Serviços',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/(stack-service)')}>
              <FontAwesome6 name="repeat" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <Text>My service</Text>
    </TabsContainer>
  );
}
