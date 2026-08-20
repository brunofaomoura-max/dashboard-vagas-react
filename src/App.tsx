import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './App.css'

interface Vaga {
  id: number
  titulo: string
  empresa: string
  localizacao: string
  salario: number
}

function App() {
  const vagas: Vaga[] = [
    {
      id: 1,
      titulo: "Dev Python",
      empresa: "Exxon",
      localizacao: "São Paulo",
      salario: 5000
    },
    {
      id: 2,
      titulo: "Dev TypeScript",
      empresa: "Microsoft",
      localizacao: "Rio de Janeiro",
      salario: 6000
    },
    {
      id: 3,
      titulo: "RPA Developer",
      empresa: "BRF",
      localizacao: "São Paulo",
      salario: 4500
    }
  ]

  const [filtro, setFiltro] = useState('')
  const [filtroEmpresa, setFiltroEmpresa] = useState('')

  const vagasFiltradas = vagas.filter(vaga => {
    const matchTitulo = vaga.titulo.toLowerCase().includes(filtro.toLowerCase())
    const matchEmpresa = filtroEmpresa === '' || vaga.empresa === filtroEmpresa
    return matchTitulo && matchEmpresa
  })

  const empresas = [...new Set(vagas.map(v => v.empresa))]

  const dadosGrafico = empresas.map(empresa => ({
    empresa,
    vagas: vagasFiltradas.filter(v => v.empresa === empresa).length
  }))

  return (
    <div>
      <h1>Dashboard de Vagas</h1>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por título..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #7c3aed',
            backgroundColor: '#111827',
            color: '#fff',
            fontSize: '0.95rem',
            flex: 1
          }}
        />
        
        <select
          value={filtroEmpresa}
          onChange={(e) => setFiltroEmpresa(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #7c3aed',
            backgroundColor: '#111827',
            color: '#fff',
            fontSize: '0.95rem',
            minWidth: '200px'
          }}
        >
          <option value="">Todas as empresas</option>
          {empresas.map(emp => (
            <option key={emp} value={emp}>{emp}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '50px', backgroundColor: '#111827', padding: '20px', borderRadius: '10px', border: '1px solid #7c3aed' }}>
        <h2 style={{ color: '#00d4ff', marginBottom: '20px' }}>Vagas por Empresa</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="empresa" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #7c3aed', borderRadius: '6px' }}
              labelStyle={{ color: '#00d4ff' }}
            />
            <Bar dataKey="vagas" fill="#7c3aed" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Empresa</th>
            <th>Localização</th>
            <th>Salário</th>
          </tr>
        </thead>
        <tbody>
          {vagasFiltradas.map((vaga) => (
            <tr key={vaga.id}>
              <td>{vaga.id}</td>
              <td>{vaga.titulo}</td>
              <td>{vaga.empresa}</td>
              <td>{vaga.localizacao}</td>
              <td>R$ {vaga.salario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App