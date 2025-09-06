import { apiFetch } from "../api/client";
import type { Product, CatalogQuery, PaginateResult } from "../types";


/**
 * fake store API no soporta paginación real, así que esta función simula la paginación en el cliente.
 * Estrategia: pedimos `limit = page * pageSize` y luego cortamos los items que no necesitamos.
 * Esto no es óptimo, pero funciona para este ejemplo.
 */
export async function getProducts(
    query: CatalogQuery
): Promise<PaginateResult<Product>> {
    const { page, pageSize, category, q } = query;
    const limit = page * pageSize;

    let endpoint = `/products?limit=${limit}`;
    if (category && category !== "all") {
        endpoint = `/products/category/${category}?limit=${limit}`;
    }

    const items = await apiFetch<Product[]>(endpoint);

    // filtro
    const filtered = q
        ? items.filter((item) =>
            item.title.toLowerCase().includes(q.toLowerCase())
        )
        : items;

    // determinamos que pagina se puede ver
    const pagedItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
        items: pagedItems,
        totalKnown: filtered.length,
        hasMore: page * pageSize < filtered.length,
    };
}

export async function getProductById(id: number): Promise<Product> {
    return apiFetch<Product>(`/products/${id}`);
}