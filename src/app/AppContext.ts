import { createContext } from "react";
import { SignalRService } from "services/common-services/signalr-service";
import { AppAction, AppState } from "./AppReducer";

export interface AppContext {
  appState: AppState;
  appDispatch: React.Dispatch<AppAction>;
}

export const SignalRContext = createContext<SignalRService>(null);
export const AppStateContext = createContext<AppContext>(null);
