import { Dispatch } from "redux";

import { apiRoutes, http } from "../services/http";
import {
  FETCH_CLIENT_CLIENT,
  FETCH_ORDERS_CLIENT,
  FETCH_ROWS_CLIENT,
  FETCH_IMAGES_CLIENT,
  FETCH_TEMPS_CLIENT,
  FETCH_WEIGHTS_CLIENT,
  FETCH_MEASURES_CLIENT,
} from "../reducers/clientReducer";

// Action for Orders
export const fetchClient = (id: number) => async (dispatch: Dispatch) => {
  try {
    const res = await http.get(`${apiRoutes.clients_data}${id}/`);

    return dispatch({ type: FETCH_CLIENT_CLIENT, payload: res });
  } catch (error) {}
};

export const fetchOrders = (id: number) => async (dispatch: Dispatch) => {
  try {
    const orders = await http.get(`${apiRoutes.client_orders}?client=${id}`);

    return dispatch({ type: FETCH_ORDERS_CLIENT, payload: orders });
  } catch (error) {}
};

export const fetchRows = (id: number) => async (dispatch: Dispatch) => {
  try {
    const rows = await http.get(`${apiRoutes.client_rows}?order=${id}`);

    return dispatch({ type: FETCH_ROWS_CLIENT, payload: rows });
  } catch (error) {}
};

export const fetchImages = (id: number) => async (dispatch: Dispatch) => {
  try {
    const images = await http.get(`${apiRoutes.client_images}?order=${id}`);

    return dispatch({ type: FETCH_IMAGES_CLIENT, payload: images });
  } catch (error) {}
};

export const fetchTemps = (id: number) => async (dispatch: Dispatch) => {
  try {
    const temps = await http.get(`${apiRoutes.client_temps}?order=${id}`);

    return dispatch({ type: FETCH_TEMPS_CLIENT, payload: temps });
  } catch (error) {}
};

export const fetchWeights = (id: number) => async (dispatch: Dispatch) => {
  try {
    const res = await http.get(`${apiRoutes.client_weights}?order=${id}`);

    return dispatch({ type: FETCH_WEIGHTS_CLIENT, payload: res });
  } catch (error) {}
};

export const fetchMeasures = (id: number) => async (dispatch: Dispatch) => {
  try {
    const res = await http.get(`${apiRoutes.client_measures}?order=${id}`);

    return dispatch({ type: FETCH_MEASURES_CLIENT, payload: res });
  } catch (error) {}
};
