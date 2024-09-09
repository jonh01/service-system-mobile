import { FontAwesome } from '@expo/vector-icons';
import { Adapt, Button, Input, Label, Popover, XStack, YStack } from 'tamagui';

export default function CustomPopover() {
  return (
    <Popover size="$5" allowFlip placement="top-start">
      <Popover.Trigger asChild>
        <Button
          icon={<FontAwesome name="ellipsis-v" size={22} />}
          $theme-light={{ backgroundColor: '#fff' }}
          $theme-dark={{ backgroundColor: '#000' }}
        />
      </Popover.Trigger>

      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}>
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack space="$3">
          <XStack space="$3">
            <Label size="$3" htmlFor="teste">
              Name
            </Label>
            <Input size="$3" id="teste" />
          </XStack>

          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}>
              Submit
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
