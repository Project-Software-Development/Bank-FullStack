import { useState } from 'react';
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

export default function RegisterPage({ onBackToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setFeedback('Tela de cadastro criada. A integração com backend será feita em seguida.');
  }

  return (
    <div className="register-root">
      <aside className="register-panel">
        <div className="register-panel__content">
          <h2>Abra sua conta digital</h2>
          <p>
            Preencha seus dados para criar uma conta no Banco Litoral.
           
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
              <input id="nome" type="text" placeholder="Maria Silva" required />
            </div>

            <div className="field-group">
              <label htmlFor="cpf">CPF</label>
              <input id="cpf" type="text" placeholder="123.456.789-00" required />
            </div>

            <div className="field-group">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" placeholder="maria@email.com" required />
            </div>

            <div className="field-group">
              <label htmlFor="senha-cadastro">Senha</label>
              <div className="password-wrapper">
                <input
                  id="senha-cadastro"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="nascimento">Data de nascimento</label>
              <input id="nascimento" type="date" required />
            </div>

            {feedback && <div className="feedback-banner">{feedback}</div>}

            <button type="submit" className="btn-submit">
              Continuar cadastro
            </button>
          </form>

          <p className="register-footer">
            Já tem conta?{' '}
            <button type="button" className="link-btn" onClick={onBackToLogin}>
              Voltar para login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
