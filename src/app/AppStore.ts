import { useContext } from "react";
import { AppContext, AppStateContext } from "./AppContext";

export function useAppState() {
  const state = useContext<AppContext>(AppStateContext);
  return state;
}
