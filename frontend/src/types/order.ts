// import { Product } from "../components/Products";
// import { Address } from "./address";
import { Base } from "./base";
import { Client } from "./client";
import { Inspector } from "./inspector";
import { Product } from "./product";

export const statusMap: Record<string, string> = {
  pending: "Pendiente",
  initiating: "Iniciando",
  loading: "Cargando",
  closing: "Cerrando",
  finish: "Terminado",
  cancel: "Cancelado",
  ready: "Listo",
};

export interface Order extends Base {
  client: Client;
  inspector: Inspector;
  products: Product[];
  date: string;
  time_start: string;
  time_complete: string;
  origin: string;
  discharge: string;
  booking: string
  shipping_line?: string;
  vessel_name: string;
  etd?: string;
  eta?: string;
  seal?: string;
  container?: string;
  plant?: string;
  boxes?: number;
  net_weigth?: number;
  gross_weigth?: number;
  lot?: string[];
  status: string;
}

export interface OrderPagination {
  count: number;
  current: number;
  next: number | null;
  previous: number | null;
  total_pages: number;
  results: Order[];
}
