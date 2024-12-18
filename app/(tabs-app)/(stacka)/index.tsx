import { FontAwesome6 } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Linking, TouchableOpacity } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Toast from 'react-native-toast-message';
import { H4, Spinner, useTheme, YStack } from 'tamagui';

import { ModalNewRating } from '~/app/components/ModalNewRating';
import { ModalOrder } from '~/app/components/ModalOrder';
import { ModalService } from '~/app/components/ModalService';
import { OrderCard } from '~/app/components/OrderCard';
import { TabsContainer } from '~/app/components/TabsContainer';
import { setLoadingOrders, setOrders } from '~/app/redux/orderSlice';
import {
  exitstsRatingByUserIdAndServiceId,
  findAllOrderByUserId,
  updateOrder,
} from '~/app/services/ServicesAPI';
import { MessageToast } from '~/app/types/message';
import { OrderResponse } from '~/app/types/order';
import { PageRequest } from '~/app/types/page';
import { useAppDispatch, useAppSelector } from '~/app/types/reduxHooks';
import { cleanPhone } from '~/app/utils/formatters';

export default function Services() {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const bannerRef = useRef<BannerAd>(null);

  const adsBanner = TestIds.ADAPTIVE_BANNER;

  /*
    const adsBanner = __DEV__
      ? TestIds.ADAPTIVE_BANNER
      : (process.env.EXPO_PUBLIC_URL_GOOGLE_ADS_BANNER ?? ''); // activate something payment options activate
  */

  const user = useAppSelector((state) => state.auth.user);
  const loadingOrders = useAppSelector((state) => state.orders.loading);
  const orders = useAppSelector((state) => state.orders.orders);
  const pageOrders = useAppSelector((state) => state.orders.pageOrdersResponse);

  const [modalService, setModalService] = useState(false);
  const [modalOrder, setModalOrder] = useState(false);
  const [modalNewRating, setModalNewRating] = useState(false);

  const [modalServiceId, setModalServiceId] = useState('');
  const [modalOrderItem, setModalOrderItem] = useState<OrderResponse>();
  const [modalNewRatingServiceId, setModalNewRatingServiceId] = useState('');

  const [modalNewRatingUpdate, setModalNewRatingUpdate] = useState(false);

  const [message, setMessage] = useState<MessageToast | null>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [sucessAttOrder, setSucessAttOrder] = useState(false);

  const [orderPageble, setOrderPageble] = useState<PageRequest>({
    page: 0,
    size: 6,
    sort: [
      {
        orderBy: 'endAt',
        direction: 'desc',
      },
      {
        orderBy: 'startAt',
        direction: 'desc',
      },
    ],
  });

  useEffect(() => {
    if (user!.id.length > 0 || (user!.id.length > 0 && sucessAttOrder)) {
      setMessage(null);
      dispatch(setLoadingOrders());
      findAllOrderByUserId(user!.id, orderPageble)
        .then((response) => {
          dispatch(setOrders(response));
          console.log('Orders:', response);
        })
        .catch(() => {
          console.log(':', message);
          setMessage({
            type: 'error',
            title: 'Erro ao Buscar Ordens',
            text: 'Não foram retornadas ordens',
          });
        });
      setIsRefreshing(false);
      setSucessAttOrder(false);
    }
  }, [orderPageble, sucessAttOrder]);

  useEffect(() => {
    if (message) {
      Toast.show({
        autoHide: true,
        visibilityTime: 5000,
        type: message.type,
        text1: message?.title,
        text2: message?.text,
      });
    }
  }, [message]);

  const onRefresh = () => {
    if (user!.id.length > 0) {
      setIsRefreshing(true);
      setOrderPageble((prev) => ({ ...prev, page: 0 }));
    }
  };

  const fetchMoreData = () => {
    if (!pageOrders?.last && pageOrders?.totalPages != orderPageble.page! + 1) {
      setOrderPageble((prev) => ({ ...prev, page: orderPageble.page! + 1 }));
      console.log('deu bom');
    } else {
      console.log('acabou');
    }
  };

  const closeOrder = (orderId: string): boolean => {
    let successUp = false;
    updateOrder(orderId, { endAt: new Date() })
      .then(() => {
        onRefresh();
        successUp = true;
      })
      .catch(() => {
        setMessage({
          type: 'error',
          title: 'Erro ao Finalizar Ordem',
          text: 'Tente novamente. Se persistir entre em contato conosco',
        });
        successUp = false;
      });
    return successUp;
  };

  return (
    <TabsContainer overflow="hidden" pb={0} marginHorizontal={0}>
      <Stack.Screen
        options={{
          title: 'Ordens',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/my-orders')}>
              <FontAwesome6 name="repeat" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <YStack flex={1} pt={10}>
        <FlatList
          style={{ backgroundColor: theme.background.get() }}
          showsVerticalScrollIndicator
          data={orders} // alterar
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          keyExtractor={(order) => order.id.toString()}
          ListEmptyComponent={
            !loadingOrders ? (
              <YStack ai="center">
                <H4>Nenhuma Ordem Encontrada!</H4>
              </YStack>
            ) : null
          }
          initialNumToRender={8}
          renderItem={({ item }) => (
            <OrderCard
              pendding={() => {
                const existsLocal = item.local;
                if (item.endAt == null && existsLocal == null) return true;
                else if (item.endAt == null && existsLocal == undefined) return true;
                else return false;
              }}
              order={item}
              openService={() => {
                setModalServiceId(item.serviceProvided.id);
                setModalService(true);
              }}
              closeOrder={() => {
                closeOrder(item.id);
                exitstsRatingByUserIdAndServiceId(user!.id, item.serviceProvided.id).then(
                  (response) => {
                    if (response.data == true) {
                      Alert.alert(
                        'Avaliação Já Cadastrada',
                        'Já existe uma avaliação para esse serviço. Deseja atualizar?',
                        [
                          {
                            text: 'Não',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'Sim',
                            onPress: () => {
                              setModalNewRatingUpdate(true);
                              setModalNewRatingServiceId(item.serviceProvided.id);
                              setModalNewRating(true);
                            },
                          },
                        ]
                      );
                    } else {
                      setModalNewRatingServiceId(item.serviceProvided.id);
                      setModalNewRating(true);
                    }
                  }
                );
              }}
              openChat={() => {
                Linking.openURL(
                  `http://api.whatsapp.com/send?phone=${cleanPhone(item.serviceProvided.user.phone)}`
                );
              }}
              openOrder={() => {
                setModalOrderItem(item);
                setModalOrder(true);
              }}
              orderOpen={item.endAt !== null}
            />
          )}
          onEndReachedThreshold={0.1}
          onEndReached={orders != null ? fetchMoreData : null}
          ListFooterComponent={
            orders && !pageOrders?.last ? <Spinner size="small" mt={20} /> : null
          }
        />
      </YStack>
      <YStack marginVertical={10}>
        <BannerAd ref={bannerRef} unitId={adsBanner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </YStack>
      <ModalService
        serviceId={modalServiceId}
        modalVisible={modalService}
        setModalVisible={() => {
          setModalService(!modalService);
        }}
      />
      <ModalOrder
        order={modalOrderItem ?? null}
        modalVisible={modalOrder}
        setModalVisible={() => {
          setModalOrder(!modalOrder);
        }}
        successAtt={(sucess) => {
          setSucessAttOrder(sucess);
        }}
      />
      <ModalNewRating
        update={modalNewRatingUpdate}
        serviceId={modalNewRatingServiceId}
        modalVisible={modalNewRating}
        setModalVisible={() => {
          setModalNewRating(!modalNewRating);
        }}
      />
    </TabsContainer>
  );
}
