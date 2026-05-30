import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ShareIcon from '@mui/icons-material/Share'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import StarIcon from '@mui/icons-material/Star'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import { supabase, type Listing, type Rating as RatingType } from '../lib/supabase'
import { useAuth } from '../lib/auth-context'
import { useToast } from '../lib/toast-context'
import EmptyState from '../components/EmptyState'
import DealBadge from '../components/DealBadge'
import VerifiedBadge from '../components/VerifiedBadge'

export default function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  const [listing, setListing] = useState<Listing | null>(null)
  const [seller, setSeller] = useState<any>(null)
  const [ratings, setRatings] = useState<RatingType[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [userRating, setUserRating] = useState(5)
  const [userReview, setUserReview] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (listingError) throw listingError
        if (!listingData) {
          setListing(null)
          return
        }

        setListing(listingData)

        // Fetch seller profile
        const { data: sellerData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', listingData.user_id)
          .maybeSingle()

        setSeller(sellerData)

        // Fetch ratings
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select('*, user_profiles(*)')
          .eq('listing_id', id)
          .order('created_at', { ascending: false })

        setRatings(ratingsData || [])

        // Check if saved
        if (user) {
          const { data: savedData } = await supabase
            .from('saved_listings')
            .select('id')
            .eq('user_id', user.id)
            .eq('listing_id', id)
            .maybeSingle()

          setSaved(!!savedData)
        }
      } catch (err) {
        console.error('Error fetching listing:', err)
        showError(err instanceof Error ? err.message : 'Failed to load listing')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchListing()
  }, [id, user, showError])

  const handleSave = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (saved) {
        await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id)
        setSaved(false)
        success('Removed from saved')
      } else {
        await supabase.from('saved_listings').insert({
          user_id: user.id,
          listing_id: id,
        })
        setSaved(true)
        success('Added to saved')
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  const handleSubmitReview = async () => {
    if (!user || !listing) return

    setSubmittingReview(true)
    try {
      const { error } = await supabase.from('ratings').upsert({
        listing_id: listing.id,
        user_id: user.id,
        seller_id: listing.user_id,
        rating: userRating,
        review: userReview || undefined,
      })

      if (error) throw error

      // Refresh ratings
      const { data: newRatings } = await supabase
        .from('ratings')
        .select('*, user_profiles(*)')
        .eq('listing_id', id)
        .order('created_at', { ascending: false })

      setRatings(newRatings || [])
      setReviewDialogOpen(false)
      setUserReview('')
      success('Review submitted!')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#00E5FF' }} />
      </Box>
    )
  }

  if (!listing) {
    return (
      <EmptyState
        emoji="🚗"
        title="Listing not found"
        subtitle="This listing may have been removed"
      />
    )
  }

  const avgRating =
    ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 'N/A'

  const formatPrice = (p: number) => (p >= 100000 ? `₹${(p / 100000).toFixed(1)}L` : `₹${(p / 1000).toFixed(0)}K`)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050A14', color: '#E8EDF5', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(5,10,20,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #1E2D47', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: '#E8EDF5', bgcolor: '#111D35', borderRadius: '10px' }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <div style={{ display: 'flex', gap: '8px' }}>
          <IconButton size="small" sx={{ color: '#7A8BA8', bgcolor: '#111D35', borderRadius: '10px' }}>
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleSave} size="small" sx={{ color: saved ? '#00E5FF' : '#7A8BA8', bgcolor: '#111D35', borderRadius: '10px' }}>
            {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </IconButton>
        </div>
      </div>

      <Container maxWidth="sm" sx={{ pt: 2, pb: 4 }}>
        {/* Photo Gallery */}
        {listing.photos && listing.photos.length > 0 ? (
          <div
            style={{
              aspectRatio: '16/9',
              backgroundColor: '#111D35',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '16px',
              position: 'relative',
            }}
          >
            <img
              src={listing.photos[currentPhotoIdx]}
              alt="Listing photo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {listing.photos.length > 1 && (
              <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                {listing.photos.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentPhotoIdx(i)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: i === currentPhotoIdx ? '#00E5FF' : '#666',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ aspectRatio: '16/9', backgroundColor: '#111D35', borderRadius: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
            🚗
          </div>
        )}

        {/* Title and Price */}
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>{listing.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#00E5FF' }}>{formatPrice(listing.price || 0)}</div>
          {listing.deal_status && <DealBadge status={listing.deal_status as any} />}
          {listing.verified && <VerifiedBadge />}
        </div>

        {/* Location */}
        <div style={{ fontSize: '14px', color: '#7A8BA8', marginBottom: '24px' }}>
          📍 {listing.location}
        </div>

        {/* Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {listing.year && (
            <div style={{ backgroundColor: '#0F1A2E', padding: '12px', borderRadius: '12px', border: '1px solid #1E2D47' }}>
              <div style={{ fontSize: '12px', color: '#7A8BA8', marginBottom: '4px' }}>📅 Year</div>
              <div style={{ fontWeight: 600 }}>{listing.year}</div>
            </div>
          )}
          {listing.kilometers && (
            <div style={{ backgroundColor: '#0F1A2E', padding: '12px', borderRadius: '12px', border: '1px solid #1E2D47' }}>
              <div style={{ fontSize: '12px', color: '#7A8BA8', marginBottom: '4px' }}>🛣️ Kilometers</div>
              <div style={{ fontWeight: 600 }}>{(listing.kilometers / 1000).toFixed(0)}K</div>
            </div>
          )}
          {listing.fuel_type && (
            <div style={{ backgroundColor: '#0F1A2E', padding: '12px', borderRadius: '12px', border: '1px solid #1E2D47' }}>
              <div style={{ fontSize: '12px', color: '#7A8BA8', marginBottom: '4px' }}>⛽ Fuel</div>
              <div style={{ fontWeight: 600 }}>{listing.fuel_type}</div>
            </div>
          )}
          {listing.condition && (
            <div style={{ backgroundColor: '#0F1A2E', padding: '12px', borderRadius: '12px', border: '1px solid #1E2D47' }}>
              <div style={{ fontSize: '12px', color: '#7A8BA8', marginBottom: '4px' }}>⭐ Condition</div>
              <div style={{ fontWeight: 600 }}>{listing.condition}</div>
            </div>
          )}
        </div>

        {/* Description */}
        {listing.description && (
          <>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>About this listing</h2>
            <p style={{ color: '#B0BEC5', lineHeight: '1.6', marginBottom: '24px' }}>{listing.description}</p>
          </>
        )}

        <Divider sx={{ backgroundColor: '#1E2D47', my: 3 }} />

        {/* Seller Info */}
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>About the seller</h2>
        {seller && (
          <div style={{ backgroundColor: '#0F1A2E', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#00E5FF22', color: '#00E5FF', fontSize: '20px', fontWeight: 700 }}>
                {seller.display_name ? seller.display_name[0].toUpperCase() : 'U'}
              </Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{seller.display_name || 'Seller'}</div>
                <div style={{ fontSize: '14px', color: '#7A8BA8', marginBottom: '4px' }}>⭐ {avgRating} stars • {ratings.length} reviews</div>
                {seller.phone && <div style={{ fontSize: '14px', color: '#7A8BA8' }}>📞 {seller.phone}</div>}
              </div>
            </div>
            <Button
              variant="contained"
              fullWidth
              startIcon={<WhatsAppIcon />}
              sx={{ bgcolor: '#25D366', color: '#000', fontWeight: 700, mb: 1, '&:hover': { bgcolor: '#20BA5A' } }}
            >
              WhatsApp
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PhoneIcon />}
              sx={{ borderColor: '#00E5FF', color: '#00E5FF', fontWeight: 700 }}
            >
              Call
            </Button>
          </div>
        )}

        <Divider sx={{ backgroundColor: '#1E2D47', my: 3 }} />

        {/* Ratings Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Reviews ({ratings.length})</h2>
          {user && user.id !== listing.user_id && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setReviewDialogOpen(true)}
              sx={{ borderColor: '#00E5FF', color: '#00E5FF', textTransform: 'none' }}
            >
              Write review
            </Button>
          )}
        </div>

        {ratings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#7A8BA8' }}>
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ratings.map((rating) => (
              <div key={rating.id} style={{ backgroundColor: '#0F1A2E', padding: '12px', borderRadius: '12px', border: '1px solid #1E2D47' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {rating.user_profiles?.display_name || 'Anonymous'}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: '16px', color: i < rating.rating ? '#FFB800' : '#333' }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#7A8BA8' }}>
                    {new Date(rating.created_at).toLocaleDateString()}
                  </div>
                </div>
                {rating.review && <p style={{ fontSize: '14px', color: '#B0BEC5', margin: '8px 0 0 0' }}>{rating.review}</p>}
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#0F1A2E', color: '#E8EDF5' } }}>
        <DialogTitle>Write a review</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 600 }}>Rating</div>
            <Rating
              value={userRating}
              onChange={(_, value) => setUserRating(value || 5)}
              sx={{ fontSize: '28px', '& .MuiRating-iconFilled': { color: '#FFB800' } }}
            />
          </div>
          <TextField
            label="Your review (optional)"
            multiline
            rows={4}
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            placeholder="Share your experience..."
            slotProps={{
              input: { sx: { color: '#E8EDF5' } },
              inputLabel: { sx: { color: '#7A8BA8' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: '#1E2D47',
                '& fieldset': { borderColor: '#1E2D47' },
                '&:hover fieldset': { borderColor: '#00E5FF' },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)} sx={{ color: '#7A8BA8' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            disabled={submittingReview}
            variant="contained"
            sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 700 }}
          >
            {submittingReview ? <CircularProgress size={20} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
