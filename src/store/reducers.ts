import { combineReducers } from "redux";

import Layout from "./layout/reducer";
import Authorized from "./authorized/reducer";

const rootReducer = combineReducers({
  Layout,
  Authorized,
});

export default rootReducer;
