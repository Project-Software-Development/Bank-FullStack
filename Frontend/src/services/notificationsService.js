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

async function requestNotificationDeletion(url, token, fallbackMessage) {
  let response;

  try {
    response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error(fallbackMessage);
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);

    if (response.status === 401) {
      throw new Error("Sessao expirada. Faca login novamente.");
    }

    throw new Error(error.message || fallbackMessage);
  }

  return parseJsonSafely(response);
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

export async function deleteNotification(token, notificationId) {
  return requestNotificationDeletion(
    `${API_BASE_URL}/notifications/${notificationId}`,
    token,
    "Nao foi possivel excluir a notificacao.",
  );
}

export async function deleteAllNotifications(token) {
  return requestNotificationDeletion(
    `${API_BASE_URL}/notifications`,
    token,
    "Nao foi possivel excluir as notificacoes.",
  );
}

export async function updateNotificationStatus(token, notificationId, lida) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lida }),
    });
  } catch {
    throw new Error("Nao foi possivel atualizar a notificacao.");
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);

    if (response.status === 401) {
      throw new Error("Sessao expirada. Faca login novamente.");
    }

    if (response.status === 404) {
      throw new Error(error.message || "Notificacao nao encontrada.");
    }

    throw new Error(error.message || "Nao foi possivel atualizar a notificacao.");
  }

  return response.json();
}
