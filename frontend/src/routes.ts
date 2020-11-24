export const LOGIN: string = "/";
export const PROFILE_CLIENT: string = "/cliente";
export const PROFILE_INSPECTOR: string = "/inspector";
export const DASHBOARD: string = "/dashboard";
export const DASHBOARD_ORDERS: string = "/dashboard/cargas";
export const DASHBOARD_CLIENTS: string = "/dashboard/clientes";
export const DASHBOARD_INSPECTORS: string = "/dashboard/inspectores";
export const DASHBOARD_PRODUCTS: string = "/dashboard/productos";
export const DASHBOARD_REPORTS: string = "/dashboard/informes";

// DASHBOARD ORDERS ROUTES
export const NEW_ORDER: string = DASHBOARD_ORDERS + "/new";
export const ORDER_EDIT: string = DASHBOARD_ORDERS + "/edit";

// INSPECTOR ORDERS ROUTES
export const INSPECTOR_START_ORDER: string = PROFILE_INSPECTOR + "/iniciar";
export const INSPECTOR_LOADING_ORDER: string = PROFILE_INSPECTOR + "/cargar";
export const INSPECTOR_CLOSING_ORDER: string = PROFILE_INSPECTOR + "/finalizar";
export const INSPECTOR_NEW_LINE: string = "/add/line";
export const INSPECTOR_TEMPERATURE_CONTROL: string = "/add/temp";
export const INSPECTOR_WEIGHT_CONTROL: string = "/add/weight";
export const INSPECTOR_MEASURE_CONTROL: string = "/add/organoleptic";
export const INSPECTOR_CHECK_ORDER: string = "/check";
export const INSPECTOR_CHECK_ROWS: string = PROFILE_INSPECTOR + "/check/rows";
