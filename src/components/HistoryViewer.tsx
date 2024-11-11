import { useAnimeStore } from '../store/animeStore'

const getEpisodeColor = (watchStatus: string) => {
  switch (watchStatus) {
    case 'watched':
      return 'bg-green-500'
    case 'partial':
      return 'bg-yellow-500'
    case 'unwatched':
    default:
      return 'bg-gray-600'
  }
}

const HistoryViewer = () => {
  const { history } = useAnimeStore()

  // Group episodes by series
  const seriesMap = history.reduce((acc, item) => {
    if (!acc[item.series.title]) {
      acc[item.series.title] = {
        url: item.series.url,
        episodes: [],
        seasons: new Set()
      }
    }
    acc[item.series.title].episodes.push(item.episode)
    acc[item.series.title].seasons.add(item.episode.season)
    return acc
  }, {} as Record<string, { url: string; episodes: typeof history[number]['episode'][]; seasons: Set<number | null> }>)

  return (
    <div className="space-y-6">
      {Object.entries(seriesMap).map(([title, data]) => (
        <div key={title} className="bg-slate-800 rounded-lg p-4">
          {/* Series Title */}
          <a 
            href={data.url}
            target="_blank"
            className="text-lg font-bold text-crunchyroll hover:text-orange-400"
          >
            {title}
          </a>

          {/* Seasons */}
          {Array.from(data.seasons).sort().map(season => {
            const seasonEpisodes = data.episodes
              .filter(ep => ep.season === season)
              .sort((a, b) => (a.number || 0) - (b.number || 0))

            return (
              <div key={`${title}-${season}`} className="mt-3">
                <div className="text-sm text-gray-400 mb-2">
                  Season {season || '1'}
                </div>
                
                {/* Episodes Grid */}
                <div className="grid grid-cols-8 gap-1">
                  {seasonEpisodes.map((episode) => (
                    <a
                      key={episode.url}
                      href={episode.url}
                      target="_blank"
                      className={`
                        ${getEpisodeColor(episode.watchStatus)}
                        aspect-square rounded flex items-center justify-center
                        text-sm hover:scale-110 transition-transform cursor-pointer
                      `}
                      title={`${episode.fullTitle}\n${
                        episode.watchStatus === 'partial' ? '(Partially watched)' :
                        episode.watchStatus === 'watched' ? '(Watched)' :
                        '(Not watched)'
                      }`}
                    >
                      {episode.number}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default HistoryViewer