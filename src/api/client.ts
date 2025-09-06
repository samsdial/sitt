const API_BASE = "https://fakestoreapi.com";

export interface RequestOptions extends RequestInit {
  timeout?: number;
  signal?: AbortSignal;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = options.timeout ?? 5000;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: options.signal ?? controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
    if (!response.ok) {
      throw {
        status: response.status,
        message: response.statusText,
      };
    }
    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw { message: "Request timed out", status: 408, retriable: true };
    }
    if (typeof err === "object" && err !== null) {
      throw {
        status: (err as { status?: number }).status ?? 500,
        message: (err as { message?: string }).message ?? "Unknown error",
        retriable: (err as { retriable?: boolean }).retriable ?? false,
      };
    } else {
      throw {
        status: 500,
        message: "Unknown error",
        retriable: false,
      };
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
