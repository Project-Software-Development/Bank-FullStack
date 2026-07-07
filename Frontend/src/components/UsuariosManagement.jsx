import { useEffect, useState } from 'react';
import { listarUsuarios, alterarStatusUsuario, excluirUsuario } from '../services/configuracoesService';
import './UsuariosManagement.css';

const STATUS_OPTIONS = ['ATIVO', 'INATIVO'];
const TIPO_OPTIONS = ['CLIENTE', 'ADMINISTRADOR'];
const PAGE_LIMIT = 10;

function formatCurrency(value) {
  if (typeof value !== 'number') {
    return '-';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function statusClassName(status) {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'ATIVO' || normalized === 'ATIVA') {
    return 'usr-badge usr-badge--ativo';
  }
  if (normalized === 'BLOQUEADO' || normalized === 'BLOQUEADA') {
    return 'usr-badge usr-badge--bloqueado';
  }
  return 'usr-badge usr-badge--inativo';
}

export default function UsuariosManagement({ token, currentUserId, onSessionExpired }) {
  const [usuarios, setUsuarios] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: PAGE_LIMIT, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [buscaInput, setBuscaInput] = useState('');
  const [filtros, setFiltros] = useState({ busca: '', tipo: '', statusConta: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function carregarUsuarios() {
      if (!token) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await listarUsuarios(token, {
          busca: filtros.busca,
          tipo: filtros.tipo || undefined,
          statusConta: filtros.statusConta || undefined,
          page,
          limit: PAGE_LIMIT,
        });
        if (!isMounted) {
          return;
        }
        setUsuarios(response.data ?? []);
        setMeta(response.meta ?? { page, limit: PAGE_LIMIT, total: 0 });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar usuarios.';
        if (message === 'Sessao expirada. Faca login novamente.') {
          onSessionExpired?.();
          return;
        }
        if (isMounted) {
          setError(message);
          setUsuarios([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarUsuarios();

    return () => {
      isMounted = false;
    };
  }, [token, filtros, page, onSessionExpired]);

  function handleBuscaSubmit(event) {
    event.preventDefault();
    setPage(1);
    setFiltros((current) => ({ ...current, busca: buscaInput.trim() }));
  }

  function handleFiltroChange(campo, value) {
    setPage(1);
    setFiltros((current) => ({ ...current, [campo]: value }));
  }

  function limparFiltros() {
    setBuscaInput('');
    setPage(1);
    setFiltros({ busca: '', tipo: '', statusConta: '' });
  }

  async function handleAlterarStatus(usuario, novoStatus) {
    if (!token || novoStatus === usuario.statusConta) {
      return;
    }

    setUpdatingId(usuario.id);
    setError('');
    setFeedback('');

    try {
      const atualizado = await alterarStatusUsuario(token, usuario.id, novoStatus);
      setUsuarios((current) =>
        current.map((item) => (item.id === atualizado.id ? atualizado : item)),
      );
      setFeedback(`Status de ${atualizado.nome} atualizado para ${atualizado.statusConta}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar status.';
      if (message === 'Sessao expirada. Faca login novamente.') {
        onSessionExpired?.();
        return;
      }
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleExcluirUsuario(usuario) {
    if (!token || usuario.id === currentUserId) {
      return;
    }

    const confirmacao = window.confirm(
      `Excluir permanentemente o usuario "${usuario.nome}" (${usuario.email})?\n\nEsta acao remove a conta vinculada e o historico de transacoes associado.`,
    );
    if (!confirmacao) {
      return;
    }

    setDeletingId(usuario.id);
    setError('');
    setFeedback('');

    try {
      const response = await excluirUsuario(token, usuario.id);
      setUsuarios((current) => current.filter((item) => item.id !== usuario.id));
      setMeta((current) => ({
        ...current,
        total: Math.max(0, (current.total ?? 1) - 1),
      }));
      setFeedback(response.mensagem || 'Usuario excluido com sucesso.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir usuario.';
      if (message === 'Sessao expirada. Faca login novamente.') {
        onSessionExpired?.();
        return;
      }
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil((meta.total ?? 0) / (meta.limit || PAGE_LIMIT)));

  return (
    <section className="usr-page">
      <header className="usr-page__header">
        <div>
          <h2>Gestão de Usuários</h2>
          <p>Visualize, busque e gerencie o status dos usuários cadastrados.</p>
        </div>
        <span className="usr-page__total">{meta.total ?? 0} usuário(s)</span>
      </header>

      <div className="usr-toolbar">
        <form className="usr-filters" onSubmit={handleBuscaSubmit}>
          <div className="usr-field usr-field--search">
            <label htmlFor="usr-busca">Buscar</label>
            <input
              id="usr-busca"
              type="text"
              className="usr-filters__search"
              placeholder="Nome, e-mail ou CPF"
              value={buscaInput}
              onChange={(event) => setBuscaInput(event.target.value)}
            />
          </div>

          <div className="usr-field">
            <label htmlFor="usr-tipo">Perfil</label>
            <select
              id="usr-tipo"
              className="usr-filters__select"
              value={filtros.tipo}
              onChange={(event) => handleFiltroChange('tipo', event.target.value)}
            >
              <option value="">Todos</option>
              {TIPO_OPTIONS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="usr-field">
            <label htmlFor="usr-status">Status</label>
            <select
              id="usr-status"
              className="usr-filters__select"
              value={filtros.statusConta}
              onChange={(event) => handleFiltroChange('statusConta', event.target.value)}
            >
              <option value="">Todos</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="usr-filters__actions">
            <button type="submit" className="usr-filters__btn">
              Buscar
            </button>
            <button
              type="button"
              className="usr-filters__btn usr-filters__btn--ghost"
              onClick={limparFiltros}
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      {(error || feedback) && (
        <div className="usr-alerts">
          {error && (
            <div className="usr-feedback usr-feedback--error" role="alert">
              {error}
            </div>
          )}
          {feedback && (
            <div className="usr-feedback usr-feedback--success" role="status">
              {feedback}
            </div>
          )}
        </div>
      )}

      <div className="usr-panel">
        <div className="usr-table-wrapper">
          <table className="usr-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>CPF</th>
                <th>Perfil</th>
                <th>Conta</th>
                <th>Status</th>
                <th className="usr-table__actions-col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="usr-table__empty">
                    Carregando usuários...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="usr-table__empty">
                    Nenhum usuário encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <div className="usr-user-cell">
                        <strong>{usuario.nome}</strong>
                        <span>{usuario.email}</span>
                      </div>
                    </td>
                    <td className="usr-table__mono">{usuario.cpf}</td>
                    <td>
                      <span className={`usr-tipo usr-tipo--${usuario.tipo?.toLowerCase()}`}>
                        {usuario.tipo}
                      </span>
                    </td>
                    <td>
                      {usuario.conta ? (
                        <div className="usr-account-cell">
                          <span className="usr-table__mono">{usuario.conta.numero}</span>
                          <span>{formatCurrency(usuario.conta.saldo)}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <div className="usr-status-cell">
                        <span className={statusClassName(usuario.statusConta)}>
                          {usuario.statusConta}
                        </span>
                        <select
                          className="usr-status-select"
                          value={usuario.statusConta}
                          disabled={updatingId === usuario.id || deletingId === usuario.id}
                          onChange={(event) => handleAlterarStatus(usuario, event.target.value)}
                          aria-label={`Alterar status de ${usuario.nome}`}
                        >
                          {!STATUS_OPTIONS.includes(usuario.statusConta) && (
                            <option value={usuario.statusConta}>{usuario.statusConta}</option>
                          )}
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="usr-table__actions-col">
                      <button
                        type="button"
                        className="usr-delete-btn"
                        disabled={
                          usuario.id === currentUserId ||
                          deletingId === usuario.id ||
                          updatingId === usuario.id
                        }
                        title={
                          usuario.id === currentUserId
                            ? 'Voce nao pode excluir o proprio usuario'
                            : 'Excluir usuario'
                        }
                        onClick={() => handleExcluirUsuario(usuario)}
                      >
                        {deletingId === usuario.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="usr-pagination">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Anterior
          </button>
          <span>
            Página {meta.page ?? page} de {totalPages}
          </span>
          <button
            type="button"
            disabled={loading || (meta.page ?? page) >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Próxima
          </button>
        </footer>
      </div>
    </section>
  );
}
