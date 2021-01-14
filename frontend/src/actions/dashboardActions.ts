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
  INIT_ORDER_ADMIN,
  CLOSE_ORDER_ADMIN,
  FETCH_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  FETCH_ROWS_ADMIN,
  FETCH_TEMPS_ADMIN,
  CREATE_TEMP_ADMIN,
  UPDATE_TEMP_ADMIN,
  DELETE_TEMP_ADMIN,
  FETCH_WEIGHTS_ADMIN,
  CREATE_WEIGHT_ADMIN,
  UPDATE_WEIGHT_ADMIN,
  DELETE_WEIGHT_ADMIN,
  FETCH_MEASURES_ADMIN,
  CREATE_MEASURE_ADMIN,
  UPDATE_MEASURE_ADMIN,
  DELETE_MEASURE_ADMIN,
  FETCH_IMAGES_ADMIN,
  CHANGE_DISPLAY_IMAGES_ADMIN,
} from "../reducers/dashboardReducer";
import { NEW_ROW, UPDATE_ROW, DELETE_ROW } from "../reducers/inspectorReducer";
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
    window.localStorage.clear();
    window.sessionStorage.clear();
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

/* INIT ORDER ACTIONS */
export const initOrder = (data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    await http.post(apiRoutes.container_init, data);
    const order = await http.get(`${apiRoutes.orders_data}${data.order}/`);

    return dispatch({ type: INIT_ORDER_ADMIN, payload: order });
  } catch (error) {}
};

export const closeOrder = (data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    await http.post(apiRoutes.container_close, data);
    const order = await http.get(`${apiRoutes.orders_data}${data.order}/`);

    return dispatch({ type: CLOSE_ORDER_ADMIN, payload: order });
  } catch (error) {}
};

export const updateInitOrderImage = (id: number, data) => async (
  dispatch: Dispatch
) => {
  try {
    const order = await http.patch(
      `${apiRoutes.inspector_container}${id}/`,
      data
    );

    return dispatch({ type: UPDATE_ORDER, payload: order });
  } catch (error) {}
};

export const updateCloseOrderImage = (id: number, data) => async (
  dispatch: Dispatch
) => {
  try {
    const order = await http.patch(`${apiRoutes.inspector_close}${id}/`, data);

    return dispatch({ type: UPDATE_ORDER, payload: order });
  } catch (error) {}
};

/* MANAGE ORDER ACTIONS */
// Actions for Rows
export const fetchRows = (id: number) => async (dispatch: Dispatch) => {
  try {
    const data = await http.get(`${apiRoutes.rows_data}?order=${id}`);

    return dispatch({ type: FETCH_ROWS_ADMIN, payload: data });
  } catch (error) {}
};

export const newRow = (data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const row = await http.post(apiRoutes.rows_data, data);

    return dispatch({ type: NEW_ROW, payload: row });
  } catch (error) {}
};

export const updateRow = (id: number, data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const row = await http.patch(`${apiRoutes.rows_data}${id}/`, data);

    return dispatch({ type: UPDATE_ROW, payload: row });
  } catch (error) {}
};

export const deleteRow = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.rows_data}${id}/`);

    return dispatch({ type: DELETE_ROW, payload: id });
  } catch (error) {}
};

// Actions for Temperatures
export const fetchTemps = (id: number) => async (dispatch: Dispatch) => {
  try {
    const data = await http.get(`${apiRoutes.temps_data}?order=${id}`);

    return dispatch({ type: FETCH_TEMPS_ADMIN, payload: data });
  } catch (error) {}
};

export const createTemp = (data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const res = await http.post(apiRoutes.temps_data, data);

    return dispatch({ type: CREATE_TEMP_ADMIN, payload: res });
  } catch (error) {}
};

export const updateTemp = (id: number, data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const res = await http.patch(`${apiRoutes.temps_data}${id}/`, data);

    return dispatch({ type: UPDATE_TEMP_ADMIN, payload: res });
  } catch (error) {}
};

export const deleteTemp = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.temps_data}${id}/`);

    return dispatch({ type: DELETE_TEMP_ADMIN, payload: id });
  } catch (error) {}
};

// Actions for Weights
export const fetchWeights = (id: number) => async (dispatch: Dispatch) => {
  try {
    const data = await http.get(`${apiRoutes.weights_data}?order=${id}`);

    return dispatch({ type: FETCH_WEIGHTS_ADMIN, payload: data });
  } catch (error) {}
};

export const createWeight = (data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const res = await http.post(apiRoutes.weights_data, data);

    return dispatch({ type: CREATE_WEIGHT_ADMIN, payload: res });
  } catch (error) {}
};

export const updateWeight = (id: number, data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const res = await http.patch(`${apiRoutes.weights_data}${id}/`, data);

    return dispatch({ type: UPDATE_WEIGHT_ADMIN, payload: res });
  } catch (error) {}
};

export const deleteWeight = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.weights_data}${id}/`);

    return dispatch({ type: DELETE_WEIGHT_ADMIN, payload: id });
  } catch (error) {}
};

// Actions for Measures

export const fetchMeasures = (id: number) => async (dispatch: Dispatch) => {
  try {
    const res = await http.get(`${apiRoutes.measures_data}?order=${id}`);

    return dispatch({ type: FETCH_MEASURES_ADMIN, payload: res });
  } catch (error) {}
};

export const createMeasure = (data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const res = await http.post(apiRoutes.measures_data, data);

    return dispatch({ type: CREATE_MEASURE_ADMIN, payload: res });
  } catch (error) {}
};

export const updateMeasure = (id: number, data: Record<string, any>) => async (
  dispatch: Dispatch
) => {
  try {
    const res = await http.patch(`${apiRoutes.measures_data}${id}/`, data);

    return dispatch({ type: UPDATE_MEASURE_ADMIN, payload: res });
  } catch (error) {}
};

export const deleteMeasure = (id: number) => async (dispatch: Dispatch) => {
  try {
    await http.delete(`${apiRoutes.measures_data}${id}/`);

    return dispatch({ type: DELETE_MEASURE_ADMIN, payload: id });
  } catch (error) {}
};

// Other Actions
export const fetchImagesControl = (id: number) => async (
  dispatch: Dispatch
) => {
  try {
    const data = await http.get(`${apiRoutes.images_data}?order=${id}`);

    return dispatch({ type: FETCH_IMAGES_ADMIN, payload: data });
  } catch (error) {}
};

export const changeImageControlDisplay = (
  id: number,
  display: boolean
) => async (dispatch: Dispatch) => {
  try {
    const data = await http.patch(`${apiRoutes.images_data}${id}/`, {
      display,
    });

    return dispatch({ type: CHANGE_DISPLAY_IMAGES_ADMIN, payload: data });
  } catch (error) {}
};

export const changeRowImageDisplay = (id: number, display: boolean) => async (
  dispatch: Dispatch
) => {
  try {
    const data = await http.patch(`${apiRoutes.rows_data}${id}/`, {
      display,
    });

    return dispatch({ type: UPDATE_ROW, payload: data });
  } catch (error) {}
};
