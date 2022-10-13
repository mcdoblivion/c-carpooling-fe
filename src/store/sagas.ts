import { all } from "redux-saga/effects";

//public
import LayoutSaga from "./layout/saga";

export default function* rootSaga() {
  yield all([
    //public
    LayoutSaga(),
  ]);
}
