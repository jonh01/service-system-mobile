import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';

export const LocalComponent = ({
  item,
  onpress,
}: {
  item: string;
  onpress: (value: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onpress(item);
      }}
      style={{
        borderWidth: 1,
        borderColor: '#cacaca',
        borderRadius: 7,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 10,
      }}>
      <Text
        marginRight={10}
        numberOfLines={1}
        ellipsizeMode="tail"
        width={100}
        fontWeight={500}
        fontSize="$5"
        color="#7c7c7c">
        {item}
      </Text>
      <FontAwesome name="close" size={16} color="red" />
    </TouchableOpacity>
  );
};
