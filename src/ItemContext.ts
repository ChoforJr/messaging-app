import { createContext, useContext } from "react";
import type { ItemContextValue } from "./types";

export const ItemContext = createContext<ItemContextValue | null>(null);

export function useItemContext(): ItemContextValue {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItemContext must be used within ItemContext.Provider");
  }
  return context;
}
