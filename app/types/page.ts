export type PageResponse = {
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
};

export type PageRequest = {
  page?: number;
  size?: number;
  sort?: Sort[];
};

export type Sort = {
  orderBy: string;
  direction: string;
};
