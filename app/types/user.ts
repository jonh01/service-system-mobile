const typeUser = ['Client'] as const;

export type UserInsert = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  image: string;
  type: typeof typeUser;
};

export type UserUpdate = {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  image: string;
  type: string[];
  createdAt: Date;
};
