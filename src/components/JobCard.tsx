import type { Vaga } from '../types'

interface JobCardProps {
  vaga: Vaga
  onToggleVista: (id: number, novoStatus: boolean) => void
  onAbrirVaga: (vaga: Vaga) => void
}

export function JobCard({ vaga, onToggleVista, onAbrirVaga }: JobCardProps) {
  const localizacao = [vaga.cidade, vaga.estado].filter(Boolean).join(' - ') || 'Localizacao nao informada'

  // Formatacao da data de publicacao
  let dataFormatada = 'Data nao informada'
  if (vaga.data_publicacao) {
    const apenasData = vaga.data_publicacao.split('T')[0]
    const partes = apenasData.split('-')
    if (partes.length === 3) {
      dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`
    } else {
      dataFormatada = apenasData
    }
  }

  const areas = vaga.areas && vaga.areas.length > 0 ? vaga.areas : ['Outras']

  return (
    <article className={`job-card ${vaga.vista ? 'job-card--vista' : ''}`}>
      <div className="job-card-header">
        <div className="job-card-main-info">
          <div className="job-card-tags">
            {vaga.vista && <span className="badge badge--vista">Vista</span>}
            <span className="badge badge--nivel">{vaga.nivel || 'Nivel nao informado'}</span>
            {areas.map(area => (
              <span key={area} className="badge badge--area">
                {area}
              </span>
            ))}
          </div>
          <h3 className="job-card-title">{vaga.titulo}</h3>
        </div>
      </div>

      <div className="job-card-details">
        <div className="job-card-detail-item">
          <span className="detail-label">Empresa:</span>
          <span className="detail-value">{vaga.empresa || 'Nao informada'}</span>
        </div>
        <div className="job-card-detail-item">
          <span className="detail-label">Local:</span>
          <span className="detail-value">{localizacao}</span>
        </div>
        <div className="job-card-detail-item">
          <span className="detail-label">Publicada em:</span>
          <span className="detail-value">{dataFormatada}</span>
        </div>
      </div>

      <div className="job-card-actions">
        <button
          type="button"
          onClick={() => onAbrirVaga(vaga)}
          className="btn btn--primary"
        >
          Abrir vaga
        </button>

        <button
          type="button"
          onClick={() => onToggleVista(vaga.id, !vaga.vista)}
          className={`btn ${vaga.vista ? 'btn--secondary' : 'btn--outline'}`}
        >
          {vaga.vista ? 'Desmarcar' : 'Marcar como vista'}
        </button>
      </div>
    </article>
  )
}
