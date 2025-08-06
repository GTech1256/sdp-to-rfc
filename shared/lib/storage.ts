import { RFC, RFCData } from '../types/rfc'

export const storageKeys = {
  rfcs: 'rfcs',
  rfc: (id: string) => `rfc_${id}`
} as const

export const storage = {
  getRFCs: (): RFC[] => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(storageKeys.rfcs)
    return saved ? JSON.parse(saved) : []
  },

  saveRFCs: (rfcs: RFC[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(storageKeys.rfcs, JSON.stringify(rfcs))
  },

  getRFCData: (id: string): RFCData | null => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem(storageKeys.rfc(id))
    return saved ? JSON.parse(saved) : null
  },

  saveRFCData: (data: RFCData): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(storageKeys.rfc(data.id), JSON.stringify(data))
  },

  deleteRFC: (id: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(storageKeys.rfc(id))
  }
}
