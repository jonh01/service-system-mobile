import { Text, YStack } from 'tamagui';

import CustomModal from '~/app/components/CustomModal';

type ModalProps = {
  serviceId: string;
};
export default function Modal({ serviceId }: Readonly<ModalProps>) {
  return (
    <CustomModal>
      <YStack>
        <Text>{serviceId}</Text>
      </YStack>
    </CustomModal>
  );
}