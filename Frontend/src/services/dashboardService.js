const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function getDashboardMe(token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/dashboard/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Nao foi possivel carregar o dashboard. Verifique sua conexao.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    if (response.status === 401) {
      throw new Error('Sessao expirada. Faca login novamente.');
    }
    if (response.status === 403) {
      throw new Error('Usuario sem permissao para acessar o dashboard.');
    }
    if (response.status === 404) {
      throw new Error('Usuario nao encontrado.');
    }
    throw new Error(error.message || 'Nao foi possivel carregar o dashboard.');
  }

  return response.json();
}
