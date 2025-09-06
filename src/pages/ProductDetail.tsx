import { ChevronLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { getProductById } from "../services/products";
import { useCart } from "../state/cartContext";
import { useProduct } from "../state/productContext";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const pid = productId ?? "";
  const { state, dispatch } = useProduct();
  const { dispatch: cartDispatch } = useCart();

  const entry = state.byId[Number(pid)];

  useEffect(() => {
    if (!pid) return;
    let cancelled = false;
    (async () => {
      dispatch({ type: "LOAD_START", productId: pid });
      try {
        const product = await getProductById(Number(pid));
        if (cancelled) return;
        dispatch({ type: "LOAD_SUCCESS", productId: pid, product });
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
          productId: pid,
          error: {
            status: e.status ?? 500,
            message: e.message ?? "Unknown error",
            retriable: e.retriable ?? false,
          },
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pid, dispatch]);

  const [qty, setQty] = useState<number>(1);
  const inc = useCallback(() => setQty((q) => Math.min(99, q + 1)), []);
  const dec = useCallback(() => setQty((q) => Math.max(1, q - 1)), []);

  const loading = !entry || entry.status === "loading";
  const product = entry?.data;
  const addToCart = useCallback(() => {
    if (!product) return;
    cartDispatch({
      type: "ADD_ITEM",
      item: {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
    });
  }, [cartDispatch, product, qty]);

  if (loading && !product) {
    return (
      <div className="eco">
        <p className="text-gray-500">Cargardo el producto ...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="eco">
        <p className="text-red-500">No se encontro el producto</p>
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          Volver al catalogo
        </Link>
      </div>
    );
  }
  console.log("P:.", product);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Volver al catalogo</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-2xl">
            <div className="aspect-square relative">
              <img
                src={product.image}
                alt={product.title}
                className="object-contain mx-auto"
              />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="text-sm text-gray-500">
            <Link to="/" className="hover:underline">
              Cátalogo
            </Link>
            <span className="mx-2">›</span>
            <span>{product.category}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-lg text-gray-600">{product.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                const rate = product.rating?.rate ?? 0;
                const rounded = Math.floor(rate);
                const hasHalf = rate - rounded >= 0.5;

                return (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < rounded
                        ? "fill-yellow-400 text-yellow-400"
                        : i === rounded && hasHalf
                          ? "fill-yellow-400/50 text-yellow-400"
                          : "text-gray-300"
                    }`}
                  />
                );
              })}
              <span className="ml-2 text-sm text-gray-500">
                {(product.rating?.rate ?? 0).toFixed(1)} (
                {product.rating?.count ?? 0}) reseñas
              </span>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          <p className="mb-4 text-gray-500">{product.description}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Cantidad:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                <button
                  onClick={dec}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                  {qty ?? 1}
                </span>
                <button
                  onClick={inc}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <Button
            onClick={addToCart}
            disabled={loading}
            className="flex text-center justify-center align-middle w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
