import axios from 'axios';

import { SignOut } from './FireBaseAuth';
import { persistor } from '../redux/store';
import { OrderInsert, OrderUpdate } from '../types/order';
import { PageRequest } from '../types/page';
import { RatingInsert, RatingUpdate } from '../types/rating';
import { ServiceProvidedInsert, ServiceProvidedUpdate, ServiceStatus } from '../types/service';
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
    const googleToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyNjIwZDVlN2YxMzJiNTJhZmU4ODc1Y2RmMzc3NmMwNjQyNDlkMDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1MzUyMDM2MjEyMDQtaTFobzQydXR0MW9qNGplZnE5ajVhNGIzZDhzc2k5YzIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1MzUyMDM2MjEyMDQtYjVmOWxncTRncjZobTFmcmdxdTZpNGQxZnI4MHJwYmwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM3MjY2MTI0MDI5ODkyNzk5MzMiLCJlbWFpbCI6ImpvbmhqaG91QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiSm9uaCBKaG91IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0txQ2VoWWpsVWVlLWtXRkc0elpvdnhYUGVwS1o0eWtnVEJVSV90NUs1V255QXdwQT1zOTYtYyIsImdpdmVuX25hbWUiOiJKb25oIiwiZmFtaWx5X25hbWUiOiJKaG91IiwiaWF0IjoxNzI2NTI5OTQ0LCJleHAiOjE3MjY1MzM1NDR9.Ve0asTP9oEsULnUwpBH2sPUuOQZNQD_zqDvXhccfGvFlBcz5xiEpCH2deDad-vfbe9uUl4quKaCKcPbEgw-hODt13slLRFZXwNBxmuwiND8TSnZ6RKHNPMbhPmE72qEzvz1UCX9FGr_7pnkP_6cATb7hXVAu_BDezfDpzuF6xquVBdpdT2kVE_ppo57R6izQM71IASahaIXva89pG12WR3FWR-W1-uxdVBAS_v5BbthlwVdEp6CuZ1N_fAJw9bgvmK_gbaLhxjYNPS0uTmgnHxggTopqPOSOvsdrQdEGeq4ZvrGDUBCzJTspd_2-ROfWVdNMzUGz-jseuffc7ecWAw';

    console.log('log erro 1: ' + status + ' refresh: ' + isRefreshing);
    if (status === 401 || status === 403) {
      const originalRequest = error.config;

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
          // Se o refresh falhar, desloga o usuário
          const loginResponse = await SignInAPI(googleToken);

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
