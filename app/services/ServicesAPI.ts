import axios from 'axios';

import { OrderInsert, OrderUpdate } from '../types/order';
import { PageRequest } from '../types/page';
import { RatingInsert, RatingUpdate } from '../types/rating';
import { ServiceProvidedInsert, ServiceProvidedUpdate, ServiceStatus } from '../types/service';
import { UserInsert, UserUpdate } from '../types/user';

const axiosInstance = axios.create({ baseURL: process.env.EXPO_PUBLIC_URL_SERVICE_API });

// definir os cookies
// Definir pageble

const PageDefine = (pageble: PageRequest) => {
  let sortString = '';
  pageble.sort?.forEach((sort) => {
    sortString += '&sort=' + sort.orderBy + ',' + sort.direction;
  });

  return `page=${pageble.page ? pageble.page : 0}&size=${pageble.size ? pageble.size : 10}${sortString}`;
};

const ServiceDefine = (name?: string, id?: string) => {
  if (name && id) return `name=${name}&categoryId=${id}`;
  else if (name) return `name=${name}`;
  else if (id) return `categoryId=${id}`;

  return '';
};

// Login API

export const SignInAPI = async (googleToken: string) => {
  const response = await axiosInstance.post(`/authenticate/signin?google_token=${googleToken}`);
  console.log(axiosInstance);
  return response;
};

export const SignUpAPI = async (user: UserInsert, googleToken: string) => {
  const response = await axiosInstance.post('/authenticate/signup', { user, googleToken });
  return response;
};

export const SignOutAPI = async () => {
  const response = await axiosInstance.post('/authenticate/signout');
  return response;
};

export const RefreshTokenAPI = async () => {
  const response = await axiosInstance.post('/authenticate/refreshtoken');
  return response;
};

// Category

export const findAllCategory = async (pageble?: PageRequest) => {
  if (pageble) {
    const request = `/categories?${PageDefine(pageble)}`;
    const response = await axiosInstance.get(request);
    console.log(axiosInstance);
    return response;
  }
  const response = await axiosInstance.get('/categories');
  return response;
};

export const findCategoryById = async (id: string) => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response;
};

// Order

export const createOrder = async (order: OrderInsert) => {
  const response = await axiosInstance.post('/orders', order);
  return response;
};

export const updateOrder = async (id: string, order: OrderUpdate) => {
  const response = await axiosInstance.put(`/orders/${id}`, order);
  return response;
};

export const deleteByOrderId = async (id: string) => {
  const response = await axiosInstance.delete(`/orders/${id}`);
  return response;
};

export const findOrderById = async (id: string) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response;
};

export const findAllOrderByUserId = async (
  id: string,
  finished: boolean,
  pageble?: PageRequest
) => {
  // buscar todas as ordens do usuário
  if (pageble) {
    const request = `/orders?userId=${id}&finished=${finished}&${PageDefine(pageble)}`;
    const response = await axiosInstance.get(request);
    return response;
  }
  const request = `/orders?userId=${id}&finished=${finished}`;
  const response = await axiosInstance.get(request);
  return response;
};

export const findAllOrderByServiceUserId = async (id: string, pageble?: PageRequest) => {
  // buscar todas as ordens de todos os serviços que tenha o usuário como prestador deste serviço
  if (pageble) {
    const request = `/orders/allservices?userId=${id}&${PageDefine(pageble)}`;
    const response = await axiosInstance.get(request);
    return response;
  }
  const request = `/orders/allservices?userId=${id}`;
  const response = await axiosInstance.get(request);
  return response;
};

// Rating

export const createRating = async (rating: RatingInsert) => {
  const response = await axiosInstance.post('/ratings', rating);
  return response;
};

export const updateRating = async (id: string, rating: RatingUpdate) => {
  const response = await axiosInstance.put(`/ratings/${id}`, rating);
  return response;
};

export const findRatingById = async (id: string) => {
  const response = await axiosInstance.get(`/ratings/${id}`);
  return response;
};

// Services

export const createService = async (service: ServiceProvidedInsert) => {
  const response = await axiosInstance.post('/services', service);
  return response;
};

export const updateService = async (id: string, service: ServiceProvidedUpdate) => {
  const response = await axiosInstance.put(`/services/${id}`, service);
  return response;
};

export const deleteByServiceId = async (id: string) => {
  const response = await axiosInstance.delete(`/services/${id}`);
  return response;
};

export const updateServiceStatus = async (id: string, status: ServiceStatus) => {
  const response = await axiosInstance.patch(`/services/${id}?status=${status}`);
  return response;
};

export const findServiceById = async (id: string) => {
  const response = await axiosInstance.get(`/services/${id}`);
  return response;
};

export const findAllService = async (
  status: ServiceStatus,
  pageble?: PageRequest,
  name?: string,
  id?: string
) => {
  // buscar todos os serviços
  if (pageble) {
    const request = `/services?${ServiceDefine(name, id)}&status=${status}&${PageDefine(pageble)}`;
    const response = await axiosInstance.get(request);
    return response;
  }
  const request = `/services?${ServiceDefine(name, id)}&status=${status}`;
  const response = await axiosInstance.get(request);
  return response;
};

export const findAllServiceByUserId = async (id: string, pageble?: PageRequest) => {
  // buscar todos os serviços de um usuário
  if (pageble) {
    const request = `/users/${id}/services?${PageDefine(pageble)}`;
    const response = await axiosInstance.get(request);
    return response;
  }
  const request = `/users/${id}/services`;
  const response = await axiosInstance.get(request);
  return response;
};

// User

export const createUser = async (user: UserInsert) => {
  const response = await axiosInstance.post('/users', user);
  return response;
};

export const updateUser = async (id: string, user: UserUpdate) => {
  const response = await axiosInstance.put(`/users/${id}`, user);
  return response;
};

export const deleteByUserId = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response;
};

export const findUserById = async (id: string) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response;
};
