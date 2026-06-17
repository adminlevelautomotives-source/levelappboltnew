import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useAuth } from '../lib/auth-context'
import { supabase, type Listing } from '../lib/supabase'
import VerifiedBadge from '../components/VerifiedBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const listingStatuses = ['Active', 'Pending', 'Sold', 'Expired']

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [listingStatus, setListingStatus] = useState(0)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ml'>('en')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (listingsError) throw listingsError
        setListings(listingsData || [])

        // Fetch seller's average rating
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select('rating')
          .eq('seller_id', user.id)

        if (!ratingsError && ratingsData && ratingsData.length > 0) {
          const avgRating = ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length
          // Update profile with rating (optional - could store in profile table)
          console.log('Seller average rating:', avgRating)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) return <LoadingSpinner />

  const filteredListings = listings.filter(l => l.status === listingStatuses[listingStatus])
  const stats = {
    listings: listings.length,
    saved: 8,
    views: 142,
  }

  const formatPrice = (p: number) =>
    p >= 100000 ? `₹${(p / 100000).toFixed(1)}L` : `₹${(p / 1000).toFixed(0)}K`

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="pb-safe page-enter">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-[#1E2D47]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                sx={{
                  width: 68, height: 68, bgcolor: '#00E5FF22', color: '#00E5FF',
                  fontWeight: 800, fontSize: 26, border: '3px solid #1E2D47',
                }}
              >
                {getInitials(profile?.display_name)}
              </Avatar>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00E5FF] rounded-full border-2 border-[#050A14]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{profile?.display_name || 'User'}</h1>
              <p className="text-sm text-[#7A8BA8]">{profile?.phone}</p>
              <p className="text-xs text-[#4A6FA5] mt-1">Member since Jan 2024</p>
            </div>
          </div>
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: '#FF6B35',
              fontSize: '0.8rem',
              textTransform: 'none',
              '&:hover': { bgcolor: '#FF6B3515' },
            }}
          >
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          {[
            { icon: '📋', label: 'Listings', value: stats.listings },
            { icon: '❤️', label: 'Saved', value: stats.saved },
            { icon: '👁️', label: 'Views', value: stats.views },
          ].map(stat => (
            <div key={stat.label} className="flex-1 bg-[#0F1A2E] rounded-xl p-4 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-xs text-[#7A8BA8]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Container maxWidth="sm" sx={{ pb: 12 }}>
        {/* Quick links */}
        <Box sx={{ display: 'flex', gap: 2, my: 3, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/saved')}
            sx={{ borderColor: '#00E5FF', color: '#00E5FF', textTransform: 'none' }}
          >
            ❤️ Saved Listings
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/post')}
            sx={{ borderColor: '#00E5FF', color: '#00E5FF', textTransform: 'none' }}
          >
            ➕ Post New
          </Button>
        </Box>

        {/* Tabs - only show Listings and Settings */}
        <Tabs
          value={tab === 1 ? 0 : tab}
          onChange={(_, newValue) => setTab(newValue)}
          sx={{
            borderBottom: '1px solid #1E2D47',
            '& .MuiTab-root': { color: '#7A8BA8', textTransform: 'none' },
            '& .Mui-selected': { color: '#00E5FF' },
            '& .MuiTabs-indicator': { backgroundColor: '#00E5FF' },
          }}
        >
          <Tab label="My Listings" />
          <Tab label="Settings" />
        </Tabs>

        {/* My Listings */}
        {tab === 0 && (
          <div className="mt-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {listingStatuses.map((status, idx) => (
                <button
                  key={status}
                  onClick={() => setListingStatus(idx)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition ${
                    listingStatus === idx
                      ? 'bg-[#00E5FF] text-[#050A14]'
                      : 'bg-[#0F1A2E] text-[#7A8BA8]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {filteredListings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography sx={{ color: '#7A8BA8' }}>No listings yet</Typography>
              </Box>
            ) : (
              <div className="space-y-3">
                {filteredListings.map(listing => (
                  <div
                    key={listing.id}
                    className="bg-[#0F1A2E] rounded-2xl p-4 flex gap-3 hover:bg-[#151F35] transition"
                  >
                    <div className="w-16 h-16 bg-[#1E2D47] rounded-lg flex items-center justify-center text-2xl">
                      {listing.category === 'Car' && '🚗'}
                      {listing.category === 'TwoWheeler' && '🛵'}
                      {listing.category === 'HeavyVehicle' && '🚛'}
                      {listing.category === 'SparePart' && '🔧'}
                      {listing.category === 'Service' && '🏬'}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-bold">{listing.title}</h3>
                      <p className="text-[#00E5FF] font-bold text-sm">{formatPrice(listing.price || 0)}</p>
                      <div className="flex gap-2 mt-2">
                        {listing.verified && <VerifiedBadge />}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <IconButton size="small" sx={{ color: '#00E5FF' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#FF6B35' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {tab === 1 && (
          <div className="mt-4 space-y-4">
            <div className="bg-[#0F1A2E] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Notifications</p>
                  <p className="text-xs text-[#7A8BA8]">New listings & messages</p>
                </div>
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#00E5FF' } }}
                />
              </div>
            </div>

            <div className="bg-[#0F1A2E] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Language</p>
                  <p className="text-xs text-[#7A8BA8]">English / Malayalam</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'ml')}
                  className="bg-[#050A14] border border-[#1E2D47] text-white rounded px-3 py-1 text-sm"
                >
                  <option value="en">English</option>
                  <option value="ml">Malayalam</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
