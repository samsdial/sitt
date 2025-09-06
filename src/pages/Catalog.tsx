import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { ProductCard } from "../components/products/ProductCard";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { ProductCardSkeleton } from "../components/ui/ProductCardSkeleton";
import { Select } from "../components/ui/Select";
import { getCategories } from "../services/categories";
import { getProducts } from "../services/products";
import { useCart } from "../state/cartContext";
import { useCatalog } from "../state/catalogContext";
import type { Category, Product } from "../types";

export default function Catalog() {
  const { state, dispatch } = useCatalog();
  const { dispatch: cartDispatch } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const categoryKey = state.query.category ?? "all";
  const bucket =
    state.byCategory[categoryKey] ??
    ({
      items: [],
      lastRequestedLimit: 0,
      status: "idle",
      error: null,
      totalKnown: 0,
      hasMore: true,
    } as const);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCats(true);
        const list = await getCategories();
        if (mounted) setCategories(["all", ...list]);
      } catch {
        if (mounted) setCategories(["all"]);
      } finally {
        if (mounted) setLoadingCats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      dispatch({ type: "LOAD_START", category: categoryKey });
      try {
        const res = await getProducts(state.query);
        if (cancelled) return;
        dispatch({
          type: "LOAD_SUCCESS",
          category: categoryKey,
          items: res.items,
          totalKnown: res.totalKnown,
          hasMore: res.hasMore,
        });
      } catch (error: unknown) {
        if (cancelled) return;
        const e =
          typeof error === "object" && error !== null
            ? (error as {
                status?: number;
                message?: string;
                retriable?: boolean;
              })
            : {};
        dispatch({
          type: "LOAD_FAILURE",
          category: categoryKey,
          error: {
            status: e.status ?? 500,
            message: e.message ?? "Desconocido",
            retriable: e.retriable ?? false,
          },
        });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [
    state.query.page,
    state.query.pageSize,
    state.query.category,
    state.query.q,
  ]);

  const onSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      dispatch({ type: "SET_QUERY", payload: { q, page: 1 } });
      dispatch({
        type: "RESET_CATEGORY",
        category: state.query.category ?? "all",
      });
    },
    [dispatch, state.query.category]
  );
  const onSelectCategory = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value || "all";
      dispatch({ type: "SET_QUERY", payload: { category: next, page: 1 } });
      dispatch({ type: "RESET_CATEGORY", category: next });
    },
    [dispatch]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(bucket.totalKnown / state.query.pageSize)),
    [bucket.totalKnown, state.query.pageSize]
  );
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === state.query.page) return;
      dispatch({ type: "SET_QUERY", payload: { page } });
    },
    [dispatch, state.query.page, totalPages]
  );
  const canPrev = state.query.page > 1;
  const canNext = state.query.page < totalPages;
  const prevPage = useCallback(() => {
    goToPage(state.query.page - 1);
  }, [goToPage, state.query.page]);
  const nextPage = useCallback(() => {
    goToPage(state.query.page + 1);
  }, [goToPage, state.query.page]);

  const handleAddToCard = useCallback(
    (product: Product) => {
      cartDispatch({
        type: "ADD_ITEM",
        item: {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        },
      });
    },
    [cartDispatch]
  );

  const isInitialLoading =
    bucket.status === "loading" && bucket.items.length === 0;

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Buscar productos..."
          value={state.query.q ?? ""}
          onChange={onSearch}
          className="w-full mb-4 p-2 border rounded"
        />
        <Select
          value={state.query.category ?? "all"}
          onChange={onSelectCategory}
          disabled={loadingCats}
          className="mb-4 p-2 border rounded"
        >
          {loadingCats ? (
            <option>Cargando categorías...</option>
          ) : (
            categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))
          )}
        </Select>
        <Button disabled>Filtro</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isInitialLoading ? (
          Array.from({ length: state.query.pageSize }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : bucket.items.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No se encontraron productos"
              description="Intenta con otra búsqueda o categoría."
            />
          </div>
        ) : (
          bucket.items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCard}
            />
          ))
        )}
      </div>
      <div className="mt-6 flex">
        <Button
          variant="ghost"
          onClick={prevPage}
          disabled={!canPrev || bucket.status === "loading"}
        >
          Anterior
        </Button>
        <Button>
          {state.query.page}
        </Button>
        ...
        <Button>
          {totalPages + 1}
        </Button>
        <Button
          variant="ghost"
          onClick={nextPage}
          disabled={!canNext || bucket.status === "loading"}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
