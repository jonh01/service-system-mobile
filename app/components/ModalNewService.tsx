import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  H4,
  YStack,
  ScrollView,
  Button,
  Form,
  Spinner,
  XStack,
  Label as LabelTamugui,
  TextArea,
} from 'tamagui';

import { CategorySelect } from './CategorySelect';
import { ImageUpload } from './ImageUpload';
import { Label } from './Label';
import { LocalComponent } from './LocalComponent';
import { createService } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { ServiceProvidedInsert } from '../types/service';

export const ModalNewService = ({
  modalVisible,
  setModalVisible,
  success,
}: Readonly<{
  modalVisible: boolean;
  setModalVisible: () => void;
  success: (success: boolean) => void;
}>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [newService, setNewService] = useState<ServiceProvidedInsert>({
    name: '',
    description: '',
    image: undefined,
    localAction: [''],
    category: { id: '' },
    user: { id: '' },
  });

  const [local, setLocal] = useState('');

  const [message, setMessage] = useState<MessageToast | null>(null);

  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');

  useEffect(() => {
    if (status === 'submitting') {
      createService(newService)
        .then(() => {
          success(true);
          setModalVisible();
        })
        .catch((response) => {
          console.log('deu ruim ao criar serviço: ' + response.message);
          setMessage({
            type: 'error',
            title: 'Erro ao Criar Serviço',
            text: 'Tente novamente. Se persistir entre em contato conosco',
          });
        })
        .finally(() => {
          setStatus('submitted');
        });
    }
  }, [status]);

  useEffect(() => {
    if (message != null)
      Toast.show({
        autoHide: true,
        visibilityTime: 5000,
        type: message?.type,
        text1: message?.title,
        text2: message?.text,
      });
  }, [message]);

  useEffect(() => {
    if (modalVisible) {
      setNewService({
        name: '',
        description: '',
        image: undefined,
        localAction: [''],
        category: { id: '' },
        user: { id: user!.id },
      });
    }
    setStatus('off');
  }, [modalVisible]);

  const isValidSubmit = () => {
    if (
      newService.name.length == 0 ||
      newService.description.length == 0 ||
      newService.image?.length == 0 ||
      newService.category.id.length == 0 ||
      newService.localAction.length == 0
    )
      return false;
    else return true;
  };

  return newService ? (
    <Modal animationType="fade" transparent visible={modalVisible} statusBarTranslucent>
      <YStack flex={1} justifyContent="flex-end">
        <Pressable style={{ height: '15%', width: '100%' }} onPress={setModalVisible} />
        <YStack
          width="100%"
          height="85%"
          alignItems="flex-start"
          backgroundColor="white"
          borderTopStartRadius={20}
          borderTopEndRadius={20}
          elevation={500}>
          <XStack width="100%" alignItems="center" justifyContent="space-between" padding={10}>
            <H4>Criação de Serviço</H4>
            <TouchableOpacity onPress={setModalVisible}>
              <FontAwesome name="close" size={24} color="red" />
            </TouchableOpacity>
          </XStack>

          <Form
            flex={1}
            marginTop={10}
            onSubmit={() => {
              if (newService && isValidSubmit()) setStatus('submitting');
            }}>
            <ScrollView
              style={{ paddingLeft: 10 }}
              showsVerticalScrollIndicator
              nestedScrollEnabled
              keyboardDismissMode="on-drag">
              <YStack width={400}>
                <Label
                  marginVertical={5}
                  name="Nome"
                  value={newService.name}
                  onChangeText={(text) => {
                    setNewService((prev) => ({ ...prev, name: text }));
                  }}
                  focusStyle={{
                    borderWidth: 3,
                    borderColor:
                      newService.name.length === 0 && status == 'submitted'
                        ? '#ff0000'
                        : '$borderColor',
                  }}
                  borderColor={
                    newService.name.length == 0 && status === 'submitted'
                      ? '#ff0000'
                      : '$borderColor'
                  }
                />

                <XStack ai="center" space="$2" paddingHorizontal="$3" marginVertical={5}>
                  <LabelTamugui width={90}>Descrição</LabelTamugui>
                  <TextArea
                    flex={1}
                    focusStyle={{
                      borderWidth: 3,
                      borderColor:
                        newService.description.length == 0 && status === 'submitted'
                          ? '#ff0000'
                          : '$borderColor',
                    }}
                    numberOfLines={4}
                    value={newService.description}
                    onChangeText={(text) => {
                      setNewService((prev) => ({ ...prev, description: text }));
                    }}
                    borderColor={
                      newService.description.length == 0 && status === 'submitted'
                        ? '#ff0000'
                        : '$borderColor'
                    }
                  />
                </XStack>
                <CategorySelect
                  selected={(value) => {
                    console.log('mudei para: ' + value);
                    setNewService((prev) => ({ ...prev, category: { id: value } }));
                  }}
                  id="selectNewService"
                  native
                />
                <Label
                  marginVertical={5}
                  name="Local"
                  value={local}
                  placeholder="Botafogo RJ"
                  onChangeText={(text) => {
                    setLocal(text);
                  }}
                  onSubmitEditing={() => {
                    if (newService.localAction[0] === '') newService.localAction.pop();

                    newService.localAction.push(local);
                    setLocal('');
                  }}
                  focusStyle={{
                    borderWidth: 3,
                    borderColor:
                      newService.localAction[0] === '' && status === 'submitted'
                        ? '#ff0000'
                        : '$borderColor',
                  }}
                  borderColor={
                    newService.localAction[0] === '' && status === 'submitted'
                      ? '#ff0000'
                      : '$borderColor'
                  }
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
                    {newService.localAction[0] !== ''
                      ? newService.localAction.map((item) => (
                          <LocalComponent
                            key={'item-' + item}
                            item={item}
                            onpress={(value) => {
                              setNewService((prev) => ({
                                ...prev,
                                localAction: newService.localAction.filter(
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
                    setNewService((prev) => ({ ...prev, image: imageBase64 }));
                  }}
                />
              </YStack>
            </ScrollView>
            <Form.Trigger asChild>
              <Button
                marginVertical="$2"
                alignSelf="center"
                width="$13"
                disabled={!isValidSubmit() /* alterar para  isValidSubmit() */}
                backgroundColor={!isValidSubmit() ? '#ff000042' : '$background'}
                color={!isValidSubmit() ? '#ffffff' : '#000'}
                icon={status === 'submitting' ? () => <Spinner /> : undefined}>
                Criar Serviço
              </Button>
            </Form.Trigger>
          </Form>
        </YStack>
      </YStack>
    </Modal>
  ) : null;
};
