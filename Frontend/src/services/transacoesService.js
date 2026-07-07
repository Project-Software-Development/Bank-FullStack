const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function getHistorico(token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/transacoes/historico`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Nao foi possivel carregar o historico de transacoes.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    if (response.status === 401) {
      throw new Error('Sessao expirada. Faca login novamente.');
    }
    if (response.status === 404) {
      throw new Error('Conta nao encontrada para carregar historico.');
    }
    throw new Error(error.message || 'Nao foi possivel carregar o historico.');
  }

  return response.json();
}

export async function transferir(token, payload) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/transacoes/transferir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Nao foi possivel realizar a transferencia.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    if (response.status === 401) {
      throw new Error('Sessao expirada. Faca login novamente.');
    }
    if (response.status === 404) {
      throw new Error(error.message || 'Conta de origem ou destino nao encontrada.');
    }
    if (response.status === 400) {
      throw new Error(error.message || 'Dados invalidos para transferencia.');
    }
    throw new Error(error.message || 'Nao foi possivel concluir a transferencia.');
  }

  return response.json();
}
