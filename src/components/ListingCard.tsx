import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth-context'
import { useToast } from '../lib/toast-context'
import VerifiedBadge from './VerifiedBadge'

interface Props {
  listing: any
  compact?: boolean
}

export default function ListingCard({ listing, compact = false }: Props) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const checkIfSaved = async () => {
      try {
        const { data } = await supabase
          .from('saved_listings')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', listing.id)
          .maybeSingle()

        setSaved(!!data)
      } catch (err) {
        console.error('Error checking saved status:', err)
      }
    }

    checkIfSaved()
  }, [user, listing.id])

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      if (saved) {
        await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id)
        setSaved(false)
        success('Removed from saved')
      } else {
        await supabase
          .from('saved_listings')
          .insert({ user_id: user.id, listing_id: listing.id })
        setSaved(true)
        success('Added to saved')
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (p: number) =>
    p >= 100000
      ? `₹${(p / 100000).toFixed(p % 100000 === 0 ? 0 : 1)}L`
      : `₹${(p / 1000).toFixed(0)}K`

  const formatKm = (k: number) =>
    k >= 1000 ? `${(k / 1000).toFixed(0)}K km` : `${k} km`

  return (
    <div
      className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <div className="flex gap-3 p-3">
        {/* Image placeholder */}
        <div className="w-24 h-20 rounded-xl bg-[#111D35] flex items-center justify-center shrink-0 relative overflow-hidden">
          <span className="text-4xl">{listing.emoji}</span>
          {listing.status === 'pending' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[8px] text-amber-400 font-bold text-center px-1">PENDING</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className={`text-[#E8EDF5] font-semibold leading-tight ${compact ? 'text-sm' : 'text-sm'} line-clamp-2`}>
              {listing.title}
            </h3>
            <IconButton
              size="small"
              onClick={handleSave}
              disabled={loading}
              sx={{ color: saved ? '#00E5FF' : '#7A8BA8', p: 0.5, mt: -0.5 }}
            >
              {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </div>

          <div className="text-[#00E5FF] font-bold text-lg leading-tight mt-0.5">
            {formatPrice(listing.price)}
            {listing.negotiable && (
              <span className="text-[#7A8BA8] text-[10px] font-normal ml-1">Negotiable</span>
            )}
          </div>

          <div className="text-[#7A8BA8] text-[11px] mt-1 flex items-center gap-1.5 flex-wrap">
            <span>{listing.year}</span>
            <span className="text-[#1E2D47]">·</span>
            <span>{formatKm(listing.km)}</span>
            <span className="text-[#1E2D47]">·</span>
            <span>{listing.fuelType}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="flex items-center gap-0.5 text-[#7A8BA8] text-[11px]">
              <LocationOnIcon style={{ fontSize: 11 }} />
              {listing.location}
            </span>
            {listing.verified && <VerifiedBadge />}
            {listing.status && <VerifiedBadge status={listing.status} />}
          </div>
        </div>
      </div>
    </div>
  )
}
