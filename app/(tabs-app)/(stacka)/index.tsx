import { FontAwesome6 } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { H4, Separator, Spinner, Text, useTheme, YStack } from 'tamagui';

import { CustomTabs } from '~/app/components/CustomTabs';
import { OrderCard } from '~/app/components/OrderCard';
import { RatingCard } from '~/app/components/RatingCard';
import { TabsContainer } from '~/app/components/TabsContainer';
import { setLoadingOrders, setOrders } from '~/app/redux/orderSlice';
import { findAllOrderByUserId } from '~/app/services/ServicesAPI';
import { Error } from '~/app/types/error';
import { OrderResponse } from '~/app/types/order';
import { PageRequest } from '~/app/types/page';
import { useAppDispatch, useAppSelector } from '~/app/types/reduxHooks';

export default function Services() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loadingOrders = useAppSelector((state) => state.orders.loading);
  const orders = useAppSelector((state) => state.orders.orders);
  const pageOrders = useAppSelector((state) => state.orders.pageOrdersResponse);

  const [errorMessage, setErrorMessage] = useState<Error | null>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [orderPageble, setOrderPageble] = useState<PageRequest>({
    page: 0,
    size: 6,
    sort: [
      {
        orderBy: 'id',
        direction: 'asc',
      },
    ],
  });

  useEffect(() => {
    if (user!.id.length > 0) {
      setErrorMessage(null);
      dispatch(setLoadingOrders());
      findAllOrderByUserId(user!.id, orderPageble)
        .then((response) => {
          dispatch(setOrders(response));
          console.log('Orders:', response);
        })
        .catch((error) => {
          console.log('error:', error.message);
          setErrorMessage({
            title: 'Erro ao Buscar Ordens',
            text: 'Não foram retornadas ordens',
          });
        });
      setIsRefreshing(false);
    }
  }, [orderPageble]);

  useEffect(() => {
    if (errorMessage) {
      Toast.show({
        autoHide: true,
        visibilityTime: 5000,
        type: 'error',
        text1: errorMessage?.title,
        text2: errorMessage?.text,
      });
    }
  }, [setErrorMessage]);

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
    <TabsContainer overflow="hidden" pb={0} marginHorizontal={0}>
      <Stack.Screen
        options={{
          title: 'Ordens',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/my-services')}>
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
          keyExtractor={(service) => service.id.toString()}
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
              order={item}
              openService={() => {
                console.log('teste1');
              }}
              closeOrder={() => {
                console.log('teste2');
              }}
              openOrder={() => {
                console.log('teste3');
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
    </TabsContainer>
  );
}
