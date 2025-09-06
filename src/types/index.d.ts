// ---- DM
export type Rating = {
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
};

export type Category = string;

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

// ---- QR - pagination

export type CatalogQuery = {
  page: number;
  pageSize: number;
  category?: string | null;
  q?: string;
  sort?: "asc" | "desc" | "none";
};

export type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

export interface PaginateResult<T> {
  items: T[];
  totalKnown: number;
  hasMore: boolean;
}

// ---- Errores

export interface ApiError {
  status: number;
  message: string;
  retriable?: boolean;
}

// ---- estado global

export interface CatalogBucket {
  items: Product[];
  lastRequestedLimit: number;
  status: FetchStatus;
  error?: ApiError | null;
  totalKnown: number;
  hasMore: boolean;
}

export interface CatalogState {
  byCategory: Record<string | "all", CatalogBucket>;
  query: CatalogQuery;
}
export interface ProductCacheItem {
  data?: Product;
  status: FetchStatus;
  error?: ApiError | null;
}
export interface ProductState {
  byId: Record<number, ProductCacheItem>;
}
export interface CartState {
  items: CartItem[];
  subtotal: number;
  itemsCount: number;
}
