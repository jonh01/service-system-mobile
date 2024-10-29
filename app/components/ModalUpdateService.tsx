import { FontAwesome } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  Avatar,
  Button,
  Form,
  Image,
  Input,
  Label as LabelTamugui,
  ScrollView,
  Spinner,
  TextArea,
  XStack,
  YStack,
} from 'tamagui';

import { ImageUpload } from './ImageUpload';
import { Label } from './Label';
import { LocalComponent } from './LocalComponent';
import { setUser } from '../redux/authSlice';
import { findServiceById, findUserById, updateService, updateUser } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { ServiceProvidedResponse, ServiceProvidedUpdate } from '../types/service';
import { UserUpdate } from '../types/user';
import { formatPhone } from '../utils/formatters';

export const ModalUpdateService = ({
  serviceId,
  modalVisible,
  setModalVisible,
  success,
}: Readonly<{
  serviceId: string;
  modalVisible: boolean;
  setModalVisible: () => void;
  success: (success: boolean) => void;
}>) => {
  const [oldService, setOldService] = useState<{ desc: string; local: string[] }>({
    desc: '',
    local: [],
  });

  const [upService, setUpService] = useState<ServiceProvidedUpdate>({
    description: '',
    localAction: [],
  });

  const [local, setLocal] = useState('');

  const [message, setMessage] = useState<MessageToast | null>();

  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');

  useEffect(() => {
    if (status === 'submitting') {
      updateService(serviceId, upService)
        .then(() => {
          success(true);
          setModalVisible();
          setMessage({
            type: 'success',
            title: 'Serviço atualizado!',
            text: 'As alterações feitas foram salvas.',
          });
        })
        .catch(() => {
          setMessage({
            type: 'error',
            title: 'Erro ao Atualizar Dados',
            text: 'Tente novamente. Se persistir entre em contato conosco',
          });
        })
        .finally(() => {
          setStatus('off');
        });
    }
  }, [status]);

  useEffect(() => {
    if (modalVisible === true) {
      findServiceById(serviceId)
        .then((response) => {
          const data = response.data as ServiceProvidedResponse; //aqui é um let
          setOldService({
            desc: data.description,
            local: data.localAction,
          });
          setUpService({
            description: data.description || '',
            localAction: data.localAction || [],
          });
        })
        .catch(() => {
          setMessage({
            type: 'error',
            title: 'Erro ao Buscar Serviço',
            text: 'Tente novamente. Se persistir entre em contato conosco',
          });
        });
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
    const localEquals = JSON.stringify(upService.localAction) === JSON.stringify(oldService.local);

    if (!localEquals || upService.description !== oldService.desc || upService.image !== undefined)
      setStatus('submitting');
    else
      setMessage({
        type: 'info',
        title: 'Nenhuma Alteração Feita',
        text: 'Altere algum dado para poder salvar.',
      });
  };

  const addNewLocal = () => {
    if (!upService.localAction!.includes(local)) {
      setUpService((prev) => ({ ...prev, localAction: [...prev.localAction!, local] }));
    }
  };

  return upService ? (
    <Modal animationType="fade" transparent visible={modalVisible} statusBarTranslucent>
      <YStack flex={1} justifyContent="flex-start" alignItems="center" backgroundColor="#00000044">
        <YStack
          width="96%"
          height="68%"
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
            <YStack height={520} justifyContent="center" alignItems="center">
              <XStack ai="center" space="$2" paddingHorizontal="$3" marginVertical={5}>
                <LabelTamugui width={90}>Descrição</LabelTamugui>
                <TextArea
                  flex={1}
                  focusStyle={{
                    borderWidth: 3,
                  }}
                  numberOfLines={4}
                  value={upService.description}
                  onChangeText={(text) => {
                    setUpService((prev) => ({ ...prev, description: text }));
                  }}
                />
              </XStack>
              <Label
                marginVertical={5}
                name="Local"
                value={local}
                placeholder="Botafogo RJ"
                onChangeText={(text) => {
                  setLocal(text);
                }}
                onSubmitEditing={() => {
                  if (upService.localAction![0] === '') upService.localAction!.pop();
                  addNewLocal();
                  setLocal('');
                }}
                focusStyle={{
                  borderWidth: 3,
                }}
              />
              <ScrollView
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: '#cacaca',
                  margin: 15,
                }}
                showsVerticalScrollIndicator
                nestedScrollEnabled>
                <XStack flexWrap="wrap" justifyContent="space-around">
                  {upService.localAction![0] !== ''
                    ? upService.localAction!.map((item) => (
                        <LocalComponent
                          key={'item-' + item}
                          item={item}
                          onpress={(value) => {
                            setUpService((prev) => ({
                              ...prev,
                              localAction: upService.localAction!.filter(
                                (elemento) => elemento !== value
                              ),
                            }));
                            console.log(value);
                          }}
                        />
                      ))
                    : null}
                </XStack>
              </ScrollView>
              <ImageUpload
                setImage={(imageBase64) => {
                  setUpService((prev) => ({ ...prev, image: imageBase64 ?? '' }));
                }}
              />
            </YStack>
            <Form.Trigger asChild>
              <Button
                alignSelf="center"
                width="$14"
                icon={status === 'submitting' ? () => <Spinner /> : undefined}>
                Editar
              </Button>
            </Form.Trigger>
          </Form>
        </YStack>
        <Toast position="top" topOffset={40} />
      </YStack>
    </Modal>
  ) : null;
};
