import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import StarIcon from '@mui/icons-material/Star'
import VerifiedIcon from '@mui/icons-material/Verified'
import { mockInspectors } from '../data/mockData'
import WhatsAppButton from '../components/WhatsAppButton'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

const areas = ['All', 'Kasaragod', 'Kanhangad', 'Bekal', 'Manjeshwar']

export default function InspectorsPage() {
  const navigate = useNavigate()
  const [selectedArea, setSelectedArea] = useState('All')

  const filtered = selectedArea === 'All'
    ? mockInspectors
    : mockInspectors.filter(i => i.area.toLowerCase().includes(selectedArea.toLowerCase()))

  return (
    <div className="pb-safe page-enter">
      <PageHeader
        title="Vehicle Inspectors"
        showBack
        rightElement={
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/inspectors/apply')}
            sx={{ borderColor: '#00E5FF', color: '#00E5FF', borderRadius: '10px', fontSize: '0.7rem', px: 1.5 }}
          >
            Apply as Inspector →
          </Button>
        }
      />

      {/* Banner */}
      <div className="mx-4 mt-4 mb-4 bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #0D1B2E, #0A2D20)' }}>
        <div className="text-2xl mb-1">🔍</div>
        <p className="text-[#E8EDF5] font-bold text-sm">Get your vehicle inspected</p>
        <p className="text-[#7A8BA8] text-xs mt-0.5">before buying. Save thousands!</p>
      </div>

      {/* Area filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 mb-4 pb-1">
        {areas.map(area => (
          <Chip
            key={area}
            label={area}
            onClick={() => setSelectedArea(area)}
            sx={{
              bgcolor: selectedArea === area ? '#00E5FF22' : '#111D35',
              color: selectedArea === area ? '#00E5FF' : '#7A8BA8',
              border: '1px solid',
              borderColor: selectedArea === area ? '#00E5FF44' : '#1E2D47',
              fontWeight: 600, fontSize: '0.7rem',
            }}
          />
        ))}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState emoji="🔍" title="No inspectors in this area" subtitle="Try another area or check back later" />
        ) : (
          filtered.map(inspector => (
            <div
              key={inspector.id}
              className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/inspectors/${inspector.id}`)}
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar sx={{ width: 48, height: 48, bgcolor: '#00E5FF22', color: '#00E5FF', fontWeight: 700, border: '2px solid #1E2D47' }}>
                  {inspector.name[0]}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E8EDF5] font-bold text-sm">{inspector.name}</span>
                    {inspector.verified && <VerifiedIcon sx={{ color: '#00E5FF', fontSize: 16 }} />}
                  </div>
                  <div className="text-[#7A8BA8] text-xs mt-0.5">📍 {inspector.area}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-0.5">
                      <StarIcon sx={{ color: '#f59e0b', fontSize: 13 }} />
                      <span className="text-[#E8EDF5] text-xs font-bold">{inspector.rating}</span>
                    </div>
                    <span className="text-[#7A8BA8] text-xs">{inspector.experience} yrs experience</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {inspector.services.map(s => (
                  <Chip
                    key={s} label={s} size="small"
                    sx={{ bgcolor: '#111D35', color: '#7A8BA8', border: '1px solid #1E2D47', fontSize: '0.65rem' }}
                  />
                ))}
              </div>

              <div onClick={e => e.stopPropagation()}>
                <WhatsAppButton phone={inspector.phone} size="small" label="Chat on WhatsApp" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
