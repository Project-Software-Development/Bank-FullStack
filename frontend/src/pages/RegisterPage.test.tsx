import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RegisterPage } from './RegisterPage'
import { ApiRequestError, register } from '../services/authService'

vi.mock('../services/authService', () => {
  class ApiRequestError extends Error {
    status?: number

    constructor(message: string, status?: number) {
      super(message)
      this.name = 'ApiRequestError'
      this.status = status
    }
  }

  return {
    ApiRequestError,
    register: vi.fn(),
  }
})

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Maria Silva' } })
  fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '12345678900' } })
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria@email.com' } })
  fireEvent.change(screen.getByLabelText('Telefone (opcional)'), {
    target: { value: '(98) 98888-7777' },
  })
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha123' } })
}

describe('RegisterPage', () => {
  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('mostra erros quando o formulário é inválido', async () => {
    render(<RegisterPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Revise os campos obrigatórios antes de continuar.')).toBeTruthy()
    expect(screen.getByText('Nome é obrigatório.')).toBeTruthy()
    expect(register).not.toHaveBeenCalled()
  })

  it('mostra sucesso e limpa formulário quando cadastro é concluído', async () => {
    vi.mocked(register).mockResolvedValue(new Response(null, { status: 201 }))
    render(<RegisterPage />)

    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => {
      expect(screen.getByText('Cadastro realizado com sucesso.')).toBeTruthy()
    })

    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('')
  })

  it('mostra mensagem de duplicidade quando API retorna 409', async () => {
    vi.mocked(register).mockRejectedValue(new ApiRequestError('Conflito', 409))
    render(<RegisterPage />)

    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('CPF ou e-mail já cadastrado.')).toBeTruthy()
  })

  it('mostra mensagem de endpoint indisponível quando API retorna 404', async () => {
    vi.mocked(register).mockRejectedValue(new ApiRequestError('Não encontrado', 404))
    render(<RegisterPage />)

    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Cadastro ainda não está habilitado na API.')).toBeTruthy()
  })

  it('mostra mensagem de endpoint indisponível quando API retorna 405', async () => {
    vi.mocked(register).mockRejectedValue(new ApiRequestError('Método não permitido', 405))
    render(<RegisterPage />)

    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Cadastro ainda não está habilitado na API.')).toBeTruthy()
  })
})
