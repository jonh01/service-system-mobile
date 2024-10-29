export type OrderInsert = {
  description: string;
  local?: string;
  startAt?: Date;
  price: number;
  user: {
    id: string;
  };
  serviceProvided: {
    id: string;
  };
};

export type OrderUpdate = {
  local?: string;
  startAt?: Date;
  endAt?: Date;
  price?: number;
};

export type OrderResponse = {
  id: string;
  description: string;
  local: string;
  startAt: Date;
  endAt: Date;
  price: number;
  user: {
    id: string;
    name: string;
    image: string;
    phone: string;
    email: string;
  };
  serviceProvided: {
    id: string;
    name: string;
    user: {
      id: string;
      name: string;
      image: string;
      phone: string;
      email: string;
    };
  };
  createdAt: Date;
};
