import { combineReducers } from "redux";
import { dashboardReducer } from "./dashboardReducer";
import { inspectorReducer } from "./inspectorReducer";
import { clientReducer } from "./clientReducer";

const appReducer = combineReducers({
  dashboard: dashboardReducer,
  inspector: inspectorReducer,
  client: clientReducer,
});

export default appReducer;
