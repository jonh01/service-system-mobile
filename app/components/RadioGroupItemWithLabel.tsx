import { Label, RadioGroup, SizeTokens, XStack } from 'tamagui';

export function RadioGroupItemWithLabel(
  props: Readonly<{ size: SizeTokens; value: string; label: string }>
) {
  const id = `radiogroup-${props.value}`;
  return (
    <XStack
      minWidth={180}
      maxWidth={300}
      alignItems="center"
      justifyContent="flex-start"
      space="$2"
      paddingHorizontal={10}
      borderWidth={1}
      borderColor="$shadowColor"
      borderRadius={20}
      marginBottom={10}>
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <Label size={props.size} maxWidth={270} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  );
}
