import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function HomePage() {
  const { user, signOut } = useAuth();
  const [showAccountId, setShowAccountId] = useState(false);
  const firstName = user?.nome?.split(' ')[0] || 'Cliente';
  const accountNumber = `0001-${(user?.cpf || '00000000000').slice(-6)}`;
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR')
    : '-';
  const fakeBalance = 'R$ 8.450,90';
  const hiddenAccountId = user?.id ? '••••••••••••••••••••' : '-';

  return (
    <div className="home-root">
      <aside className="home-sidebar">
        <div className="home-sidebar__brand">
          <h1>Banco Litoral</h1>
          <p>Painel principal</p>
        </div>

        <section className="home-sidebar__card">
          <p className="card-label">Boas-vindas</p>
          <h2>Ola, {firstName}!</h2>
          <p>
            Conta <strong>{user?.tipo}</strong> com status{' '}
            <span className="status-badge">{user?.statusConta}</span>.
          </p>
        </section>

        <section className="home-sidebar__card">
          <p className="card-label">Dados da sessão autenticada</p>
          <dl>
            <div>
              <dt>Nome</dt>
              <dd>{user?.nome}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>CPF</dt>
              <dd>{user?.cpf}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{user?.statusConta}</dd>
            </div>
          </dl>
        </section>

        <button type="button" className="btn-logout" onClick={signOut}>
          Sair da conta
        </button>
      </aside>

      <main className="home-content">
        <header className="home-content__header">
          <h2>Home do Banco</h2>
          <p>Campos fictícios para evoluir a aplicação.</p>
        </header>

        <section className="home-grid">
          <article className="fake-card fake-card--wide">
            <p className="fake-card__label">Dados da conta</p>
            <dl className="account-data-grid">
              <div>
                <dt className="id-label">
                  ID da conta
                  <button
                    type="button"
                    className="id-visibility-btn"
                    onClick={() => setShowAccountId((current) => !current)}
                    aria-label={showAccountId ? 'Ocultar ID da conta' : 'Mostrar ID da conta'}
                  >
                    <EyeIcon open={showAccountId} />
                  </button>
                </dt>
                <dd>{showAccountId ? user?.id || '-' : hiddenAccountId}</dd>
              </div>
              <div>
                <dt>Número da conta</dt>
                <dd>{accountNumber}</dd>
              </div>
              <div>
                <dt>Saldo</dt>
                <dd>{fakeBalance}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{user?.statusConta || '-'}</dd>
              </div>
              <div>
                <dt>Data de criação</dt>
                <dd>{createdAt}</dd>
              </div>
            </dl>
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Saldo em conta</p>
            <h3>{fakeBalance}</h3>
            <span className="fake-card__hint">Atualizado há 2 min</span>
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Cartão de crédito</p>
            <h3>R$ 1.230,00</h3>
            <span className="fake-card__hint">Fatura fecha em 12 dias</span>
          </article>

          <article className="fake-card fake-card--wide">
            <p className="fake-card__label">Últimas movimentações</p>
            <ul>
              <li>Pix recebido - R$ 340,00</li>
              <li>Débito mercado - R$ 89,90</li>
              <li>Transferência enviada - R$ 120,00</li>
            </ul>
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Próximos pagamentos</p>
            <ul>
              <li>Energia - R$ 167,40</li>
              <li>Internet - R$ 119,90</li>
            </ul>
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Objetivo mensal</p>
            <h3>42%</h3>
            <span className="fake-card__hint">Meta de economia</span>
          </article>
        </section>
      </main>
    </div>
  );
}
