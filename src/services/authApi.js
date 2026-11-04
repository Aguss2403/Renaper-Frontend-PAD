import { apiBaseUrl } from "../config/environment";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new ApiError(
      "No fue posible conectar con el servicio. Verificá tu conexión e intentá nuevamente.",
    );
  }

  if (response.ok) return response.status === 204 ? null : response.json();

  const problem = await response.json().catch(() => ({}));
  const validation = problem.errors && Object.values(problem.errors).flat()[0];
  throw new ApiError(
    validation || problem.title || "No fue posible completar la solicitud.",
    response.status,
  );
}

export const authApi = {
  register: (credentials) =>
    request("/api/v1/auth/registro", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  login: (credentials) =>
    request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  me: (accessToken) =>
    request("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  logout: (accessToken) =>
    request("/api/v1/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};

export const apiKeyApi = {
  status: (accessToken) =>
    request("/api/v1/clientes/api-key", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  generate: (accessToken) =>
    request("/api/v1/clientes/api-key", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  revoke: (accessToken) =>
    request("/api/v1/clientes/api-key", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};

export const personApi = {
  validate: (apiKey, values) =>
    request("/api/v1/personas/validar", {
      method: "POST",
      headers: { "X-API-Key": apiKey },
      body: JSON.stringify(values),
    }),
};

export const creditsApi = {
  balance: (accessToken) =>
    request("/api/v1/clientes/creditos", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  checkout: (accessToken) =>
    request("/api/v1/clientes/compras", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
