import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./state/cartContext";
import { CatalogProvider } from "./state/catalogContext";
import { ProductProvider } from "./state/productContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CatalogProvider>
      <ProductProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </ProductProvider>
    </CatalogProvider>
  </StrictMode>
);
