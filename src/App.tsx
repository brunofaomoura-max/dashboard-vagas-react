import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Vaga, FiltrosState, AbaStatus } from './types'
import { Header } from './components/Header'
import { SummaryCards } from './components/SummaryCards'
import { Charts } from './components/Charts'
import { FilterBar } from './components/FilterBar'
import { JobList } from './components/JobList'
import './App.css'

const FILTROS_INICIAIS: FiltrosState = {
  busca: '',
  area: '',
  nivel: '',
  estado: '',
  status: 'todas'
}

export function App() {
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [areasDaApi, setAreasDaApi] = useState<string[]>([])
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIAIS)
  const [loading, setLoading] = useState(true)
  const [buscandoGupy, setBuscandoGupy] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagemToast, setMensagemToast] = useState<{ texto: string; erro: boolean } | null>(null)

  // Carrega as vagas e a lista de areas
  const carregarDados = useCallback(() => {
    Promise.all([
      fetch('/api/vagas').then(res => {
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
        return res.json()
      }),
      fetch('/api/areas').then(res => (res.ok ? res.json() : [])).catch(() => [])
    ])
      .then(([dadosVagas, dadosAreas]) => {
        setVagas(dadosVagas)
        if (Array.isArray(dadosAreas) && dadosAreas.length > 0) {
          setAreasDaApi(dadosAreas)
        }
        setLoading(false)
      })
      .catch(() => {
        setErro('Nao foi possivel conectar com a API. Verifique se o servidor esta em execucao.')
        setLoading(false)
      })
  }, [])

  const recarregar = () => {
    setLoading(true)
    setErro('')
    carregarDados()
  }

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  // Temporizador para esconder mensagens flutuantes
  useEffect(() => {
    if (!mensagemToast) return
    const timer = setTimeout(() => {
      setMensagemToast(null)
    }, 4500)
    return () => clearTimeout(timer)
  }, [mensagemToast])

  // Dispara busca na Gupy (geral ou por termo especifico)
  const executarBuscaGupy = useCallback(async (termo?: string) => {
    setBuscandoGupy(true)
    try {
      const corpo = termo ? { termo } : {}
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
      })

      if (!res.ok) {
        throw new Error(`Status ${res.status}`)
      }

      const dados = await res.json()
      carregarDados()

      const totalNovas = dados.novas || 0
      const totalMineradas = dados.total_mineradas || 0

      if (termo) {
        setMensagemToast({
          texto: `Busca ao vivo para "${termo}": ${totalMineradas} vaga(s) analisada(s), ${totalNovas} nova(s) adicionada(s).`,
          erro: false
        })
      } else {
        setMensagemToast({
          texto: `Sincronizacao em tempo real concluida! ${totalMineradas} vagas analisadas na Gupy (${totalNovas} novas adicionadas).`,
          erro: false
        })
      }
    } catch {
      setMensagemToast({
        texto: 'Falha ao consultar a API da Gupy. Verifique sua conexao.',
        erro: true
      })
    } finally {
      setBuscandoGupy(false)
    }
  }, [carregarDados])

  // Abre link usando pywebview ou navegador externo
  const abrirLink = useCallback((url: string) => {
    const pywebview = (window as unknown as { pywebview?: { api?: { abrir_link?: (u: string) => void } } }).pywebview
    if (pywebview?.api?.abrir_link) {
      pywebview.api.abrir_link(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  // Atualizacao otimista do status da vaga
  const handleToggleVista = useCallback(async (id: number, novoStatus: boolean) => {
    setVagas(prev => prev.map(v => (v.id === id ? { ...v, vista: novoStatus } : v)))

    try {
      const res = await fetch(`/api/vagas/${id}/vista`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vista: novoStatus })
      })

      if (!res.ok) {
        throw new Error(`Status ${res.status}`)
      }
    } catch {
      setVagas(prev => prev.map(v => (v.id === id ? { ...v, vista: !novoStatus } : v)))
      setMensagemToast({
        texto: 'Nao foi possivel salvar o status da vaga. Alteracao desfeita.',
        erro: true
      })
    }
  }, [])

  const handleAbrirVaga = useCallback((vaga: Vaga) => {
    abrirLink(vaga.url)
    if (!vaga.vista) {
      handleToggleVista(vaga.id, true)
    }
  }, [abrirLink, handleToggleVista])

  const handleChangeFiltro = <K extends keyof FiltrosState>(campo: K, valor: FiltrosState[K]) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleLimparFiltros = () => {
    setFiltros(FILTROS_INICIAIS)
  }

  // Lista dinamica de areas, niveis e estados disponiveis
  const areasDisponiveis = useMemo(() => {
    const conjunto = new Set<string>(areasDaApi)
    vagas.forEach(v => {
      if (v.areas) {
        v.areas.forEach(a => conjunto.add(a))
      }
    })
    return Array.from(conjunto)
  }, [areasDaApi, vagas])

  const niveisDisponiveis = useMemo(() => {
    const conjunto = new Set<string>()
    vagas.forEach(v => {
      if (v.nivel) conjunto.add(v.nivel)
    })
    return Array.from(conjunto).sort()
  }, [vagas])

  const estadosDisponiveis = useMemo(() => {
    const conjunto = new Set<string>()
    vagas.forEach(v => {
      if (v.estado && v.estado.trim()) {
        conjunto.add(v.estado.trim().toUpperCase())
      }
    })
    return Array.from(conjunto).sort()
  }, [vagas])

  // Filtragem de vagas
  const vagasFiltradas = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()

    return vagas.filter(vaga => {
      // Filtro por texto (titulo ou empresa)
      if (termo) {
        const tituloMatch = vaga.titulo?.toLowerCase().includes(termo)
        const empresaMatch = vaga.empresa?.toLowerCase().includes(termo)
        if (!tituloMatch && !empresaMatch) return false
      }

      // Filtro por categoria
      if (filtros.area) {
        const areasVaga = vaga.areas || []
        if (!areasVaga.includes(filtros.area)) return false
      }

      // Filtro por nivel
      if (filtros.nivel && vaga.nivel !== filtros.nivel) {
        return false
      }

      // Filtro por estado
      if (filtros.estado) {
        const estadoVaga = vaga.estado ? vaga.estado.trim().toUpperCase() : ''
        if (estadoVaga !== filtros.estado) return false
      }

      // Filtro por status (Todas, Nao Vistas, Vistas)
      if (filtros.status === 'nao_vistas' && vaga.vista) return false
      if (filtros.status === 'vistas' && !vaga.vista) return false

      return true
    })
  }, [vagas, filtros])

  if (loading) {
    return (
      <div className="status-screen">
        <h2 className="status-screen-title status-screen-title--loading">Carregando dados...</h2>
        <p className="status-screen-desc">Buscando vagas e metricas disponiveis no banco local.</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="status-screen">
        <h2 className="status-screen-title status-screen-title--error">Falha na Conexao</h2>
        <p className="status-screen-desc">{erro}</p>
        <button type="button" onClick={recarregar} className="btn btn--primary" style={{ maxWidth: '200px' }}>
          Tentar de novo
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      {mensagemToast && (
        <div className={`toast-notification ${mensagemToast.erro ? 'toast-notification--error' : ''}`}>
          <span>{mensagemToast.texto}</span>
        </div>
      )}

      <Header
        totalVagas={vagas.length}
        buscando={buscandoGupy}
        onBuscarGupy={() => executarBuscaGupy()}
      />

      <SummaryCards
        vagas={vagas}
        statusAtivo={filtros.status}
        onSelecionarStatus={(status: AbaStatus) => handleChangeFiltro('status', status)}
      />

      <Charts
        vagas={vagasFiltradas}
        areaSelecionada={filtros.area}
        onSelecionarArea={(area: string) => handleChangeFiltro('area', area)}
      />

      <FilterBar
        filtros={filtros}
        onChangeFiltro={handleChangeFiltro}
        onLimparFiltros={handleLimparFiltros}
        onBuscarGupyTermo={(termo: string) => executarBuscaGupy(termo)}
        buscando={buscandoGupy}
        areasDisponiveis={areasDisponiveis}
        niveisDisponiveis={niveisDisponiveis}
        estadosDisponiveis={estadosDisponiveis}
        totalFiltradas={vagasFiltradas.length}
      />

      <JobList
        vagas={vagasFiltradas}
        onToggleVista={handleToggleVista}
        onAbrirVaga={handleAbrirVaga}
        onLimparFiltros={handleLimparFiltros}
      />
    </div>
  )
}

export default App