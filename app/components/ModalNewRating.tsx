import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Keyboard, Modal, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';
import { Button, Form, H4, H6, Label, Spinner, TextArea, XStack, YStack } from 'tamagui';

import { setRatings } from '../redux/ratingSlice';
import {
  createRating,
  findAllRatingByService,
  findRatingById,
  findRatingByUserIdAndServiceId,
  updateRating,
} from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { RatingInsert, RatingResponse, RatingUpdate } from '../types/rating';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';

export const ModalNewRating = ({
  serviceId,
  update,
  modalVisible,
  setModalVisible,
}: Readonly<{
  serviceId: string;
  update: boolean;
  modalVisible: boolean;
  setModalVisible: () => void;
}>) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [newRating, setNewRating] = useState<RatingInsert>({
    comment: '',
    images: [],
    note: 0,
    serviceProvided: { id: serviceId ?? '' },
    user: { id: user?.id ?? '' },
  });

  const [ratingId, setRatingId] = useState('');
  const [message, setMessage] = useState<MessageToast | null>();

  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (status === 'submitting') {
      if (update) {
        updateRating(ratingId, {
          note: newRating.note,
          comment: newRating.comment,
          images: newRating.images,
        })
          .then(() => {
            setModalVisible();
          })
          .catch(() => {
            setMessage({
              type: 'error',
              title: 'Erro ao Criar Avaliação',
              text: 'Tente novamente. Se persistir entre em contato conosco',
            });
          })
          .finally(() => {
            setStatus('off');
          });
      } else {
        createRating(newRating)
          .then(() => {
            findAllRatingByService(serviceId).then((response) => {
              dispatch(setRatings(response));
            });
            setModalVisible();
          })
          .catch(() => {
            setMessage({
              type: 'error',
              title: 'Erro ao Criar Avaliação',
              text: 'Tente novamente. Se persistir entre em contato conosco',
            });
          })
          .finally(() => {
            setStatus('off');
          });
      }
    }
  }, [status]);

  useEffect(() => {
    if (modalVisible) {
      if (update) {
        findRatingByUserIdAndServiceId(user!.id, serviceId)
          .then((response) => {
            let ratingup = response.data as RatingResponse; // aqui é um let
            setRatingId(ratingup.id);
            setNewRating({
              comment: ratingup.comment,
              images: ratingup.images,
              note: ratingup.note,
              serviceProvided: { id: ratingup.serviceProvided.id },
              user: { id: ratingup.user.id },
            });
            console.log('avaliação a atualizar: ' + ratingup.id);
          })
          .catch(() => {
            setMessage({
              type: 'error',
              title: 'Avaliação não Encontrada!',
              text: 'Tente novamente mais tarde. Se persistir entre em contato!',
            });
          });
      } else {
        setNewRating({
          comment: '',
          images: [],
          note: 1,
          serviceProvided: { id: serviceId ?? '' },
          user: { id: user?.id ?? '' },
        });
      }
    }
  }, [modalVisible]);

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

  const isValidSubmit = () => {
    if (newRating) setStatus('submitting');
    else
      setMessage({
        type: 'info',
        title: 'Nenhuma Alteração Feita',
        text: 'Altere algum dado para poder salvar.',
      });
  };

  return serviceId && newRating ? (
    <Modal animationType="fade" transparent visible={modalVisible} statusBarTranslucent>
      <YStack flex={1} justifyContent="flex-start" alignItems="center" backgroundColor="#00000044">
        <Toast />
        <YStack
          width="96%"
          height="46%"
          alignItems="flex-start"
          backgroundColor="white"
          elevation={500}
          marginTop={180}
          borderRadius={20}
          pl={10}>
          <TouchableOpacity
            onPress={setModalVisible}
            style={{ marginTop: 10, marginRight: 10, alignSelf: 'flex-end' }}>
            <FontAwesome name="close" size={24} color="red" />
          </TouchableOpacity>
          <Form flex={1} onSubmit={isValidSubmit}>
            <YStack width={370}>
              <H4 pb={10}>Nota:</H4>
              <StarRating
                rating={newRating.note}
                onChange={(newNote) => {
                  setNewRating((prev) => ({ ...prev, note: newNote >= 1 ? newNote : 1 }));
                }}
              />
              <H4 paddingVertical={10}>Comentário:</H4>
              <TextArea
                focusStyle={{
                  borderWidth: 3,
                }}
                numberOfLines={8}
                value={newRating?.comment}
                onChangeText={(text) => {
                  setNewRating((prev) => ({ ...prev, comment: text }));
                }}
              />
            </YStack>
            <Form.Trigger asChild>
              <Button
                marginVertical="$4"
                alignSelf="center"
                width="$16"
                icon={status === 'submitting' ? () => <Spinner /> : undefined}>
                Adicionar Comentário
              </Button>
            </Form.Trigger>
          </Form>
        </YStack>
      </YStack>
    </Modal>
  ) : null;
};
