const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function getNotifications(token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Nao foi possivel carregar as notificacoes.");
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    if (response.status === 401) {
      throw new Error("Sessao expirada. Faca login novamente.");
    }
    throw new Error(
      error.message || "Nao foi possivel carregar as notificacoes.",
    );
  }

  return response.json();
}
