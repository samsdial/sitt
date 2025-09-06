import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Cart from "../pages/Cart";
import Catalog from "../pages/Catalog";
import ProductDetail from "../pages/ProductDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Catalog /> },
      { path: "/product/:productId", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
