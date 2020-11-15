import { combineReducers } from "redux";
import { dashboardReducer } from "./dashboardReducer";
import { inspectorReducer } from "./inspectorReducer";
// import { showcaseReducer } from "./showcaseReducer";
// import { cartReducer } from "./cartReducer";

const appReducer = combineReducers ({
  dashboard: dashboardReducer,
  inspector: inspectorReducer,
});

export default appReducer;
