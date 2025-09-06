import { createContext, useContext, useReducer } from "react";
import type { CartItem, CartState } from "../types";

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR" };

const initialState: CartState = {
  items: [],
  subtotal: 0,
  itemsCount: 0,
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find(
        (i) => i.productId === action.item.productId
      );
      let newItems: CartItem[];
      if (exists) {
        newItems = state.items.map((i) =>
          i.productId === action.item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...state.items, { ...action.item, quantity: 1 }];
      }
      return recalc(newItems);
    }
    case "REMOVE_ITEM":
      return recalc(
        state.items.filter((i) => i.productId !== action.productId)
      );

    case "UPDATE_QUANTITY":
      return recalc(
        state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        )
      );

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

function recalc(items: CartItem[]): CartState {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, subtotal, itemsCount };
}

const CartContext = createContext<
  { state: CartState; dispatch: React.Dispatch<CartAction> } | undefined
>(undefined);

const CART_STORAGE_KEY = "cart_items_v1";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (init): CartState => {
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return init;
        const items = JSON.parse(raw) as CartItem[];
        return recalc(items);
      } catch {
        return init;
      }
    }
  );
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe utilizarse dentro de un CartProvider.");
  }
  return ctx;
}
