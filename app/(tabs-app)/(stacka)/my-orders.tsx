import { FontAwesome6 } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Linking, TouchableOpacity } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Toast from 'react-native-toast-message';
import { H4, Spinner, useTheme, YStack } from 'tamagui';

import { ModalOrder } from '~/app/components/ModalOrder';
import { ModalService } from '~/app/components/ModalService';
import { OrderUserCard } from '~/app/components/OrderUserCard';
import { TabsContainer } from '~/app/components/TabsContainer';
import { setLoadingOrders, setUserOrders } from '~/app/redux/orderSlice';
import { findAllOrderByServiceUserId } from '~/app/services/ServicesAPI';
import { MessageToast } from '~/app/types/message';
import { OrderResponse } from '~/app/types/order';
import { PageRequest } from '~/app/types/page';
import { useAppDispatch, useAppSelector } from '~/app/types/reduxHooks';
import { cleanPhone } from '~/app/utils/formatters';

export default function Search() {
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
  const orders = useAppSelector((state) => state.orders.userOrders);
  const pageOrders = useAppSelector((state) => state.orders.pageUserOrdersResponse);

  const [modalService, setModalService] = useState(false);
  const [modalOrder, setModalOrder] = useState(false);

  const [modalServiceId, setModalServiceId] = useState('');
  const [modalOrderItem, setModalOrderItem] = useState<OrderResponse>();

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
      findAllOrderByServiceUserId(user!.id, orderPageble)
        .then((response) => {
          dispatch(setUserOrders(response));
          console.log('Orders user:', response);
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
            <OrderUserCard
              pendding={() => {
                if (item.endAt == null && item.startAt == null) return true;
                else if (item.endAt == null && item.price === 0) return true;
                else return false;
              }}
              order={item}
              openService={() => {
                setModalServiceId(item.serviceProvided.id);
                setModalService(true);
              }}
              openChat={() => {
                Linking.openURL(
                  `http://api.whatsapp.com/send?phone=${cleanPhone(item.user.phone)}`
                );
              }}
              openOrder={() => {
                setModalOrderItem(item);
                setModalOrder(true);
              }}
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
    </TabsContainer>
  );
}
