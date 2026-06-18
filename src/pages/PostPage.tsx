import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
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
import Slider from '@mui/material/Slider'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckIcon from '@mui/icons-material/Check'
import { useAuth } from '../lib/auth-context'
import { useToast } from '../lib/toast-context'
import { supabase } from '../lib/supabase'
import { uploadListingPhoto } from '../lib/storage'
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

const brandModels: Record<string, string[]> = {
  "Maruti Suzuki": ["800", "Alto", "Alto K10", "S-Presso", "Celerio", "WagonR", "Swift", "Baleno", "Ignis", "Dzire", "Ciaz", "Ertiga", "XL6", "Brezza", "Grand Vitara", "Jimny", "Fronx", "Eeco", "Omni", "Zen", "Esteem", "Gypsy", "SX4", "Other"],
  "Hyundai": ["Santro", "i10", "Grand i10", "i10 Nios", "i20", "i20 N Line", "Verna", "Aura", "Exter", "Venue", "Creta", "Alcazar", "Tucson", "Ioniq 5", "Kona Electric", "Xcent", "Elite i20", "Other"],
  "Honda": ["Amaze", "City", "City Hybrid", "Civic", "Jazz", "WR-V", "HR-V", "Elevate", "CR-V", "Accord", "Brio", "Other"],
  "Tata": ["Nano", "Tiago", "Tigor", "Altroz", "Punch", "Nexon", "Nexon EV", "Harrier", "Safari", "Hexa", "Bolt", "Zest", "Indica", "Indigo", "Sumo", "Xenon", "Sierra", "Other"],
  "Mahindra": ["Thar", "Thar Roxx", "Scorpio", "Scorpio N", "Scorpio Classic", "XUV300", "XUV400", "XUV700", "Bolero", "Bolero Neo", "KUV100", "Marazzo", "TUV300", "Xylo", "Verito", "BE6", "XEV9e", "Other"],
  "Toyota": ["Glanza", "Urban Cruiser", "Hyryder", "Innova Crysta", "Innova HyCross", "Fortuner", "Hilux", "Camry", "Yaris", "Corolla", "Etios", "Etios Liva", "Prius", "Land Cruiser", "Vellfire", "Other"],
  "Kia": ["Seltos", "Sonet", "Carnival", "Carens", "EV6", "EV9", "Other"],
  "MG": ["Hector", "Hector Plus", "Gloster", "Astor", "ZS EV", "Comet EV", "Windsor EV", "Other"],
  "Renault": ["Kwid", "Triber", "Kiger", "Duster", "Captur", "Lodgy", "Other"],
  "Volkswagen": ["Polo", "Vento", "Taigun", "Virtus", "Tiguan", "T-Roc", "Other"],
  "BMW": ["1 Series", "2 Series", "3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7", "M3", "M5", "iX", "i4", "i7", "Other"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "EQS", "EQB", "EQE", "Other"],
  "Audi": ["A3", "A4", "A6", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "RS3", "RS5", "Other"],
  "Royal Enfield": ["Bullet 350", "Classic 350", "Meteor 350", "Hunter 350", "Himalayan", "Scram 411", "Super Meteor 650", "Continental GT 650", "Interceptor 650", "Shotgun 650", "Thunderbird", "Karizma (old)", "Other"],
  "Hero": ["HF Deluxe", "Splendor+", "Splendor Xtec", "Passion Pro", "Glamour", "Destini 125", "Maestro Edge", "Pleasure+", "Xoom", "Xtreme 125R", "Xtreme 160R", "Xtreme 200S", "Xpulse 200", "Xpulse 400", "Karizma XMR", "Other"],
  "Bajaj": ["CT100", "Platina", "Discover 110", "Discover 125", "Pulsar 125", "Pulsar 150", "Pulsar 160NS", "Pulsar 180", "Pulsar 200NS", "Pulsar 220F", "Pulsar RS200", "Pulsar N160", "Pulsar N250", "Dominar 250", "Dominar 400", "Avenger Street 160", "Avenger Cruise 220", "Chetak EV", "Other"],
  "TVS": ["Sport", "Star City+", "Radeon", "Jupiter", "Jupiter 125", "Ntorq 125", "iQube", "iQube S", "Ronin", "Apache RTR 160", "Apache RTR 165RP", "Apache RTR 200 4V", "Apache RR 310", "Raider 125", "XL Super", "Other"],
  "Yamaha": ["RX100", "RX135", "FZ-S", "FZ-FI", "FZS-FI", "FZ25", "MT-15", "R15 V4", "R15S", "R3", "MT-03", "FZ-X", "Ray ZR", "Ray ZR Street Rally", "Fascino 125", "Aerox 155", "Other"],
  "Suzuki": ["Access 125", "Burgman Street", "Avenis 125", "Gixxer 150", "Gixxer SF 150", "Gixxer 250", "Gixxer SF 250", "V-Strom SX", "Other"],
  "KTM": ["Duke 125", "Duke 200", "Duke 250", "Duke 390", "Duke 390 (2024)", "RC 125", "RC 200", "RC 390", "Adventure 250", "Adventure 390", "Adventure 890", "Other"],
  "Ashok Leyland": ["Dost", "Dost+", "Partner", "Bada Dost", "Boss", "Captain", "Ecomet", "Viking Bus", "Lynx Bus", "Other"],
  "Tata Commercial": ["Ace", "Ace EV", "Super Ace", "Yodha Pickup", "Ultra T.7", "LPT 407", "LPT 1109", "Signa 1918", "Prima", "Other"],
  "Eicher": ["Pro 1049", "Pro 1059", "Pro 2049", "Pro 3015", "Pro 5016", "Pro 6016", "Pro 6028", "Pro 8035", "Other"],
  "Force": ["Traveller 3350", "Traveller 4020", "Urbania", "Gurkha", "Trax Toofan", "Citiline", "Other"],
  "Other": ["Other - Enter Manually"],
}

