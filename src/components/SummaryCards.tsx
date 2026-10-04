import type { Vaga, AbaStatus } from '../types'

interface SummaryCardsProps {
  vagas: Vaga[]
  statusAtivo: AbaStatus
  onSelecionarStatus: (status: AbaStatus) => void
}

export function SummaryCards({ vagas, statusAtivo, onSelecionarStatus }: SummaryCardsProps) {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  const hojePrefixo = `${ano}-${mes}-${dia}`

  const total = vagas.length
  const naoVistas = vagas.filter(v => !v.vista).length
  const vistas = vagas.filter(v => v.vista).length
  const novasHoje = vagas.filter(v => v.data_salvo && v.data_salvo.startsWith(hojePrefixo)).length

  return (
    <div className="summary-grid">
      <div
        className={`summary-card ${statusAtivo === 'todas' ? 'summary-card--active' : ''}`}
        onClick={() => onSelecionarStatus('todas')}
      >
        <div className="summary-label">Total de Vagas</div>
        <div className="summary-value summary-value--total">{total}</div>
        <div className="summary-hint">Todas as vagas salvas</div>
      </div>

      <div
        className={`summary-card ${statusAtivo === 'nao_vistas' ? 'summary-card--active' : ''}`}
        onClick={() => onSelecionarStatus('nao_vistas')}
      >
        <div className="summary-label">Não Vistas</div>
        <div className="summary-value summary-value--nao-vistas">{naoVistas}</div>
        <div className="summary-hint">Pendentes de visualizacao</div>
      </div>

      <div
        className={`summary-card ${statusAtivo === 'vistas' ? 'summary-card--active' : ''}`}
        onClick={() => onSelecionarStatus('vistas')}
      >
        <div className="summary-label">Vistas</div>
        <div className="summary-value summary-value--vistas">{vistas}</div>
        <div className="summary-hint">Já revisadas</div>
      </div>

      <div className="summary-card">
        <div className="summary-label">Novas Hoje</div>
        <div className="summary-value summary-value--novas">{novasHoje}</div>
        <div className="summary-hint">Adicionadas hoje</div>
      </div>
    </div>
  )
}
