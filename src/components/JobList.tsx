import type { Vaga } from '../types'
import { JobCard } from './JobCard'

interface JobListProps {
  vagas: Vaga[]
  onToggleVista: (id: number, novoStatus: boolean) => void
  onAbrirVaga: (vaga: Vaga) => void
  onLimparFiltros?: () => void
}

export function JobList({ vagas, onToggleVista, onAbrirVaga, onLimparFiltros }: JobListProps) {
  if (vagas.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Nenhuma vaga com esses filtros</p>
        <p className="empty-state-desc">
          Tente alterar o termo de busca ou limpar os filtros aplicados para ver mais resultados.
        </p>
        {onLimparFiltros && (
          <button
            type="button"
            onClick={onLimparFiltros}
            className="btn btn--outline"
            style={{ marginTop: '16px' }}
          >
            Limpar todos os filtros
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="job-list-grid">
      {vagas.map(vaga => (
        <JobCard
          key={vaga.id}
          vaga={vaga}
          onToggleVista={onToggleVista}
          onAbrirVaga={onAbrirVaga}
        />
      ))}
    </div>
  )
}
