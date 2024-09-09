import { Tabs } from 'expo-router';
import { FlatList } from 'react-native';
import { Avatar, Image, Input, Text, XStack, YStack, Label } from 'tamagui';

import { CardProvider } from '../components/CardProvider';
import { Container } from '../components/Container';
import CustomPopover from '../components/CustomPopover';

import { TabsContainer } from '~/app/components/TabsContainer';
import { ServiceStatus } from '../types/service';

export default function Profile() {
  return (
    <TabsContainer>
      <Tabs.Screen
        options={{
          headerRight: () => <CustomPopover />,
        }}
      />
      <Image
        marginHorizontal={-10}
        source={{
          uri: require('../../assets/technology-background.png'),
          height: 260,
        }}
      />
      <XStack h={260} w="100%" position="absolute" justifyContent="flex-start" alignItems="center">
        <YStack ml={20} mr={25}>
          <Avatar circular size="$10">
            <Avatar.Image src="http://picsum.photos/200/300" />
            <Avatar.Fallback bc="white" />
          </Avatar>
        </YStack>
        <YStack w="58%" space={4}>
          <Label col="#fff" fontWeight="900" fontSize="$6">
            Dados do Usuário:
          </Label>
          <Input id="usuName" placeholder="Seu nome" value="Jhony de Paula" ml={20} disabled />
          <Input id="usuCPF" placeholder="Seu CPF" value="105.929.356-60" ml={20} disabled />
          <Input id="usuTel" placeholder="Seu Telefone" value="(21) 98867-0329" ml={20} disabled />
          <Input id="usuEmail" placeholder="Seu E-mail" value="jhony@email.com" ml={20} disabled />
        </YStack>
      </XStack>
      <XStack marginTop={10} justifyContent="space-between">
        {/* <FlatList/> */}
        <CardProvider
          service={{
            id: '1a8b64b7-6e4c-4c62-9b79-5e94ae1b8e25',
            name: 'App Development',
            image: 'https://example.com/service1.jpg',
            status: ServiceStatus.active,
            user: {
              id: '1a8b64b7-6e4c-4c62-9b79-5e94ae1b8e25',
            },
          }}
        />
      </XStack>
    </TabsContainer>
  );
}
