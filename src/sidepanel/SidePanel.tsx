import { useAnimeStore } from '../store/animeStore'
import HistoryViewer from '../components/HistoryViewer'

const SidePanel = () => {
  const { 
    history, 
    isScanning, 
    totalNewItemsInSession, 
    lastUpdated,
    startScanning,
    stopScanning,
    resetHistory 
  } = useAnimeStore()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-crunchyroll p-4 shadow-lg">
        <h1 className="text-xl font-bold">Animemory</h1>
      </div>

      {/* Control Panel */}
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={startScanning}
            className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold"
            disabled={isScanning}
          >
            Start Scanning
          </button>
          <button
            onClick={stopScanning}
            className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold"
            disabled={!isScanning}
          >
            Stop Scanning
          </button>
        </div>

        {/* Status */}
        <div className="text-sm text-gray-300 text-center">
          {isScanning ? (
            <div>
              <span className="text-green-400 animate-pulse">●</span>
              {' Scanning... '}
              Found {history.length} episodes
              {totalNewItemsInSession > 0 && ` (${totalNewItemsInSession} new)`}
            </div>
          ) : (
            <div>Ready to scan</div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-slate-800 p-3 rounded flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Watched</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-600 rounded"></div>
            <span>Not Watched</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {history.length === 0 ? (
          <p className="text-center text-gray-400">
            No history data available. Visit Crunchyroll history page to collect data.
          </p>
        ) : (
          <div className="space-y-4">
            {/* We'll add history display component here later */}
            <p className="text-center text-gray-400">
              Found {history.length} episodes in history
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {history.length === 0 ? (
          <p className="text-center text-gray-400">
            No history data available. Visit Crunchyroll history page to collect data.
          </p>
        ) : (
          <HistoryViewer />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-center text-sm text-gray-400">
          {lastUpdated && `Last updated: ${new Date(lastUpdated).toLocaleString()}`}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset your collected history? This cannot be undone.')) {
                resetHistory()
              }
            }}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Reset History
          </button>
        </div>
      </div>
    </div>
  )
}

export default SidePanel