import {
  XStack,
  Label as LabelTamagui,
  LabelProps as LabelPropsTamagui,
  ButtonProps as ButtonPropsTamagui,
  Button,
} from 'tamagui';

type DateButtonProps = LabelPropsTamagui &
  ButtonPropsTamagui & {
    name: string;
    date: string;
    onChangeText?: (text: string) => void;
  };

export function DateButton({ name, date, onChangeText, ...rest }: DateButtonProps) {
  return (
    <XStack ai="center" space="$2" paddingHorizontal="$3">
      <LabelTamagui width={90} {...rest}>
        {name}
      </LabelTamagui>
      <Button flex={1} {...rest} alignItems="center">
        {date}
      </Button>
    </XStack>
  );
}
