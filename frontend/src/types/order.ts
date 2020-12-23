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

export interface InitOrder {
  id: number;
  order: number;
  empty: string;
  matricula: string;
  ventilation: string | null;
  uploaded_at: string;
}

export interface FinalOrder {
  id: number;
  order: number;
  full: string;
  semi_close: string | null;
  close: string | null;
  precinto: string | null;
  uploaded_at: string;
}

export interface Order extends Base {
  order: string;
  client: Client;
  inspector: Inspector;
  products: Product[];
  date: string;
  time_start: string;
  time_complete: string;
  origin: string;
  discharge: string;
  booking: string;
  shipping_line?: string;
  vessel_name: string;
  etd?: string;
  eta?: string;
  seal?: string;
  container?: string;
  plant?: string;
  boxes?: number;
  net_weight?: number;
  gross_weight?: number;
  lot?: string;
  status: string;
  initial: InitOrder[];
  final: FinalOrder[];
  comment: string;
  is_active: boolean;
}

export interface OrderPagination {
  count: number;
  current: number;
  next: number | null;
  previous: number | null;
  total_pages: number;
  results: Order[];
}
