import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardMe } from "../services/dashboardService";
import { getHistorico, transferir } from "../services/transacoesService";
import UsuariosManagement from "../components/UsuariosManagement";
import bankLogo from "../assets/pds-bank-logo.png";
import "./HomePage.css";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
} from "../services/notificationsService";

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transition: "transform 0.15s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function HomePage() {
  const { user, token, signOut } = useAuth();
  const isAdmin = user?.tipo === "ADMINISTRADOR";
  const [activeView, setActiveView] = useState("home");
  const [configOpen, setConfigOpen] = useState(false);
  const [showPersonalId, setShowPersonalId] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [historicoLoading, setHistoricoLoading] = useState(true);
  const [historicoError, setHistoricoError] = useState("");
  const [historico, setHistorico] = useState([]);
  const [transferenciaForm, setTransferenciaForm] = useState({
    contaDestinoNumero: "",
    valor: "",
  });
  const [transferenciaLoading, setTransferenciaLoading] = useState(false);
  const [transferenciaError, setTransferenciaError] = useState("");
  const [transferenciaSuccess, setTransferenciaSuccess] = useState("");
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [deletingNotificationId, setDeletingNotificationId] = useState(null);
  const [deletingAllNotifications, setDeletingAllNotifications] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardAndHistorico() {
      if (!token) {
        if (isMounted) {
          setDashboardLoading(false);
          setHistoricoLoading(false);
          setNotificationsLoading(false);
        }
        return;
      }

      setNotificationsLoading(true);
      setNotificationsError("");
      setDashboardLoading(true);
      setHistoricoLoading(true);
      setDashboardError("");
      setHistoricoError("");

      try {
        const [dashboardResponse, historicoResponse, notificationsResponse] =
          await Promise.all([
            getDashboardMe(token),
            getHistorico(token),
            getNotifications(token),
          ]);

        if (isMounted) {
          setDashboardData(dashboardResponse);
          setHistorico(historicoResponse.itens ?? []);
          setNotifications(notificationsResponse.data ?? []);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar o dashboard.";
        if (message === "Sessao expirada. Faca login novamente.") {
          signOut();
          return;
        }
        if (isMounted) {
          setDashboardError(message);
          setHistoricoError(message);
          setNotificationsError(message);
        }
      } finally {
        if (isMounted) {
          setDashboardLoading(false);
          setHistoricoLoading(false);
          setNotificationsLoading(false);
        }
      }
    }

    loadDashboardAndHistorico();

    return () => {
      isMounted = false;
    };
  }, [token, signOut]);

  const firstName = user?.nome?.split(" ")[0] || "Cliente";
  const account = dashboardData?.conta ?? null;
  const createdAt = account?.dataCriacao
    ? new Date(account.dataCriacao).toLocaleDateString("pt-BR")
    : "-";
  const accountBalance = account?.saldo ?? null;
  const formattedBalance =
    typeof accountBalance === "number"
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(accountBalance)
      : "Saldo indisponivel";
  const hiddenPersonalId = user?.id ? "••••••••••••••••••••" : "-";

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatDate(value) {
    return new Date(value).toLocaleString("pt-BR");
  }

  async function handleDeleteNotification(notificationId) {
    if (!token || deletingNotificationId || deletingAllNotifications) {
      return;
    }

    setDeletingNotificationId(notificationId);
    setNotificationsError("");

    try {
      await deleteNotification(token, notificationId);

      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationId),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir notificacao.";

      if (message === "Sessao expirada. Faca login novamente.") {
        signOut();
        return;
      }

      setNotificationsError(message);
    } finally {
      setDeletingNotificationId(null);
    }
  }

  async function handleDeleteAllNotifications() {
    if (!token || notifications.length === 0 || deletingAllNotifications) {
      return;
    }

    setDeletingAllNotifications(true);
    setNotificationsError("");

    try {
      await deleteAllNotifications(token);
      setNotifications([]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir notificacoes.";

      if (message === "Sessao expirada. Faca login novamente.") {
        signOut();
        return;
      }

      setNotificationsError(message);
    } finally {
      setDeletingAllNotifications(false);
    }
  }

  async function handleTransferenciaSubmit(event) {
    event.preventDefault();
    if (
      !token ||
      !transferenciaForm.contaDestinoNumero.trim() ||
      !transferenciaForm.valor
    ) {
      return;
    }

    const valorNumerico = Number(
      String(transferenciaForm.valor).replace(",", "."),
    );
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setTransferenciaError("Informe um valor valido para transferencia.");
      return;
    }

    setTransferenciaLoading(true);
    setTransferenciaError("");
    setTransferenciaSuccess("");

    try {
      const response = await transferir(token, {
        contaDestinoNumero: transferenciaForm.contaDestinoNumero.trim(),
        valor: valorNumerico,
      });

      const [dashboardResponse, historicoResponse, notificationsResponse] =
        await Promise.all([
          getDashboardMe(token),
          getHistorico(token),
          getNotifications(token),
        ]);

      setDashboardData(dashboardResponse);
      setHistorico(historicoResponse.itens ?? []);
      setNotifications(notificationsResponse.data ?? []);
      setTransferenciaForm({ contaDestinoNumero: "", valor: "" });
      setTransferenciaSuccess(
        response.mensagem || "Transferencia realizada com sucesso.",
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao transferir valor.";
      if (message === "Sessao expirada. Faca login novamente.") {
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

        <section className="home-sidebar__card home-sidebar__card--compact">
          <p className="card-label">Sessão ativa</p>
          <h2>Olá, {firstName}</h2>
          <div className="home-badges">
            <span className="type-badge">{user?.tipo || "-"}</span>
            <span className="status-badge">{user?.statusConta || "-"}</span>
          </div>
        </section>

        <nav className="home-nav" aria-label="Menu principal">
          <button
            type="button"
            className={`home-nav__item ${activeView === "home" ? "is-active" : ""}`}
            onClick={() => setActiveView("home")}
          >
            <HomeIcon />
            <span>Painel</span>
          </button>

          <button
            type="button"
            className={`home-nav__item ${activeView === "perfil" ? "is-active" : ""}`}
            onClick={() => setActiveView("perfil")}
          >
            <UserIcon />
            <span>Meu perfil</span>
          </button>

          {isAdmin && (
            <div className="home-nav__group">
              <button
                type="button"
                className="home-nav__item home-nav__item--group"
                onClick={() => setConfigOpen((current) => !current)}
                aria-expanded={configOpen}
              >
                <GearIcon />
                <span>Configurações</span>
                <ChevronIcon open={configOpen} />
              </button>

              {configOpen && (
                <div className="home-nav__sub">
                  <button
                    type="button"
                    className={`home-nav__subitem ${activeView === "usuarios" ? "is-active" : ""}`}
                    onClick={() => setActiveView("usuarios")}
                  >
                    Gestão de Usuários
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button type="button" className="btn-logout" onClick={signOut}>
          Sair da conta
        </button>
      </aside>

      <main className="home-content">
        {activeView === "usuarios" && isAdmin ? (
          <UsuariosManagement
            token={token}
            currentUserId={user?.id}
            onSessionExpired={signOut}
          />
        ) : activeView === "perfil" ? (
          <>
            <header className="home-content__header">
              <h2>Minhas informações pessoais</h2>
              <p>Confira os dados vinculados à sua conta e sessão atual.</p>
            </header>

            <section className="home-grid">
              <article className="fake-card fake-card--wide">
                <p className="fake-card__label">Dados pessoais</p>
                <dl className="account-data-grid">
                  <div>
                    <dt>Nome completo</dt>
                    <dd>{user?.nome || "-"}</dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>{user?.email || "-"}</dd>
                  </div>
                  <div>
                    <dt>CPF</dt>
                    <dd>{user?.cpf || "-"}</dd>
                  </div>
                  <div>
                    <dt>Telefone</dt>
                    <dd>{user?.telefone || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Número da conta</dt>
                    <dd>{account?.numero || "-"}</dd>
                  </div>
                  <div>
                    <dt>Tipo de usuário</dt>
                    <dd>{user?.tipo || "-"}</dd>
                  </div>
                  <div>
                    <dt>Status da conta</dt>
                    <dd>{user?.statusConta || "-"}</dd>
                  </div>
                  <div>
                    <dt className="id-label">
                      ID do usuário
                      <button
                        type="button"
                        className="id-visibility-btn"
                        onClick={() => setShowPersonalId((current) => !current)}
                        aria-label={
                          showPersonalId
                            ? "Ocultar ID do usuário"
                            : "Mostrar ID do usuário"
                        }
                      >
                        <EyeIcon open={showPersonalId} />
                      </button>
                    </dt>
                    <dd>
                      {showPersonalId ? user?.id || "-" : hiddenPersonalId}
                    </dd>
                  </div>
                  <div>
                    <dt>Conta criada em</dt>
                    <dd>{createdAt}</dd>
                  </div>
                </dl>
              </article>
              <article className="fake-card fake-card--wide">
                <div className="notification-header">
                  <p className="fake-card__label">Notificações da conta</p>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      className="notification-clear-all"
                      onClick={handleDeleteAllNotifications}
                      disabled={
                        notificationsLoading || deletingAllNotifications
                      }
                    >
                      {deletingAllNotifications
                        ? "Apagando..."
                        : "Apagar todas"}
                    </button>
                  )}
                </div>

                {notificationsLoading ? (
                  <p className="fake-card__hint">Carregando notificações...</p>
                ) : notificationsError ? (
                  <p className="fake-card__hint">{notificationsError}</p>
                ) : notifications.length === 0 ? (
                  <p className="fake-card__hint">
                    Nenhuma notificação registrada até o momento.
                  </p>
                ) : (
                  <ul className="notification-list">
                    {notifications.slice(0, 6).map((notification) => {
                      const isDeleting =
                        deletingNotificationId === notification.id;

                      return (
                        <li key={notification.id} className="notification-item">
                          <div className="notification-item__content">
                            <strong>{notification.title}</strong>
                            <span>{notification.body}</span>
                            <small>{formatDate(notification.createdAt)}</small>
                          </div>

                          <button
                            type="button"
                            className="notification-delete"
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            disabled={isDeleting || deletingAllNotifications}
                            aria-label={`Apagar notificacao ${notification.title}`}
                          >
                            {isDeleting ? "Apagando..." : "Apagar"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            </section>
          </>
        ) : (
          <>
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
              <article className="fake-card">
                <p className="fake-card__label">Saldo em conta</p>
                <h3>{formattedBalance}</h3>
                <span className="fake-card__hint">
                  {account ? "" : "Sem conta vinculada no momento"}
                </span>
              </article>

              <article className="fake-card">
                <p className="fake-card__label">Enviar valor</p>
                <form
                  className="transfer-form"
                  onSubmit={handleTransferenciaSubmit}
                  noValidate
                >
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
                      disabled={transferenciaLoading}
                    />
                  </label>

                  {transferenciaError && (
                    <p className="transfer-feedback transfer-feedback--error">
                      {transferenciaError}
                    </p>
                  )}
                  {transferenciaSuccess && (
                    <p className="transfer-feedback transfer-feedback--success">
                      {transferenciaSuccess}
                    </p>
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
                    {transferenciaLoading ? "Enviando..." : "Transferir"}
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
                  <p className="fake-card__hint">
                    Nenhuma transacao registrada ate o momento.
                  </p>
                ) : (
                  <ul className="tx-list">
                    {historico.map((item) => (
                      <li key={item.id} className="tx-item">
                        <div className="tx-item__main">
                          <strong>
                            {item.direcao === "SAIDA"
                              ? "Transferencia enviada"
                              : "Transferencia recebida"}
                          </strong>
                          <span>{item.descricao}</span>
                          <span className="tx-item__meta">
                            {item.direcao === "SAIDA" ? "Para" : "De"} conta{" "}
                            {item.contaContraparte} - {formatDate(item.data)}
                          </span>
                        </div>
                        <span
                          className={`tx-item__amount ${
                            item.direcao === "SAIDA"
                              ? "tx-item__amount--saida"
                              : "tx-item__amount--entrada"
                          }`}
                        >
                          {item.direcao === "SAIDA" ? "-" : "+"}
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
                <span className="fake-card__hint">
                  Aguardando endpoint de metas
                </span>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
