import { AlertDialog, Button, XStack, YStack, ButtonProps } from 'tamagui';

type CustomAlertProps = ButtonProps & {
  buttonText?: string;
  alertTitle: string;
  alertDescription: string;
  onAlertPress: () => void;
};
export function CustomAlertDialog({
  buttonText,
  alertTitle,
  alertDescription,
  onAlertPress,
  ...props
}: CustomAlertProps) {
  return (
    <AlertDialog modal key={`alert-${alertTitle}`} native>
      <AlertDialog.Trigger asChild>
        <Button {...props}>{buttonText}</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={0.9}
          opacity={1}
          y={0}>
          <YStack space>
            <AlertDialog.Title fontSize="$8" fontWeight={600}>
              {alertTitle}
            </AlertDialog.Title>
            <AlertDialog.Description fontSize="$5">{alertDescription}</AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Não</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={onAlertPress}>
                  Sim
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
