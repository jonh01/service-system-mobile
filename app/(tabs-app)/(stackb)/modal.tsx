import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Linking } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';
import {
  Separator,
  Avatar,
  H4,
  H6,
  Paragraph,
  Spinner,
  Text,
  XStack,
  YStack,
  useTheme,
} from 'tamagui';

import { CustomAlertDialog } from '~/app/components/CustomAlertDialog';
import CustomModal from '~/app/components/CustomModal';
import { CustomTabs } from '~/app/components/CustomTabs';
import { LocalityTooltip } from '~/app/components/LocalityTooltip';
import { RatingCard } from '~/app/components/RatingCard';
import { ReviewsAvarenge } from '~/app/components/ReviewsAvarenge';
import { setLoadingOrders, setOrders } from '~/app/redux/orderSlice';
import { setLoadingRating, setRatings } from '~/app/redux/ratingSlice';
import { setServices } from '~/app/redux/serviceSlice';
import {
  createOrder,
  findAllOrderByUserId,
  findAllRatingByService,
  findServiceById,
} from '~/app/services/ServicesAPI';
import { Error } from '~/app/types/error';
import { PageRequest } from '~/app/types/page';
import { NumReviewsNote } from '~/app/types/rating';
import { useAppDispatch, useAppSelector } from '~/app/types/reduxHooks';
import { ServiceProvidedResponse } from '~/app/types/service';
import { cleanPhone } from '~/app/utils/formatters';

const reviewsNoteView = (reviewsNote?: NumReviewsNote[]) => {
  return reviewsNote
    ?.sort((a, b) => b.note - a.note)
    .map((element) => (
      <ReviewsAvarenge key={element.serviceProvidedId + '' + element.note} reviews={element} />
    ));
};

