import { useParams, useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import StarIcon from '@mui/icons-material/Star'
import VerifiedIcon from '@mui/icons-material/Verified'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { mockInspectors } from '../data/mockData'
import WhatsAppButton from '../components/WhatsAppButton'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

export default function InspectorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const inspector = mockInspectors.find(i => i.id === id)

  if (!inspector) return <EmptyState emoji="🔍" title="Inspector not found" actionLabel="Go Back" onAction={() => navigate(-1)} />

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Inspector Profile" showBack />

      <div className="px-4 py-4">
        {/* Profile card */}
        <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-5 mb-4 text-center">
          <Avatar sx={{ width: 72, height: 72, bgcolor: '#00E5FF22', color: '#00E5FF', fontWeight: 800, fontSize: 28, mx: 'auto', mb: 2, border: '3px solid #1E2D47' }}>
            {inspector.name[0]}
          </Avatar>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-[#E8EDF5] font-bold text-xl">{inspector.name}</h2>
            {inspector.verified && <VerifiedIcon sx={{ color: '#00E5FF', fontSize: 20 }} />}
          </div>
          <p className="text-[#7A8BA8] text-sm mb-3">📍 {inspector.area}, {inspector.district}</p>

          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <StarIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
                <span className="text-[#E8EDF5] font-black text-lg">{inspector.rating}</span>
              </div>
              <div className="text-[#7A8BA8] text-[10px]">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-[#E8EDF5] font-black text-lg">{inspector.experience}</div>
              <div className="text-[#7A8BA8] text-[10px]">Years Exp</div>
            </div>
            <div className="text-center">
              <div className="text-[#E8EDF5] font-black text-lg">{inspector.reviews.length * 12}+</div>
              <div className="text-[#7A8BA8] text-[10px]">Inspections</div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
          <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {inspector.services.map(s => (
              <Chip key={s} label={s} sx={{ bgcolor: '#00E5FF15', color: '#00E5FF', border: '1px solid #00E5FF30', fontSize: '0.75rem' }} />
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
          <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Certifications</h3>
          {inspector.certifications.map(cert => (
            <div key={cert} className="flex items-center gap-2 py-1.5">
              <WorkspacePremiumIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
              <span className="text-[#E8EDF5] text-sm">{cert}</span>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="mb-4">
          <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Reviews</h3>
          <div className="flex flex-col gap-3">
            {inspector.reviews.map((review, i) => (
              <div key={i} className="bg-[#0D1526] border border-[#1E2D47] rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#111D35', color: '#7A8BA8', fontSize: 12 }}>{review.name[0]}</Avatar>
                  <span className="text-[#E8EDF5] text-sm font-semibold">{review.name}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <StarIcon key={j} sx={{ color: '#f59e0b', fontSize: 12 }} />
                    ))}
                  </div>
                </div>
                <p className="text-[#7A8BA8] text-xs leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <Divider sx={{ borderColor: '#1E2D47', my: 3 }} />
        <WhatsAppButton phone={inspector.phone} message={`Hi ${inspector.name}, I need a vehicle inspection.`} />
      </div>
    </div>
  )
}