const years = Array.from({ length: 46 }, (_, i) => 2025 - i)

const fuelOptions = [
  { value: 'Petrol', emoji: '⛽' },
  { value: 'Diesel', emoji: '🛢️' },
  { value: 'Electric', emoji: '⚡' },
  { value: 'CNG', emoji: '🔵' },
  { value: 'LPG', emoji: '🟡' },
]

const conditionOptions = [
  { value: 'Poor', emoji: '💔' },
  { value: 'Fair', emoji: '😐' },
  { value: 'Good', emoji: '🙂' },
  { value: 'Very Good', emoji: '😊' },
  { value: 'Excellent', emoji: '🌟' },
]

const ownerOptions = ['1st Owner', '2nd Owner', '3rd Owner', '4th or more']

const colorOptions = [
  { label: 'White', hex: '#FFFFFF', border: '#ccc' },
  { label: 'Silver', hex: '#C0C0C0', border: '#aaa' },
  { label: 'Black', hex: '#1a1a1a', border: '#555' },
  { label: 'Red', hex: '#DC2626', border: '#DC2626' },
  { label: 'Blue', hex: '#2563EB', border: '#2563EB' },
  { label: 'Brown', hex: '#92400E', border: '#92400E' },
  { label: 'Grey', hex: '#6B7280', border: '#6B7280' },
  { label: 'Green', hex: '#16A34A', border: '#16A34A' },
  { label: 'Yellow', hex: '#EAB308', border: '#EAB308' },
  { label: 'Orange', hex: '#EA580C', border: '#EA580C' },
  { label: 'Other', hex: null, border: '#7C3AED' },
]

const keralaDistricts = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
]

function formatKmDisplay(v: number) {
  if (v === 0) return '0 km'
  return v.toLocaleString('en-IN') + ' km'
}

interface DetailsErrors {
  brand?: string
  model?: string
  year?: string
  fuelType?: string
  transmission?: string
  condition?: string
  color?: string
  owners?: string
}

