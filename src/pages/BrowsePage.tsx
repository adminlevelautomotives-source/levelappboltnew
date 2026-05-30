import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const categories = [
  {
    id: 1, emoji: '🚗', name: 'Cars', subtitle: 'All cars, SUVs, EVs',
    borderColor: '#3b82f6', bg: '#1a2d4a', path: '/search?cat=Cars',
  },
  {
    id: 2, emoji: '🏍️', name: 'Two/Three Wheelers', subtitle: 'Bikes, Scooters, Autos',
    borderColor: '#f59e0b', bg: '#2d1e0a', path: '/search?cat=2-3 Wheelers',
  },
  {
    id: 3, emoji: '🚛', name: 'Heavy Vehicles', subtitle: 'Trucks, Buses, Tractors',
    borderColor: '#ef4444', bg: '#2d0f0f', path: '/search?cat=Heavy Vehicles',
  },
  {
    id: 4, emoji: '🔍', name: 'Vehicle Inspectors', subtitle: 'Verified professionals',
    borderColor: '#a855f7', bg: '#1e0f2d', path: '/inspectors',
  },
  {
    id: 5, emoji: '🔧', name: 'Spare Parts', subtitle: 'Dealers & used parts',
    borderColor: '#FF6B35', bg: '#2d1600', path: '/spare-parts',
  },
  {
    id: 6, emoji: '🎨', name: 'Accessories', subtitle: 'Fittings & Installers',
    borderColor: '#ec4899', bg: '#2d0f1e', path: '/search?cat=Accessories',
  },
  {
    id: 7, emoji: '🏪', name: 'Garages', subtitle: 'Near your location',
    borderColor: '#10b981', bg: '#0a2d1e', path: '/garages',
  },
  {
    id: 8, emoji: '🛡️', name: 'Insurance & Docs', subtitle: 'Insurance, RC, Challan',
    borderColor: '#0ea5e9', bg: '#0a1e2d', path: '/insurance',
  },
]

export default function BrowsePage() {
  const navigate = useNavigate()

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Browse Categories" showBack={false} />

      <div className="px-4 py-4">
        <p className="text-[#7A8BA8] text-sm mb-4">What are you looking for?</p>

        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.path)}
              className="text-left rounded-2xl p-4 active:scale-[0.97] transition-transform border-l-4 relative overflow-hidden"
              style={{
                backgroundColor: cat.bg,
                borderLeftColor: cat.borderColor,
                border: `1px solid #1E2D47`,
                borderLeft: `4px solid ${cat.borderColor}`,
              }}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="text-[#E8EDF5] font-bold text-sm leading-tight">{cat.name}</div>
              <div className="text-[#7A8BA8] text-[11px] mt-0.5">{cat.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-5 bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
          <h3 className="text-[#E8EDF5] font-semibold text-sm mb-3">Market Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Active Listings', value: '1,240+', color: '#00E5FF' },
              { label: 'Verified Sellers', value: '380+', color: '#10b981' },
              { label: 'Districts', value: '14', color: '#FF6B35' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-black text-lg" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[#7A8BA8] text-[10px] leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
