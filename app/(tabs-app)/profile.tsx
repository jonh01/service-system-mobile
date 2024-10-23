import { FontAwesome } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
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
  H4,
  useTheme,
} from 'tamagui';

import { CustomCardMyService } from '../components/CustomCardMyService';
import { ModalNewService } from '../components/ModalNewService';
import ProfilePopover from '../components/ProfilePopover';
import { setLoadingServices, setStateUserService, setUserServices } from '../redux/serviceSlice';
import { persistor } from '../redux/store';
import { SignOut } from '../services/FireBaseAuth';
import { findAllServiceByUserId, SignOutAPI, updateServiceStatus } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { PageRequest } from '../types/page';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { ServiceStatus } from '../types/service';

import { TabsContainer } from '~/app/components/TabsContainer';

export default function Profile() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.services.loading);
  const [message, setMessage] = useState<MessageToast | null>(null);
  const services = useAppSelector((state) => state.services.userServices);
  const pageServices = useAppSelector((state) => state.services.pageUserResponse);

  const [modalNewService, setModalNewService] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

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
    if (user!.id.length > 0 || (user!.id.length > 0 && success)) {
      setMessage(null);
      dispatch(setLoadingServices());
      findAllServiceByUserId(user?.id!, pageble)
        .then((response) => {
          console.log('page:', response);
          dispatch(setUserServices({ page: response?.page, userServices: response?.userServices }));
        })
        .catch((error) => {
          console.log('error:', error.message);
          setMessage({
            type: 'error',
            title: 'Erro ao Buscar Serviços',
            text: 'Tente novamente mais tarde. Se persistir entre em contato conosco.',
          });
        });

      setIsRefreshing(false);
    }
  }, [pageble, success]);

  useEffect(() => {
    if (message != null)
      Toast.show({
        autoHide: true,
        visibilityTime: 5000,
        type: message?.type,
        text1: message?.title,
        text2: message?.text,
      });
  }, [message]);

  const onRefresh = () => {
    if (user!.id.length > 0) {
      setIsRefreshing(true);
      setPageble((prev) => ({ ...prev, page: 0 }));
    }
  };

  const fetchMoreData = () => {
    if (!pageServices?.last && pageServices?.totalPages != pageble.page! + 1) {
      setPageble((prev) => ({ ...prev, page: pageble.page! + 1 }));
      console.log('deu bom');
    } else {
      console.log('acabou');
    }
  };

  const toggleStatusService = (serviceId: string, status: boolean) => {
    updateServiceStatus(serviceId, status ? ServiceStatus.active : ServiceStatus.disabled)
      .then(() => {
        dispatch(
          setStateUserService({
            id: serviceId,
            newStatus: status ? ServiceStatus.active : ServiceStatus.disabled,
          })
        );
      })
      .catch(() => {
        setMessage({
          type: 'error',
          title: 'Erro ao Atualizar Status do Serviço',
          text: 'Tente novamente mais tarde. Se persistir entre em contato conosco.',
        });
      });
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
        data={services}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-evenly',
          paddingVertical: 10,
          backgroundColor: theme.background.name,
        }}
        keyExtractor={(service) => service.id.toString()}
        ListEmptyComponent={
          !loading ? (
            <YStack ai="center">
              <H4>Você Não Possui Serviços!</H4>
              <Text> Crie um novo serviço para poder visualiza-lo</Text>
            </YStack>
          ) : null
        }
        initialNumToRender={8}
        renderItem={({ index, item }) => (
          <CustomCardMyService
            width={190}
            height={230}
            animation="bouncy"
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.875 }}
            serviceName={item.name}
            serviceStatus={item.status}
            serviceImage={item.image}
            onPress={() => {
              console.log('toquei: ');
            }}
            toggleStatus={(newStatus) => {
              toggleStatusService(item.id, newStatus);
            }}
          />
        )}
        onEndReachedThreshold={0.1}
        onEndReached={services != null ? fetchMoreData : null}
        ListFooterComponent={
          services && !pageServices?.last ? <Spinner size="small" mt={20} /> : null
        }
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
        position="absolute"
        onPress={() => {
          setModalNewService(true);
        }}>
        <FontAwesome name="plus" size={24} color="#fff" />
      </Button>
      <ModalNewService
        modalVisible={modalNewService}
        setModalVisible={() => {
          setModalNewService(!modalNewService);
        }}
        success={(success) => {
          setSuccess(success);
        }}
      />
    </TabsContainer>
  );
}
