const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Array<{ field: string; message: string }>,
    public isAuthError: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new ApiError("Refresh token não encontrado", 401, [], true);
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data: ApiResponse<{
      tokens: { accessToken: string; refreshToken: string };
    }> = await response.json();

    if (!response.ok) {
      throw new ApiError("Falha ao renovar token", response.status, [], true);
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data!.tokens;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    throw new ApiError("Sessão expirada. Faça login novamente.", 401, [], true);
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry: boolean = false
): Promise<T> {
  const token = localStorage.getItem("accessToken");

  const hasBody = options.body !== undefined && options.body !== null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  const publicEndpoints = [
    "/api/auth/signup",
    "/api/auth/login",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/refresh",
  ];
  const isPublicEndpoint = publicEndpoints.some((publicEndpoint) =>
    endpoint.includes(publicEndpoint)
  );

  if (token && !isPublicEndpoint) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      if (response.status === 401 && !isPublicEndpoint && !isRetry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return fetchApi<T>(endpoint, options, true);
          }) as Promise<T>;
        }

        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          return fetchApi<T>(endpoint, options, true);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          throw new ApiError(
            "Sessão expirada. Faça login novamente.",
            401,
            [],
            true
          );
        } finally {
          isRefreshing = false;
        }
      }

      throw new ApiError(
        data.message || "Erro na requisição",
        response.status,
        data.errors
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Erro de conexão com o servidor");
  }
}

export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    }),
};

export { ApiError };
