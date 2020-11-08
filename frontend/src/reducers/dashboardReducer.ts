import { Reducer } from "redux";

// Import Types
import { Account } from "../types/account";
import { Client } from "../types/client";
import { Inspector } from "../types/inspector";
import { Order, OrderPagination } from "../types/order";
import { Product } from "../types/product";


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


type State = {
  account: Partial<Account>;
  clients: Client[];
  inspectors: Inspector[];
  orders: Partial<OrderPagination>;
  products: Product[];
}


const initialState: State = {
  account: {},
  clients: [],
  inspectors: [],
  orders: {},
  products: []
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
        c => c.user.id === payload.user.id
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
        clients:
          state.clients.filter(c => c.user.id !== payload) ?? [],
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
        i => i.user.id === payload.user.id
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
        inspectors:
          state.inspectors.filter(i => i.user.id !== payload) ?? [],
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
        products:
          state.products.filter(p => p.id !== payload) ?? [],
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
        results: [
          payload, 
          ...state.orders.results!
        ]
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
          results: state.orders.results!.filter(
            (o: Order) => o.id !== payload
          ) ?? []
        }
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