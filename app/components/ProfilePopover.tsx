import { FontAwesome } from '@expo/vector-icons';
import { Adapt, Button, Popover, PopoverProps, YStack } from 'tamagui';

type ProfilePopoverProps = PopoverProps & {
  shouldAdapt?: boolean;
  editInfo: () => void;
  exit: () => void;
};

export default function ProfilePopover({
  shouldAdapt,
  editInfo,
  exit,
  ...props
}: ProfilePopoverProps) {
  return (
    <Popover size="$5" allowFlip {...props}>
      <Popover.Trigger asChild>
        <Button
          icon={<FontAwesome name="ellipsis-v" size={22} />}
          $theme-light={{ backgroundColor: '#fff' }}
          $theme-dark={{ backgroundColor: '#000' }}
        />
      </Popover.Trigger>

      {shouldAdapt && (
        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[14]}>
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
      )}

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

        <YStack>
          <Popover.Close asChild>
            <YStack space>
              <Button size="$3" onPress={editInfo}>
                Editar Informações
              </Button>
              <Button size="$3" onPress={exit}>
                Sair
              </Button>
            </YStack>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
