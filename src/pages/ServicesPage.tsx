import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const services = [
  {
    emoji: '🔍', title: 'Vehicle Inspectors', subtitle: 'Pre-purchase, insurance & RC help', path: '/inspectors',
    color: '#00E5FF', bg: '#00E5FF10', border: '#00E5FF30',
    tags: ['Pre-purchase', 'Insurance', 'RC Help'],
  },
  {
    emoji: '🔧', title: 'Spare Parts', subtitle: 'Dealers and used parts near you', path: '/spare-parts',
    color: '#FF6B35', bg: '#FF6B3510', border: '#FF6B3530',
    tags: ['New Parts', 'Used Parts', 'Dealers'],
  },
  {
    emoji: '🏪', title: 'Garages', subtitle: 'Repair and service centers', path: '/garages',
    color: '#10b981', bg: '#10b98110', border: '#10b98130',
    tags: ['AC Service', 'Engine', 'Tyres'],
  },
  {
    emoji: '🛡️', title: 'Insurance & Docs', subtitle: 'Insurance, RC, DL, Challan, EMI', path: '/insurance',
    color: '#3b82f6', bg: '#3b82f610', border: '#3b82f630',
    tags: ['Insurance', 'RC Transfer', 'DL Renewal'],
  },
]

export default function ServicesPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Services" showBack={false} />

      <div className="px-4 py-4">
        <p className="text-[#7A8BA8] text-sm mb-5">All services for vehicle owners in Kerala</p>

        <div className="flex flex-col gap-4">
          {services.map(svc => (
            <button
              key={svc.title}
              onClick={() => navigate(svc.path)}
              className="text-left rounded-2xl p-4 active:scale-[0.98] transition-transform"
              style={{ backgroundColor: svc.bg, border: `1px solid ${svc.border}` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ backgroundColor: `${svc.color}15`, border: `1px solid ${svc.color}30` }}
                >
                  {svc.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-[#E8EDF5] font-bold text-base mb-0.5">{svc.title}</h3>
                  <p className="text-[#7A8BA8] text-xs mb-2">{svc.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${svc.color}20`, color: svc.color }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ color: svc.color }} className="text-lg font-bold">›</span>
              </div>
            </button>
          ))}
        </div>

        {/* Quick stats banner */}
        <div className="mt-6 bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
          <p className="text-[#7A8BA8] text-xs font-semibold mb-3 uppercase tracking-wide">LEVEL Automotives Network</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Verified Inspectors', value: '12+', emoji: '🔍' },
              { label: 'Garages Listed', value: '38+', emoji: '🏪' },
              { label: 'Spare Part Dealers', value: '24+', emoji: '🔧' },
              { label: 'Insurance Partners', value: '6', emoji: '🛡️' },
            ].map(stat => (
              <div key={stat.label} className="bg-[#111D35] rounded-xl p-3 flex items-center gap-2">
                <span className="text-xl">{stat.emoji}</span>
                <div>
                  <div className="text-[#00E5FF] font-black text-base">{stat.value}</div>
                  <div className="text-[#7A8BA8] text-[10px] leading-tight">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
