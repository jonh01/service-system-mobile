import * as Progress from 'react-native-progress';
import { Dialog } from 'tamagui';

type CustomProgressProps = {
  open: boolean;
  location: 'flex-end' | 'flex-start';
};
export function CustomProgress({ open, location }: Readonly<CustomProgressProps>) {
  return (
    <Dialog modal open={open}>
      <Dialog.Portal justifyContent={location}>
        <Progress.Bar width={500} indeterminate borderWidth={0} animationType="spring" />
      </Dialog.Portal>
    </Dialog>
  );
}
