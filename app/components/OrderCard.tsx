import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Button, Text, XStack, YStack } from 'tamagui';

import { OrderResponse } from '../types/order';

type OrderCardProps = {
  order: OrderResponse;
  openService: () => void;
  closeOrder: () => void;
  openOrder: () => void;
};
export const OrderCard = ({ order, openService, closeOrder, openOrder }: OrderCardProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={openService}>
      <XStack
        maxHeight={200}
        w="96%"
        justifyContent="space-between"
        alignItems="flex-start"
        alignSelf="center"
        backgroundColor="#fff"
        paddingVertical={10}
        elevation={1}
        borderLeftColor={order.endAt == null ? '$green10Dark' : '$red10Dark'}
        borderLeftWidth={3}>
        <YStack
          alignSelf="stretch"
          height="100%"
          alignItems="center"
          justifyContent="center"
          mr={14}
          ml={10}>
          <Avatar circular size="$8">
            <Avatar.Image
              src={order.serviceProvided.user.image ?? 'http://picsum.photos/200/300'}
            />
            <Avatar.Fallback bc="white" />
          </Avatar>
        </YStack>
        <YStack flex={1} space="$1">
          <Text
            maxWidth={200}
            ml={5}
            numberOfLines={1}
            ellipsizeMode="tail"
            fontWeight={500}
            fontSize="$6">
            {order.serviceProvided.name}
          </Text>
          <Text ml={5} fontSize="$4" color="$gray10Light">
            {order.serviceProvided.user.name}
          </Text>
          <TouchableWithoutFeedback>
            <XStack justifyContent="space-evenly" marginVertical={15}>
              <Button size="$3" onPress={closeOrder}>
                Fechar Ordem
              </Button>
              <Button size="$3" onPress={openOrder}>
                Exibir Ordem
              </Button>
            </XStack>
          </TouchableWithoutFeedback>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
};
