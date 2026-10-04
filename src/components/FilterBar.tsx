import type { FiltrosState, AbaStatus } from '../types'

interface FilterBarProps {
  filtros: FiltrosState
  onChangeFiltro: <K extends keyof FiltrosState>(campo: K, valor: FiltrosState[K]) => void
  onLimparFiltros: () => void
  onBuscarGupyTermo: (termo: string) => void
  buscando: boolean
  areasDisponiveis: string[]
  niveisDisponiveis: string[]
  estadosDisponiveis: string[]
  totalFiltradas: number
}

export function FilterBar({
  filtros,
  onChangeFiltro,
  onLimparFiltros,
  onBuscarGupyTermo,
  buscando,
  areasDisponiveis,
  niveisDisponiveis,
  estadosDisponiveis,
  totalFiltradas
}: FilterBarProps) {
  const temFiltroAtivo =
    filtros.busca !== '' ||
    filtros.area !== '' ||
    filtros.nivel !== '' ||
    filtros.estado !== '' ||
    filtros.status !== 'todas'

  const handleKeyDownBusca = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filtros.busca.trim()) {
      onBuscarGupyTermo(filtros.busca.trim())
    }
  }

  return (
    <div className="filter-bar">
      {/* Abas de status */}
      <div className="status-tabs">
        <button
          type="button"
          className={`status-tab ${filtros.status === 'todas' ? 'status-tab--active' : ''}`}
          onClick={() => onChangeFiltro('status', 'todas' as AbaStatus)}
        >
          Todas
        </button>
        <button
          type="button"
          className={`status-tab ${filtros.status === 'nao_vistas' ? 'status-tab--active' : ''}`}
          onClick={() => onChangeFiltro('status', 'nao_vistas' as AbaStatus)}
        >
          Não Vistas
        </button>
        <button
          type="button"
          className={`status-tab ${filtros.status === 'vistas' ? 'status-tab--active' : ''}`}
          onClick={() => onChangeFiltro('status', 'vistas' as AbaStatus)}
        >
          Vistas
        </button>
      </div>

      {/* Controles de filtro */}
      <div className="filter-controls">
        <div className="search-box-wrapper">
          <input
            type="text"
            placeholder="Buscar por título, empresa ou tecnologia..."
            value={filtros.busca}
            onChange={(e) => onChangeFiltro('busca', e.target.value)}
            onKeyDown={handleKeyDownBusca}
            className="filter-input filter-input--search"
          />
          {filtros.busca.trim() && (
            <button
              type="button"
              onClick={() => onBuscarGupyTermo(filtros.busca.trim())}
              disabled={buscando}
              className="btn-live-search"
              title="Buscar esse termo diretamente na API da Gupy em tempo real"
            >
              {buscando ? 'Consultando...' : 'Buscar na Gupy (ao vivo)'}
            </button>
          )}
        </div>

        <select
          value={filtros.area}
          onChange={(e) => onChangeFiltro('area', e.target.value)}
          className="filter-select"
        >
          <option value="">Todas as Categorias</option>
          {areasDisponiveis.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        <select
          value={filtros.nivel}
          onChange={(e) => onChangeFiltro('nivel', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos os Níveis</option>
          {niveisDisponiveis.map(nivel => (
            <option key={nivel} value={nivel}>{nivel}</option>
          ))}
        </select>

        <select
          value={filtros.estado}
          onChange={(e) => onChangeFiltro('estado', e.target.value)}
          className="filter-select"
        >
          <option value="">Todos os Estados</option>
          {estadosDisponiveis.map(uf => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>

        {temFiltroAtivo && (
          <button
            type="button"
            onClick={onLimparFiltros}
            className="filter-btn-clear"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="filter-results-info">
        Exibindo {totalFiltradas} {totalFiltradas === 1 ? 'vaga encontrada' : 'vagas encontradas'}
      </div>
    </div>
  )
}
