export interface Vaga {
  id: number
  titulo: string
  empresa: string
  cidade: string
  estado: string
  url: string
  nivel: string
  data_publicacao: string
  data_salvo: string
  vista: boolean
  areas: string[]
}

export type AbaStatus = 'todas' | 'nao_vistas' | 'vistas'

export interface FiltrosState {
  busca: string
  area: string
  nivel: string
  estado: string
  status: AbaStatus
}
