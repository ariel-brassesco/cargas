import { Dispatch } from "redux";
// Import Types
import { Credentials } from "../types/credentials";
// Import Actions
import {
  DASHBOARD_LOGIN,
  DASHBOARD_LOGOUT,
  CREATE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  FETCH_CLIENTS,
  CREATE_INSPECTOR,
  UPDATE_INSPECTOR,
  DELETE_INSPECTOR,
  FETCH_INSPECTORS,
  FETCH_ORDERS,
  CREATE_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
  FETCH_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../reducers/dashboardReducer";
import { apiRoutes, http } from "../services/http";

/* LOGIN AND LOGOUT ACTIONS */
export const login = (credentials: Credentials) => async (
  dispatch: Dispatch
) => {
  try {
    const { token } = await http.post(apiRoutes.login, credentials);
    // Set the token in http headers
    http.setAuth(token);
    //Save Token in localStorage
    localStorage.setItem("token", token);
    const user = await http.get(apiRoutes.me);

    return dispatch({ type: DASHBOARD_LOGIN, payload: user });
  } catch (error) {
    return false;
  }
};

export const logout = () => (dispatch: Dispatch) => {
  try {
    http.setAuth("");
    //Remove Token in localStorage
    localStorage.removeItem("token");
  } catch (error) {}
  return dispatch({ type: DASHBOARD_LOGOUT });
};

export const sendCredentials = (id: number) => async () => {
  try {
    const { ok } = await http.post(apiRoutes.credentials, { id: id });
    return ok;
  } catch (error) {
    return false;
  }
};
/* CLIENTS ACTIONS */
export const fetchClients = () => async (dispatch: Dispatch) => {
  try {
    const clients = await http.get(apiRoutes.clients_data);

    return dispatch({ type: FETCH_CLIENTS, payload: clients });
  } catch (error) {}
};

export const createClient = (client: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await http.post(apiRoutes.clients_data, client);

    return dispatch({ type: CREATE_CLIENT, payload: result });
  } catch (error) {}
};

export const updateClient = (id: number, client: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await http.patch(`${apiRoutes.clients_data}${id}/`, client);

    return dispatch({ type: UPDATE_CLIENT, payload: result });
  } catch (error) {}
};

export const deleteClient = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.clients_data}${id}/`);

    return dispatch({ type: DELETE_CLIENT, payload: id });
  } catch (error) {}
};

/* INSPECTOR ACTIONS */
export const fetchInspectors = () => async (dispatch: Dispatch) => {
  try {
    const inspectors = await http.get(apiRoutes.inspectors_data);

    return dispatch({ type: FETCH_INSPECTORS, payload: inspectors });
  } catch (error) {}
};

export const createInspector = (inspector: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await http.post(apiRoutes.inspectors_data, inspector);

    return dispatch({ type: CREATE_INSPECTOR, payload: result });
  } catch (error) {}
};

export const updateInspector = (
  id: number,
  inspector: Record<string, any>
) => async (dispatch: Dispatch) => {
  try {
    const result = await http.patch(
      `${apiRoutes.inspectors_data}${id}/`,
      inspector
    );

    return dispatch({ type: UPDATE_INSPECTOR, payload: result });
  } catch (error) {}
};

export const deleteInspector = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.inspectors_data}${id}/`);

    return dispatch({ type: DELETE_INSPECTOR, payload: id });
  } catch (error) {}
};

/* PRODUCTS ACTIONS */
export const fetchProducts = () => async (dispatch: Dispatch) => {
  try {
    const products = await http.get(apiRoutes.products_data);

    return dispatch({ type: FETCH_PRODUCTS, payload: products });
  } catch (error) {}
};

export const createProduct = (product: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await http.post(apiRoutes.products_data, product);

    return dispatch({ type: CREATE_PRODUCT, payload: result });
  } catch (error) {}
};

export const updateProduct = (
  id: number,
  product: Record<string, any>
) => async (dispatch: Dispatch) => {
  try {
    const result = await http.patch(
      `${apiRoutes.products_data}${id}/`,
      product
    );

    return dispatch({ type: UPDATE_PRODUCT, payload: result });
  } catch (error) {}
};

export const deleteProduct = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.products_data}${id}/`);

    return dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {}
};

/* ORDERS ACTIONS */
export const fetchOrders = (page?: number) => async (dispatch: Dispatch) => {
  try {
    const orders = await http.get(`${apiRoutes.orders_data}?page=${page ?? 1}`);

    return dispatch({ type: FETCH_ORDERS, payload: orders });
  } catch (error) {}
};

export const createOrder = (order: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await http.post(apiRoutes.orders_data, order);

    return dispatch({ type: CREATE_ORDER, payload: result });
  } catch (error) {}
};

export const updateOrder = (id: number, order: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await http.patch(`${apiRoutes.orders_data}${id}/`, order);

    return dispatch({ type: UPDATE_ORDER, payload: result });
  } catch (error) {}
};

export const deleteOrder = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.orders_data}${id}/`);

    return dispatch({ type: DELETE_ORDER, payload: id });
  } catch (error) {}
};
