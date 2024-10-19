import { FontAwesome } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import {
  Avatar,
  Image,
  Input,
  XStack,
  YStack,
  Label,
  Button,
  Text,
  Spinner,
  H2,
  H4,
} from 'tamagui';

import { CustomCardMyService } from '../components/CustomCardMyService';
import ProfilePopover from '../components/ProfilePopover';
import { setLoadingServices, setUserServices } from '../redux/serviceSlice';
import { persistor } from '../redux/store';
import { SignOut } from '../services/FireBaseAuth';
import { findAllServiceByUserId, SignOutAPI } from '../services/ServicesAPI';
import { PageRequest } from '../types/page';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { ServiceStatus } from '../types/service';

import { TabsContainer } from '~/app/components/TabsContainer';

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.services.loading);
  const [error, setError] = useState('');
  const services = useAppSelector((state) => state.services.userServices);
  const pageServices = useAppSelector((state) => state.services.pageUserResponse);

  const [pageble, setPageble] = useState<PageRequest>({
    page: 0,
    size: 5,
    sort: [
      {
        orderBy: 'id',
        direction: 'desc',
      },
    ],
  });

  useEffect(() => {
    setError('');
    dispatch(setLoadingServices());
    findAllServiceByUserId(user?.id!, pageble)
      .then((response) => {
        console.log('page:', response);
        dispatch(setUserServices({ page: response?.page, userServices: response?.userServices }));
      })
      .catch((error) => {
        console.log('error:', error.message);
        setError(error.message);
      });
  }, [pageble]);

  if (!loading && error !== '') {
    console.log('Error: ', error);
  }

  const onRefresh = () => {
    setPageble((prev) => ({ ...prev, page: 0 }));
  };

  const fetchMoreData = () => {
    if (!pageServices?.last && pageServices?.first != pageServices?.last) {
      setPageble((prev) => ({ ...prev, page: pageble.page! + 1 }));
      console.log('deu bom');
    } else {
      console.log('acabou');
    }
  };

  return (
    <TabsContainer>
      <Tabs.Screen
        options={{
          title: 'Perfil',
          headerTitleAlign: 'center',
          headerRight: () => (
            <ProfilePopover
              shouldAdapt
              placement="bottom"
              editInfo={() => {
                console.log('clicou');
              }}
              exit={() => {
                SignOutAPI()
                  .then(() => {
                    SignOut()
                      .then(() => {
                        console.log('SignOut with Google!');
                      })
                      .catch((error) => {
                        console.log('error signOut: ', error);
                      });
                  })
                  .finally(() => {
                    persistor.purge().catch((error) => {
                      console.log('error delete AsyncStorage: ', error);
                    });
                    router.replace('/(stack-auth)');
                  });
              }}
            />
          ),
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
            <Avatar.Image src={user?.image || 'http://picsum.photos/200/300'} />
            <Avatar.Fallback bc="white" />
          </Avatar>
        </YStack>
        <YStack w="58%" space={4}>
          <Label col="#fff" fontWeight="900" fontSize="$6" disabled>
            Dados do Usuário:
          </Label>
          <Input id="usuName" placeholder="Seu nome" value={user?.name} ml={20} disabled />
          <Input id="usuCPF" placeholder="Seu CPF" value={user?.cpf} ml={20} disabled />
          <Input id="usuTel" placeholder="Seu Telefone" value={user?.phone} ml={20} disabled />
          <Input id="usuEmail" placeholder="Seu E-mail" value={user?.email} ml={20} disabled />
        </YStack>
      </XStack>
      <FlatList
        style={{ marginTop: 40 }}
        showsVerticalScrollIndicator
        data={services} // alterar
        refreshing={loading}
        onRefresh={onRefresh}
        keyExtractor={(service) => service.id.toString()}
        ListEmptyComponent={
          <YStack ai="center">
            <H4>Você Não Possui Serviços!</H4>
            <Text> Crie um novo serviço para poder visualiza-lo</Text>
          </YStack>
        }
        renderItem={({ item }) => <Text>{item.id}</Text>}
        onEndReachedThreshold={0.1}
        onEndReached={fetchMoreData}
        ListFooterComponent={!pageServices?.empty ? <Spinner size="small" mt={20} /> : null}
      />
      <Button
        backgroundColor="#016cf7"
        pressStyle={{ backgroundColor: '#3cff15' }}
        borderRadius={360}
        height={56}
        width={56}
        elevate
        bottom={20}
        right={16}
        position="absolute">
        <FontAwesome name="plus" size={24} color="#fff" />
      </Button>
    </TabsContainer>
  );
}
