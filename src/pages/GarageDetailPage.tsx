import { useParams, useNavigate } from 'react-router-dom'
import Chip from '@mui/material/Chip'
import StarIcon from '@mui/icons-material/Star'
import Avatar from '@mui/material/Avatar'
import { mockGarages } from '../data/mockData'
import WhatsAppButton from '../components/WhatsAppButton'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

export default function GarageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const garage = mockGarages.find(g => g.id === id)

  if (!garage) return <EmptyState emoji="🏪" title="Garage not found" actionLabel="Go Back" onAction={() => navigate(-1)} />

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Garage Profile" showBack />

      <div className="px-4 py-4">
        {/* Header card */}
        <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-5 mb-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#10b98120] border border-[#10b98130] flex items-center justify-center text-3xl mx-auto mb-3">🏪</div>
          <h2 className="text-[#E8EDF5] font-bold text-xl mb-1">{garage.name}</h2>
          <p className="text-[#7A8BA8] text-sm mb-3">📍 {garage.area}, {garage.district}</p>
          <div className="flex items-center justify-center gap-1">
            <StarIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
            <span className="text-[#E8EDF5] font-bold">{garage.rating}</span>
            <span className="text-[#7A8BA8] text-sm">rating</span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
          <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Services</h3>
          <div className="flex flex-wrap gap-2">
            {garage.services.map(s => (
              <Chip key={s} label={s} sx={{ bgcolor: '#10b98115', color: '#10b981', border: '1px solid #10b98130', fontSize: '0.75rem' }} />
            ))}
          </div>
        </div>

        {/* Offers */}
        {garage.offers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Current Offers</h3>
            {garage.offers.map((offer, i) => (
              <div key={i} className="bg-[#FF6B3510] border border-[#FF6B3530] rounded-xl p-3">
                <span className="text-[#FF6B35] text-sm font-semibold">🎁 {offer}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        <div className="mb-4">
          <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Reviews</h3>
          {garage.reviews.map((review, i) => (
            <div key={i} className="bg-[#0D1526] border border-[#1E2D47] rounded-xl p-3 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#111D35', color: '#7A8BA8', fontSize: 12 }}>{review.name[0]}</Avatar>
                <span className="text-[#E8EDF5] text-sm font-semibold">{review.name}</span>
                <div className="flex items-center gap-0.5 ml-auto">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <StarIcon key={j} sx={{ color: '#f59e0b', fontSize: 12 }} />
                  ))}
                </div>
              </div>
              <p className="text-[#7A8BA8] text-xs">{review.comment}</p>
            </div>
          ))}
        </div>

        <WhatsAppButton phone={garage.phone} message={`Hi, I found ${garage.name} on Level Automotives.`} />
      </div>
    </div>
  )
}
