import type { RegisterFieldErrors, RegisterFormData } from '../types/register'

export const INITIAL_REGISTER_FORM: RegisterFormData = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  senha: '',
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export function normalizeRegisterData(data: RegisterFormData): RegisterFormData {
  return {
    nome: data.nome.trim(),
    cpf: onlyDigits(data.cpf),
    email: data.email.trim().toLowerCase(),
    telefone: onlyDigits(data.telefone),
    senha: data.senha.trim(),
  }
}

export function validateRegisterForm(data: RegisterFormData): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {}
  const normalized = normalizeRegisterData(data)

  if (!normalized.nome) {
    errors.nome = 'Nome é obrigatório.'
  }

  if (normalized.cpf.length !== 11) {
    errors.cpf = 'CPF deve conter 11 dígitos.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(normalized.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (normalized.senha.length < 6) {
    errors.senha = 'Senha deve ter no mínimo 6 caracteres.'
  }

  return errors
}
