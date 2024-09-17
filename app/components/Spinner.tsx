import { Adapt, Dialog, Paragraph, Progress, Sheet, Spinner, YStack } from 'tamagui';
type DialogProps = {
  size:number
};

export function CustomDialog({size}: DialogProps) {
  return (
    <YStack>
        <Progress size={size}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
    </YStack>
    );
}
