const API_BASE_URL = 'http://localhost:3000';

export async function login(emailOuCpf, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emailOuCpf, senha }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 403) {
      throw new Error('Usuário inativo. Entre em contato com o suporte.');
    }
    throw new Error(error.message || 'Credenciais inválidas.');
  }

  return response.json();
}

export async function getMe(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  return response.json();
}
