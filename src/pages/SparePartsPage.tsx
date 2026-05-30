import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import AddIcon from '@mui/icons-material/Add'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import { mockSpareParts, mockSpareDealers } from '../data/mockData'
import WhatsAppButton from '../components/WhatsAppButton'
import PageHeader from '../components/PageHeader'

export default function SparePartsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  return (
    <div className="pb-safe page-enter">
      <PageHeader
        title="Spare Parts"
        showBack
        rightElement={
          <Button
            size="small" variant="contained" startIcon={<AddIcon />}
            onClick={() => navigate('/post')}
            sx={{ bgcolor: '#00E5FF', color: '#050A14', borderRadius: '10px', fontSize: '0.7rem', px: 1.5 }}
          >
            Post Part
          </Button>
        }
      />

      <div className="px-4">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #1E2D47', mb: 3 }}>
          <Tab label="Dealers" />
          <Tab label="Parts for Sale" />
        </Tabs>

        {tab === 0 && (
          <div className="flex flex-col gap-3">
            {mockSpareDealers.map(dealer => (
              <div key={dealer.id} className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[#E8EDF5] font-bold text-sm">{dealer.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <LocationOnIcon sx={{ color: '#FF6B35', fontSize: 13 }} />
                      <span className="text-[#7A8BA8] text-xs">{dealer.area}</span>
                    </div>
                  </div>
                  <Button
                    size="small" variant="outlined" startIcon={<PhoneIcon sx={{ fontSize: 14 }} />}
                    component="a" href={`tel:+91${dealer.phone}`}
                    sx={{ borderColor: '#1E2D47', color: '#7A8BA8', borderRadius: '10px', fontSize: '0.65rem', minWidth: 0, px: 1.5 }}
                  >
                    Call
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {dealer.specializations.map(s => (
                    <Chip key={s} label={s} size="small" sx={{ bgcolor: '#FF6B3515', color: '#FF6B35', border: '1px solid #FF6B3530', fontSize: '0.65rem' }} />
                  ))}
                </div>
                <WhatsAppButton phone={dealer.phone} size="small" label="Chat on WhatsApp" message={`Hi, I'm looking for spare parts at ${dealer.name}`} />
              </div>
            ))}

            <button
              onClick={() => navigate('/post')}
              className="border-2 border-dashed border-[#1E2D47] rounded-2xl p-4 text-center active:scale-[0.98] transition-transform"
            >
              <div className="text-2xl mb-1">🏪</div>
              <div className="text-[#7A8BA8] text-sm font-semibold">Add Your Shop</div>
              <div className="text-[#7A8BA8] text-xs">List your spare parts business here</div>
            </button>
          </div>
        )}

        {tab === 1 && (
          <div className="flex flex-col gap-3">
            {mockSpareParts.map(part => (
              <div key={part.id} className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-[#111D35] border border-[#1E2D47] flex items-center justify-center text-2xl shrink-0">
                    {part.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#E8EDF5] font-semibold text-sm leading-tight mb-1">{part.title}</h3>
                    <div className="text-[#00E5FF] font-bold text-base mb-1">₹{part.price.toLocaleString('en-IN')}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip
                        label={part.condition}
                        size="small"
                        sx={{
                          bgcolor: part.condition === 'New' ? '#10b98120' : '#f59e0b20',
                          color: part.condition === 'New' ? '#10b981' : '#f59e0b',
                          border: '1px solid',
                          borderColor: part.condition === 'New' ? '#10b98130' : '#f59e0b30',
                          fontSize: '0.6rem',
                        }}
                      />
                      <span className="text-[#7A8BA8] text-xs">{part.compatibleWith}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <LocationOnIcon sx={{ color: '#FF6B35', fontSize: 12 }} />
                      <span className="text-[#7A8BA8] text-xs">{part.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <WhatsAppButton phone={part.phone} size="small" label="Chat on WhatsApp" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
