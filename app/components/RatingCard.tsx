import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Avatar, Paragraph, Text, XStack, YStack } from 'tamagui';

import { RatingResponse } from '../types/rating';
import { converterData } from '../utils/formatters';

type RatingCardProps = {
  rating: RatingResponse;
};
export const RatingCard = ({ rating }: RatingCardProps) => {
  return (
    <XStack maxHeight={400} w="100%" justifyContent="space-between" alignItems="flex-start">
      <YStack ml={15} mr={15}>
        <Avatar circular size="$6">
          <Avatar.Image src={rating.user.image ?? 'http://picsum.photos/200/300'} />
          <Avatar.Fallback bc="white" />
        </Avatar>
      </YStack>
      <YStack>
        <XStack
          w={280}
          h={30}
          mr={15}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="#8b8b8b">
          <Text
            maxWidth={80}
            ml={5}
            numberOfLines={1}
            ellipsizeMode="tail"
            fontWeight={500}
            fontSize="$5">
            {rating.user.name}
          </Text>
          <StarRatingDisplay maxStars={5} starSize={20} rating={rating.note} />
          <Text fontSize="$1" color="$gray10Light">
            {converterData(rating.createdAt.toString())}
          </Text>
        </XStack>
        <Paragraph ml={5} mb={5} maxWidth={260} textAlign="justify" color="#5e5e5e">
          {rating.comment}
        </Paragraph>
      </YStack>
    </XStack>
  );
};
