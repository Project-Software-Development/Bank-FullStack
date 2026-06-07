export type RegisterFormData = {
  nome: string
  cpf: string
  email: string
  telefone: string
  senha: string
}

export type RegisterFieldErrors = Partial<Record<keyof RegisterFormData, string>>
