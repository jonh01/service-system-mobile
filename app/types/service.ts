import { NumReviewsNote } from './rating';

export enum ServiceStatus {
  active = 'Active',
  pending = 'Pending',
  disabled = 'Disabled',
}

export type ServiceProvidedInsert = {
  name: string;
  image?: string;
  description: string;
  localAction: string[];
  user: {
    id: string;
  };
  category: {
    id: string;
  };
};

export type ServiceProvidedUpdate = {
  image?: string;
  description?: string;
  localAction?: string[];
};

export type ServiceProvidedResponse = {
  id: string;
  name: string;
  image: string;
  description: string;
  status: ServiceStatus;
  localAction: string[];
  user: {
    id: string;
    name: string;
    image: string;
    phone: string;
  };
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  numReviews: number;
  sumReviews: number;
  numReviewsNote: NumReviewsNote[];
};

export type ServiceProvidedSummaryResponse = {
  id: string;
  name: string;
  image: string;
  description: string;
  status: ServiceStatus;
  user: {
    name: string;
    image: string;
  };
  category: {
    id: string;
    name: string;
  };
  numReviews: number;
  sumReviews: number;
};

export type ServiceProvidedUserResponse = {
  id: string;
  name: string;
  image: string;
  status: ServiceStatus;
  user: {
    id: string;
  };
};
