import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Button, Text, useTheme, XStack, YStack } from 'tamagui';

import { OrderResponse } from '../types/order';

type OrderUserCardProps = {
  order: OrderResponse;
  openService: () => void;
  openOrder: () => void;
  openChat: () => void;
  pendding: () => boolean;
};
export const OrderUserCard = ({
  order,
  openService,
  openOrder,
  openChat,
  pendding,
}: OrderUserCardProps) => {
  const theme = useTheme();
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
          <Avatar circular size="$6">
            <Avatar.Image src={order.user.image ?? 'http://picsum.photos/200/300'} />
            <Avatar.Fallback bc="white" />
          </Avatar>
        </YStack>
        <YStack flex={1} space="$1">
          <XStack>
            <Text
              maxWidth={200}
              ml={5}
              numberOfLines={1}
              ellipsizeMode="tail"
              fontWeight={500}
              fontSize="$6">
              {order.user.name}
            </Text>
            {pendding() ? (
              <FontAwesome6
                name="circle-info"
                size={14}
                color="#ff0022"
                style={{ marginLeft: 5 }}
              />
            ) : null}
          </XStack>
          <Text ml={5} fontSize="$4" color="$gray10Light">
            {'Serviço: ' + order.serviceProvided.name}
          </Text>
          <TouchableWithoutFeedback>
            <XStack justifyContent="flex-start" width={120} marginVertical={15}>
              <Button size="$2" onPress={openOrder} mr={10}>
                Exibir Ordem
              </Button>
              <Button
                size="$2"
                onPress={openChat}
                bc="#fff"
                pressStyle={{ backgroundColor: 'rgba(79, 83, 80, 0.055)' }}>
                <FontAwesome name="whatsapp" size={26} color={theme.green9.get()} />
              </Button>
            </XStack>
          </TouchableWithoutFeedback>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
};
