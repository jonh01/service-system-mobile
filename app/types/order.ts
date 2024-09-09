export type OrderInsert = {
  description: string;
  startAt: Date;
  price: number;
  user: {
    id: string;
  };
  serviceProvided: {
    id: string;
  };
};

export type OrderUpdate = {
  startAt?: Date;
  endAt?: Date;
  price?: number;
};

export type OrderResponse = {
  id: string;
  description: string;
  startAt: Date;
  endAt: Date;
  price: number;
  user: {
    id: string;
  };
  serviceProvided: {
    id: string;
  };
  createdAt: Date;
};
