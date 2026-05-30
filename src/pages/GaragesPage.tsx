import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import StarIcon from '@mui/icons-material/Star'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { mockGarages, type Garage } from '../data/mockData'
import WhatsAppButton from '../components/WhatsAppButton'
import PageHeader from '../components/PageHeader'

function GarageCard({ garage, onClick }: { garage: Garage; onClick: () => void }) {
  return (
    <div
      className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#10b98120] border border-[#10b98130] flex items-center justify-center text-xl shrink-0">
          🏪
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-[#E8EDF5] font-bold text-sm">{garage.name}</h3>
            <div className="flex items-center gap-0.5 bg-[#111D35] border border-[#1E2D47] rounded-lg px-2 py-0.5">
              <StarIcon sx={{ color: '#f59e0b', fontSize: 12 }} />
              <span className="text-[#E8EDF5] text-xs font-bold">{garage.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <LocationOnIcon sx={{ color: '#10b981', fontSize: 12 }} />
            <span className="text-[#7A8BA8] text-xs">{garage.area}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {garage.services.slice(0, 4).map(s => (
          <Chip key={s} label={s} size="small" sx={{ bgcolor: '#10b98115', color: '#10b981', border: '1px solid #10b98130', fontSize: '0.6rem' }} />
        ))}
        {garage.services.length > 4 && (
          <Chip label={`+${garage.services.length - 4}`} size="small" sx={{ bgcolor: '#111D35', color: '#7A8BA8', border: '1px solid #1E2D47', fontSize: '0.6rem' }} />
        )}
      </div>

      {garage.offers.length > 0 && (
        <div className="bg-[#FF6B3510] border border-[#FF6B3530] rounded-xl px-3 py-2 mb-3">
          <span className="text-[#FF6B35] text-xs font-semibold">🎁 {garage.offers[0]}</span>
        </div>
      )}

      <div onClick={e => e.stopPropagation()}>
        <WhatsAppButton phone={garage.phone} size="small" label="Chat on WhatsApp" />
      </div>
    </div>
  )
}

export default function GaragesPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<'list' | 'map'>('list')

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Garages Near Me" showBack />

      <div className="px-4 mt-4">
        {/* Location prompt */}
        <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b98120] flex items-center justify-center">📍</div>
            <div className="flex-1">
              <p className="text-[#E8EDF5] text-sm font-semibold">Allow location access</p>
              <p className="text-[#7A8BA8] text-xs">for nearest garages</p>
            </div>
            <Button size="small" variant="outlined" sx={{ borderColor: '#10b981', color: '#10b981', borderRadius: '10px', fontSize: '0.7rem' }}>
              Allow
            </Button>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-4">
          {(['list', 'map'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                view === v ? 'bg-[#00E5FF22] border-[#00E5FF] text-[#00E5FF]' : 'bg-[#111D35] border-[#1E2D47] text-[#7A8BA8]'
              }`}
            >
              {v === 'list' ? '📋 List View' : '🗺️ Map View'}
            </button>
          ))}
        </div>

        {view === 'map' ? (
          <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl h-48 flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-[#7A8BA8] text-sm">Map view coming soon</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          {mockGarages.map(garage => (
            <GarageCard key={garage.id} garage={garage} onClick={() => navigate(`/garages/${garage.id}`)} />
          ))}
        </div>

        <button
          className="w-full border-2 border-dashed border-[#1E2D47] rounded-2xl p-4 text-center mt-3 active:scale-[0.98] transition-transform"
          onClick={() => navigate('/post')}
        >
          <div className="text-2xl mb-1">🔧</div>
          <div className="text-[#7A8BA8] text-sm font-semibold">Add Your Garage</div>
          <div className="text-[#7A8BA8] text-xs">List your garage on Level Automotives</div>
        </button>
      </div>
    </div>
  )
}
