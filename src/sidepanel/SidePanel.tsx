import './SidePanel.css'

export const SidePanel = () => {
  return (
    <div className="p-4 bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold text-crunchyroll mb-4">
        Animemory
      </h1>
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
        <p className="text-white">
          If you see this styled nicely with:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li className="text-green-400">Orange title</li>
          <li className="text-green-400">Dark background</li>
          <li className="text-green-400">White text</li>
          <li className="text-green-400">Proper padding</li>
        </ul>
        <p className="mt-4 text-crunchyroll">
          Then Tailwind is working! 🎉
        </p>
      </div>
      
      <div className="mt-4 p-4 bg-slate-800 rounded-lg">
        <button 
          className="px-4 py-2 bg-crunchyroll text-white rounded hover:bg-orange-600 transition-colors"
          onClick={() => alert('Button works!')}
        >
          Test Button
        </button>
      </div>
    </div>
  )
}

export default SidePanel
