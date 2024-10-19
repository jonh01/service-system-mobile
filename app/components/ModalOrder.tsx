import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Keyboard, Modal, TouchableOpacity } from 'react-native';
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

import { DateButton } from './DateButton';
import { Label } from './Label';
import { updateOrder } from '../services/ServicesAPI';
import { MessageToast } from '../types/message';
import { OrderResponse, OrderUpdate } from '../types/order';
import { useAppDispatch, useAppSelector } from '../types/reduxHooks';
import { converterData } from '../utils/formatters';

export const ModalOrder = ({
  order,
  modalVisible,
  setModalVisible,
  successAtt,
}: Readonly<{
  order: OrderResponse | null;
  modalVisible: boolean;
  setModalVisible: () => void;
  successAtt: (success: boolean) => void;
}>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [orderUp, setOrderUp] = useState<OrderUpdate>({ price: 0.0 });
  const [dateStart, setDateStart] = useState(new Date());

  const [editable, setEditable] = useState(false);

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
      updateOrder(order!.id, orderUp)
        .then(() => {
          successAtt(true);
          setModalVisible();
        })
        .catch((response) => {
          console.log('deu ruim ao criar a conta: ' + response.message);
          setMessage({
            type: 'error',
            title: 'Erro ao Atualizar ordem',
            text: 'Tente novamente. Se persistir entre em contato conosco',
          });
        })
        .finally(() => {
          setStatus('off');
        });
    }
  }, [status]);

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

  useEffect(() => {
    if (modalVisible) {
      setEditable(order?.endAt == null);
      setOrderUp({
        local: order?.local,
        price: order?.price,
        startAt: order?.startAt,
      });
    }
  }, [modalVisible]);

  const onChangeStart = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDateStart(currentDate);

    if (event.type.toString().includes('set'))
      setOrderUp((prev) => ({ ...prev, startAt: currentDate }));
  };

  const showModeStart = () => {
    DateTimePickerAndroid.open({
      value: order!.startAt ? new Date(order!.startAt) : dateStart,
      onChange: onChangeStart,
      is24Hour: true,
    });
  };

  const isValidSubmit = () => {
    let isValid: boolean = false;
    if (orderUp.local === order?.local) isValid = false;
    else if (orderUp.price === order?.price) isValid = false;
    else if (orderUp.startAt === order?.startAt) isValid = false;
    else isValid = true;

    if (order && !isValid) setStatus('submitting');
    else
      setMessage({
        type: 'info',
        title: 'Nenhuma Alteração Feita',
        text: 'Altere algum dado para poder salvar.',
      });
  };

  const isValidLocal = () => {
    return order?.user.id === user?.id && (orderUp.local == undefined || orderUp.local === '');
  };

  const isValidDtInicial = () => {
    return (
      order?.serviceProvided.user.id === user?.id &&
      (orderUp.startAt == null || orderUp.startAt === undefined)
    );
  };

  const isValidPrice = () => {
    return (
      order?.serviceProvided.user.id === user?.id &&
      (orderUp.price == null || orderUp.price === 0.0)
    );
  };

  return order ? (
    <Modal animationType="fade" transparent visible={modalVisible} statusBarTranslucent>
      <YStack flex={1} justifyContent="center" alignItems="flex-end" backgroundColor="#00000044">
        <Toast />
        <YStack
          width="100%"
          height="60%"
          alignItems="flex-start"
          backgroundColor="white"
          elevation={500}
          marginBottom={keyboardHeight ?? 0}>
          <TouchableOpacity
            onPress={setModalVisible}
            style={{ marginVertical: 10, marginLeft: 10, alignSelf: 'flex-start' }}>
            <FontAwesome name="close" size={24} color="red" />
          </TouchableOpacity>
          <Form flex={1} onSubmit={isValidSubmit}>
            <ScrollView
              style={{ paddingLeft: 10 }}
              showsVerticalScrollIndicator
              keyboardDismissMode="on-drag">
              <YStack width={400}>
                <H4 ml={10} marginVertical={20}>
                  Serviço
                </H4>
                <Label marginVertical={5} name="Descrição" value={order.description} disabled />
                <Label
                  marginVertical={5}
                  name="Nome Prestador"
                  value={order.serviceProvided.user.name}
                  disabled
                />
                <Label
                  marginVertical={5}
                  name="Telefone Prestador"
                  value={order.serviceProvided.user.phone}
                  disabled
                />

                <H4 ml={10} marginVertical={20}>
                  Cliente
                </H4>
                <Label marginVertical={5} name="Nome" value={order.user.name} disabled />

                <XStack ai="center" space="$2" paddingHorizontal="$3" marginVertical={5}>
                  <LabelTamugui width={90}>Endereço</LabelTamugui>
                  <TextArea
                    flex={1}
                    focusStyle={{
                      borderWidth: 3,
                      borderColor: isValidLocal() ? '#ff0000' : '$borderColor',
                    }}
                    numberOfLines={4}
                    value={orderUp.local}
                    disabled={order.user.id != user?.id || !editable}
                    onChangeText={(text) => {
                      setOrderUp((prev) => ({ ...prev, local: text }));
                    }}
                    borderColor={isValidLocal() ? '#ff0000' : '$borderColor'}
                  />
                </XStack>

                <Label marginVertical={5} name="Telefone" value={order.user.phone} disabled />

                <H4 ml={10} marginVertical={20}>
                  Outras Informações
                </H4>
                <DateButton
                  marginVertical={5}
                  name="Data Inicial"
                  date={`${orderUp!.startAt ? converterData(orderUp.startAt.toString()) : ''}`}
                  onPress={() => showModeStart()}
                  disabled={order?.serviceProvided.user.id !== user?.id || !editable}
                  focusStyle={{
                    borderColor: isValidDtInicial() ? '#ff0000' : '$borderColor',
                  }}
                  borderColor={isValidDtInicial() ? '#ff0000' : '$borderColor'}
                />
                <DateButton
                  marginVertical={5}
                  name="Data Final"
                  date={`${order.endAt ? converterData(order.endAt.toString()) : ''}`}
                  disabled
                />
                <Label
                  marginVertical={5}
                  name="Preço"
                  value={'R$ ' + orderUp.price?.toString()}
                  keyboardType="number-pad"
                  disabled={order?.serviceProvided.user.id !== user?.id || !editable}
                  focusStyle={{
                    borderColor: isValidPrice() ? '#ff0000' : '$borderColor',
                  }}
                  borderColor={isValidPrice() ? '#ff0000' : '$borderColor'}
                />
              </YStack>
            </ScrollView>
            <Form.Trigger asChild>
              <Button
                marginVertical="$2"
                alignSelf="center"
                width="$13"
                disabled={!editable}
                backgroundColor={!editable ? '#ff000042' : '$background'}
                color={!editable ? '#ffffff' : '#000'}
                icon={status === 'submitting' ? () => <Spinner /> : undefined}>
                Atualizar dados
              </Button>
            </Form.Trigger>
          </Form>
        </YStack>
      </YStack>
    </Modal>
  ) : null;
};
