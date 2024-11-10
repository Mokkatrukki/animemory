import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type WatchStatus = 'watched' | 'partial' | 'unwatched' | 'unknown'

interface Episode {
  fullTitle: string
  season: number | null
  number: number | null
  name: string | null
  url: string
  watchStatus: WatchStatus
}

interface Series {
  title: string
  url: string
}

interface HistoryItem {
  series: Series
  episode: Episode
  metadata: {
    date: string | null
    index: number
  }
}

interface AnimeStore {
  // State
  history: HistoryItem[]
  isScanning: boolean
  totalNewItemsInSession: number
  lastUpdated: string | null

  // Actions
  startScanning: () => void
  stopScanning: () => void
  addHistoryItems: (items: HistoryItem[]) => void
  resetHistory: () => void
}

export const useAnimeStore = create<AnimeStore>()(
    persist(
      (set) => ({
        // Initial state
        history: [],
        isScanning: false,
        totalNewItemsInSession: 0,
        lastUpdated: null,
  
        // Actions
        startScanning: () => set({ isScanning: true, totalNewItemsInSession: 0 }),
        stopScanning: () => set({ isScanning: false }),
        
        addHistoryItems: (newItems) => set((state) => {
          const existingUrls = new Set(state.history.map(item => item.episode.url))
          const uniqueNewItems = newItems.filter(item => !existingUrls.has(item.episode.url))
          
          return {
            history: [...state.history, ...uniqueNewItems],
            totalNewItemsInSession: state.totalNewItemsInSession + uniqueNewItems.length,
            lastUpdated: new Date().toISOString()
          }
        }),
        
        resetHistory: () => set({
          history: [],
          totalNewItemsInSession: 0,
          lastUpdated: null
        })
      }),
      {
        name: 'anime-storage'
      }
    )
  )