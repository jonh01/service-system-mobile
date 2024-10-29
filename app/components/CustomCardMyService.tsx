import { FontAwesome } from '@expo/vector-icons';
import { Card, CardProps, Image, Switch, XStack, Label, Button } from 'tamagui';

type CustomCardMyServiceProps = CardProps & {
  serviceName: string;
  serviceStatus: string;
  serviceImage: string;
  toggleStatus: (checked: boolean) => void;
  penddingOnpress: () => void;
};

export function CustomCardMyService({
  serviceName,
  serviceStatus,
  serviceImage,
  toggleStatus,
  penddingOnpress,
  ...props
}: CustomCardMyServiceProps) {
  return (
    <Card elevate size="$1" bordered {...props}>
      <Card.Footer justifyContent="center">
        <XStack
          backgroundColor="white"
          width={182}
          minHeight={50}
          marginBottom={6}
          alignItems="center"
          justifyContent="space-around">
          <Label
            width={110}
            htmlFor={serviceStatus.includes('Pending') ? undefined : 'notify'}
            size="$2">
            {serviceName}
          </Label>
          {serviceStatus.includes('Pending') ? (
            <Button
              size="$3"
              bc="#fff"
              onPress={penddingOnpress}
              icon={<FontAwesome id="notify" name="warning" size={22} />}
            />
          ) : (
            <Switch
              id="notify"
              size="$2"
              style={{ backgroundColor: serviceStatus.includes('Active') ? '#edffe7' : '#ffe3e3' }}
              defaultChecked={!!serviceStatus.includes('Active')}
              onCheckedChange={toggleStatus}>
              <Switch.Thumb
                animation="quick"
                style={{
                  backgroundColor: serviceStatus.includes('Active') ? '#08f800' : '#ff0000',
                }}
              />
            </Switch>
          )}
        </XStack>
      </Card.Footer>
      <Card.Background>
        <Image
          opacity={serviceStatus.includes('Active') ? 1 : 0.5}
          backgroundColor={
            !serviceStatus.includes('Active')
              ? serviceStatus.includes('Pending')
                ? '#eeff00'
                : '#ff0000'
              : 'transparent'
          }
          source={{
            uri: serviceImage ?? require('../../assets/technology-background.png'),
            height: 230,
            width: 190,
          }}
        />
      </Card.Background>
    </Card>
  );
}
