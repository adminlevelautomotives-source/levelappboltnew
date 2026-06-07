import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Slider from '@mui/material/Slider'
import { useAuth } from '../lib/auth-context'
import { useToast } from '../lib/toast-context'
import { supabase } from '../lib/supabase'
import { uploadListingPhoto } from '../lib/storage'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { keralaDistricts } from '../data/mockData'
import { brandModels, allBrands, vehicleColors } from '../data/brandModels'
import PageHeader from '../components/PageHeader'

const STEPS = ['Type', 'Photos', 'Details', 'Pricing', 'Location']

const photoSlots = [
  { label: 'Front' }, { label: 'Rear' }, { label: 'Left Side' },
  { label: 'Right Side' }, { label: 'Dashboard' },
  { label: 'Extra 1' }, { label: 'Extra 2' }, { label: 'Extra 3' },
  { label: 'Extra 4' }, { label: 'Extra 5' },
]

const fuelOptions = [
  { value: 'Petrol', emoji: '⛽' },
  { value: 'Diesel', emoji: '🛢️' },
  { value: 'Electric', emoji: '⚡' },
  { value: 'CNG', emoji: '🔵' },
  { value: 'LPG', emoji: '🟡' },
]

const conditionOptions = [
  { value: 1, emoji: '💔', label: 'Poor' },
  { value: 2, emoji: '😐', label: 'Fair' },
  { value: 3, emoji: '🙂', label: 'Good' },
  { value: 4, emoji: '😊', label: 'Very Good' },
  { value: 5, emoji: '🌟', label: 'Excellent' },
]

const years = Array.from({ length: 46 }, (_, i) => 2025 - i) // 1980–2025

