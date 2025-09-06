import { memo } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { Plus } from "lucide-react";

type Props = {
  product: Product;
  onAddToCart: (p: Product) => void;
};

function ProductCardBase({ product, onAddToCart }: Props) {
  return (
    <div className="border border-gray-100 shadow rounded-lg hover:shadow-lg transition flex flex-col bg-white">
      <Link to={`/product/${product.id}`} className="mb-4 flex-grow">
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.title}
          className="w-full h-[287px] object-contain mb-2 rounded"
        />
      </Link>
      <div className="p-4">
      <Link to={`/product/${product.id}`} className="mb-4 flex-grow">
        <h2 className="text-md font-semibold mb-5">{product.title}</h2>
      </Link>
        <p className="text-gray-600 text-md w-[225px] md:w-auto whitespace-nowrap overflow-hidden overflow-ellipsis">
          {product.description}
        </p>
      <div className="flex items-center align-middle justify-between mt-4">
        <p className="text-2xl font-semibold  px-3 py-1">${product.price.toFixed(2)}</p>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className=" flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            <Plus />
            Add
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardBase);
