import { useState } from 'react';
import { register } from '../services/authService';
import './RegisterPage.css';

function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function RegisterPage({ onBackToLogin, onRegisterSuccess }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback('');
    setError('');
    setLoading(true);

    try {
      await register({
        nome,
        cpf,
        email,
        telefone,
        senha,
      });

      setFeedback('Cadastro realizado com sucesso! Você já pode fazer login.');
      onRegisterSuccess(email.trim().toLowerCase());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível realizar o cadastro.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-root">
      <aside className="register-panel">
        <div className="register-panel__content">
          <h2>Abra sua conta digital</h2>
          <p>
            Preencha seus dados para criar uma conta no Banco Litoral.
            Seu cadastro será validado no backend.
          </p>
        </div>
      </aside>

      <main className="register-form-wrapper">
        <div className="register-form-card">
          <div className="register-form-card__header">
            <h1>Criar nova conta</h1>
            <p>Preencha os campos abaixo.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Maria Silva"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                type="text"
                placeholder="123.456.789-00"
                value={cpf}
                onChange={(event) => setCpf(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="maria@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="telefone">Telefone (opcional)</label>
              <input
                id="telefone"
                type="text"
                placeholder="(98) 99999-9999"
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="field-group">
              <label htmlFor="senha-cadastro">Senha</label>
              <div className="password-wrapper">
                <input
                  id="senha-cadastro"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  disabled={loading}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && <div className="register-error-banner">{error}</div>}

            {feedback && <div className="register-feedback-banner">{feedback}</div>}

            <button
              type="submit"
              className="register-btn-submit"
              disabled={loading || !nome.trim() || !cpf.trim() || !email.trim() || !senha}
            >
              {loading ? 'Cadastrando...' : 'Continuar cadastro'}
            </button>
          </form>

          <p className="register-footer">
            Já tem conta?{' '}
            <button
              type="button"
              className="register-link-btn"
              onClick={onBackToLogin}
              disabled={loading}
            >
              Voltar para login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
