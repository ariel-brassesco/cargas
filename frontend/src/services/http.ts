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
    axios.defaults.baseURL = "/";
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
  orders_data: "/orders/admin/",
  products_data: "/orders/products/",
  container_init_data: "/orders/container/init/",
  rows_data: "/orders/admin/rows/",
  temps_data: "/orders/admin/temps/",
  weights_data: "/orders/admin/weights/",
  measures_data: "/orders/admin/measures/",
  images_data: "/orders/admin/images/",
  container_close_data: "/orders/container/close/",
  inspector_orders: "/orders/inspector/",
  inspector_rows: "/orders/inspector/rows/",
  inspector_temps: "/orders/inspector/temps/",
  inspector_weights: "/orders/inspector/weights/",
  inspector_measures: "/orders/inspector/measures/",
  inspector_close: "/orders/inspector/close/",
  inspector_container: "/orders/inspector/container/",
  client_orders: "/orders/client/",
  client_rows: "/orders/client/rows/",
  client_images: "/orders/client/control/",
};