const P = '#7C3AED'
const PL = '#A855F7'
const BG = '#0D0D1A'
const CARD = '#1A1A2E'
const BORDER = '#374151'
const TEXT = '#FFFFFF'
const MUTED = '#6B7280'

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
  const [customModel, setCustomModel] = useState('')
  const [customColor, setCustomColor] = useState('')

  const [form, setForm] = useState({
    title: '', category: 'Car',
    brand: '', model: '', year: 2022,
    fuelType: 'Petrol', transmission: 'Manual',
    km: 0, condition: 3, owners: 1,
    color: '', description: '',
    price: '', negotiable: false,
    district: 'Kasaragod', area: '', whatsapp: '', phone: '',
  })

  const setField = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => { if (step === 0) navigate(-1); else setStep(s => s - 1) }

  const selectedModels = form.brand ? (brandModels[form.brand] || []) : []
  const isModelOther = form.model === 'Other' || form.model === 'Other - Enter Manually'
  const isColorOther = form.color === 'Other'

  const handlePost = async () => {
    setError(''); setLoading(true)
    try {
      if (!user) throw new Error('Please login to post')
      if (!form.title.trim()) throw new Error('Listing title is required')
      if (!form.price) throw new Error('Price is required')
      if (photos.filter(Boolean).length < 5) throw new Error('Minimum 5 photos required')

      const finalModel = isModelOther ? customModel : form.model
      const finalColor = isColorOther ? customColor : form.color
      const category = listingType === 'vehicle' ? form.category : listingType === 'part' ? 'SparePart' : 'Service'

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        category,
        price: parseInt(form.price),
        location: `${form.area}, ${form.district}, Kerala`,
        year: form.year,
        kilometers: form.km,
        fuel_type: form.fuelType,
        transmission: form.transmission,
        condition: conditionOptions[form.condition - 1]?.label || 'Good',
        color: finalColor,
        owners: form.owners,
        brand: form.brand,
        model: finalModel,
        status: 'Pending',
        verified: false,
        photos: photos.filter(Boolean),
      })
      if (insertError) throw insertError
      success('Listing posted! Verification takes 24–72 hours.')
      navigate('/')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to post listing'
      setError(msg); showError(msg)
    } finally { setLoading(false) }
  }

  const handlePhotoUpload = async (index: number) => {
    if (!fileInputRef.current) return
    fileInputRef.current.dataset.index = index.toString()
    fileInputRef.current.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const index = parseInt(fileInputRef.current?.dataset.index || '0')
    setUploadingIndex(index); setUploading(true)
    try {
      if (!user?.id) throw new Error('Not authenticated')
      const url = await uploadListingPhoto(file, `temp-${Date.now()}`)
      const newPhotos = [...photos]; newPhotos[index] = url
      setPhotos(newPhotos)
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false); setUploadingIndex(-1)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Selector helper styles ──────────────────────────────
  const chip = (active: boolean) => ({
    border: `1.5px solid ${active ? P : BORDER}`,
    background: active ? P + '22' : CARD,
    color: active ? PL : MUTED,
    borderRadius: 10, padding: '8px 4px', cursor: 'pointer',
    fontWeight: 600, fontSize: 13, textAlign: 'center' as const,
    transition: 'all 0.15s',
  })

  // ── STEP 0: Type ────────────────────────────────────────
  if (step === 0) return (
    <div className="pb-safe page-enter" style={{ background: BG, minHeight: '100vh' }}>
      <PageHeader title="Post a Listing" showBack />
      <div className="px-4 py-4">
        <p style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Who are you posting as?</p>
        <p style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>Select your seller type</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { key: 'individual', emoji: '👤', title: 'Individual Owner', sub: 'Free listing', tag: 'FREE', tagColor: '#10B981' },
            { key: 'dealer', emoji: '🏢', title: 'Dealer / Broker', sub: 'Subscription — coming soon', tag: 'SOON', tagColor: MUTED, disabled: true },
          ].map(o => (
            <button key={o.key} disabled={o.disabled}
              onClick={() => setSellerType(o.key as 'individual')}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16,
                border: `2px solid ${sellerType === o.key ? P : BORDER}`,
                background: sellerType === o.key ? P + '15' : CARD,
                opacity: o.disabled ? 0.5 : 1, cursor: o.disabled ? 'not-allowed' : 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 28 }}>{o.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>{o.title}</div>
                <div style={{ color: MUTED, fontSize: 12 }}>{o.sub}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                background: o.tagColor + '22', color: o.tagColor }}>{o.tag}</span>
            </button>
          ))}
        </div>

        <p style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>What are you listing?</p>
        <p style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>Select listing category</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { key: 'vehicle', emoji: '🚗', title: 'Vehicle', sub: 'Car / 2-3 Wheeler / Heavy' },
            { key: 'part', emoji: '🔧', title: 'Spare Part', sub: 'New or used auto parts' },
            { key: 'service', emoji: '🏪', title: 'Service / Shop', sub: 'Inspector / Garage / Accessories' },
          ].map(o => (
            <button key={o.key} onClick={() => setListingType(o.key as 'vehicle')}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16,
                border: `2px solid ${listingType === o.key ? P : BORDER}`,
                background: listingType === o.key ? P + '15' : CARD,
                cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 28 }}>{o.emoji}</span>
              <div>
                <div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>{o.title}</div>
                <div style={{ color: MUTED, fontSize: 12 }}>{o.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <Button fullWidth variant="contained" disabled={!sellerType || !listingType} onClick={next}
          sx={{ bgcolor: P, color: '#fff', fontWeight: 700, borderRadius: '14px', py: 1.5, fontSize: 15,
            '&:hover': { bgcolor: '#6D28D9' }, '&:disabled': { bgcolor: BORDER, color: MUTED } }}>
          Continue
        </Button>
      </div>
    </div>
  )

  // ── Step content for steps 1–5 ──────────────────────────
  const stepContent = () => {
    switch (step) {

      // STEP 1: Photos
      case 1: return (
        <div>
          <p style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Upload Photos</p>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>Minimum 5 required (4 exterior + 1 dashboard)</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 16 }}>
            {photoSlots.map((slot, i) => (
              <button key={i} onClick={() => handlePhotoUpload(i)} disabled={uploading}
                style={{ aspectRatio: '1', borderRadius: 12, border: `2px ${photos[i] ? 'solid' : 'dashed'} ${photos[i] ? P : BORDER}`,
                  background: photos[i] ? P + '15' : CARD, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', padding: 4 }}>
                {uploadingIndex === i && uploading
                  ? <CircularProgress size={18} sx={{ color: PL }} />
                  : photos[i]
                    ? <CheckCircleIcon sx={{ color: PL, fontSize: 20 }} />
                    : <AddPhotoAlternateIcon sx={{ color: MUTED, fontSize: 18 }} />}
                <span style={{ fontSize: 8, color: MUTED, textAlign: 'center', lineHeight: 1.2 }}>{slot.label}</span>
              </button>
            ))}
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 14px' }}>
            <span style={{ color: PL, fontWeight: 700, fontSize: 16 }}>{photos.filter(Boolean).length}</span>
            <span style={{ color: MUTED, fontSize: 13 }}> / 10 photos added</span>
            {photos.filter(Boolean).length < 5 && (
              <span style={{ color: '#F59E0B', fontSize: 11, marginLeft: 8 }}>⚠️ Need {5 - photos.filter(Boolean).length} more</span>
            )}
          </div>
        </div>
      )

      // STEP 2: Vehicle Details
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: -8 }}>Vehicle Details</p>

          {/* Title */}
          <TextField fullWidth label="Listing Title" size="small"
            value={form.title} onChange={e => setField('title', e.target.value)}
            placeholder="e.g. 2022 Maruti Swift ZXI+" />

          {/* Category */}
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select value={form.category} onChange={e => setField('category', e.target.value)} label="Category">
              {['Car','Two Wheeler','Three Wheeler','Heavy Vehicle'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Brand */}
          <FormControl fullWidth size="small">
            <InputLabel>Make / Brand</InputLabel>
            <Select value={form.brand} onChange={e => { setField('brand', e.target.value); setField('model', '') }} label="Make / Brand">
              {allBrands.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Model */}
          {form.brand && (
            <FormControl fullWidth size="small">
              <InputLabel>Model</InputLabel>
              <Select value={form.model} onChange={e => setField('model', e.target.value)} label="Model">
                {selectedModels.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          )}
          {isModelOther && (
            <TextField fullWidth label="Enter Model Name" size="small"
              value={customModel} onChange={e => setCustomModel(e.target.value)}
              placeholder="Type your model name" />
          )}

          {/* Year */}
          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select value={form.year} onChange={e => setField('year', e.target.value)} label="Year">
              {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Fuel Type */}
          <div>
            <p style={{ color: MUTED, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Fuel Type</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {fuelOptions.map(f => (
                <button key={f.value} onClick={() => setField('fuelType', f.value)}
                  style={{ ...chip(form.fuelType === f.value), flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px' }}>
                  <span style={{ fontSize: 20 }}>{f.emoji}</span>
                  <span style={{ fontSize: 10 }}>{f.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <p style={{ color: MUTED, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Transmission</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: 'Manual', e: '⚙️' }, { v: 'Automatic', e: '🤖' }].map(t => (
                <button key={t.v} onClick={() => setField('transmission', t.v)}
                  style={{ ...chip(form.transmission === t.v), flex: 1, padding: '12px 8px', fontSize: 14 }}>
                  {t.e} {t.v}
                </button>
              ))}
            </div>
          </div>

          {/* KM Driven */}
          <div>
            <p style={{ color: MUTED, fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
              KM Driven: <span style={{ color: PL, fontWeight: 700 }}>{form.km.toLocaleString('en-IN')} km</span>
            </p>
            <Slider
              value={form.km} onChange={(_, v) => setField('km', v as number)}
              min={0} max={300000} step={1000}
              sx={{ color: P, '& .MuiSlider-rail': { bgcolor: BORDER }, '& .MuiSlider-thumb': { bgcolor: P } }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: MUTED, fontSize: 10 }}>0 km</span>
              <span style={{ color: MUTED, fontSize: 10 }}>3,00,000 km</span>
            </div>
          </div>

          {/* Condition */}
          <div>
            <p style={{ color: MUTED, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Condition</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {conditionOptions.map(c => (
                <button key={c.value} onClick={() => setField('condition', c.value)}
                  style={{ ...chip(form.condition === c.value), flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px' }}>
                  <span style={{ fontSize: 20 }}>{c.emoji}</span>
                  <span style={{ fontSize: 9 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Owners */}
          <div>
            <p style={{ color: MUTED, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Number of Owners</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4].map(o => (
                <button key={o} onClick={() => setField('owners', o)}
                  style={{ ...chip(form.owners === o), flex: 1, padding: '10px 4px', fontSize: 12 }}>
                  {o === 4 ? '4th+' : `${o === 1 ? '1st' : o === 2 ? '2nd' : '3rd'}`}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p style={{ color: MUTED, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>Color</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {vehicleColors.map(c => (
                <button key={c.name} onClick={() => setField('color', c.name)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
                    background: 'none', border: 'none', padding: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.hex,
                    border: `3px solid ${form.color === c.name ? P : BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: form.color === c.name ? `0 0 0 2px ${P}` : 'none' }}>
                    {form.color === c.name && <span style={{ color: c.name === 'White' || c.name === 'Silver' || c.name === 'Yellow' ? '#000' : '#fff', fontSize: 16 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 9, color: form.color === c.name ? PL : MUTED }}>{c.name}</span>
                </button>
              ))}
              <button onClick={() => setField('color', 'Other')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px dashed ${form.color === 'Other' ? P : BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', background: CARD }}>
                  <span style={{ fontSize: 16, color: MUTED }}>+</span>
                </div>
                <span style={{ fontSize: 9, color: MUTED }}>Other</span>
              </button>
            </div>
            {isColorOther && (
              <TextField fullWidth label="Enter Color" size="small" sx={{ mt: 1 }}
                value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="e.g. Pearl White" />
            )}
          </div>

          {/* Description */}
          <TextField fullWidth label="Description (optional)" size="small" multiline rows={3}
            value={form.description} onChange={e => setField('description', e.target.value)}
            placeholder="Describe condition, history, modifications, reason for selling..." />
        </div>
      )

      // STEP 3: Pricing
      case 3: return (
        <div>
          <p style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Set Your Price</p>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>Set a fair price to attract genuine buyers</p>
          <TextField fullWidth label="Your Price" value={form.price}
            onChange={e => setField('price', e.target.value)} type="number"
            InputProps={{ startAdornment: <InputAdornment position="start"><span style={{ color: TEXT, fontWeight: 700, fontSize: 20 }}>₹</span></InputAdornment> }}
            sx={{ mb: 2, '& input': { color: PL, fontWeight: 800, fontSize: '1.4rem' } }} />
          <Button fullWidth variant="outlined" onClick={() => navigate('/insurance?tab=value')}
            sx={{ borderColor: P, color: PL, borderRadius: '12px', mb: 3, fontWeight: 700, '&:hover': { bgcolor: P + '11' } }}>
            ⚡ Use Price Decider
          </Button>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16 }}>
            <FormControlLabel
              control={<Switch checked={form.negotiable} onChange={e => setField('negotiable', e.target.checked)}
                sx={{ '& .Mui-checked': { color: P }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: P } }} />}
              label={<div><div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Negotiable</div>
                <div style={{ color: MUTED, fontSize: 12 }}>Allow buyers to make offers</div></div>} />
          </div>
        </div>
      )

      // STEP 4: Location & Contact
      case 4: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: -6 }}>Location & Contact</p>
          <div style={{ background: P + '15', border: `1px solid ${P}44`, borderRadius: 10, padding: '8px 12px' }}>
            <span style={{ color: PL, fontSize: 12, fontWeight: 600 }}>📍 State: Kerala (Fixed)</span>
          </div>
          <FormControl fullWidth size="small">
            <InputLabel>District</InputLabel>
            <Select value={form.district} onChange={e => setField('district', e.target.value)} label="District">
              {keralaDistricts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="Area / Town / Panchayat" size="small"
            value={form.area} onChange={e => setField('area', e.target.value)}
            placeholder="e.g. Kasaragod Town, Bekal, Kanhangad" />
          <TextField fullWidth label="WhatsApp Number *" size="small" type="tel"
            value={form.whatsapp} onChange={e => setField('whatsapp', e.target.value)}
            inputProps={{ maxLength: 10 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><span style={{ color: MUTED, fontSize: 13 }}>+91</span></InputAdornment> }} />
          <TextField fullWidth label="Phone for Calls (optional)" size="small" type="tel"
            value={form.phone} onChange={e => setField('phone', e.target.value)}
            inputProps={{ maxLength: 10 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><span style={{ color: MUTED, fontSize: 13 }}>+91</span></InputAdornment> }} />
        </div>
      )

      // STEP 5: Review & Post
      case 5: return (
        <div>
          <p style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Review & Post</p>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>Check all details before posting</p>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
            {[
              ['Title', form.title || '—'],
              ['Category', form.category],
              ['Brand', form.brand || '—'],
              ['Model', isModelOther ? customModel : form.model || '—'],
              ['Year', String(form.year)],
              ['Fuel', form.fuelType],
              ['Transmission', form.transmission],
              ['KM Driven', `${form.km.toLocaleString('en-IN')} km`],
              ['Condition', conditionOptions[form.condition - 1]?.label || '—'],
              ['Owners', `${form.owners}${form.owners === 4 ? '+' : ''}`],
              ['Color', isColorOther ? customColor : form.color || '—'],
              ['Price', form.price ? `₹${parseInt(form.price).toLocaleString('en-IN')}` : '—'],
              ['Negotiable', form.negotiable ? 'Yes' : 'No'],
              ['District', form.district],
              ['Area', form.area || '—'],
              ['WhatsApp', form.whatsapp ? `+91 ${form.whatsapp}` : '—'],
              ['Photos', `${photos.filter(Boolean).length} / 10`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: MUTED, fontSize: 12 }}>{k}</span>
                <span style={{ color: TEXT, fontSize: 13, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button fullWidth variant="contained" onClick={handlePost} disabled={loading}
            sx={{ bgcolor: P, color: '#fff', fontWeight: 800, borderRadius: '14px', py: 1.8, fontSize: 15, mb: 3,
              '&:hover': { bgcolor: '#6D28D9' } }}>
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '🚀 POST LISTING'}
          </Button>
          <div style={{ border: `1px solid #F59E0B55`, borderRadius: 16, padding: 16, background: '#F59E0B11' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <InfoOutlinedIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
              <div>
                <p style={{ color: '#F59E0B', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>About Verification</p>
                <p style={{ color: MUTED, fontSize: 12, lineHeight: 1.6 }}>
                  Your listing goes live immediately. Admin verification takes 24–72 hours. It will show <strong style={{ color: '#F59E0B' }}>Pending</strong> until then.
                </p>
              </div>
            </div>
          </div>
        </div>
      )

      default: return null
    }
  }

  // Step indicator dots
  return (
    <div style={{ background: BG, minHeight: '100vh' }} className="pb-safe page-enter">
      <PageHeader title="Post a Listing" showBack />

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px', justifyContent: 'center' }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: step - 1 === i ? 28 : 8, height: 8, borderRadius: 4, transition: 'all 0.3s',
              background: step - 1 > i ? '#10B981' : step - 1 === i ? P : BORDER }} />
          </div>
        ))}
      </div>

      <div style={{ padding: '0 16px 100px' }}>
        {stepContent()}

        {step > 0 && step < 5 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Button variant="outlined" onClick={back}
              sx={{ borderColor: BORDER, color: MUTED, borderRadius: '12px', flex: 1 }}>
              Back
            </Button>
            <Button variant="contained" onClick={next}
              sx={{ bgcolor: P, color: '#fff', fontWeight: 700, borderRadius: '12px', flex: 2,
                '&:hover': { bgcolor: '#6D28D9' } }}>
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
