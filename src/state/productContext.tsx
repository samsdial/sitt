import { createContext, useContext, useReducer } from "react";
import type { ApiError, Product, ProductState } from "../types";

type ProductAction =
  | { type: "LOAD_START"; productId: string }
  | { type: "LOAD_SUCCESS"; productId: string; product: Product }
  | { type: "LOAD_FAILURE"; productId: string; error: ApiError };

  const initialState: ProductState = {
    byId: {},
  };

function reducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.productId]: { status: "loading", error: null },
        },
      };

    case "LOAD_SUCCESS":
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.productId]: { data: action.product, status: "succeeded", error: null },
        },
      };
    case "LOAD_FAILURE":
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.productId]: { data: undefined, status: "failed", error: action.error },
        },
      };

    default:
      return state;
  }
}

const ProductContext = createContext<
{state: ProductState;dispatch: React.Dispatch<ProductAction>;} | undefined
>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export function useProduct() {
    const ctx = useContext(ProductContext);
    if (!ctx) {
      throw new Error("useProduct debe utilizarse dentro de un ProductProvider.");
    }
    return ctx;
}