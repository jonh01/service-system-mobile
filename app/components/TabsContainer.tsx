import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, YStackProps } from 'tamagui';

type ContainerProps = YStackProps & {
  children: React.ReactNode;
};

export const TabsContainer = ({ children, ...rest }: ContainerProps) => {
  const { left, right } = useSafeAreaInsets();

  return (
    <YStack flex={1} ml={left + 4} mr={right + 4} paddingBottom="$4" bg="$background" {...rest}>
      {children}
    </YStack>
  );
};
