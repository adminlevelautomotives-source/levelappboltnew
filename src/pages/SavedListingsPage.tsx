import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '../lib/auth-context'
import { supabase, type Listing } from '../lib/supabase'
import PageHeader from '../components/PageHeader'
import ListingCard from '../components/ListingCard'
import EmptyState from '../components/EmptyState'

export default function SavedListingsPage() {
  const { user, isAuthenticated } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchSavedListings = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_listings')
          .select('listing_id, listings(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        const items = (data || []).map((item: any) => item.listings).filter(Boolean)
        setListings(items)
      } catch (err) {
        console.error('Error fetching saved listings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedListings()
  }, [user, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="pb-safe page-enter">
        <PageHeader title="Saved Listings" showBack />
        <EmptyState
          emoji="🔐"
          title="Please sign in"
          subtitle="Log in to view your saved listings"
        />
      </div>
    )
  }

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Saved Listings" showBack />

      <div className="px-4 py-4">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} sx={{ color: '#00E5FF' }} />
          </Box>
        ) : listings.length === 0 ? (
          <EmptyState
            emoji="❤️"
            title="No saved listings yet"
            subtitle="Bookmark listings to save them for later"
          />
        ) : (
          <>
            <div className="text-[#7A8BA8] text-sm mb-3">
              {listings.length} saved {listings.length === 1 ? 'listing' : 'listings'}
            </div>
            <div className="flex flex-col gap-3">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
