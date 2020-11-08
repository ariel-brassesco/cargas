import { combineReducers } from "redux";
import { dashboardReducer } from "./dashboardReducer";
// import { ownerReducer } from "./ownerReducer";
// import { showcaseReducer } from "./showcaseReducer";
// import { cartReducer } from "./cartReducer";

const appReducer = combineReducers ({
  dashboard: dashboardReducer,
});

export default appReducer;
