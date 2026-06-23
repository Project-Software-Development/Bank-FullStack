import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardMe } from '../services/dashboardService';
import { getHistorico, transferir } from '../services/transacoesService';
import bankLogo from '../assets/pds-bank-logo.png';
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
  const { user, token, signOut } = useAuth();
  const [showAccountId, setShowAccountId] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [historicoLoading, setHistoricoLoading] = useState(true);
  const [historicoError, setHistoricoError] = useState('');
  const [historico, setHistorico] = useState([]);
  const [transferenciaForm, setTransferenciaForm] = useState({
    contaDestinoNumero: '',
    valor: '',
  });
  const [transferenciaLoading, setTransferenciaLoading] = useState(false);
  const [transferenciaError, setTransferenciaError] = useState('');
  const [transferenciaSuccess, setTransferenciaSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardAndHistorico() {
      if (!token) {
        if (isMounted) {
          setDashboardLoading(false);
          setHistoricoLoading(false);
        }
        return;
      }

      setDashboardLoading(true);
      setHistoricoLoading(true);
      setDashboardError('');
      setHistoricoError('');

      try {
        const [dashboardResponse, historicoResponse] = await Promise.all([
          getDashboardMe(token),
          getHistorico(token),
        ]);

        if (isMounted) {
          setDashboardData(dashboardResponse);
          setHistorico(historicoResponse.itens ?? []);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar o dashboard.';
        if (message === 'Sessao expirada. Faca login novamente.') {
          signOut();
          return;
        }
        if (isMounted) {
          setDashboardError(message);
          setHistoricoError(message);
        }
      } finally {
        if (isMounted) {
          setDashboardLoading(false);
          setHistoricoLoading(false);
        }
      }
    }

    loadDashboardAndHistorico();

    return () => {
      isMounted = false;
    };
  }, [token, signOut]);

  const firstName = user?.nome?.split(' ')[0] || 'Cliente';
  const account = dashboardData?.conta ?? null;
  const accountNumber = account?.numero ?? '-';
  const accountStatus = account?.status ?? 'Conta nao vinculada';
  const createdAt = account?.dataCriacao
    ? new Date(account.dataCriacao).toLocaleDateString('pt-BR')
    : '-';
  const accountBalance = account?.saldo ?? null;
  const formattedBalance =
    typeof accountBalance === 'number'
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(accountBalance)
      : 'Saldo indisponivel';
  const hiddenAccountId = user?.id ? '••••••••••••••••••••' : '-';

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function formatDate(value) {
    return new Date(value).toLocaleString('pt-BR');
  }

  async function handleTransferenciaSubmit(event) {
    event.preventDefault();
    if (!token || !transferenciaForm.contaDestinoNumero.trim() || !transferenciaForm.valor) {
      return;
    }

    const valorNumerico = Number(String(transferenciaForm.valor).replace(',', '.'));
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setTransferenciaError('Informe um valor valido para transferencia.');
      return;
    }

    setTransferenciaLoading(true);
    setTransferenciaError('');
    setTransferenciaSuccess('');

    try {
      const response = await transferir(token, {
        contaDestinoNumero: transferenciaForm.contaDestinoNumero.trim(),
        valor: valorNumerico,
      });

      const [dashboardResponse, historicoResponse] = await Promise.all([
        getDashboardMe(token),
        getHistorico(token),
      ]);

      setDashboardData(dashboardResponse);
      setHistorico(historicoResponse.itens ?? []);
      setTransferenciaForm({ contaDestinoNumero: '', valor: '' });
      setTransferenciaSuccess(response.mensagem || 'Transferencia realizada com sucesso.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao transferir valor.';
      if (message === 'Sessao expirada. Faca login novamente.') {
        signOut();
        return;
      }
      setTransferenciaError(message);
    } finally {
      setTransferenciaLoading(false);
    }
  }

  return (
    <div className="home-root">
      <aside className="home-sidebar">
        <div className="home-sidebar__brand">
          <img src={bankLogo} alt="PDS Bank" className="home-sidebar__logo" />
        
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
          <h2>Painel do cliente</h2>
          <p>Dados reais da conta vinculada ao usuario autenticado.</p>
        </header>

        {dashboardError && (
          <div className="home-feedback home-feedback--error" role="alert">
            {dashboardError}
          </div>
        )}

        {dashboardLoading && (
          <div className="home-feedback home-feedback--loading">
            Carregando dados do dashboard...
          </div>
        )}

        <section className="home-grid">
          <article className="fake-card fake-card--wide">
            <p className="fake-card__label">Dados da conta</p>
            <dl className="account-data-grid">
              <div>
                <dt className="id-label">
                  ID do usuario
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
                <dd>{formattedBalance}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{accountStatus}</dd>
              </div>
              <div>
                <dt>Data de criação</dt>
                <dd>{createdAt}</dd>
              </div>
            </dl>
            {!account && (
              <p className="fake-card__hint">
                Conta ainda nao vinculada. Assim que a conta for criada, os dados aparecerao aqui.
              </p>
            )}
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Saldo em conta</p>
            <h3>{formattedBalance}</h3>
            <span className="fake-card__hint">
              {account ? 'Atualizado com dados do backend' : 'Sem conta vinculada no momento'}
            </span>
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Enviar valor</p>
            <form className="transfer-form" onSubmit={handleTransferenciaSubmit} noValidate>
              <label htmlFor="conta-destino">
                Conta destino
                <input
                  id="conta-destino"
                  type="text"
                  value={transferenciaForm.contaDestinoNumero}
                  onChange={(event) =>
                    setTransferenciaForm((current) => ({
                      ...current,
                      contaDestinoNumero: event.target.value,
                    }))
                  }
                  placeholder="00012345-6"
                  disabled={transferenciaLoading}
                />
              </label>
              <label htmlFor="valor-transferencia">
                Valor (R$)
                <input
                  id="valor-transferencia"
                  type="text"
                  value={transferenciaForm.valor}
                  onChange={(event) =>
                    setTransferenciaForm((current) => ({
                      ...current,
                      valor: event.target.value,
                    }))
                  }
                  placeholder="100,00"
                  disabled={transferenciaLoading}
                />
              </label>

              {transferenciaError && (
                <p className="transfer-feedback transfer-feedback--error">{transferenciaError}</p>
              )}
              {transferenciaSuccess && (
                <p className="transfer-feedback transfer-feedback--success">{transferenciaSuccess}</p>
              )}

              <button
                type="submit"
                className="transfer-submit"
                disabled={
                  transferenciaLoading ||
                  !transferenciaForm.contaDestinoNumero.trim() ||
                  !transferenciaForm.valor.trim()
                }
              >
                {transferenciaLoading ? 'Enviando...' : 'Transferir'}
              </button>
            </form>
          </article>

          <article className="fake-card fake-card--wide">
            <p className="fake-card__label">Últimas movimentações</p>
            {historicoLoading ? (
              <p className="fake-card__hint">Carregando historico...</p>
            ) : historicoError ? (
              <p className="fake-card__hint">{historicoError}</p>
            ) : historico.length === 0 ? (
              <p className="fake-card__hint">Nenhuma transacao registrada ate o momento.</p>
            ) : (
              <ul className="tx-list">
                {historico.map((item) => (
                  <li key={item.id} className="tx-item">
                    <div className="tx-item__main">
                      <strong>{item.direcao === 'SAIDA' ? 'Transferencia enviada' : 'Transferencia recebida'}</strong>
                      <span>{item.descricao}</span>
                      <span className="tx-item__meta">
                        {item.direcao === 'SAIDA' ? 'Para' : 'De'} conta {item.contaContraparte} - {formatDate(item.data)}
                      </span>
                    </div>
                    <span
                      className={`tx-item__amount ${
                        item.direcao === 'SAIDA' ? 'tx-item__amount--saida' : 'tx-item__amount--entrada'
                      }`}
                    >
                      {item.direcao === 'SAIDA' ? '-' : '+'}
                      {formatCurrency(item.valor)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Próximos pagamentos</p>
            <ul>
              <li>Aguardando endpoint de pagamentos.</li>
            </ul>
          </article>

          <article className="fake-card">
            <p className="fake-card__label">Objetivo mensal</p>
            <h3>Em breve</h3>
            <span className="fake-card__hint">Aguardando endpoint de metas</span>
          </article>
        </section>
      </main>
    </div>
  );
}
