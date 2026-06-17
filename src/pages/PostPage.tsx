import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { useAuth } from '../lib/auth-context'
import { useToast } from '../lib/toast-context'
import { supabase } from '../lib/supabase'
import { uploadListingPhoto } from '../lib/storage'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { keralaDistricts } from '../data/mockData'
import PageHeader from '../components/PageHeader'

const STEPS = ['Type', 'Photos', 'Details', 'Pricing', 'Location']

const photoSlots = [
  { label: 'Front', emoji: '🔵' },
  { label: 'Rear', emoji: '🔴' },
  { label: 'Left Side', emoji: '◀️' },
  { label: 'Right Side', emoji: '▶️' },
  { label: 'Dashboard', emoji: '📊' },
  { label: 'Extra 1', emoji: '📷' },
  { label: 'Extra 2', emoji: '📷' },
  { label: 'Extra 3', emoji: '📷' },
  { label: 'Extra 4', emoji: '📷' },
  { label: 'Extra 5', emoji: '📷' },
]

const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'CNG', 'LPG']
const years = Array.from({ length: 36 }, (_, i) => 2025 - i)
const conditions = [1, 2, 3, 4, 5]
const conditionLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function PostPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [sellerType, setSellerType] = useState<'individual' | 'dealer' | null>(null)
  const [listingType, setListingType] = useState<'vehicle' | 'part' | 'service' | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', category: 'Car', brand: '', model: '', year: 2022,
    fuelType: 'Petrol', km: '', condition: 4, owners: 1, color: '', description: '',
    price: '', negotiable: false, district: 'Kasaragod', area: '', whatsapp: '', phone: '',
  })

  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => {
    if (step === 0) navigate(-1)
    else setStep(s => s - 1)
  }

  const handlePost = async () => {
    setError('')
    setLoading(true)

    try {
      if (!user) throw new Error('User not authenticated')
      if (!form.title || !form.price) throw new Error('Title and price are required')
      if (photos.filter(Boolean).length < 5) throw new Error('Minimum 5 photos required')

      const category = listingType === 'vehicle' ? form.category : (listingType === 'part' ? 'SparePart' : 'Service')

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        category,
        price: parseInt(form.price),
        location: `${form.area}, ${form.district}, Kerala`,
        year: form.year,
        kilometers: parseInt(form.km) || 0,
        fuel_type: form.fuelType,
        condition: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.condition - 1],
        color: form.color,
        owners: form.owners,
        status: 'Pending',
        verified: false,
        photos: photos.filter(Boolean),
      })

      if (insertError) throw insertError
      success('Listing posted! It will be verified within 24-72 hours.')
      navigate('/')
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to post listing'
      setError(errMsg)
      showError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const setField = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotoUpload = async (index: number) => {
    if (!fileInputRef.current) return
    fileInputRef.current.dataset.index = index.toString()
    fileInputRef.current.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const index = parseInt(fileInputRef.current?.dataset.index || '0')
    setUploadingIndex(index)
    setUploading(true)

    try {
      if (!user?.id) throw new Error('User not authenticated')
      const tempId = `temp-${Date.now()}`
      const url = await uploadListingPhoto(file, tempId)
      const newPhotos = [...photos]
      newPhotos[index] = url
      setPhotos(newPhotos)
      showError('Photo uploaded!')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadingIndex(-1)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Step 0: Type
  if (step === 0) {
    return (
      <div className="pb-safe page-enter">
        <PageHeader title="Post a Listing" showBack />
        <div className="px-4 py-4">
          <h3 className="text-[#E8EDF5] font-bold text-base mb-1">Who are you posting as?</h3>
          <p className="text-[#7A8BA8] text-sm mb-4">Select your seller type</p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              { key: 'individual', emoji: '👤', title: 'Individual Owner', subtitle: 'Free listing', tag: 'FREE' },
              { key: 'dealer', emoji: '🏢', title: 'Dealer / Broker', subtitle: 'Subscription plan', tag: 'COMING SOON' },
            ].map(opt => (
              <button
                key={opt.key}
                disabled={opt.key === 'dealer'}
                onClick={() => setSellerType(opt.key as 'individual')}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  sellerType === opt.key
                    ? 'border-[#00E5FF] bg-[#00E5FF11]'
                    : 'border-[#1E2D47] bg-[#0D1526]'
                } ${opt.key === 'dealer' ? 'opacity-50' : 'active:scale-[0.98]'}`}
              >
                <div className="text-3xl">{opt.emoji}</div>
                <div className="flex-1">
                  <div className="text-[#E8EDF5] font-semibold">{opt.title}</div>
                  <div className="text-[#7A8BA8] text-sm">{opt.subtitle}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  opt.tag === 'FREE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1E2D47] text-[#7A8BA8]'
                }`}>
                  {opt.tag}
                </span>
              </button>
            ))}
          </div>

          <h3 className="text-[#E8EDF5] font-bold text-base mb-1">What are you listing?</h3>
          <p className="text-[#7A8BA8] text-sm mb-4">Select listing category</p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              { key: 'vehicle', emoji: '🚗', title: 'Vehicle', subtitle: 'Car / 2-3 Wheeler / Heavy' },
              { key: 'part', emoji: '🔧', title: 'Spare Part', subtitle: 'New or used parts' },
              { key: 'service', emoji: '🏪', title: 'Service', subtitle: 'Inspector / Garage / Shop' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setListingType(opt.key as 'vehicle')}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                  listingType === opt.key
                    ? 'border-[#00E5FF] bg-[#00E5FF11]'
                    : 'border-[#1E2D47] bg-[#0D1526]'
                }`}
              >
                <div className="text-3xl">{opt.emoji}</div>
                <div>
                  <div className="text-[#E8EDF5] font-semibold">{opt.title}</div>
                  <div className="text-[#7A8BA8] text-sm">{opt.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          <Button
            fullWidth
            variant="contained"
            disabled={!sellerType || !listingType}
            onClick={next}
            sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 700, borderRadius: '14px', py: 1.5 }}
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  // Step indicator for steps 1-5
  const stepContent = () => {
    switch (step) {
      // Step 1: Photos
      case 1:
        return (
          <div>
            <h3 className="text-[#E8EDF5] font-bold text-base mb-1">Upload Photos</h3>
            <p className="text-[#7A8BA8] text-sm mb-4">Minimum 5 photos required for verification</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <div className="grid grid-cols-5 gap-2 mb-4">
              {photoSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handlePhotoUpload(i)}
                  disabled={uploading}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative ${
                    photos[i] ? 'border-[#00E5FF] bg-[#00E5FF11]' : 'border-[#1E2D47] border-dashed bg-[#111D35]'
                  }`}
                >
                  {uploadingIndex === i && uploading ? (
                    <CircularProgress size={20} sx={{ color: '#00E5FF' }} />
                  ) : photos[i] ? (
                    <CheckCircleIcon sx={{ color: '#00E5FF', fontSize: 20 }} />
                  ) : (
                    <AddPhotoAlternateIcon sx={{ color: '#7A8BA8', fontSize: 18 }} />
                  )}
                  <span className="text-[8px] text-[#7A8BA8] leading-tight text-center">{slot.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-[#111D35] border border-[#1E2D47] rounded-xl px-3 py-2">
                <InfoOutlinedIcon sx={{ color: '#00E5FF', fontSize: 16 }} />
                <span className="text-[#7A8BA8] text-xs">Minimum 5 photos required for verification</span>
              </div>
            </div>

            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-xl px-4 py-2 mb-4">
              <span className="text-[#00E5FF] font-bold">{photos.filter(Boolean).length}</span>
              <span className="text-[#7A8BA8] text-sm"> / 10 photos added</span>
            </div>
          </div>
        )

      // Step 2: Vehicle Details
      case 2:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-[#E8EDF5] font-bold text-base mb-1">Vehicle Details</h3>

            <TextField
              fullWidth label="Listing Title" size="small"
              value={form.title} onChange={e => setField('title', e.target.value)}
              placeholder="e.g. 2021 Maruti Swift ZXI+"
            />

            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={form.category} onChange={e => setField('category', e.target.value)} label="Category">
                {['Car', 'Two Wheeler', 'Three Wheeler', 'Heavy Vehicle'].map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="grid grid-cols-2 gap-3">
              <TextField fullWidth label="Make / Brand" size="small" value={form.brand} onChange={e => setField('brand', e.target.value)} />
              <TextField fullWidth label="Model" size="small" value={form.model} onChange={e => setField('model', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select value={form.year} onChange={e => setField('year', e.target.value)} label="Year">
                  {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Fuel Type</InputLabel>
                <Select value={form.fuelType} onChange={e => setField('fuelType', e.target.value)} label="Fuel Type">
                  {fuelTypes.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
              </FormControl>
            </div>

            <TextField
              fullWidth label="KM Driven" size="small" type="number"
              value={form.km} onChange={e => setField('km', e.target.value)}
              InputProps={{ endAdornment: <InputAdornment position="end"><span className="text-[#7A8BA8] text-xs">km</span></InputAdornment> }}
            />

            <div>
              <p className="text-[#7A8BA8] text-xs mb-2">Condition</p>
              <div className="flex gap-2">
                {conditions.map(c => (
                  <button
                    key={c}
                    onClick={() => setField('condition', c)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      form.condition === c
                        ? 'bg-[#00E5FF22] border-[#00E5FF] text-[#00E5FF]'
                        : 'bg-[#111D35] border-[#1E2D47] text-[#7A8BA8]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-[#00E5FF] text-xs mt-1">{conditionLabels[form.condition - 1]}</p>
            </div>

            <div>
              <p className="text-[#7A8BA8] text-xs mb-2">Number of Owners</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(o => (
                  <button
                    key={o}
                    onClick={() => setField('owners', o)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      form.owners === o
                        ? 'bg-[#00E5FF22] border-[#00E5FF] text-[#00E5FF]'
                        : 'bg-[#111D35] border-[#1E2D47] text-[#7A8BA8]'
                    }`}
                  >
                    {o === 4 ? '4+' : o}
                  </button>
                ))}
              </div>
            </div>

            <TextField fullWidth label="Color" size="small" value={form.color} onChange={e => setField('color', e.target.value)} />
            <TextField
              fullWidth label="Description" size="small" multiline rows={3}
              value={form.description} onChange={e => setField('description', e.target.value)}
              placeholder="Describe the vehicle condition, history, modifications..."
            />
          </div>
        )

      // Step 3: Pricing
      case 3:
        return (
          <div>
            <h3 className="text-[#E8EDF5] font-bold text-base mb-1">Set Your Price</h3>
            <p className="text-[#7A8BA8] text-sm mb-4">Set a competitive price to sell faster</p>

            <div className="mb-4">
              <TextField
                fullWidth label="Your Price"
                value={form.price} onChange={e => setField('price', e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><span className="text-[#E8EDF5] font-bold text-xl">₹</span></InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { fontSize: '1.5rem', fontWeight: 700 },
                  '& input': { color: '#00E5FF', fontWeight: 800, fontSize: '1.5rem' },
                }}
              />
            </div>

            <Button
              fullWidth variant="outlined"
              onClick={() => navigate('/insurance?tab=value')}
              sx={{
                borderColor: '#00E5FF', color: '#00E5FF',
                borderRadius: '12px', mb: 4, fontWeight: 700,
                '&:hover': { bgcolor: '#00E5FF11' },
              }}
            >
              ⚡ Use Price Decider
            </Button>

            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-xl p-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={form.negotiable}
                    onChange={e => setField('negotiable', e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#00E5FF' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00E5FF' } }}
                  />
                }
                label={
                  <div>
                    <div className="text-[#E8EDF5] font-semibold text-sm">Negotiable</div>
                    <div className="text-[#7A8BA8] text-xs">Buyers can make offers</div>
                  </div>
                }
              />
            </div>
          </div>
        )

      // Step 4: Location
      case 4:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-[#E8EDF5] font-bold text-base mb-1">Location & Contact</h3>

            <div className="bg-[#00E5FF11] border border-[#00E5FF33] rounded-xl px-3 py-2">
              <span className="text-[#00E5FF] text-xs font-semibold">📍 State: Kerala (Fixed)</span>
            </div>

            <FormControl fullWidth size="small">
              <InputLabel>District</InputLabel>
              <Select value={form.district} onChange={e => setField('district', e.target.value)} label="District">
                {keralaDistricts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField
              fullWidth label="Area / Panchayat" size="small"
              value={form.area} onChange={e => setField('area', e.target.value)}
              placeholder="e.g. Kasaragod Town, Bekal, Kanhangad"
            />

            <TextField
              fullWidth label="WhatsApp Number *" size="small"
              value={form.whatsapp} onChange={e => setField('whatsapp', e.target.value)}
              type="tel" inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><span className="text-[#7A8BA8] text-sm">+91</span></InputAdornment>,
              }}
            />

            <TextField
              fullWidth label="Phone Number for Calls (optional)" size="small"
              value={form.phone} onChange={e => setField('phone', e.target.value)}
              type="tel" inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><span className="text-[#7A8BA8] text-sm">+91</span></InputAdornment>,
              }}
            />
          </div>
        )

      // Step 5: Review
      case 5:
        return (
          <div>
            <h3 className="text-[#E8EDF5] font-bold text-base mb-1">Review & Post</h3>
            <p className="text-[#7A8BA8] text-sm mb-4">Check all details before posting</p>

            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
              {[
                ['Title', form.title || 'Not set'],
                ['Category', form.category],
                ['Brand / Model', `${form.brand || '—'} ${form.model || '—'}`],
                ['Year', form.year.toString()],
                ['Fuel', form.fuelType],
                ['KM', form.km ? `${form.km} km` : 'Not set'],
                ['Condition', conditionLabels[form.condition - 1]],
                ['Owners', form.owners.toString()],
                ['Color', form.color || 'Not set'],
                ['Price', form.price ? `₹${parseInt(form.price).toLocaleString('en-IN')}` : 'Not set'],
                ['Negotiable', form.negotiable ? 'Yes' : 'No'],
                ['District', form.district],
                ['Area', form.area || 'Not set'],
                ['WhatsApp', form.whatsapp || 'Not set'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1.5 border-b border-[#1E2D47] last:border-0">
                  <span className="text-[#7A8BA8] text-xs">{k}</span>
                  <span className="text-[#E8EDF5] text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Button
              fullWidth variant="contained"
              onClick={handlePost}
              disabled={loading}
              sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 800, borderRadius: '14px', py: 1.5, fontSize: '1rem', mb: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : '🚀 POST LISTING'}
            </Button>

            <div className="border border-[#FF6B35] rounded-2xl p-4 bg-[#FF6B3510]">
              <div className="flex gap-2">
                <InfoOutlinedIcon sx={{ color: '#FF6B35', fontSize: 18, mt: 0.2, shrink: 0 }} />
                <div>
                  <p className="text-[#FF6B35] font-semibold text-sm">About Verification</p>
                  <p className="text-[#7A8BA8] text-xs mt-1 leading-relaxed">
                    Your listing will go live immediately but official verification takes 24–72 hours. It will be marked as Pending until then.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Post a Listing" showBack />

      {/* Step indicator */}
      <div className="px-4 py-3">
        <Stepper activeStep={step - 1} alternativeLabel>
          {STEPS.map(label => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': { color: '#7A8BA8', fontSize: '0.6rem' },
                '& .MuiStepLabel-label.Mui-active': { color: '#00E5FF' },
                '& .MuiStepLabel-label.Mui-completed': { color: '#10b981' },
                '& .MuiStepIcon-root': { color: '#1E2D47' },
                '& .MuiStepIcon-root.Mui-active': { color: '#00E5FF' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' },
              }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="px-4 pb-4">
        {stepContent()}

        {step < 5 && (
          <div className="flex gap-3 mt-6">
            <Button
              variant="outlined"
              onClick={back}
              sx={{ borderColor: '#1E2D47', color: '#7A8BA8', borderRadius: '12px', flex: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={next}
              sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 700, borderRadius: '12px', flex: 2 }}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
