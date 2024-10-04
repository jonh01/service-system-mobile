import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { H4, Spinner, Text, useTheme, YStack } from 'tamagui';

import { CustomCardService } from '../components/CustomCardService';
import SearchButton from '../components/SearchButton';
import SearchPopover from '../components/SearchPopover';
import { TabsContainer } from '../components/TabsContainer';
import { setLoadingServices, setServices } from '../redux/serviceSlice';
import { findAllService } from '../services/ServicesAPI';
import { PageRequest } from '../types/page';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { ServiceStatus } from '../types/service';

export default function Search() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const loadingServices = useAppSelector((state) => state.services.loading);
  const [error, setError] = useState('');
  const services = useAppSelector((state) => state.services.services);
  const pageServices = useAppSelector((state) => state.services.pageResponse);

  const [modal, setModal] = useState(false);
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
        direction: 'asc',
      },
    ],
  });

  useEffect(() => {
    if (name.length > 0) {
      setError('');
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
          setError(error.message);
        });
      setIsRefreshing(false);
    }
  }, [servicePageble]);

  if (!loadingServices && error !== '') {
    console.log('Error: ', error);
  }

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

  return (
    <TabsContainer overflow="hidden" pb={0} marginHorizontal={0}>
      <Tabs.Screen
        options={{
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
              minHeight={230}
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
                console.log('clicou');
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
    </TabsContainer>
  );
}
