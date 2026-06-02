import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { mockListings } from '../data/mockData'
import ListingCard from '../components/ListingCard'
import { supabase, type Listing } from '../lib/supabase'
import { useAuth } from '../lib/auth-context'

const categories = [
  { label: 'Cars', emoji: '🚗', path: '/browse?cat=Cars' },
  { label: '2-3 Wheelers', emoji: '🏍️', path: '/browse?cat=2-3 Wheelers' },
  { label: 'Heavy Vehicles', emoji: '🚛', path: '/browse?cat=Heavy Vehicles' },
  { label: 'Inspectors', emoji: '🔍', path: '/inspectors' },
  { label: 'Spare Parts', emoji: '🔧', path: '/spare-parts' },
  { label: 'Accessories', emoji: '🎨', path: '/browse?cat=Accessories' },
  { label: 'Garages', emoji: '🏪', path: '/garages' },
  { label: 'Insurance', emoji: '🛡️', path: '/insurance' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { profile } = useAuth()
  const [searchValue, setSearchValue] = useState('')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'Active')
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) throw error
        setListings(data || [])
      } catch (error) {
        console.error('Error fetching listings:', error)
        setListings(mockListings.slice(0, 6) as unknown as Listing[])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  const handleSearch = () => {
    if (searchValue.trim()) navigate(`/search?q=${encodeURIComponent(searchValue)}`)
  }

  const displayListings = listings.length > 0 ? listings : mockListings.slice(0, 6)

  return (
    <div className="pb-safe page-enter">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div>
          <div className="flex items-center gap-1">
            <span style={{ color: theme.palette.primary.main }} className="font-black text-2xl tracking-tight">LEVEL</span>
            <span style={{ color: theme.palette.text.secondary, backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md border ml-1">AUTOMOTIVES</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <LocationOnIcon style={{ fontSize: 13, color: theme.palette.warning.main }} />
            <span style={{ color: theme.palette.text.secondary }} className="text-xs">Kasaragod, Kerala</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton size="small" sx={{ color: theme.palette.text.secondary, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px' }}>
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>
          <Avatar
            sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.light + '33', color: theme.palette.primary.main, fontSize: 14, fontWeight: 700, border: `2px solid ${theme.palette.divider}`, cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            {profile?.display_name ? profile.display_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
          </Avatar>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <OutlinedInput
          fullWidth
          placeholder="Search cars, bikes, autos..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
            </InputAdornment>
          }
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '14px',
            fontSize: 14,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main + '50' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
            '& input': { color: theme.palette.text.primary, py: 1.5 },
            '& input::placeholder': { color: theme.palette.text.secondary },
          }}
          onClick={() => navigate('/search')}
        />
      </div>

      {/* Price Decider Banner */}
      <div className="px-4 mb-5">
        <div
          className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.primary.dark}22 100%)`,
            border: `1px solid ${theme.palette.primary.main}33`
          }}
          onClick={() => navigate('/insurance?tab=value')}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: theme.palette.primary.main, transform: 'translate(30%, -30%)' }} />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.palette.primary.main }}>
                  <ElectricBoltIcon style={{ fontSize: 14, color: theme.palette.primary.contrastText }} />
                </div>
                <span style={{ color: theme.palette.primary.main }} className="font-black text-sm tracking-wider">PRICE DECIDER</span>
              </div>
              <p style={{ color: theme.palette.text.primary }} className="text-sm font-medium">Is the price fair?</p>
              <p style={{ color: theme.palette.text.secondary }} className="text-xs">Check real market value instantly</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl px-3 py-2" style={{ backgroundColor: theme.palette.primary.main }}>
              <span style={{ color: theme.palette.primary.contrastText }} className="text-xs font-black">Check now</span>
              <ArrowForwardIcon style={{ fontSize: 14, color: theme.palette.primary.contrastText }} />
            </div>
          </div>
        </div>
      </div>

      {/* Browse Categories */}
      <div className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[#E8EDF5] font-bold text-base">Browse Categories</h2>
          <button onClick={() => navigate('/browse')} className="text-[#00E5FF] text-xs font-semibold">See all</button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#111D35] border border-[#1E2D47] flex items-center justify-center text-2xl hover:border-[#00E5FF44] transition-colors">
                {cat.emoji}
              </div>
              <span className="text-[#7A8BA8] text-[10px] font-medium text-center w-14 leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured chips */}
      <div className="px-4 mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {['All', 'Near Me', 'Electric', 'Under ₹5L', 'New Arrivals', 'Verified Only'].map(filter => (
            <Chip
              key={filter}
              label={filter}
              size="small"
              onClick={() => navigate(`/search?filter=${filter}`)}
              sx={{
                bgcolor: filter === 'All' ? '#00E5FF22' : '#111D35',
                color: filter === 'All' ? '#00E5FF' : '#7A8BA8',
                border: '1px solid',
                borderColor: filter === 'All' ? '#00E5FF44' : '#1E2D47',
                fontWeight: 600,
                fontSize: '0.7rem',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#00E5FF11' },
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent Listings */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#E8EDF5] font-bold text-base">Recent Listings</h2>
          <button onClick={() => navigate('/search')} className="text-[#00E5FF] text-xs font-semibold">View all</button>
        </div>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: '#00E5FF' }} />
          </Box>
        ) : (
          <div className="flex flex-col gap-3">
            {displayListings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  )
}