export default function Modal() {
  const { serviceId } = useLocalSearchParams<{
    serviceId: string;
  }>();

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loadingRatings = useAppSelector((state) => state.ratings.loading);
  const ratings = useAppSelector((state) => state.ratings.ratings);
  const pageRatings = useAppSelector((state) => state.ratings.pageResponse);

  const [service, setService] = useState<ServiceProvidedResponse>();
  const [errorMessage, setErrorMessage] = useState<Error | null>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [ratingPageble, setRatingPageble] = useState<PageRequest>({
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
    if (serviceId.length > 0) {
      setErrorMessage(null);
      findServiceById(serviceId)
        .then((response) => {
          setService(response.data as ServiceProvidedResponse);
          console.log('service:', response.data);
        })
        .catch((error) => {
          console.log('error:', error.message);
          setErrorMessage({
            title: 'Erro ao Buscar Serviço',
            text: 'Não foram retornados serviços',
          });
        });
    }
  }, []);

  useEffect(() => {
    if (serviceId.length > 0) {
      setErrorMessage(null);
      dispatch(setLoadingRating());
      findAllRatingByService(serviceId, ratingPageble)
        .then((response) => {
          console.log('page:', response);
          dispatch(setRatings(response));
        })
        .catch((error) => {
          console.log('error:', error.message);
          setErrorMessage({
            title: 'Erro ao Buscar Comentários',
            text: 'Não foi retornado comentário para esse serviço.',
          });
        });
      setIsRefreshing(false);
    }
  }, [ratingPageble]);

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
    if (serviceId.length > 0) {
      setIsRefreshing(true);
      setRatingPageble((prev) => ({ ...prev, page: 0 }));
    }
  };

  const fetchMoreData = () => {
    if (!pageRatings?.last && pageRatings?.totalPages != ratingPageble.page! + 1) {
      setRatingPageble((prev) => ({ ...prev, page: ratingPageble.page! + 1 }));
      console.log('deu bom');
    } else {
      console.log('acabou');
    }
  };

  const createOrderAndRedirect = () => {
    createOrder({
      description: service!.name,
      startAt: new Date(),
      price: 0.0,
      user: {
        id: user!.id,
      },
      serviceProvided: {
        id: service!.id,
      },
    })
      .then((response) => {
        console.log('Ordem criada, indo para WhatsApp. Ordem: ' + response.data);
        dispatch(setLoadingOrders());
        findAllOrderByUserId(user!.id).then((response) => {
          dispatch(setOrders(response));
          console.log('Orders:', response);
        });
        Linking.openURL(`http://api.whatsapp.com/send?phone=${cleanPhone(service!.user.phone)}`);
      })
      .catch((error) => {
        console.log('error ordem: ' + error);
        setErrorMessage({
          title: 'Erro ao Criar Ordem',
          text: 'O usuário já possui uma ordem ativa para esse serviço.',
        });
      });
  };

  return service ? (
    <CustomModal
      routeReturn={() => {
        router.back();
      }}>
      <YStack space="$6">
        <XStack maxHeight={500} w="100%" justifyContent="space-between" alignItems="flex-start">
          <YStack ml={20} mr={20}>
            <Avatar circular size="$8">
              <Avatar.Image src={service?.user.image ?? 'http://picsum.photos/200/300'} />
              <Avatar.Fallback bc="white" />
            </Avatar>
          </YStack>
          <YStack>
            <XStack
              w={270}
              h={60}
              mr={15}
              pr={10}
              justifyContent="space-between"
              alignItems="center"
              borderBottomWidth={1}
              borderBottomColor="#8b8b8b">
              <H6 mt={30} ml={10}>
                {service?.user.name}
              </H6>
              <LocalityTooltip
                message={
                  service?.localAction ? service.localAction.toString().replace(/,/g, ', ') : ''
                }
              />
            </XStack>
            <Text fontWeight={700} mt={5} ml={5} maxWidth={250} color="#5e5e5e">
              {service?.name}
            </Text>
            <Paragraph ml={5} mb={5} maxWidth={260} textAlign="justify" color="#5e5e5e">
              {service?.description}
            </Paragraph>
            <StarRatingDisplay
              maxStars={5}
              starSize={20}
              rating={service?.numReviews ? (service.sumReviews * 1.0) / service.numReviews : 0.0}
            />
          </YStack>
        </XStack>
        <CustomTabs
          width={390}
          height={518}
          tab1={
            <YStack flex={1}>
              <FlatList
                style={{ backgroundColor: '#fff' }}
                showsVerticalScrollIndicator
                data={ratings}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                keyExtractor={(rating) => rating.id.toString()}
                ListEmptyComponent={
                  !loadingRatings ? (
                    <YStack ai="center">
                      <H4>Nenhuma Avaliação Encontrado!</H4>
                    </YStack>
                  ) : null
                }
                initialNumToRender={8}
                ItemSeparatorComponent={() => <Separator marginVertical={20} />}
                renderItem={({ item }) =>
                  item.serviceProvided.id.includes(serviceId) ? <RatingCard rating={item} /> : null
                }
                onEndReachedThreshold={0.1}
                onEndReached={ratings != null ? fetchMoreData : null}
                ListFooterComponent={
                  ratings && !pageRatings?.last ? <Spinner size="small" mt={20} /> : null
                }
              />
            </YStack>
          }
          tab1Name="Comentários"
          tab2={
            <YStack
              alignContent="center"
              alignItems="center"
              space="$3"
              padding={14}
              borderColor="$yellow10Light"
              borderWidth={1}
              borderRadius={20}>
              {reviewsNoteView(service.numReviewsNote)}
            </YStack>
          }
          tab2Name="Avaliações"
        />
        <CustomAlertDialog
          alertTitle="Abrir WhatsApp"
          alertDescription='Ao clicar em "Sim", será gerada uma ordem de serviço.'
          themeInverse
          icon={<FontAwesome name="whatsapp" size={24} color={theme.green9.get()} />}
          borderRadius={360}
          height={64}
          width={64}
          elevate
          bottom={50}
          right={16}
          position="absolute"
          onAlertPress={createOrderAndRedirect}
        />
      </YStack>
    </CustomModal>
  ) : null;
}
