import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Toast from 'react-native-toast-message';
import { H4, Spinner, Text, useTheme, YStack } from 'tamagui';

import { CustomCardService } from '../components/CustomCardService';
import SearchButton from '../components/SearchButton';
import SearchPopover from '../components/SearchPopover';
import { TabsContainer } from '../components/TabsContainer';
import { setLoadingServices, setServices } from '../redux/serviceSlice';
import { findAllService } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { PageRequest } from '../types/page';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { ServiceStatus } from '../types/service';

import { ModalService } from '~/app/components/ModalService';

export default function Search() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const bannerRef = useRef<BannerAd>(null);
  const adsBanner = TestIds.ADAPTIVE_BANNER;

  /*
    const adsBanner = __DEV__
      ? TestIds.ADAPTIVE_BANNER
      : (process.env.EXPO_PUBLIC_URL_GOOGLE_ADS_BANNER ?? ''); // activate something payment options activate
  */

  const loadingServices = useAppSelector((state) => state.services.loading);
  const [message, setMessage] = useState<MessageToast | null>();
  const services = useAppSelector((state) => state.services.services);
  const pageServices = useAppSelector((state) => state.services.pageResponse);

  const [modal, setModal] = useState(false);
  const [modalService, setModalService] = useState(false);
  const [modalServiceId, setModalServiceId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [local, setLocal] = useState('');

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [servicePageble, setServicePageble] = useState<PageRequest>({
    page: 0,
    size: 8,
    sort: [
      {
        orderBy: 'id',
        direction: 'desc',
      },
    ],
  });

  useEffect(() => {
    if (name.length > 0) {
      setMessage(null);
      dispatch(setLoadingServices());
      findAllService(
        ServiceStatus.active,
        name.length > 0 ? name : '',
        servicePageble,
        category.includes('todas') ? '' : category,
        local.length > 0 ? local : ''
      )
        .then((response) => {
          console.log('page:', response);
          dispatch(setServices(response));
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
  }, [servicePageble]);

  const onRefresh = () => {
    if (name.length > 0) {
      setIsRefreshing(true);
      setServicePageble((prev) => ({ ...prev, page: 0 }));
    }
  };

  const fetchMoreData = () => {
    if (!pageServices?.last && pageServices?.totalPages != servicePageble.page! + 1) {
      setServicePageble((prev) => ({ ...prev, page: servicePageble.page! + 1 }));
      console.log('deu bom');
    } else {
      console.log('acabou');
    }
  };

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

  return (
    <TabsContainer overflow="hidden" pb={0} marginHorizontal={0}>
      <Tabs.Screen
        options={{
          title: 'Buscar',
          headerTitleAlign: 'center',
          headerRight: () => (
            <SearchPopover
              open={modal}
              onOpenChange={() => {
                setModal(!modal);
              }}
              shouldAdapt
              placement="bottom"
              exit={(value, local) => {
                setModal(!modal);
                setCategory(value);
                setLocal(local);
                onRefresh();
              }}
            />
          ),
        }}
      />
      <SearchButton
        placeholder="Busque por um serviço..."
        onPress={onRefresh}
        value={name}
        changeText={(text) => {
          setName(text);
        }}
      />
      <YStack flex={1} backgroundColor="$background">
        <FlatList
          style={{ backgroundColor: theme.background.get() }}
          showsVerticalScrollIndicator
          data={services} // alterar
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          keyExtractor={(service) => service.id!.toString()}
          ListEmptyComponent={
            !loadingServices ? (
              <YStack ai="center">
                <H4>Nenhum Serviço Encontrado!</H4>
                <Text> Refaça sua busca.</Text>
              </YStack>
            ) : null
          }
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-evenly',
            paddingVertical: 10,
            backgroundColor: theme.background.name,
          }}
          initialNumToRender={6}
          renderItem={({ item }) => (
            <CustomCardService
              animation="bouncy"
              size="$3"
              width={182}
              minHeight={240}
              imageW={182}
              scale={0.9}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.875 }}
              serviceName={item.name}
              serviceImage={item.image}
              userName={item.user.name}
              userImage={item.user.image}
              star={(item.sumReviews * 1.0) / item.numReviews}
              onPress={() => {
                setModalServiceId(item.id);
                setModalService(true);
              }}
            />
          )}
          onEndReachedThreshold={0.1}
          onEndReached={services != null ? fetchMoreData : null}
          ListFooterComponent={
            services && !pageServices?.last ? <Spinner size="small" mt={20} /> : null
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
    </TabsContainer>
  );
}
