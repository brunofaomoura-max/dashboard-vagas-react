import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts'
import type { Vaga } from '../types'

interface ChartsProps {
  vagas: Vaga[]
  areaSelecionada: string
  onSelecionarArea: (area: string) => void
}

export function Charts({ vagas, areaSelecionada, onSelecionarArea }: ChartsProps) {
  // 1. Vagas por Categoria (uma vaga com mais de uma area conta em cada uma delas)
  const contagemAreas: Record<string, number> = {}
  vagas.forEach(vaga => {
    const areas = vaga.areas && vaga.areas.length > 0 ? vaga.areas : ['Outras']
    areas.forEach(area => {
      contagemAreas[area] = (contagemAreas[area] || 0) + 1
    })
  })

  const dadosAreas = Object.entries(contagemAreas)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)

  // 2. Vagas por Nivel
  const contagemNiveis: Record<string, number> = {}
  vagas.forEach(vaga => {
    const nivel = vaga.nivel || 'Nao identificado'
    contagemNiveis[nivel] = (contagemNiveis[nivel] || 0) + 1
  })

  const dadosNiveis = Object.entries(contagemNiveis)
    .map(([nivel, total]) => ({ nivel, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 7)

  // 3. Vagas por Estado (Top 8)
  const contagemEstados: Record<string, number> = {}
  vagas.forEach(vaga => {
    const estado = (vaga.estado && vaga.estado.trim()) ? vaga.estado.toUpperCase() : 'N/I'
    contagemEstados[estado] = (contagemEstados[estado] || 0) + 1
  })

  const dadosEstados = Object.entries(contagemEstados)
    .map(([estado, total]) => ({ estado, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  const handleBarAreaClick = (entry: { nome: string }) => {
    if (!entry || !entry.nome) return
    if (areaSelecionada === entry.nome) {
      onSelecionarArea('')
    } else {
      onSelecionarArea(entry.nome)
    }
  }

  return (
    <section className="charts-section">
      {/* Grafico de Categorias */}
      <div className="chart-card chart-card--wide">
        <div className="chart-header">
          <h2 className="chart-title">Vagas por Categoria</h2>
          <span className="chart-subtitle">
            {areaSelecionada ? `Filtrando por: ${areaSelecionada} (clique para limpar)` : 'Clique em uma barra para filtrar'}
          </span>
        </div>
        <div className="chart-container">
          {dadosAreas.length === 0 ? (
            <div className="chart-empty">Sem dados de categorias</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={dadosAreas}
                margin={{ top: 10, right: 10, left: -20, bottom: 65 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="nome"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #7c3aed',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                  formatter={(value: any) => [`${value} vaga(s)`, 'Total']}
                />
                <Bar
                  dataKey="total"
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={(_data: any, index: number) => {
                    if (dadosAreas[index]) {
                      handleBarAreaClick(dadosAreas[index])
                    }
                  }}
                >
                  {dadosAreas.map((entry) => (
                    <Cell
                      key={entry.nome}
                      fill={entry.nome === areaSelecionada ? '#00d4ff' : '#7c3aed'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="charts-row">
        {/* Grafico por Nivel */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Vagas por Nível</h2>
            <span className="chart-subtitle">Distribuicao por senioridade</span>
          </div>
          <div className="chart-container">
            {dadosNiveis.length === 0 ? (
              <div className="chart-empty">Sem dados de nivel</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={dadosNiveis}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="nivel"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #06b6d4',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value: any) => [`${value} vaga(s)`, 'Total']}
                  />
                  <Bar dataKey="total" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Grafico por Estado */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Top 8 Estados</h2>
            <span className="chart-subtitle">Concentracao geografica</span>
          </div>
          <div className="chart-container">
            {dadosEstados.length === 0 ? (
              <div className="chart-empty">Sem dados de estados</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={dadosEstados}
                  margin={{ top: 10, right: 10, left: -20, bottom: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="estado" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(value: any) => [`${value} vaga(s)`, 'Total']}
                  />
                  <Bar dataKey="total" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
