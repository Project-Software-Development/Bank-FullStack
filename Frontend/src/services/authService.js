const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function login(emailOuCpf, senha) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOuCpf, senha }),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    if (response.status === 401) {
      throw new Error(error.message || 'Credenciais inválidas.');
    }
    if (response.status === 403) {
      throw new Error('Usuário inativo. Entre em contato com o suporte.');
    }
    throw new Error(error.message || 'Não foi possível realizar o login.');
  }

  return response.json();
}

export async function getMe(token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Não foi possível validar a sessão. Verifique sua conexão.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    if (response.status === 401) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    throw new Error(error.message || 'Não foi possível validar sua sessão.');
  }

  return response.json();
}

export async function register({ nome, cpf, email, telefone, senha }) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, cpf, email, telefone, senha }),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  }

  if (!response.ok) {
    const error = await parseJsonSafely(response);
    if (response.status === 409) {
      throw new Error(error.message || 'CPF ou e-mail já cadastrado.');
    }
    if (response.status === 400) {
      throw new Error(error.message || 'Dados de cadastro inválidos.');
    }
    throw new Error(error.message || 'Não foi possível concluir o cadastro.');
  }

  return response.json();
}
