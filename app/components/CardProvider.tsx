import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, YStackProps, Image, Text, XStack, Label, Switch } from 'tamagui';

import { ServiceProvidedUserResponse, ServiceStatus } from '../types/service';

type CardProps = {
  service: ServiceProvidedUserResponse;
};

export const CardProvider = ({ service }: CardProps) => {
  const [status, setStatus] = useState<ServiceStatus>(service.status);

  return (
    <YStack>
      <Image
        onPress={() => {
          console.log('cliquei aqui!');
        }}
        source={{
          uri: require('../../assets/technology-background.png'),
          height: 230,
          width: 190,
        }}
      />
      <XStack
        position="absolute"
        bottom={8}
        left={4}
        width={182}
        minHeight={50}
        backgroundColor="#fff"
        alignItems="center"
        justifyContent="space-around">
        <Label width={90} htmlFor="notify" size="$2">
          {service.name}
        </Label>
        {status === ServiceStatus.pending ? (
          <FontAwesome name="warning" size={24} />
        ) : (
          <Switch id="notify" size="$2" defaultChecked={status === ServiceStatus.active}>
            <Switch.Thumb animation="quick" />
          </Switch>
        )}
      </XStack>
    </YStack>
  );
};
