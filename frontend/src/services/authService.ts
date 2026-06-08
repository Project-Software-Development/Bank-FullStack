import type { RegisterFormData } from '../types/register'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000'

export class ApiRequestError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(payload.message)) {
      return payload.message.join(', ')
    }
    if (payload.message) {
      return payload.message
    }
  } catch {
    // Ignore parse error and use fallback message.
  }

  return 'Não foi possível concluir o cadastro.'
}

export async function register(payload: RegisterFormData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new ApiRequestError(message, response.status)
  }

  return response
}
