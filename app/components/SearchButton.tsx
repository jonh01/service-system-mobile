import { FontAwesome } from '@expo/vector-icons';
import { Keyboard, TouchableOpacity } from 'react-native';
import { Input, XStack } from 'tamagui';

type SearchButtonProps = {
  placeholder: string;
  onPress: () => void;
};

export default function SearchButton({ placeholder, onPress }: Readonly<SearchButtonProps>) {
  return (
    <XStack
      ai="center"
      backgroundColor="$background"
      marginHorizontal="$4"
      marginVertical="$3"
      pr="$3"
      borderRadius="$radius.10"
      elevation="$zIndex.1">
      <Input
        backgroundColor="$background"
        flex={1}
        size="$4"
        borderWidth={0}
        borderRadius="$radius.10"
        placeholder={placeholder}
        onSubmitEditing={onPress}
      />
      <TouchableOpacity onPress={onPress}>
        <FontAwesome name="search" size={26} />
      </TouchableOpacity>
    </XStack>
  );
}
