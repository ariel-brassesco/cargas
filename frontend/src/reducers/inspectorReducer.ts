import { Reducer } from "redux";

// Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
import  { Temperature } from "../types/temp";
import { Weight } from "../types/weight";

export const FETCH_ORDERS_INSPECTOR: string = "FETCH_ORDERS_INSPECTOR";
export const FETCH_ROWS_INSPECTOR: string = "FETCH_ROWS_INSPECTOR";
export const FETCH_TEMPS_INSPECTOR: string = "FETCH_TEMPS_INSPECTOR";
export const FETCH_WEIGHTS_INSPECTOR: string = "FETCH_WEIGHTS_INSPECTOR";
export const INIT_ORDER: string = "INIT_ORDER";
export const CLOSE_ORDER: string = "CLOSE_ORDER";
export const UPDATE_STATUS_ORDER: string = "UPDATE_STATUS_ORDER";
export const NEW_ROW: string = "INSPECTOR_NEW_ROW";
export const NEW_TEMPERATURE: string = "INSPECTOR_NEW_TEMPERATURE";
export const NEW_WEIGHT: string = "INSPECTOR_NEW_WEIGHT";

type State = {
  orders: Order[];
  rows: Row[];
  next: number;
  temps: Temperature[];
  weights: Weight[];
}

const initialState: State = {
  orders: [],
  rows: [],
  next: 1,
  temps: [],
  weights: [],
  // measures: []
};

export const inspectorReducer: Reducer<State> = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    // ORDERS ACTIONS //
    case FETCH_ORDERS_INSPECTOR:
      return {
        ...state,
        orders: payload ?? [],
      };

    case FETCH_ROWS_INSPECTOR:
      return {
        ...state,
        rows: payload ?? [],
        next: payload.reduce((acc: number, val: Row) => 
          acc > val.number?acc:val.number , 0) + 1,
      };

    case FETCH_TEMPS_INSPECTOR:
      return {
        ...state,
        temps: payload ?? [],
      };
    
    case FETCH_WEIGHTS_INSPECTOR:
      return {
        ...state,
        weights: payload ?? [],
      };

    case INIT_ORDER:
      return {
        ...state,
        orders: state.orders.map(o => (o.id === payload.id)?payload:o)
      }
      
    case CLOSE_ORDER:
      return {
        ...state,
        orders: state.orders.map(o => (o.id === payload.id)?payload:o)
      }

    case UPDATE_STATUS_ORDER:
      return {
        ...state,
        orders: state.orders.map(o => (o.id === payload.id)?payload:o)
      }

    case NEW_ROW:
      const rows = [...state.rows, payload];
      return {
        ...state,
        rows,
        next: payload.number + 1
      }
    
    case NEW_TEMPERATURE:
      const temps = state.temps.concat(payload);
      return {
        ...state,
        temps
      }

    case NEW_WEIGHT:
      const weights = state.weights.concat(payload);
      return {
        ...state,
        weights
      }

    default:
      return state;
  }
};

// Define Getters
export const getOrders = (state: any) => state.inspector.orders;
export const getRows = (state: any) => state.inspector.rows;
export const getNextRow = (state: any) => state.inspector.next;
export const getTemps = (state: any) => state.inspector.temps;
export const getWeights = (state: any) => state.inspector.weights;
