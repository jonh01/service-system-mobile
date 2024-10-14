import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Linking, VirtualizedList } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
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
  Accordion,
  Square,
  Button,
  Theme,
  useTheme,
} from 'tamagui';

import { CustomAlertDialog } from '~/app/components/CustomAlertDialog';
import CustomModal from '~/app/components/CustomModal';
import { LocalityTooltip } from '~/app/components/LocalityTooltip';
import { RatingCard } from '~/app/components/RatingCard';
import { RatingTabs } from '~/app/components/RatingTabs';
import { ReviewsAvarenge } from '~/app/components/ReviewsAvarenge';
import { setLoadingRating, setRatings } from '~/app/redux/ratingSlice';
import { createOrder, findAllRatingByService, findServiceById } from '~/app/services/ServicesAPI';
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
  const [error, setError] = useState('');

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
      setError('');
      findServiceById(serviceId)
        .then((response) => {
          setService(response.data as ServiceProvidedResponse);
          console.log('service:', response.data);
        })
        .catch((error) => {
          console.log('error:', error.message);
          setError(error.message);
        });
    }
  }, []);

  useEffect(() => {
    if (serviceId.length > 0) {
      setError('');
      dispatch(setLoadingRating());
      findAllRatingByService(serviceId, ratingPageble)
        .then((response) => {
          console.log('page:', response);
          dispatch(setRatings(response));
        })
        .catch((error) => {
          console.log('error:', error.message);
          setError(error.message);
        });
      setIsRefreshing(false);
    }
  }, [ratingPageble]);

  if (!loadingRatings && error !== '') {
    console.log('Error: ', error);
  }

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
        console.log('Ordem criada, indo para Whatsapp. Ordem: ' + response.data);
        Linking.openURL(`http://api.whatsapp.com/send?phone=${cleanPhone(service!.user.phone)}`);
      })
      .catch((error) => {
        console.log('error ordem: ' + error);
      });
  };

  return service ? (
    <CustomModal>
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
        <RatingTabs
          ratings={
            <YStack flex={1}>
              <FlatList
                style={{ backgroundColor: '#fff' }}
                showsVerticalScrollIndicator
                data={ratings} // alterar
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                keyExtractor={(service) => service.id.toString()}
                ListEmptyComponent={
                  !loadingRatings ? (
                    <YStack ai="center">
                      <H4>Nenhuma Avaliação Encontrado!</H4>
                    </YStack>
                  ) : null
                }
                initialNumToRender={8}
                ItemSeparatorComponent={() => <Separator marginVertical={20} />}
                renderItem={({ item }) => <RatingCard rating={item} />}
                onEndReachedThreshold={0.1}
                onEndReached={ratings != null ? fetchMoreData : null}
                ListFooterComponent={
                  ratings && !pageRatings?.last ? <Spinner size="small" mt={20} /> : null
                }
              />
            </YStack>
          }
          reviewsNote={
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
