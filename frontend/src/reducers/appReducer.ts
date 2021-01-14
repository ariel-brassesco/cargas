import { combineReducers } from "redux";
import { dashboardReducer, DASHBOARD_LOGOUT } from "./dashboardReducer";
import { inspectorReducer } from "./inspectorReducer";
import { clientReducer } from "./clientReducer";

const appReducer = combineReducers({
  dashboard: dashboardReducer,
  inspector: inspectorReducer,
  client: clientReducer,
});

//Reset the reducer when user logout
const rootReducer = (state, action) =>
  appReducer(action.type === DASHBOARD_LOGOUT ? undefined : state, action);

export default rootReducer;
