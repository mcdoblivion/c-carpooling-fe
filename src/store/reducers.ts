import { combineReducers } from "redux";

import Layout from "./layout/reducer";
import Authorized from "./authorized/reducer";
import GlobalState from "./global-state/reducer";

const rootReducer = combineReducers({
  Layout,
  Authorized,
  GlobalState,
});

export default rootReducer;
