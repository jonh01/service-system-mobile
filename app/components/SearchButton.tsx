import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Input, XStack } from 'tamagui';

type SearchButtonProps = {
  placeholder: string;
  onPress: () => void;
  value: string;
  changeText: (text: string) => void;
};

export default function SearchButton({
  placeholder,
  onPress,
  value,
  changeText,
}: Readonly<SearchButtonProps>) {
  return (
    <XStack
      ai="center"
      backgroundColor="white"
      marginHorizontal="$4"
      marginVertical="$5"
      pr="$3"
      borderRadius="$radius.10"
      elevation="$1">
      <Input
        backgroundColor="white"
        flex={1}
        size="$4"
        borderWidth={0}
        borderRadius="$radius.10"
        placeholder={placeholder}
        value={value}
        onChangeText={changeText}
        onSubmitEditing={onPress}
      />
      <TouchableOpacity onPress={onPress}>
        <FontAwesome name="search" size={26} />
      </TouchableOpacity>
    </XStack>
  );
}
