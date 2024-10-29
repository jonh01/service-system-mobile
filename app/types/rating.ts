export type RatingInsert = {
  note: number;
  comment: string;
  images: string[];
  user: {
    id: string;
  };
  serviceProvided: {
    id: string;
  };
};

export type RatingUpdate = {
  note?: number;
  comment?: string;
  images?: string[];
};

export type RatingResponse = {
  id: string;
  note: number;
  comment: string;
  images: string[];
  user: {
    id: string;
    name: string;
    image: string;
  };
  serviceProvided: {
    id: string;
  };
  createdAt: Date;
};

export type NumReviewsNote = {
  note: number;
  serviceProvidedId: string;
  numReviews: number;
};
