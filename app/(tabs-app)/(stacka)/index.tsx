import { FontAwesome6 } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

import { TabsContainer } from '~/app/components/TabsContainer';

export default function Services() {
  return (
    <TabsContainer>
      <Stack.Screen
        options={{
          title: 'Serviços',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/my-services')}>
              <FontAwesome6 name="repeat" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <Text>My service</Text>
    </TabsContainer>
  );
}
