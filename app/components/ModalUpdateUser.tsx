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
  Label,
  Spinner,
  XStack,
  YStack,
} from 'tamagui';

import { setUser } from '../redux/authSlice';
import {
  findUserById,
  updateUser,
} from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { UserUpdate } from '../types/user';
import { formatPhone } from '../utils/formatters';

export const ModalUpdateUser = ({
  modalVisible,
  setModalVisible,
}: Readonly<{
  modalVisible: boolean;
  setModalVisible: () => void;
}>) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [userEdit, setUserEdit] = useState<UserUpdate>({
    phone: user?.phone,
  });

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const [message, setMessage] = useState<MessageToast | null>();

  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');

  const phoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/;

  useEffect(() => {
    if (status === 'submitting') {
      updateUser(user!.id, userEdit)
        .then(() => {
          findUserById(user!.id)
            .then((response) => {
              dispatch(setUser(response.data));
              setModalVisible();
            })
            .catch(() => {
              setMessage({
                type: 'error',
                title: 'Erro ao Buscar Novos Dados',
                text: 'Tente novamente. Se persistir entre em contato conosco',
              });
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
    if (modalVisible) {
      setUserEdit({
        phone: user?.phone,
      });
    }
  }, [modalVisible]);

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      if (result.assets[0].base64 != null)
        setUserEdit((prev) => ({ ...prev, image: result.assets[0].base64 ?? undefined }));
    } else {
      Alert.alert('Aviso', 'Nenhuma imagem selecionada!');
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

  const isValidSubmit = () => {
    if (userEdit.phone !== user?.phone || userEdit.image !== undefined) setStatus('submitting');
    else
      setMessage({
        type: 'info',
        title: 'Nenhuma Alteração Feita',
        text: 'Altere algum dado para poder salvar.',
      });
  };

  return userEdit ? (
    <Modal animationType="fade" transparent visible={modalVisible} statusBarTranslucent>
      <YStack flex={1} justifyContent="flex-start" backgroundColor="#00000044">
        <Pressable style={{ height: headerHeight }} onPress={setModalVisible} />
        <YStack
          width="100%"
          height={300}
          justifyContent="flex-end"
          alignItems="center"
          elevation={500}>
          <Image
            position="absolute"
            top={0}
            source={{
              uri: require('../../assets/technology-background.png'),
              height: 260,
              width: 434,
            }}
          />
          <TouchableOpacity
            onPress={setModalVisible}
            style={{ position: 'absolute', top: 0, right: 5, zIndex: 1000 }}>
            <FontAwesome name="close" size={24} color="red" />
          </TouchableOpacity>
          <Form flex={1} onSubmit={isValidSubmit}>
            <XStack h={160} position="relative" justifyContent="center" alignItems="center">
              <YStack ml={20} mr={25}>
                <Avatar
                  circular
                  size="$8"
                  onPress={pickImageAsync}
                  hoverStyle={{ scale: 0.925 }}
                  pressStyle={{ scale: 0.875 }}>
                  <Avatar.Image
                    source={{
                      uri: selectedImage ? selectedImage : user?.image ? user.image : '',
                    }}
                  />
                  <Avatar.Fallback bc="white" />
                </Avatar>
              </YStack>
              <YStack w="60%" space={4}>
                <Label col="#fff" fontWeight="900" fontSize="$6" htmlFor="modalUsuTel">
                  Telefone:
                </Label>
                <Input
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  id="modalUsuTel"
                  ml={20}
                  placeholder="Seu Telefone"
                  inputMode="tel"
                  keyboardType="number-pad"
                  borderColor={
                    userEdit.phone != '' && !phoneRegex.test(userEdit.phone!)
                      ? '#ff0000'
                      : '$borderColor'
                  }
                  focusStyle={{
                    borderColor:
                      userEdit.phone != '' && !phoneRegex.test(userEdit.phone!)
                        ? '#ff0000'
                        : '$borderColor',
                  }}
                  defaultValue={userEdit.phone}
                  onChangeText={(text) => {
                    setUserEdit((prev) => ({ ...prev, phone: formatPhone(text) }));
                  }}
                />
              </YStack>
            </XStack>
            <Form.Trigger asChild>
              <Button
                marginVertical="$4"
                alignSelf="center"
                width="$14"
                icon={status === 'submitting' ? () => <Spinner /> : undefined}>
                Editar
              </Button>
            </Form.Trigger>
          </Form>
        </YStack>
        <Pressable style={{ flex: 1 }} onPress={setModalVisible} />
        <Toast position="top" topOffset={40} />
      </YStack>
    </Modal>
  ) : null;
};
