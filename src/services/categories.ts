import { apiFetch } from "../api/client";
import type { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/products/categories");
}