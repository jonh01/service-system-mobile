import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { YStack, Text, XStack } from 'tamagui';

type LocalityTooltipProps = {
  message: string;
};

export const LocalityTooltip = ({ message }: LocalityTooltipProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente ou reabrir o balão
    }
  }, [visible]);

  return (
    <YStack alignItems="flex-end" justifyContent="center" flex={1} minHeight={70}>
      <XStack
        pt={20}
        alignItems="center"
        space="$1.5"
        onPress={() => {
          setVisible(!visible);
        }}>
        <FontAwesome name="question-circle" size={20} color="black" />
        <Text mt={10}>Localidades</Text>
      </XStack>

      {visible && (
        <YStack
          backgroundColor="#fff"
          padding={15}
          borderRadius={10}
          w={166}
          position="absolute" // Balão agora é absoluto
          bottom={50} // Ajuste a posição para que o balão apareça sobre o texto
          zIndex={1000} // Se necessário, aumenta a prioridade para sobrepor
          borderWidth={1}
          borderColor="#b1b1b1"
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.3}
          shadowRadius={5}>
          <Text>{message}</Text>
          <YStack
            position="absolute"
            bottom={-11}
            left="57%"
            marginLeft={-10}
            width={20}
            height={20}
            backgroundColor="#fff"
            borderLeftWidth={1}
            borderBottomWidth={1}
            borderColor="#b1b1b1"
            transform={[{ rotate: '-45deg' }]}
          />
        </YStack>
      )}
    </YStack>
  );
};
