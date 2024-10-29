import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Text, XStack } from 'tamagui';

import { NumReviewsNote } from '../types/rating';

type ReviewsAvarengeProps = {
  reviews: NumReviewsNote;
};

export const ReviewsAvarenge = ({ reviews }: ReviewsAvarengeProps) => {
  return (
    <XStack space="$4">
      <StarRatingDisplay maxStars={5} starSize={30} rating={reviews.note} />
      <Text fontSize="$6" fontWeight={700} color="$yellow10Light">
        {reviews.numReviews}
      </Text>
    </XStack>
  );
};
