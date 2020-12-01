import { Reducer } from "redux";

// Import Types
import { Account } from "../types/account";
import { Client } from "../types/client";
import { Inspector } from "../types/inspector";
import { Order, OrderPagination } from "../types/order";
import { Product } from "../types/product";
import { Row } from "../types/row";
import { Temperature } from "../types/temp";
import { Weight } from "../types/weight";
import { ImageControl } from "../types/images";
// Import Actions
import { NEW_ROW, UPDATE_ROW, DELETE_ROW } from "./inspectorReducer";

export const DASHBOARD_LOGIN = "DASHBOARD_LOGIN";
export const DASHBOARD_LOGOUT = "DASHBOARD_LOGOUT";
export const FETCH_CLIENTS = "FETCH_CLIENTS";
export const CREATE_CLIENT = "CREATE_CLIENT";
export const UPDATE_CLIENT = "UPDATE_CLIENT";
export const DELETE_CLIENT = "DELETE_CLIENT";
export const FETCH_INSPECTORS = "FETCH_INSPECTORS";
export const CREATE_INSPECTOR = "CREATE_INSPECTOR";
export const UPDATE_INSPECTOR = "UPDATE_INSPECTOR";
export const DELETE_INSPECTOR = "DELETE_INSPECTOR";
export const FETCH_ORDERS = "FETCH_ORDERS";
export const CREATE_ORDER = "CREATE_ORDER";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const DELETE_ORDER = "DELETE_ORDER";
export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const FETCH_ROWS_ADMIN = "FETCH_ROWS_ADMIN";
export const FETCH_TEMPS_ADMIN = "FETCH_TEMPS_ADMIN";
export const FETCH_WEIGHTS_ADMIN = "FETCH_WEIGHTS_ADMIN";
export const FETCH_IMAGES_ADMIN = "FETCH_IMAGES_ADMIN";
export const CHANGE_DISPLAY_IMAGES_ADMIN = "CHANGE_DISPLAY_IMAGES_ADMIN";
export const CHANGE_DISPLAY_ROWS_ADMIN = "CHANGE_DISPLAY_ROWS_ADMIN";

type State = {
  account: Partial<Account>;
  clients: Client[];
  inspectors: Inspector[];
  orders: Partial<OrderPagination>;
  products: Product[];
  rows: Row[];
  temps: Temperature[];
  weights: Weight[];
  images: ImageControl[];
};

const initialState: State = {
  account: {},
  clients: [],
  inspectors: [],
  orders: {},
  products: [],
  rows: [],
  temps: [],
  weights: [],
  images: [],
};

export const dashboardReducer: Reducer<State> = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    // LOGIN AND LOGOUT ACTIONS //
    case DASHBOARD_LOGIN:
      return {
        ...state,
        account: payload,
      };

    case DASHBOARD_LOGOUT:
      return {
        ...state,
        account: {},
      };

    // CLIENTS ACTIONS //
    case FETCH_CLIENTS:
      return {
        ...state,
        clients: payload ?? [],
      };

    case CREATE_CLIENT:
      return {
        ...state,
        clients: [...state.clients, payload],
      };

    case UPDATE_CLIENT:
      const clientIndex = state.clients.findIndex(
        (c) => c.user.id === payload.user.id
      );
      const clients = [...state.clients];

      clients[clientIndex] = payload;

      return {
        ...state,
        clients,
      };

    case DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter((c) => c.user.id !== payload) ?? [],
      };

    // INSPECTORS ACTIONS //
    case FETCH_INSPECTORS:
      return {
        ...state,
        inspectors: payload ?? [],
      };

    case CREATE_INSPECTOR:
      return {
        ...state,
        inspectors: [...state.inspectors, payload],
      };

    case UPDATE_INSPECTOR:
      const inspectorIndex = state.inspectors.findIndex(
        (i) => i.user.id === payload.user.id
      );
      const inspectors = [...state.inspectors];

      inspectors[inspectorIndex] = payload;

      return {
        ...state,
        inspectors,
      };

    case DELETE_INSPECTOR:
      return {
        ...state,
        inspectors: state.inspectors.filter((i) => i.user.id !== payload) ?? [],
      };

    // PRODUCTS ACTIONS //
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: payload ?? [],
      };

    case CREATE_PRODUCT:
      return {
        ...state,
        products: [...state.products, payload],
      };

    case UPDATE_PRODUCT:
      const prodIndex = state.products.findIndex(
        (product) => product.id === payload.id
      );
      const products = [...state.products];

      products[prodIndex] = payload;

      return {
        ...state,
        products,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter((p) => p.id !== payload) ?? [],
      };

    // ORDERS ACTIONS //
    case FETCH_ORDERS:
      return {
        ...state,
        orders: payload ?? {},
      };

    case CREATE_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          results: [payload, ...state.orders.results!],
        },
      };

    case UPDATE_ORDER:
      const orderIndex = state.orders.results!.findIndex(
        (order: Order) => order.id === payload.id
      );
      const orders = { ...state.orders };
      orders.results![orderIndex] = payload;

      return {
        ...state,
        orders,
      };

    case DELETE_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          results:
            state.orders.results!.filter((o: Order) => o.id !== payload) ?? [],
        },
      };
    // MANAGE ORDER ACTIONS
    case FETCH_ROWS_ADMIN:
      return {
        ...state,
        rows: payload,
      };

    case FETCH_TEMPS_ADMIN:
      return {
        ...state,
        temps: payload,
      };

    case FETCH_WEIGHTS_ADMIN:
      return {
        ...state,
        weights: payload,
      };

    case FETCH_IMAGES_ADMIN:
      return {
        ...state,
        images: payload,
      };

    case NEW_ROW:
      const rows = [...state.rows, payload];
      return {
        ...state,
        rows,
        next: payload.number + 1,
      };

    case UPDATE_ROW:
      return {
        ...state,
        rows: state.rows.map((r) => (r.id === payload.id ? payload : r)),
      };

    case DELETE_ROW:
      return {
        ...state,
        rows: state.rows.filter((r) => r.id !== payload.id),
      };

    case CHANGE_DISPLAY_IMAGES_ADMIN:
      return {
        ...state,
        images: state.images.map((i) => (i.id === payload.id ? payload : i)),
      };

    case CHANGE_DISPLAY_ROWS_ADMIN:
      return {
        ...state,
        rows: state.rows.map((r) => (r.id === payload.id ? payload : r)),
      };

    default:
      return state;
  }
};

// Define Getters
export const getAccount = (state: any) => state.dashboard.account;
export const getClients = (state: any) => state.dashboard.clients;
export const getInspectors = (state: any) => state.dashboard.inspectors;
export const getProducts = (state: any) => state.dashboard.products;
export const getOrders = (state: any) => state.dashboard.orders.results;
export const getOrdersPages = (state: any) =>
  state.dashboard.orders.total_pages;
export const getOrdersCurrent = (state: any) => state.dashboard.orders.current;
export const getOrdersNext = (state: any) => state.dashboard.orders.next;
export const getOrdersPrevious = (state: any) =>
  state.dashboard.orders.previous;
export const getRows = (state: any) => state.dashboard.rows;
export const getTemps = (state: any) => state.dashboard.temps;
export const getWeights = (state: any) => state.dashboard.weights;
export const getImages = (state: any) => state.dashboard.images;
