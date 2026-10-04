interface HeaderProps {
  totalVagas: number
  buscando: boolean
  onBuscarGupy: () => void
}

export function Header({ totalVagas, buscando, onBuscarGupy }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-info">
        <div className="header-title-row">
          <h1 className="header-title">Dashboard de Vagas TI</h1>
          <span className="live-status-pill">
            <span className="live-dot"></span> API Gupy em Tempo Real
          </span>
        </div>
        <p className="header-subtitle">
          Monitoramento e mineracao ativa de oportunidades de TI em todo o Brasil
        </p>
      </div>

      <div className="header-actions">
        <button
          type="button"
          onClick={onBuscarGupy}
          disabled={buscando}
          className={`btn-sync ${buscando ? 'btn-sync--loading' : ''}`}
        >
          {buscando ? 'Minerando vagas na Gupy...' : 'Atualizar Todas as Categorias (Gupy)'}
        </button>

        <div className="header-badge">
          <span className="header-badge-number">{totalVagas}</span>
          <span className="header-badge-label">
            {totalVagas === 1 ? 'vaga monitorada' : 'vagas monitoradas'}
          </span>
        </div>
      </div>
    </header>
  )
}
