import { FontAwesome } from '@expo/vector-icons';
import { Card, CardProps, Image, Switch, XStack, Label } from 'tamagui';

type CustomCardMyServiceProps = CardProps & {
  serviceName: string;
  serviceStatus: string;
  toggleStatus: (checked: boolean) => void;
};

export function CustomCardMyService({
  serviceName,
  serviceStatus,
  toggleStatus,
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
          <Label width={90} htmlFor="notify" size="$2">
            {serviceName}
          </Label>
          {serviceStatus.includes('Pending') ? (
            <FontAwesome name="warning" size={24} />
          ) : (
            <Switch
              id="notify"
              size="$2"
              style={{ backgroundColor: serviceStatus.includes('Active') ? '#edffe7' : '#ffe3e3' }}
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
            uri: require('../../assets/technology-background.png'),
            height: 230,
            width: 190,
          }}
        />
      </Card.Background>
    </Card>
  );
}
