const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function mapError(response, error, fallback) {
  if (response.status === 401) {
    return new Error('Sessao expirada. Faca login novamente.');
  }
  if (response.status === 403) {
    return new Error('Voce nao tem permissao para acessar a gestao de usuarios.');
  }
  if (response.status === 404) {
    return new Error(error.message || 'Usuario nao encontrado.');
  }
  if (response.status === 400) {
    return new Error(error.message || 'Dados invalidos para a operacao.');
  }
  return new Error(error.message || fallback);
}

export async function listarUsuarios(token, { busca, tipo, statusConta, page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (busca) params.set('busca', busca);
  if (tipo) params.set('tipo', tipo);
  if (statusConta) params.set('statusConta', statusConta);
  params.set('page', String(page));
  params.set('limit', String(limit));

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/configuracoes/usuarios?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Nao foi possivel carregar a lista de usuarios.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    throw mapError(response, error, 'Nao foi possivel carregar a lista de usuarios.');
  }

  return response.json();
}

export async function alterarStatusUsuario(token, id, statusConta) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/configuracoes/usuarios/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ statusConta }),
    });
  } catch {
    throw new Error('Nao foi possivel atualizar o status do usuario.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    throw mapError(response, error, 'Nao foi possivel atualizar o status do usuario.');
  }

  return response.json();
}

export async function excluirUsuario(token, id) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/configuracoes/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Nao foi possivel excluir o usuario.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    throw mapError(response, error, 'Nao foi possivel excluir o usuario.');
  }

  return response.json();
}
