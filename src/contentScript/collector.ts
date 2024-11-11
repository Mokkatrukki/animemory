interface HistoryItem {
    series: {
      title: string
      url: string
    }
    episode: {
      fullTitle: string
      season: number | null
      number: number | null
      name: string | null
      url: string
      watchStatus: WatchStatus
    }
    metadata: {
      date: string | null
      index: number
    }
  }
  
  type WatchStatus = 'watched' | 'partial' | 'unwatched' | 'unknown'
  
  export function startCollector() {
    console.log('🟩 Collector: Initializing')
    let isScanning = false
    let scrollTimeout: number | null = null
    let totalNewItemsInSession = 0
  
    function getWatchStatus(card: Element): WatchStatus {
      try {
        const statusElement = card.querySelector(
          '.history-playable-card__thumbnail-wrapper--xOHuX .playable-thumbnail__duration--p-Ldq'
        )
        if (!statusElement) return 'unknown'
  
        const statusText = statusElement.textContent?.trim() || ''
        
        if (statusText === 'Watched') {
          return 'watched'
        }
        
        const minutesMatch = statusText.match(/(\d+)m left/)
        if (minutesMatch) {
          const minutesLeft = parseInt(minutesMatch[1])
          if (minutesLeft <= 5) {
            return 'watched'
          } else if (minutesLeft <= 20) {
            return 'partial'
          }
        }
  
        return 'unwatched'
      } catch (error) {
        console.error('Error getting watch status:', error)
        return 'unknown'
      }
    }
  
    function extractCardData(card: Element, index: number): HistoryItem | null {
      try {
        const seriesLink = card.querySelector<HTMLAnchorElement>('a.history-playable-card__show-link--fe0Xz')
        const episodeLink = card.querySelector<HTMLAnchorElement>('a.history-playable-card__title-link--vSAJy')
        const dateInfo = card.querySelector('.history-playable-card__footer-meta--mE2XC')
  
        if (!seriesLink || !episodeLink) {
          console.warn(`Skipping card ${index} - missing required elements`)
          return null
        }
  
        const episodeTitle = episodeLink.textContent || ''
        const episodeMatch = episodeTitle.match(/S(\d+)\s*E(\d+)\s*-\s*(.*)/)
        
        const historyItem: HistoryItem = {
          series: {
            title: seriesLink.textContent?.trim() || '',
            url: seriesLink.href
          },
          episode: {
            fullTitle: episodeTitle,
            season: episodeMatch ? parseInt(episodeMatch[1]) : null,
            number: episodeMatch ? parseInt(episodeMatch[2]) : null,
            name: episodeMatch ? episodeMatch[3].trim() : null,
            url: episodeLink.href,
            watchStatus: getWatchStatus(card)
          },
          metadata: {
            date: dateInfo?.textContent?.trim() || null,
            index
          }
        }
  
        // Handle episodes without season number
        if (!episodeMatch) {
          const simpleEpisodeMatch = episodeTitle.match(/E(\d+)\s*-\s*(.*)/)
          if (simpleEpisodeMatch) {
            historyItem.episode.season = 1
            historyItem.episode.number = parseInt(simpleEpisodeMatch[1])
            historyItem.episode.name = simpleEpisodeMatch[2].trim()
          }
        }
  
        return historyItem
      } catch (error) {
        console.error(`Error processing card ${index}:`, error)
        return null
      }
    }
  
    async function scanPage() {
        if (!isScanning) {
          console.log('🟩 Collector: Scanning stopped, exiting scan')
          return
        }
    
        try {
          console.log('🟩 Collector: Starting page scan')
          const cards = document.querySelectorAll('.history-playable-card--qVdzv')
          console.log('🟩 Collector: Found cards:', cards.length)
    
          const historyData: HistoryItem[] = []
          cards.forEach((card, index) => {
            console.log('🟩 Collector: Processing card', index + 1, 'of', cards.length)
            const cardData = extractCardData(card, index)
            if (cardData) {
              historyData.push(cardData)
            }
          })
    
          if (historyData.length > 0) {
            console.log('🟩 Collector: Sending data to extension:', historyData.length, 'items')
            chrome.runtime.sendMessage({
              action: "updateHistory",
              data: historyData
            })
          }
    
        } catch (error) {
          console.error('🟩 Collector: Error scanning page:', error)
          stopScanning()
        }
      }
    
  
    function handleScroll() {
      if (!isScanning) return
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(scanPage, 500)
    }
  
    function startScanning() {
        console.log('🟩 Collector: Starting scanning process')
        isScanning = true
        totalNewItemsInSession = 0
        window.addEventListener('scroll', handleScroll)
        scanPage()
      }
    
      function stopScanning() {
        console.log('🟩 Collector: Stopping scanning process')
        isScanning = false
        totalNewItemsInSession = 0
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimeout) clearTimeout(scrollTimeout)
      }
  
    return {
      startScanning,
      stopScanning
    }
  }