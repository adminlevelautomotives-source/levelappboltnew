import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import TuneIcon from '@mui/icons-material/Tune'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Slider from '@mui/material/Slider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { supabase, type Listing } from '../lib/supabase'
import { useToast } from '../lib/toast-context'
import ListingCard from '../components/ListingCard'
import EmptyState from '../components/EmptyState'

const sortOptions = ['Newest', 'Price ↑', 'Price ↓']
const PAGE_SIZE = 10

export default function SearchPage() {
  const navigate = useNavigate()
  const { error: showError } = useToast()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('Newest')
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000])
  const [selectedFuels, setSelectedFuels] = useState<string[]>([])
  const observerTarget = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  const fetchListings = useCallback(async (pageNum: number, reset = false) => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setLoading(true)

    try {
      let q = supabase
        .from('listings')
        .select('*')
        .eq('status', 'Active')
        .gte('price', priceRange[0])
        .lte('price', priceRange[1])
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (query) {
        q = q.ilike('title', `%${query}%`)
      }

      if (selectedFuels.length > 0) {
        q = q.in('fuel_type', selectedFuels)
      }

      const orderBy = sortBy === 'Price ↑' ? 'price' : sortBy === 'Price ↓' ? 'price' : 'created_at'
      const ascending = sortBy === 'Price ↑'
      q = q.order(orderBy, { ascending })

      const { data, error } = await q

      if (error) throw error

      const newListings = data || []
      if (reset) {
        setListings(newListings)
      } else {
        setListings(prev => [...prev, ...newListings])
      }

      setHasMore(newListings.length === PAGE_SIZE)
      setPage(pageNum)
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch listings')
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [query, sortBy, priceRange, selectedFuels, showError])

  useEffect(() => {
    fetchListings(0, true)
  }, [query, sortBy])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && listings.length > 0) {
          fetchListings(page + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, page, fetchListings, listings.length])

  return (
    <div className="pb-safe page-enter">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#050A14]/95 backdrop-blur-sm border-b border-[#1E2D47] px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: '#E8EDF5', bgcolor: '#111D35', borderRadius: '10px', p: 0.75 }}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <OutlinedInput
            fullWidth
            autoFocus
            placeholder="Search cars, bikes, autos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            startAdornment={<InputAdornment position="start"><SearchIcon sx={{ color: '#7A8BA8', fontSize: 18 }} /></InputAdornment>}
            sx={{
              backgroundColor: '#111D35', borderRadius: '12px', fontSize: 14,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1E2D47' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00E5FF' },
              '& input': { color: '#E8EDF5', py: 1.2 },
            }}
          />
          <IconButton
            size="small"
            onClick={() => setFilterOpen(true)}
            sx={{ color: selectedFuels.length > 0 || priceRange[0] > 0 ? '#00E5FF' : '#7A8BA8', bgcolor: '#111D35', borderRadius: '10px', p: 0.75, shrink: 0 }}
          >
            <TuneIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={e => setSortAnchor(e.currentTarget)}
            sx={{ color: '#7A8BA8', bgcolor: '#111D35', borderRadius: '10px', p: 0.75, shrink: 0 }}
          >
            <SortIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Active filters chip */}
        {(sortBy !== 'Newest' || selectedFuels.length > 0 || priceRange[0] > 0) && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {sortBy !== 'Newest' && (
              <Chip
                label={`Sort: ${sortBy}`}
                size="small"
                variant="outlined"
                sx={{ borderColor: '#00E5FF', color: '#00E5FF', shrink: 0 }}
                onDelete={() => setSortBy('Newest')}
              />
            )}
            {priceRange[0] > 0 && (
              <Chip
                label={`₹${(priceRange[0] / 100000).toFixed(1)}L-${(priceRange[1] / 100000).toFixed(1)}L`}
                size="small"
                variant="outlined"
                sx={{ borderColor: '#00E5FF', color: '#00E5FF', shrink: 0 }}
                onDelete={() => setPriceRange([0, 5000000])}
              />
            )}
            {selectedFuels.length > 0 && (
              <Chip
                label={`Fuels: ${selectedFuels.length}`}
                size="small"
                variant="outlined"
                sx={{ borderColor: '#00E5FF', color: '#00E5FF', shrink: 0 }}
                onDelete={() => setSelectedFuels([])}
              />
            )}
          </div>
        )}
      </div>

      {/* Sort menu */}
      <Menu
        anchorEl={sortAnchor}
        open={!!sortAnchor}
        onClose={() => setSortAnchor(null)}
        slotProps={{
          paper: { sx: { bgcolor: '#0F1A2E', border: '1px solid #1E2D47' } },
        }}
      >
        {sortOptions.map(opt => (
          <MenuItem
            key={opt}
            selected={sortBy === opt}
            onClick={() => {
              setSortBy(opt)
              setSortAnchor(null)
            }}
            sx={{ color: sortBy === opt ? '#00E5FF' : '#7A8BA8' }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>

      {/* Filter dialog */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#0F1A2E', color: '#E8EDF5' } }}
      >
        <DialogTitle>Filters</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {/* Price range */}
          <Box>
            <div className="text-sm font-semibold mb-3">Price Range</div>
            <div className="text-xs text-[#7A8BA8] mb-2">
              ₹{(priceRange[0] / 100000).toFixed(1)}L - ₹{(priceRange[1] / 100000).toFixed(1)}L
            </div>
            <Slider
              value={priceRange}
              onChange={(_, value) => setPriceRange(value as [number, number])}
              min={0}
              max={5000000}
              step={100000}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `₹${(v / 100000).toFixed(1)}L`}
              sx={{
                color: '#00E5FF',
                '& .MuiSlider-track': { backgroundColor: '#00E5FF' },
                '& .MuiSlider-rail': { backgroundColor: '#1E2D47' },
                '& .MuiSlider-thumb': { backgroundColor: '#00E5FF' },
              }}
            />
          </Box>

          {/* Fuel type */}
          <Box>
            <div className="text-sm font-semibold mb-3">Fuel Type</div>
            {['Petrol', 'Diesel', 'Electric', 'CNG', 'LPG'].map(fuel => (
              <FormControlLabel
                key={fuel}
                control={
                  <Checkbox
                    checked={selectedFuels.includes(fuel)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFuels([...selectedFuels, fuel])
                      } else {
                        setSelectedFuels(selectedFuels.filter(f => f !== fuel))
                      }
                    }}
                    sx={{ color: '#00E5FF', '&.Mui-checked': { color: '#00E5FF' } }}
                  />
                }
                label={fuel}
                sx={{ color: '#E8EDF5', mb: 1 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)} sx={{ color: '#00E5FF' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Results */}
      <div className="px-4 py-4">
        {listings.length === 0 && !loading ? (
          <EmptyState
            emoji="🔍"
            title="No listings found"
            subtitle={query ? `No results for "${query}"` : 'Start searching to see listings'}
          />
        ) : (
          <>
            <div className="text-[#7A8BA8] text-sm mb-3">
              {listings.length > 0 && `Showing ${listings.length} listings`}
            </div>
            <div className="flex flex-col gap-3">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        )}

        {/* Load more observer */}
        {hasMore && (
          <Box
            ref={observerTarget}
            sx={{ display: 'flex', justifyContent: 'center', py: 4 }}
          >
            {loading ? (
              <CircularProgress size={32} sx={{ color: '#00E5FF' }} />
            ) : (
              <div className="text-[#7A8BA8] text-sm">Scroll for more</div>
            )}
          </Box>
        )}
      </div>
    </div>
  )
}
