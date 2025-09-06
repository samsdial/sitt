import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../state/cartContext";

export default function Header() {
  const { state } = useCart();
  return (
    <header className="fixed w-full">
      <nav className="bg-white border-b-1 border-gray-200 py-2.5">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <Link to="/" className="text-2xl font-bold">
            Sitt Store
          </Link>
          <div className="flex space-x-4">
            <Link to="/cart" className="mr-4 hover:underline relative">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {state.items.length > 0 && (
                <span className="absolute top-[-8px] left-2 w-5 h-5 p-0.5 text-center flex align-middle bg-red-500 text-white rounded-full px-2 text-xs">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
