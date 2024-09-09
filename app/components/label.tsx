import {
  XStack,
  Label as LabelTamagui,
  Input,
  LabelProps as LabelPropsTamagui,
  InputProps as InputPropsTamagui,
} from 'tamagui';

type LabelProps = LabelPropsTamagui &
  InputPropsTamagui & {
    name: string;
  };

export function Label({ name, ...rest }: LabelProps) {
  return (
    <XStack ai="center" space="$2" paddingHorizontal="$3">
      <LabelTamagui width={90} {...rest}>
        {name}
      </LabelTamagui>
      <Input flex={1} focusStyle={{ borderWidth: 3 }} {...rest} />
    </XStack>
  );
}
