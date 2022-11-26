import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { userRepository } from "repositories/user-repository";
import { updateUser } from "./global-state/actions";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

export const reloadUserInfo = () => {
  const accessToken = JSON.parse(localStorage.getItem("token"));

  userRepository.getMe(accessToken).subscribe((result) => {
    store.dispatch(updateUser(result));
    localStorage.setItem("currentUserInfo", JSON.stringify(result.data));
  });
};

export const getCurrentUserInfo = () =>
  store.getState()?.GlobalState?.user?.data;

export default store;