interface LocationErrors {
  district?: string
  area?: string
}

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
  const [detailsErrors, setDetailsErrors] = useState<DetailsErrors>({})
  const [locationErrors, setLocationErrors] = useState<LocationErrors>({})
  const [customModel, setCustomModel] = useState('')
  const [customColor, setCustomColor] = useState('')

  const [form, setForm] = useState({
    title: '',
    category: 'Car',
    brand: '',
    model: '',
    year: 2025,
    fuelType: '',
    transmission: '',
    condition: '',
    km: 0,
    owners: '',
    color: '',
    description: '',
    price: '',
    negotiable: false,
    district: 'Kasaragod',
    area: '',
    whatsapp: '',
    phone: '',
  })

  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => {
    if (step === 0) navigate(-1)
    else setStep(s => s - 1)
  }

  const setField = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const modelsForBrand = form.brand ? (brandModels[form.brand] ?? []) : []
  const showCustomModel = form.model === 'Other' || form.model === 'Other - Enter Manually'
  const showCustomColor = form.color === 'Other'

  const effectiveModel = showCustomModel ? customModel : form.model
  const effectiveColor = showCustomColor ? customColor : form.color

  const validateDetails = () => {
    const errs: DetailsErrors = {}
    if (!form.brand) errs.brand = 'Please select a brand'
    if (!form.model) errs.model = 'Please select a model'
    if (showCustomModel && !customModel.trim()) errs.model = 'Please enter the model name'
    if (!form.year) errs.year = 'Please select a year'
    if (!form.fuelType) errs.fuelType = 'Please select fuel type'
    if (!form.transmission) errs.transmission = 'Please select transmission'
    if (!form.condition) errs.condition = 'Please select condition'
    if (!form.color) errs.color = 'Please select a color'
    if (showCustomColor && !customColor.trim()) errs.color = 'Please enter the color'
    if (!form.owners) errs.owners = 'Please select number of owners'
    setDetailsErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateLocation = () => {
    const errs: LocationErrors = {}
    if (!form.district) errs.district = 'Please select a district'
    if (!form.area.trim()) errs.area = 'Please enter area / locality'
    setLocationErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleContinue = () => {
    if (step === 2 && !validateDetails()) return
    if (step === 4 && !validateLocation()) return
    next()
  }

  const handlePost = async () => {
    setError('')
    setLoading(true)
    try {
      if (!user) throw new Error('User not authenticated')
      if (!form.price) throw new Error('Price is required')
      if (photos.filter(Boolean).length < 5) throw new Error('Minimum 5 photos required')

      const category = listingType === 'vehicle' ? form.category : (listingType === 'part' ? 'SparePart' : 'Service')
      const displayTitle = form.title || `${form.year} ${form.brand} ${effectiveModel}`

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        title: displayTitle,
        description: form.description,
        category,
        price: parseInt(form.price),
        location: `${form.area}, ${form.district}, Kerala`,
        year: form.year,
        kilometers: form.km,
        fuel_type: form.fuelType,
        transmission: form.transmission,
        condition: form.condition,
        color: effectiveColor,
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
      success('Photo uploaded!')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadingIndex(-1)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const PURPLE = '#7C3AED'
  const PURPLE_BG = 'rgba(124,58,237,0.15)'
  const PURPLE_BORDER = '#7C3AED'
  const INACTIVE_BG = '#111D35'
  const INACTIVE_BORDER = '#1E2D47'
  const TEXT_PRIMARY = '#E8EDF5'
  const TEXT_SECONDARY = '#7A8BA8'

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
                  sellerType === opt.key ? 'border-[#7C3AED] bg-[rgba(124,58,237,0.12)]' : 'border-[#1E2D47] bg-[#0D1526]'
                } ${opt.key === 'dealer' ? 'opacity-50' : 'active:scale-[0.98]'}`}
              >
                <div className="text-3xl">{opt.emoji}</div>
                <div className="flex-1">
                  <div className="text-[#E8EDF5] font-semibold">{opt.title}</div>
                  <div className="text-[#7A8BA8] text-sm">{opt.subtitle}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  opt.tag === 'FREE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1E2D47] text-[#7A8BA8]'
                }`}>{opt.tag}</span>
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
                  listingType === opt.key ? 'border-[#7C3AED] bg-[rgba(124,58,237,0.12)]' : 'border-[#1E2D47] bg-[#0D1526]'
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
            fullWidth variant="contained"
            disabled={!sellerType || !listingType}
            onClick={next}
            sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 700, borderRadius: '14px', py: 1.5 }}
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  const stepContent = () => {
    switch (step) {
      // Step 1: Photos
      case 1:
        return (
          <div>
            <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base mb-1">Upload Photos</h3>
            <p style={{ color: TEXT_SECONDARY }} className="text-sm mb-4">Minimum 5 photos required for verification</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
            <div className="grid grid-cols-5 gap-2 mb-4">
              {photoSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handlePhotoUpload(i)}
                  disabled={uploading}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative ${
                    photos[i] ? 'border-[#7C3AED] bg-[rgba(124,58,237,0.12)]' : 'border-[#1E2D47] border-dashed bg-[#111D35]'
                  }`}
                >
                  {uploadingIndex === i && uploading ? (
                    <CircularProgress size={20} sx={{ color: PURPLE }} />
                  ) : photos[i] ? (
                    <CheckCircleIcon sx={{ color: PURPLE, fontSize: 20 }} />
                  ) : (
                    <AddPhotoAlternateIcon sx={{ color: TEXT_SECONDARY, fontSize: 18 }} />
                  )}
                  <span className="text-[8px] leading-tight text-center" style={{ color: TEXT_SECONDARY }}>{slot.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-[#111D35] border border-[#1E2D47] rounded-xl px-3 py-2 mb-4">
              <InfoOutlinedIcon sx={{ color: PURPLE, fontSize: 16 }} />
              <span className="text-xs" style={{ color: TEXT_SECONDARY }}>Minimum 5 photos required for verification</span>
            </div>
            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-xl px-4 py-2">
              <span style={{ color: PURPLE }} className="font-bold">{photos.filter(Boolean).length}</span>
              <span className="text-sm" style={{ color: TEXT_SECONDARY }}> / 10 photos added</span>
            </div>
          </div>
        )

      // Step 2: Vehicle Details
      case 2:
        return (
          <div className="flex flex-col gap-5">
            <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base mb-0">Vehicle Details</h3>

            {/* FIELD 1: Make / Brand */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Make / Brand</p>
              <FormControl fullWidth size="small" error={!!detailsErrors.brand}>
                <InputLabel>Select Brand</InputLabel>
                <Select
                  value={form.brand}
                  onChange={e => {
                    setField('brand', e.target.value)
                    setField('model', '')
                    setCustomModel('')
                    setDetailsErrors(prev => ({ ...prev, brand: undefined, model: undefined }))
                  }}
                  label="Select Brand"
                  MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                >
                  {Object.keys(brandModels).map(b => (
                    <MenuItem key={b} value={b}>{b}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {detailsErrors.brand && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.brand}</p>}
            </div>

            {/* FIELD 2: Model */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Model</p>
              <FormControl fullWidth size="small" disabled={!form.brand} error={!!detailsErrors.model}>
                <InputLabel>Select Model</InputLabel>
                <Select
                  value={form.model}
                  onChange={e => {
                    setField('model', e.target.value)
                    setCustomModel('')
                    setDetailsErrors(prev => ({ ...prev, model: undefined }))
                  }}
                  label="Select Model"
                  MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                >
                  {modelsForBrand.map(m => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {showCustomModel && (
                <TextField
                  fullWidth size="small"
                  placeholder="Enter model name"
                  value={customModel}
                  onChange={e => { setCustomModel(e.target.value); setDetailsErrors(prev => ({ ...prev, model: undefined })) }}
                  sx={{ mt: 1.5 }}
                />
              )}
              {detailsErrors.model && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.model}</p>}
            </div>

            {/* FIELD 3: Year */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Year</p>
              <FormControl fullWidth size="small" error={!!detailsErrors.year}>
                <InputLabel>Select Year</InputLabel>
                <Select
                  value={form.year}
                  onChange={e => { setField('year', e.target.value); setDetailsErrors(prev => ({ ...prev, year: undefined })) }}
                  label="Select Year"
                  MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                >
                  {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
              {detailsErrors.year && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.year}</p>}
            </div>

            {/* FIELD 4: Fuel Type */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Fuel Type</p>
              <div className="flex gap-2 flex-wrap">
                {fuelOptions.map(opt => {
                  const selected = form.fuelType === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setField('fuelType', opt.value); setDetailsErrors(prev => ({ ...prev, fuelType: undefined })) }}
                      style={{
                        flex: '1 1 0',
                        minWidth: 60,
                        padding: '10px 6px',
                        borderRadius: 12,
                        border: `2px solid ${selected ? PURPLE_BORDER : INACTIVE_BORDER}`,
                        background: selected ? PURPLE_BG : INACTIVE_BG,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: selected ? PURPLE : TEXT_SECONDARY }}>{opt.value}</span>
                    </button>
                  )
                })}
              </div>
              {detailsErrors.fuelType && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.fuelType}</p>}
            </div>

            {/* FIELD 5: Transmission */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Transmission</p>
              <div className="flex gap-3">
                {[{ value: 'Manual', emoji: '⚙️' }, { value: 'Automatic', emoji: '🤖' }].map(opt => {
                  const selected = form.transmission === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setField('transmission', opt.value); setDetailsErrors(prev => ({ ...prev, transmission: undefined })) }}
                      style={{
                        flex: 1,
                        padding: '14px 8px',
                        borderRadius: 14,
                        border: `2px solid ${selected ? PURPLE_BORDER : INACTIVE_BORDER}`,
                        background: selected ? PURPLE_BG : INACTIVE_BG,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 26 }}>{opt.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: selected ? PURPLE : TEXT_SECONDARY }}>{opt.value}</span>
                    </button>
                  )
                })}
              </div>
              {detailsErrors.transmission && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.transmission}</p>}
            </div>

            {/* FIELD 6: Condition */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Condition</p>
              <div className="flex gap-2">
                {conditionOptions.map(opt => {
                  const selected = form.condition === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setField('condition', opt.value); setDetailsErrors(prev => ({ ...prev, condition: undefined })) }}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: 12,
                        border: `2px solid ${selected ? PURPLE_BORDER : INACTIVE_BORDER}`,
                        background: selected ? PURPLE_BG : INACTIVE_BG,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                      {selected && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: PURPLE, lineHeight: 1.1, textAlign: 'center' }}>{opt.value}</span>
                      )}
                    </button>
                  )
                })}
              </div>
              {detailsErrors.condition && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.condition}</p>}
            </div>

            {/* FIELD 7: KM Driven */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold" style={{ color: TEXT_SECONDARY }}>KM Driven</p>
                <span style={{ color: PURPLE, fontWeight: 700, fontSize: 14 }}>{formatKmDisplay(form.km)}</span>
              </div>
              <Slider
                value={form.km}
                onChange={(_, v) => setField('km', v as number)}
                min={0}
                max={300000}
                step={500}
                sx={{
                  color: PURPLE,
                  '& .MuiSlider-rail': { backgroundColor: INACTIVE_BORDER },
                  '& .MuiSlider-thumb': {
                    backgroundColor: PURPLE,
                    width: 22,
                    height: 22,
                    '&:hover, &.Mui-active': { boxShadow: `0 0 0 8px rgba(124,58,237,0.2)` },
                  },
                  '& .MuiSlider-track': { backgroundColor: PURPLE, border: 'none' },
                }}
              />
              <div className="flex justify-between mt-0.5">
                <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>0 km</span>
                <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>3,00,000 km</span>
              </div>
            </div>

            {/* FIELD 8: Number of Owners */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Number of Owners</p>
              <div className="flex gap-2">
                {ownerOptions.map(opt => {
                  const selected = form.owners === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => { setField('owners', opt); setDetailsErrors(prev => ({ ...prev, owners: undefined })) }}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: 12,
                        border: `2px solid ${selected ? PURPLE_BORDER : INACTIVE_BORDER}`,
                        background: selected ? PURPLE_BG : INACTIVE_BG,
                        fontSize: 11,
                        fontWeight: 700,
                        color: selected ? PURPLE : TEXT_SECONDARY,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {detailsErrors.owners && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.owners}</p>}
            </div>

            {/* FIELD 9: Color */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Color</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {colorOptions.map(col => {
                  const selected = form.color === col.label
                  return (
                    <button
                      key={col.label}
                      onClick={() => { setField('color', col.label); setCustomColor(''); setDetailsErrors(prev => ({ ...prev, color: undefined })) }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                      }}
                    >
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: col.hex ?? `linear-gradient(135deg, ${PURPLE}, #A855F7)`,
                        border: `3px solid ${selected ? PURPLE : col.border}`,
                        boxShadow: selected ? `0 0 0 2px ${PURPLE}` : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {selected && (
                          <CheckIcon sx={{ fontSize: 18, color: col.label === 'White' || col.label === 'Yellow' || col.label === 'Silver' ? '#222' : '#fff' }} />
                        )}
                      </div>
                      <span style={{ fontSize: 10, color: selected ? PURPLE : TEXT_SECONDARY, fontWeight: selected ? 700 : 400 }}>{col.label}</span>
                    </button>
                  )
                })}
              </div>
              {showCustomColor && (
                <TextField
                  fullWidth size="small"
                  placeholder="Enter color name"
                  value={customColor}
                  onChange={e => { setCustomColor(e.target.value); setDetailsErrors(prev => ({ ...prev, color: undefined })) }}
                  sx={{ mt: 1.5 }}
                />
              )}
              {detailsErrors.color && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{detailsErrors.color}</p>}
            </div>

            {/* Description */}
            <TextField
              fullWidth label="Description (optional)" size="small" multiline rows={3}
              value={form.description} onChange={e => setField('description', e.target.value)}
              placeholder="Describe the vehicle condition, history, modifications..."
            />
          </div>
        )

      // Step 3: Pricing
      case 3:
        return (
          <div>
            <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base mb-1">Set Your Price</h3>
            <p style={{ color: TEXT_SECONDARY }} className="text-sm mb-4">Set a competitive price to sell faster</p>
            <div className="mb-4">
              <TextField
                fullWidth label="Your Price"
                value={form.price} onChange={e => setField('price', e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><span style={{ color: TEXT_PRIMARY, fontWeight: 700, fontSize: '1.25rem' }}>₹</span></InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { fontSize: '1.5rem', fontWeight: 700 },
                  '& input': { color: PURPLE, fontWeight: 800, fontSize: '1.5rem' },
                }}
              />
            </div>
            <Button
              fullWidth variant="outlined"
              onClick={() => navigate('/price-decider?returnTo=/post')}
              sx={{
                borderColor: PURPLE, color: PURPLE,
                borderRadius: '12px', mb: 4, fontWeight: 700,
                '&:hover': { bgcolor: PURPLE_BG },
              }}
            >
              <AutoAwesomeIcon sx={{ mr: 1, fontSize: 18 }} />
              Use AI Price Decider
            </Button>
            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-xl p-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={form.negotiable}
                    onChange={e => setField('negotiable', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: PURPLE },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: PURPLE },
                    }}
                  />
                }
                label={
                  <div>
                    <div style={{ color: TEXT_PRIMARY }} className="font-semibold text-sm">Negotiable</div>
                    <div style={{ color: TEXT_SECONDARY }} className="text-xs">Buyers can make offers</div>
                  </div>
                }
              />
            </div>
          </div>
        )

      // Step 4: Location
      case 4:
        return (
          <div className="flex flex-col gap-4">
            <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base mb-0">Location & Contact</h3>

            <div style={{ background: `rgba(124,58,237,0.1)`, border: `1px solid rgba(124,58,237,0.3)`, borderRadius: 12 }} className="px-3 py-2">
              <span style={{ color: PURPLE }} className="text-xs font-semibold">📍 State: Kerala (Fixed)</span>
            </div>

            {/* FIELD 10: District */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>District</p>
              <FormControl fullWidth size="small" error={!!locationErrors.district}>
                <InputLabel>Select District</InputLabel>
                <Select
                  value={form.district}
                  onChange={e => { setField('district', e.target.value); setLocationErrors(prev => ({ ...prev, district: undefined })) }}
                  label="Select District"
                >
                  {keralaDistricts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
              {locationErrors.district && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{locationErrors.district}</p>}
            </div>

            {/* FIELD 11: Area / Locality */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Area / Locality</p>
              <TextField
                fullWidth size="small"
                placeholder="Enter your area, town or panchayat name"
                value={form.area}
                onChange={e => { setField('area', e.target.value); setLocationErrors(prev => ({ ...prev, area: undefined })) }}
                error={!!locationErrors.area}
              />
              {locationErrors.area && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{locationErrors.area}</p>}
            </div>

            <TextField
              fullWidth label="WhatsApp Number *" size="small"
              value={form.whatsapp} onChange={e => setField('whatsapp', e.target.value)}
              type="tel" inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><span style={{ color: TEXT_SECONDARY }} className="text-sm">+91</span></InputAdornment>,
              }}
            />
            <TextField
              fullWidth label="Phone Number for Calls (optional)" size="small"
              value={form.phone} onChange={e => setField('phone', e.target.value)}
              type="tel" inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><span style={{ color: TEXT_SECONDARY }} className="text-sm">+91</span></InputAdornment>,
              }}
            />
          </div>
        )

      // Step 5: Review
      case 5:
        return (
          <div>
            <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base mb-1">Review & Post</h3>
            <p style={{ color: TEXT_SECONDARY }} className="text-sm mb-4">Check all details before posting</p>
            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
              {[
                ['Brand', form.brand || '—'],
                ['Model', effectiveModel || '—'],
                ['Year', form.year.toString()],
                ['Fuel', form.fuelType || '—'],
                ['Transmission', form.transmission || '—'],
                ['KM Driven', formatKmDisplay(form.km)],
                ['Condition', form.condition || '—'],
                ['Owners', form.owners || '—'],
                ['Color', effectiveColor || '—'],
                ['Price', form.price ? `₹${parseInt(form.price).toLocaleString('en-IN')}` : 'Not set'],
                ['Negotiable', form.negotiable ? 'Yes' : 'No'],
                ['District', form.district],
                ['Area', form.area || 'Not set'],
                ['WhatsApp', form.whatsapp || 'Not set'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1.5 border-b border-[#1E2D47] last:border-0">
                  <span style={{ color: TEXT_SECONDARY }} className="text-xs">{k}</span>
                  <span style={{ color: TEXT_PRIMARY }} className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <Button
              fullWidth variant="contained"
              onClick={handlePost}
              disabled={loading}
              sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 800, borderRadius: '14px', py: 1.5, fontSize: '1rem', mb: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : '🚀 POST LISTING'}
            </Button>
            <div style={{ border: '1px solid #FF6B35', borderRadius: 16, background: 'rgba(255,107,53,0.06)' }} className="p-4">
              <div className="flex gap-2">
                <InfoOutlinedIcon sx={{ color: '#FF6B35', fontSize: 18, mt: 0.2 }} />
                <div>
                  <p style={{ color: '#FF6B35' }} className="font-semibold text-sm">About Verification</p>
                  <p style={{ color: TEXT_SECONDARY }} className="text-xs mt-1 leading-relaxed">
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
      <div className="px-4 py-3">
        <Stepper activeStep={step - 1} alternativeLabel>
          {STEPS.map(label => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': { color: TEXT_SECONDARY, fontSize: '0.6rem' },
                '& .MuiStepLabel-label.Mui-active': { color: PURPLE },
                '& .MuiStepLabel-label.Mui-completed': { color: '#10b981' },
                '& .MuiStepIcon-root': { color: INACTIVE_BORDER },
                '& .MuiStepIcon-root.Mui-active': { color: PURPLE },
                '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' },
              }}>{label}</StepLabel>
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
              sx={{ borderColor: INACTIVE_BORDER, color: TEXT_SECONDARY, borderRadius: '12px', flex: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 700, borderRadius: '12px', flex: 2 }}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
