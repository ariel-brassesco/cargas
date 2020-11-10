import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { logout } from "../actions/dashboardActions";
import store from "../store";

type Data = Record<string, any>;

const mapData = (result: AxiosResponse<any>) => result.data;

const handleError = (error: Error & { response: AxiosResponse<any> }) => {
  if (error.response.status === 401) {
    store.dispatch(logout() as any);
  }

  throw error;
};

export class Http {
  public constructor() {
    axios.defaults.baseURL = "/api";
    const token = localStorage.getItem("token") ?? "";
    this.setAuth(token);
  }

  public setAuth(token: string) {
    if (token) {
      axios.defaults.headers.common["authorization"] = `JWT ${token}`;
    } else {
      delete axios.defaults.headers.common["authorization"];
    }
  }

  public get(path: string, options: AxiosRequestConfig = {}) {
    return axios.get(path, options).then(mapData).catch(handleError);
  }

  public post(path: string, data: Data, options: AxiosRequestConfig = {}) {
    return axios.post(path, data, options).then(mapData).catch(handleError);
  }

  public put(path: string, data: Data, options: AxiosRequestConfig = {}) {
    return axios.put(path, data, options).then(mapData).catch(handleError);
  }

  public patch(path: string, data: Data, options: AxiosRequestConfig = {}) {
    return axios.patch(path, data, options).then(mapData).catch(handleError);
  }

  public delete(path: string, options: AxiosRequestConfig = {}) {
    return axios.delete(path, options).then(mapData).catch(handleError);
  }
}

export const http = new Http();

export const apiRoutes = {
  login: "/api-token-auth/",
  me: "/accounts/me",
  clients_data: "/accounts/clients/",
  inspectors_data: "accounts/inspectors/",
  validate_username: "/accounts/validate_username/",
  credentials: "accounts/send_credentials/",
  // orders_create: "/orders/admin/new_order/",
  // orders_update: "/orders/admin/update/",
  orders_data: "/orders/admin/",
  products_data: "/orders/products/",
  client_orders: "/orders/client/",
  inspector_orders: "/orders/inspector/"
};