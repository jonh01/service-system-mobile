import { Adapt, Dialog, Paragraph, Sheet, Spinner } from 'tamagui';
import * as Progress from 'react-native-progress';

type CustomProgressProps = {
    open: boolean,
    location:'flex-end'|'flex-start'
}
export function CustomProgress({open, location}:CustomProgressProps) {
  return (
    <Dialog modal open={open}>
      <Dialog.Portal justifyContent={location}>
        <Progress.Bar width={500} indeterminate={true} borderWidth={0} animationType="spring" />
      </Dialog.Portal>
    </Dialog>
  );
}
