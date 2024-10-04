import axios from 'axios';
import { router } from 'expo-router';

import { SignOut } from './FireBaseAuth';
import { persistor, store } from '../redux/store';
import { CategoryResponse } from '../types/category';
import { OrderInsert, OrderUpdate } from '../types/order';
import { PageRequest, PageResponse } from '../types/page';
import { RatingInsert, RatingUpdate } from '../types/rating';
import {
  ServiceProvidedInsert,
  ServiceProvidedSummaryResponse,
  ServiceProvidedUpdate,
  ServiceProvidedUserResponse,
  ServiceStatus,
} from '../types/service';
import { UserInsert, UserUpdate } from '../types/user';

const axiosInstance = axios.create({ baseURL: process.env.EXPO_PUBLIC_URL_SERVICE_API });

// definir refresh
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Se a resposta estiver ok, retorna diretamente
  },
  async (error) => {
    const status: number = error.response ? error.response.status : null;
    const urlRequest: string = error.config.url;

    console.log('log erro 1: ' + status + ' refresh: ' + isRefreshing);
    if ((status === 401 || status === 403) && !urlRequest.includes('logged')) {
      const originalRequest = error.config;
      console.log(urlRequest);

      // Verifica se já estamos atualizando o token
      if (!isRefreshing) {
        console.log('log erro 2: ' + status + ' refresh: ' + isRefreshing);
        isRefreshing = true;
        try {
          // Atualiza o token
          const response = await RefreshTokenAPI();

          // Reenvia a requisição original com o novo token
          if (response.status === 200) {
            const responseRefresh = await axiosInstance(originalRequest);
            return responseRefresh;
          }
        } catch (refreshError) {
          console.log('log erro 3: ' + status + ' refresh: ' + isRefreshing);

          // Acesse diretamente o googleToken do estado do Redux
          const googleToken = store.getState().auth.googleToken;

          // Se o refresh falhar, desloga o usuário
          const loginResponse = await SignInAPI(googleToken || '');

          if (loginResponse.status === 200) {
            console.log('signIn: ' + loginResponse.data);
            const responseRefresh = await axiosInstance(originalRequest);
            return responseRefresh;
          } else return Promise.reject(refreshError);
        } finally {
          // Reseta o estado de refresh para permitir novas atualizações no futuro
          isRefreshing = false;
        }
      } else if (status === 403 && isRefreshing) {
        // sair porque o google token é inválido
        console.log('log erro 4: ' + status + ' refresh: ' + isRefreshing);
        SignOut()
          .then(() => {
            console.log('SignOut with Google!');
            persistor.purge().catch((error) => {
              console.log('error delete AsyncStorage: ', error);
            });
            router.replace('/(stack-auth)');
          })
          .catch((error) => {
            console.log('error signOut: ', error);
          });
      }
    }
    console.log('log erro 5: ' + status + ' refresh: ' + isRefreshing);
    return Promise.reject(error); // Propaga o erro para outras situações
  }
);

// Definir pageble

const PageDefine = (pageble: PageRequest) => {
  let sortString = '';
  pageble.sort?.forEach((sort) => {
    sortString += '&sort=' + sort.orderBy + ',' + sort.direction;
  });

  return `page=${pageble.page ? pageble.page : 0}&size=${pageble.size ? pageble.size : 10}${sortString}`;
};

const ServiceDefine = (local?: string, id?: string) => {
  if (local && local.length > 0 && id && id.length > 0){
    console.log('local1: '+ local + ' category: '+ id);
    return `local=${local}&categoryId=${id}&`;
  }
  else if (local && local.length > 0) {
    console.log('local2: '+ local + ' category: '+ id);
    return `local=${local}&`;
  }
  else if (id && id.length > 0) {
    console.log('local3: '+ local + ' category: '+ id);
    return `categoryId=${id}&`;
  }
  else return '';
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

export const LoggedAPI = async () => {
  const response = await axiosInstance.post('authenticate/logged');
  return response;
};

// Category

export const findAllCategory = async (pageble?: PageRequest) => {
  let response;
  if (pageble) {
    const request = `/categories?${PageDefine(pageble)}`;
    response = await axiosInstance.get(request);
  } else {
    response = await axiosInstance.get('/categories');
  }

  try {
    const data = await response.data;
    const page: PageResponse = {
      first: data.first,
      last: data.last,
      numberOfElements: data.numberOfElements,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      empty: data.empty,
    };
    const categories = data.content as CategoryResponse[];
    return Promise.resolve({ page, categories });
  } catch (error: any) {
    return Promise.reject(error);
  }
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

export const findAllRatingByService = async (serviceId: string, pageble?: PageRequest) => {
  if (pageble) {
    const request = `/services/${serviceId}/ratings?${PageDefine(pageble)}`;
    const response = await axiosInstance.get(request);
    return response;
  }
  const request = `/services/${serviceId}/ratings`;
  const response = await axiosInstance.get(request);
  return response;
};

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
  name: string,
  pageble?: PageRequest,
  categoryId?: string,
  local?: string
) => {
  // buscar todos os serviços
  let response;
  if (pageble) {
    const request = `/services?${PageDefine(pageble)}&${ServiceDefine(local, categoryId)}name=${name}&status=${status}`;
    console.log('request: '+ request)
    response = await axiosInstance.get(request);
  } else {
    const request = `/services?${ServiceDefine(local, categoryId)}name=${name}&status=${status}`;
    response = await axiosInstance.get(request);
  }

  try {
    const data = await response.data;
    const page: PageResponse = {
      first: data.first,
      last: data.last,
      numberOfElements: data.numberOfElements,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      empty: data.empty,
    };
    const services = data.content as ServiceProvidedSummaryResponse[];
    return Promise.resolve({ page, services });
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const findAllServiceByUserId = async (userId: string, pageble?: PageRequest) => {
  // buscar todos os serviços de um usuário
  let response;
  if (pageble) {
    const request = `/users/${userId}/services?${PageDefine(pageble)}`;
    response = await axiosInstance.get(request);
  } else {
    const request = `/users/${userId}/services`;
    response = await axiosInstance.get(request);
  }

  try {
    const data = await response.data;
    const page: PageResponse = {
      first: data.first,
      last: data.last,
      numberOfElements: data.numberOfElements,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      empty: data.empty,
    };
    const userServices = data.content as ServiceProvidedUserResponse[];
    return Promise.resolve({ page, userServices });
  } catch (error: any) {
    return Promise.reject(error);
  }
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
