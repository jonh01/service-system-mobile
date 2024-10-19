import { Alert } from 'react-native';
import { Button, ButtonProps } from 'tamagui';

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
  const createTwoButtonAlert = () =>
    Alert.alert(alertTitle, alertDescription, [
      {
        text: 'Não',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Sim', onPress: onAlertPress },
    ]);
  return (
    <Button onPress={createTwoButtonAlert} {...props}>
      {buttonText}
    </Button>
  );
}
