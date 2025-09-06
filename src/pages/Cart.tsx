import { ArrowLeft, Minus, Plus, Shield, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useCart } from "../state/cartContext";

export default function Cart() {
  const { state, dispatch } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const inc = (productId: number, current: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity: current + 1 });
  };

  const dec = (productId: number, current: number) => {
    current > 1
      ? dispatch({ type: "UPDATE_QUANTITY", productId, quantity: current - 1 })
      : dispatch({ type: "REMOVE_ITEM", productId });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  };

  const clear = () => dispatch;

  const subtotal = state.subtotal;
  const totalItems = state.itemsCount;
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Carrito</h1>
          <p className="text-gray-500">El carrito está vacío.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Seguir comprando
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Carrito de compras</h1>
            <span className="text-gray-500">{totalItems} artículos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      ${item.price.toFixed(2)} c/u
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-green-600 text-sm font-medium">
                        En stock
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => dec(item.productId, item.quantity)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => inc(item.productId, item.quantity)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                ¿Tienes un código de descuento?
              </h3>
              <div className="flex space-x-3">
                <Input
                  placeholder="Ingresa tu código"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-gray-900 hover:bg-gray-800">Aplicar</Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} artículos)
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <hr className="my-4 border-gray-200" />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="flex items-center w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Proceder al pago
                </Button>

                <Button variant="ghost" className="w-full bg-transparent" onClick={clear}>
                  Vaciar carrito
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-1" />
                Pago seguro
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
