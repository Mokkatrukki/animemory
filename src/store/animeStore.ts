import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const testData: HistoryItem[] = [
    {
      series: {
        title: "Demon Slayer",
        url: "https://www.crunchyroll.com/demon-slayer"
      },
      episode: {
        fullTitle: "S1 E1 - Cruelty",
        season: 1,
        number: 1,
        name: "Cruelty",
        url: "https://www.crunchyroll.com/demon-slayer/episode-1",
        watchStatus: "watched"
      },
      metadata: {
        date: "2024-03-15",
        index: 0
      }
    },
    {
      series: {
        title: "Demon Slayer",
        url: "https://www.crunchyroll.com/demon-slayer"
      },
      episode: {
        fullTitle: "S1 E2 - Trainer Sakonji Urokodaki",
        season: 1,
        number: 2,
        name: "Trainer Sakonji Urokodaki",
        url: "https://www.crunchyroll.com/demon-slayer/episode-2",
        watchStatus: "partial"
      },
      metadata: {
        date: "2024-03-15",
        index: 1
      }
    },
    {
      series: {
        title: "Jujutsu Kaisen",
        url: "https://www.crunchyroll.com/jujutsu-kaisen"
      },
      episode: {
        fullTitle: "S1 E1 - Ryomen Sukuna",
        season: 1,
        number: 1,
        name: "Ryomen Sukuna",
        url: "https://www.crunchyroll.com/jujutsu-kaisen/episode-1",
        watchStatus: "watched"
      },
      metadata: {
        date: "2024-03-15",
        index: 2
      }
    },
    {
      series: {
        title: "Jujutsu Kaisen",
        url: "https://www.crunchyroll.com/jujutsu-kaisen"
      },
      episode: {
        fullTitle: "S2 E1 - Hidden Inventory",
        season: 2,
        number: 1,
        name: "Hidden Inventory",
        url: "https://www.crunchyroll.com/jujutsu-kaisen/episode-1-s2",
        watchStatus: "unwatched"
      },
      metadata: {
        date: "2024-03-15",
        index: 3
      }
    }
  ]

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
  loadTestData: () => void 
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

        loadTestData: () => set({
            history: testData,
            lastUpdated: new Date().toISOString(),
            totalNewItemsInSession: testData.length
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