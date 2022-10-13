import { createContext } from "react";
import { AppState } from "services/common-services/authorization-service";
import { SignalRService } from "services/common-services/signalr-service";

export const SignalRContext = createContext<SignalRService>(null);
export const AppStateContext = createContext<AppState>(null);
