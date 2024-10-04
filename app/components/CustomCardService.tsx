import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Card, CardProps, Image, H6, Avatar, YStack, Text } from 'tamagui';

type CustomCardServiceProps = CardProps & {
  serviceName: string;
  serviceImage?: string;
  userName: string;
  userImage: string;
  star: number;
  imageW: number;
};

export function CustomCardService({
  serviceName,
  star,
  serviceImage,
  userName,
  userImage,
  imageW,
  ...props
}: CustomCardServiceProps) {
  return (
    <Card elevate size="$1" bordered {...props}>
      <Card.Header>
        <YStack alignItems="center">
          <Avatar circular size="$10">
            <Avatar.Image src={userImage}/>
            <Avatar.Fallback delayMs={600} bc="white" />
          </Avatar>
        </YStack>
      </Card.Header>
      <Card.Footer justifyContent="center">
        <YStack
          backgroundColor="#f5f5f5"
          width={172}
          minHeight={80}
          marginBottom={10}
          padding={6}
          alignItems="center"
          justifyContent="center">
          <Text col="$color.gray10Dark">{userName}</Text>
          <H6 textAlign="center">{serviceName}</H6>
          <StarRatingDisplay maxStars={5} starSize={20} rating={star} />
        </YStack>
      </Card.Footer>
      <Card.Background backgroundColor={userImage ? '#f5f5f5' : undefined} borderRadius={5}>
        {serviceImage ? (
          <Image
            style={{ flex: 1 }}
            source={{
              uri: serviceImage,
              width: imageW,
            }}
          />
        ) : null}
      </Card.Background>
    </Card>
  );
}
