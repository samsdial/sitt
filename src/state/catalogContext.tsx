import { createContext, useContext, useReducer } from "react";
import type {
  ApiError,
  CatalogBucket,
  CatalogQuery,
  CatalogState,
  Product,
} from "../types";

type CatalogAction =
  | { type: "SET_QUERY"; payload: Partial<CatalogQuery> }
  | { type: "LOAD_START"; category: string }
  | { type: "RESET_CATEGORY"; category: string }
  | {
      type: "LOAD_SUCCESS";
      category: string;
      items: Product[];
      totalKnown: number;
      hasMore: boolean;
    }
  | { type: "LOAD_FAILURE"; category: string; error: ApiError };

const initialState: CatalogState = {
  byCategory: {
    all: {
      items: [],
      lastRequestedLimit: 0,
      status: "idle",
      error: null,
      totalKnown: 0,
      hasMore: true,
    },
  },
  query: {
    page: 1,
    pageSize: 12,
    category: "all",
    q: "",
    sort: "none",
  },
};

function reducer(state: CatalogState, action: CatalogAction): CatalogState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: { ...state.query, ...action.payload } };

    case "LOAD_START":
      return {
        ...state,
        byCategory: {
          ...state.byCategory,
          [action.category]: {
            ...(state.byCategory[action.category] || {
              items: [],
              lastRequestedLimit: 0,
            }),
            status: "loading",
            error: null,
          } as CatalogBucket,
        },
      };

    case "RESET_CATEGORY":
      return {
        ...state,
        byCategory: {
          ...state.byCategory,
          [action.category]: {
            items: [],
            lastRequestedLimit: 0,
            status: "idle",
            error: null,
            totalKnown: 0,
            hasMore: true,
          },
        },
      };

    case "LOAD_SUCCESS":
      return {
        ...state,
        byCategory: {
          ...state.byCategory,
          [action.category]: {
            items: [
              ...(state.byCategory[action.category]?.items || []),
              ...action.items,
            ],
            lastRequestedLimit: action.items.length,
            status: "succeeded",
            error: null,
            totalKnown: action.totalKnown,
            hasMore: action.hasMore,
          },
        },
      };

    case "LOAD_FAILURE":
      return {
        ...state,
        byCategory: {
          ...state.byCategory,
          [action.category]: {
            ...(state.byCategory[action.category] || {
              items: [],
              lastRequestedLimit: 0,
            }),
            status: "failed",
            error: action.error,
          },
        },
      };

    default:
      return state;
  }
}
// Context
const CatalogContext = createContext<
  | {
      state: CatalogState;
      dispatch: React.Dispatch<CatalogAction>;
    }
  | undefined
>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CatalogContext.Provider value={{ state, dispatch }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog debe utilizarse dentro de un CatalogProvider.");
  }
  return ctx;
}
