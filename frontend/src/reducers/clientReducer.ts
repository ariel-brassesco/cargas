import { Reducer } from "redux";

// Import Types
import { Client } from "../types/client";
import { Order } from "../types/order";
import { Row } from "../types/row";
import { ImageControl } from "../types/images";
import { Temperature } from "../types/temp";
import { Weight } from "../types/weight";
import { Measure } from "../types/measure";

export const FETCH_CLIENT_CLIENT: string = "FETCH_CLIENT_CLIENT";
export const FETCH_ORDERS_CLIENT: string = "FETCH_ORDERS_CLIENT";
export const FETCH_ROWS_CLIENT: string = "FETCH_ROWS_CLIENT";
export const FETCH_IMAGES_CLIENT: string = "FETCH_IMAGES_CLIENT";
export const FETCH_TEMPS_CLIENT: string = "FETCH_TEMPS_CLIENT";
export const FETCH_WEIGHTS_CLIENT: string = "FETCH_WEIGHTS_CLIENT";
export const FETCH_MEASURES_CLIENT: string = "FETCH_MEASURES_CLIENT";

type State = {
  client: Partial<Client>;
  orders: Order[];
  rows: Row[];
  images: ImageControl[];
  temps: Temperature[];
  weights: Weight[];
  measures: Measure[];
};

const initialState: State = {
  client: {},
  orders: [],
  rows: [],
  images: [],
  temps: [],
  weights: [],
  measures: [],
};

export const clientReducer: Reducer<State> = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case FETCH_CLIENT_CLIENT:
      return {
        ...state,
        client: payload ?? {},
      };

    case FETCH_ORDERS_CLIENT:
      return {
        ...state,
        orders: payload ?? [],
      };

    case FETCH_ROWS_CLIENT:
      return {
        ...state,
        rows: payload ?? [],
        next:
          payload.reduce(
            (acc: number, val: Row) => (acc > val.number ? acc : val.number),
            0
          ) + 1,
      };

    case FETCH_IMAGES_CLIENT:
      return {
        ...state,
        images: payload ?? [],
      };

    case FETCH_TEMPS_CLIENT:
      return {
        ...state,
        temps: payload ?? [],
      };

    case FETCH_WEIGHTS_CLIENT:
      return {
        ...state,
        weights: payload ?? [],
      };

    case FETCH_MEASURES_CLIENT:
      return {
        ...state,
        measures: payload ?? [],
      };

    default:
      return state;
  }
};

// Define Getters
export const getClient = (state: any) => state.client.client;
export const getOrders = (state: any) => state.client.orders;
export const getRows = (state: any) => state.client.rows;
export const getImages = (state: any) => state.client.images;
export const getTemps = (state: any) => state.client.temps;
export const getWeights = (state: any) => state.client.weights;
export const getMeasures = (state: any) => state.client.measures;
