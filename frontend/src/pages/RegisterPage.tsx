import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiRequestError, register } from '../services/authService'
import type { RegisterFieldErrors, RegisterFormData } from '../types/register'
import {
  formatCpf,
  INITIAL_REGISTER_FORM,
  normalizeRegisterData,
  validateRegisterForm,
} from '../utils/register'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_REGISTER_FORM)
  const [errors, setErrors] = useState<RegisterFieldErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  function updateField<K extends keyof RegisterFormData>(
    key: K,
    value: RegisterFormData[K],
  ) {
    setFormData((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setMessage('')
    setSubmitState('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const validationErrors = validateRegisterForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmitState('error')
      setMessage('Revise os campos obrigatórios antes de continuar.')
      return
    }

    setSubmitState('loading')
    setMessage('Processando cadastro...')

    const normalizedPayload = normalizeRegisterData(formData)

    try {
      await register(normalizedPayload)
      setSubmitState('success')
      setMessage('Cadastro realizado com sucesso.')
      setFormData(INITIAL_REGISTER_FORM)
      setErrors({})
    } catch (error) {
      setSubmitState('error')

      if (error instanceof ApiRequestError) {
        if (error.status === 409) {
          setMessage('CPF ou e-mail já cadastrado.')
          return
        }

        if (error.status === 404 || error.status === 405) {
          setMessage('Cadastro ainda não está habilitado na API.')
          return
        }

        setMessage(error.message)
        return
      }

      setMessage('Não foi possível conectar com a API de cadastro.')
    }
  }

  return (
    <main>
      <h1>Cadastro</h1>
      <p>Preencha os dados para criar sua conta.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={(event) => updateField('nome', event.target.value)}
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? 'nome-erro' : undefined}
          />
          {errors.nome && <small id="nome-erro">{errors.nome}</small>}
        </div>

        <div>
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={(event) => updateField('cpf', formatCpf(event.target.value))}
            aria-invalid={Boolean(errors.cpf)}
            aria-describedby={errors.cpf ? 'cpf-erro' : undefined}
          />
          {errors.cpf && <small id="cpf-erro">{errors.cpf}</small>}
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-erro' : undefined}
          />
          {errors.email && <small id="email-erro">{errors.email}</small>}
        </div>

        <div>
          <label htmlFor="telefone">Telefone (opcional)</label>
          <input
            id="telefone"
            name="telefone"
            type="text"
            value={formData.telefone}
            onChange={(event) => updateField('telefone', event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={(event) => updateField('senha', event.target.value)}
            aria-invalid={Boolean(errors.senha)}
            aria-describedby={errors.senha ? 'senha-erro' : undefined}
          />
          {errors.senha && <small id="senha-erro">{errors.senha}</small>}
        </div>

        <button type="submit" disabled={submitState === 'loading'}>
          {submitState === 'loading' ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>

      {message && (
        <p role="alert" aria-live="polite">
          {message}
        </p>
      )}
    </main>
  )
}
