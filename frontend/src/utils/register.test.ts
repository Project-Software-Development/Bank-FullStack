import { describe, expect, it } from 'vitest'
import {
  formatCpf,
  normalizeRegisterData,
  validateRegisterForm,
} from './register'

describe('register utils', () => {
  it('normaliza campos de cadastro', () => {
    const normalized = normalizeRegisterData({
      nome: '  Joao Lago  ',
      cpf: '123.456.789-00',
      email: '  JOAO@EMAIL.COM  ',
      telefone: '(98) 98888-7777',
      senha: '  senha123  ',
    })

    expect(normalized).toEqual({
      nome: 'Joao Lago',
      cpf: '12345678900',
      email: 'joao@email.com',
      telefone: '98988887777',
      senha: 'senha123',
    })
  })

  it('formata CPF durante digitação', () => {
    expect(formatCpf('12345678900')).toBe('123.456.789-00')
  })

  it('retorna erros para campos inválidos', () => {
    const errors = validateRegisterForm({
      nome: '',
      cpf: '123',
      email: 'email-invalido',
      telefone: '',
      senha: '123',
    })

    expect(errors.nome).toBe('Nome é obrigatório.')
    expect(errors.cpf).toBe('CPF deve conter 11 dígitos.')
    expect(errors.email).toBe('Informe um e-mail válido.')
    expect(errors.senha).toBe('Senha deve ter no mínimo 6 caracteres.')
  })
})
