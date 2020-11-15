import { Dispatch } from  "redux";

import {apiRoutes, http} from "../services/http";
import { 
  FETCH_ORDERS_INSPECTOR, 
  FETCH_ROWS_INSPECTOR,
  FETCH_TEMPS_INSPECTOR,
  FETCH_WEIGHTS_INSPECTOR,
  INIT_ORDER,
  CLOSE_ORDER,
  UPDATE_STATUS_ORDER,
  NEW_ROW,
  NEW_TEMPERATURE,
  NEW_WEIGHT
} from "../reducers/inspectorReducer";

export const fetchOrders = (id: number) => async (dispatch: Dispatch) => {
  try {
    const orders = await http.get(`${apiRoutes.inspector_orders}?inspector=${id}`);

    return dispatch({ type: FETCH_ORDERS_INSPECTOR, payload: orders });
  } catch (error) {}
};

export const fetchRows = (id: number) => async (dispatch: Dispatch) => {
  try {
    const rows = await http.get(`${apiRoutes.inspector_rows}?order=${id}`);

    return dispatch({ type: FETCH_ROWS_INSPECTOR, payload: rows });
  } catch (error) {}
};

export const fetchTemps = (id: number) => async (dispatch: Dispatch) => {
  try {
    const temps = await http.get(`${apiRoutes.inspector_temps}?order=${id}`);

    return dispatch({ type: FETCH_TEMPS_INSPECTOR, payload: temps });
  } catch (error) {}
};

export const fetchWeights = (id: number) => async (dispatch: Dispatch) => {
  try {
    const res = await http.get(`${apiRoutes.inspector_weights}?order=${id}`);

    return dispatch({ type: FETCH_WEIGHTS_INSPECTOR, payload: res });
  } catch (error) {}
};

export const initOrder = (data: Record<string, any>) => async (dispatch: Dispatch) => {
  try {
    const order = await http.post(apiRoutes.inspector_orders, data);

    return dispatch({ type: INIT_ORDER, payload: order });
  } catch (error) {}
};

export const closeOrder = (data: Record<string, any>) => async (dispatch: Dispatch) => {
  try {
    const order = await http.post(apiRoutes.inspector_close, data);

    return dispatch({ type: CLOSE_ORDER, payload: order });
  } catch (error) {}
};

export const updateStatusOrder = (id: number, status: string) => async (dispatch: Dispatch) => {
  try {
    const order = await http.patch(`${apiRoutes.inspector_orders}${id}/`, { status });

    return dispatch({ type: UPDATE_STATUS_ORDER, payload: order });
  } catch (error) {}
};

export const newRow = (data: Record<string, any>) => async (dispatch: Dispatch) => {
  try {
    const row = await http.post(apiRoutes.inspector_rows, data);

    return dispatch({type: NEW_ROW, payload: row});
  } catch(error) {}
}

export const newTemperature = (data: Record<string, any>) => async (dispatch: Dispatch) => {
  try {
    const temp = await http.post(apiRoutes.inspector_temps, data);

    return dispatch({type: NEW_TEMPERATURE, payload: temp});
  } catch(error) {}
}

export const newWeight = (data: Record<string, any>) => async (dispatch: Dispatch) => {
  try {
    const weight = await http.post(apiRoutes.inspector_weights, data);

    return dispatch({type: NEW_WEIGHT, payload: weight});
  } catch(error) {}
}
