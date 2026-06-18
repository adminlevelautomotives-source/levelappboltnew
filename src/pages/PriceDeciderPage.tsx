import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Slider from '@mui/material/Slider'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PageHeader from '../components/PageHeader'

const STEPS = ['Type', 'Vehicle', 'Details', 'Result']

const brandModels: Record<string, string[]> = {
  "Maruti Suzuki": ["800", "Alto", "Alto K10", "S-Presso", "Celerio", "WagonR", "Swift", "Baleno", "Ignis", "Dzire", "Ciaz", "Ertiga", "XL6", "Brezza", "Grand Vitara", "Jimny", "Fronx", "Eeco", "Omni", "Other"],
  "Hyundai": ["Santro", "i10", "Grand i10", "i10 Nios", "i20", "i20 N Line", "Verna", "Aura", "Exter", "Venue", "Creta", "Alcazar", "Tucson", "Ioniq 5", "Kona Electric", "Other"],
  "Honda": ["Amaze", "City", "City Hybrid", "Civic", "Jazz", "WR-V", "HR-V", "Elevate", "CR-V", "Accord", "Brio", "Other"],
  "Tata": ["Nano", "Tiago", "Tigor", "Altroz", "Punch", "Nexon", "Nexon EV", "Harrier", "Safari", "Hexa", "Bolt", "Zest", "Indica", "Indigo", "Other"],
  "Mahindra": ["Thar", "Thar Roxx", "Scorpio", "Scorpio N", "Scorpio Classic", "XUV300", "XUV400", "XUV700", "Bolero", "Bolero Neo", "KUV100", "Marazzo", "TUV300", "Xylo", "Other"],
  "Toyota": ["Glanza", "Urban Cruiser", "Hyryder", "Innova Crysta", "Innova HyCross", "Fortuner", "Hilux", "Camry", "Yaris", "Corolla", "Etios", "Land Cruiser", "Other"],
  "Kia": ["Seltos", "Sonet", "Carnival", "Carens", "EV6", "EV9", "Other"],
  "MG": ["Hector", "Hector Plus", "Gloster", "Astor", "ZS EV", "Comet EV", "Windsor EV", "Other"],
  "Renault": ["Kwid", "Triber", "Kiger", "Duster", "Captur", "Other"],
  "Volkswagen": ["Polo", "Vento", "Taigun", "Virtus", "Tiguan", "T-Roc", "Other"],
  "BMW": ["1 Series", "2 Series", "3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7", "iX", "i4", "i7", "Other"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "EQS", "EQB", "EQE", "Other"],
  "Audi": ["A3", "A4", "A6", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "Other"],
  "Royal Enfield": ["Bullet 350", "Classic 350", "Meteor 350", "Hunter 350", "Himalayan", "Scram 411", "Super Meteor 650", "Continental GT 650", "Interceptor 650", "Shotgun 650", "Thunderbird", "Other"],
  "Hero": ["HF Deluxe", "Splendor+", "Splendor Xtec", "Passion Pro", "Glamour", "Destini 125", "Maestro Edge", "Pleasure+", "Xoom", "Xtreme 125R", "Xtreme 160R", "Xpulse 200", "Other"],
  "Bajaj": ["CT100", "Platina", "Discover 110", "Discover 125", "Pulsar 125", "Pulsar 150", "Pulsar 200NS", "Pulsar 220F", "Pulsar RS200", "Dominar 250", "Dominar 400", "Avenger Street 160", "Chetak EV", "Other"],
  "TVS": ["Sport", "Star City+", "Radeon", "Jupiter", "Jupiter 125", "Ntorq 125", "iQube", "Ronin", "Apache RTR 160", "Apache RTR 200 4V", "Apache RR 310", "Raider 125", "Other"],
  "Yamaha": ["RX100", "FZ-S", "FZ-FI", "FZS-FI", "MT-15", "R15 V4", "R3", "FZ-X", "Ray ZR", "Fascino 125", "Aerox 155", "Other"],
  "Suzuki": ["Access 125", "Burgman Street", "Avenis 125", "Gixxer 150", "Gixxer SF 150", "Gixxer 250", "V-Strom SX", "Other"],
  "KTM": ["Duke 125", "Duke 200", "Duke 250", "Duke 390", "RC 125", "RC 200", "RC 390", "Adventure 250", "Adventure 390", "Other"],
  "Other": ["Other - Enter Manually"],
}

const years = Array.from({ length: 46 }, (_, i) => 2025 - i)

const vehicleTypes = [
  { key: 'car', emoji: '🚗', title: 'Car', subtitle: 'Hatchback, Sedan, SUV, MUV' },
  { key: 'twoWheeler', emoji: '🏍️', title: '2-Wheeler', subtitle: 'Scooter, Bike, Cruiser' },
  { key: 'heavy', emoji: '🚛', title: 'Heavy Vehicle', subtitle: 'Truck, Bus, Commercial' },
]

const fuelOptions = [
  { value: 'Petrol', emoji: '⛽' },
  { value: 'Diesel', emoji: '🛢️' },
  { value: 'Electric', emoji: '⚡' },
  { value: 'CNG', emoji: '🔵' },
  { value: 'LPG', emoji: '🟡' },
]

const conditionOptions = [
  { value: 'Poor', emoji: '💔', desc: 'Major repairs needed' },
  { value: 'Fair', emoji: '😐', desc: 'Some issues present' },
  { value: 'Good', emoji: '🙂', desc: 'Minor wear & tear' },
  { value: 'Very Good', emoji: '😊', desc: 'Well maintained' },
  { value: 'Excellent', emoji: '🌟', desc: 'Like new condition' },
]

const ownerOptions = ['1st Owner', '2nd Owner', '3rd Owner', '4th or more']

const keralaDistricts = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
]

// Base price ranges for popular models (in lakhs)
const basePrices: Record<string, { new: number; resale: number }> = {
  // Maruti Suzuki
  "Swift": { new: 7, resale: 5 },
  "Baleno": { new: 8, resale: 6 },
  "Dzire": { new: 8, resale: 5.5 },
  "WagonR": { new: 6, resale: 4 },
  "Celerio": { new: 6, resale: 4 },
  "Brezza": { new: 11, resale: 8 },
  "Ertiga": { new: 13, resale: 9 },
  "Ciaz": { new: 12, resale: 7 },
  "Grand Vitara": { new: 15, resale: 12 },
  "Alto": { new: 4, resale: 2.5 },
  "Alto K10": { new: 5, resale: 3.5 },
  // Hyundai
  "Creta": { new: 14, resale: 10 },
  "Venue": { new: 10, resale: 7 },
  "i20": { new: 9, resale: 6 },
  "Verna": { new: 13, resale: 8 },
  "Grand i10": { new: 7, resale: 4.5 },
  "i10 Nios": { new: 7, resale: 5 },
  "Tucson": { new: 30, resale: 20 },
  // Tata
  "Nexon": { new: 11, resale: 8 },
  "Nexon EV": { new: 16, resale: 12 },
  "Harrier": { new: 19, resale: 13 },
  "Safari": { new: 20, resale: 14 },
  "Punch": { new: 7, resale: 5 },
  "Tiago": { new: 6, resale: 4 },
  "Altroz": { new: 8, resale: 5.5 },
  // Mahindra
  "Thar": { new: 14, resale: 11 },
  "Scorpio": { new: 17, resale: 12 },
  "Scorpio N": { new: 18, resale: 15 },
  "XUV700": { new: 20, resale: 16 },
  "XUV300": { new: 11, resale: 8 },
  "Bolero": { new: 12, resale: 8 },
  // Toyota
  "Innova Crysta": { new: 25, resale: 18 },
  "Innova HyCross": { new: 28, resale: 22 },
  "Fortuner": { new: 45, resale: 32 },
  "Camry": { new: 50, resale: 30 },
  "Glanza": { new: 8, resale: 5.5 },
  "Hyryder": { new: 14, resale: 10 },
  "Urban Cruiser": { new: 12, resale: 8 },
  // Kia
  "Seltos": { new: 14, resale: 10 },
  "Sonet": { new: 10, resale: 7 },
  "Carens": { new: 15, resale: 11 },
  "Carnival": { new: 35, resale: 24 },
  // Honda
  "City": { new: 14, resale: 9 },
  "Amaze": { new: 9, resale: 6 },
  "Elevate": { new: 13, resale: 10 },
  "WR-V": { new: 12, resale: 8 },
  // Royal Enfield
  "Classic 350": { new: 2.2, resale: 1.6 },
  "Bullet 350": { new: 1.8, resale: 1.3 },
  "Hunter 350": { new: 1.8, resale: 1.4 },
  "Meteor 350": { new: 2.1, resale: 1.5 },
  "Himalayan": { new: 2.5, resale: 1.8 },
  "Continental GT 650": { new: 3.3, resale: 2.4 },
  "Interceptor 650": { new: 3.1, resale: 2.2 },
  // Other bikes
  "Pulsar 150": { new: 1.3, resale: 0.8 },
  "Pulsar 200NS": { new: 1.7, resale: 1.1 },
  "Apache RTR 160": { new: 1.4, resale: 0.9 },
  "FZ-S": { new: 1.4, resale: 0.9 },
  "R15 V4": { new: 1.9, resale: 1.3 },
  "MT-15": { new: 1.8, resale: 1.2 },
  "Access 125": { new: 0.9, resale: 0.6 },
  "Jupiter": { new: 0.85, resale: 0.55 },
  "Ntorq 125": { new: 1.1, resale: 0.75 },
  "Activa 6G": { new: 0.85, resale: 0.6 },
}

function formatKmDisplay(v: number) {
  if (v === 0) return '0 km'
  return v.toLocaleString('en-IN') + ' km'
}

function formatPriceDisplay(lakhs: number) {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(1)} Cr`
  if (lakhs >= 1) return `₹${lakhs.toFixed(1)} L`
  return `₹${(lakhs * 100000).toLocaleString('en-IN')}`
}

function formatPriceFull(lakhs: number) {
  return `₹${Math.round(lakhs * 100000).toLocaleString('en-IN')}`
}

export default function PriceDeciderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo')

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [customBrand, setCustomBrand] = useState('')
  const [customModel, setCustomModel] = useState('')

  const [form, setForm] = useState({
    vehicleType: '',
    brand: '',
    model: '',
    year: 2025,
    fuelType: '',
    condition: '',
    km: 30000,
    owners: '1st Owner',
    district: 'Kasaragod',
  })

  const PURPLE = '#7C3AED'
  const PURPLE_BG = 'rgba(124,58,237,0.15)'
  const PURPLE_BORDER = '#7C3AED'
  const INACTIVE_BG = '#111D35'
  const INACTIVE_BORDER = '#1E2D47'
  const TEXT_PRIMARY = '#E8EDF5'
  const TEXT_SECONDARY = '#7A8BA8'

  const next = () => setStep(s => Math.min(s + 1, 3))
  const back = () => {
    if (step === 0) navigate(-1)
    else setStep(s => s - 1)
  }

  const setField = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const modelsForBrand = form.brand ? (brandModels[form.brand] ?? []) : []
  const showCustomBrand = form.brand === 'Other'
  const showCustomModel = form.model === 'Other' || form.model === 'Other - Enter Manually'

  const effectiveBrand = showCustomBrand ? customBrand : form.brand
  const effectiveModel = showCustomModel ? customModel : form.model

  // AI Price Calculation
  const aiResult = useMemo(() => {
    if (!form.brand || !form.model || !form.year || !form.condition) return null

    const currentYear = 2025
    const age = currentYear - form.year

    // Get base price for this model
    let basePrice = basePrices[effectiveModel]
    if (!basePrice) {
      // Estimate based on brand category
      const premiumBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Land Rover', 'Volvo', 'Jeep']
      const budgetBrands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Renault', 'Datsun']

      if (premiumBrands.includes(effectiveBrand)) {
        basePrice = { new: 35, resale: 22 }
      } else if (budgetBrands.includes(effectiveBrand)) {
        basePrice = { new: 8, resale: 5 }
      } else {
        basePrice = { new: 15, resale: 10 }
      }
    }

    // Calculate depreciation
    let priceMultiplier = 1
    const depreciations = [1, 0.82, 0.72, 0.65, 0.58, 0.52, 0.48, 0.44, 0.41, 0.38, 0.35]
    if (age < depreciations.length) {
      priceMultiplier = depreciations[age]
    } else {
      priceMultiplier = Math.max(0.15, 0.35 - (age - 10) * 0.02)
    }

    // Condition adjustments
    const conditionMultipliers: Record<string, number> = {
      'Excellent': 1.15,
      'Very Good': 1.05,
      'Good': 1.0,
      'Fair': 0.85,
      'Poor': 0.65,
    }

    // KM adjustments (assume 12,000 km per year as average)
    const expectedKm = age * 12000
    const kmRatio = form.km / Math.max(expectedKm, 1000)
    let kmMultiplier = 1
    if (kmRatio > 1.5) kmMultiplier = 0.9
    else if (kmRatio > 2) kmMultiplier = 0.8
    else if (kmRatio > 2.5) kmMultiplier = 0.7
    else if (kmRatio < 0.7) kmMultiplier = 1.05

    // Owner adjustments
    const ownerMultipliers: Record<string, number> = {
      '1st Owner': 1.0,
      '2nd Owner': 0.9,
      '3rd Owner': 0.82,
      '4th or more': 0.72,
    }

    // Fuel type adjustments
    const fuelMultipliers: Record<string, number> = {
      'Petrol': 1.0,
      'Diesel': 0.95,
      'Electric': 1.1,
      'CNG': 0.85,
      'LPG': 0.82,
    }

    // Location demand
    const highDemandDistricts = ['Ernakulam', 'Thiruvananthapuram', 'Thrissur', 'Kozhikode', 'Kannur', 'Kasaragod']
    const locationMultiplier = highDemandDistricts.includes(form.district) ? 1.03 : 1.0

    // Calculate final price
    const baseResale = basePrice.resale
    const conditionMult = conditionMultipliers[form.condition] || 1
    const ownerMult = ownerMultipliers[form.owners] || 1
    const fuelMult = fuelMultipliers[form.fuelType] || 1

    const estimatedPrice = baseResale * priceMultiplier * conditionMult * kmMultiplier * ownerMult * fuelMult * locationMultiplier
    const variance = estimatedPrice * 0.08 // 8% variance

    const minPrice = estimatedPrice - variance
    const maxPrice = estimatedPrice + variance
    const suggestedPrice = estimatedPrice - (variance * 0.3) // Slightly lower for quick sale

    // Determine market trend
    const trend = kmRatio > 1.3 || form.condition === 'Poor' || form.condition === 'Fair'
      ? 'below'
      : kmRatio < 0.8 && (form.condition === 'Excellent' || form.condition === 'Very Good')
        ? 'above'
        : 'at'

    return {
      estimatedPrice,
      minPrice,
      maxPrice,
      suggestedPrice,
      trend,
      confidence: age <= 5 && form.km < 80000 ? 'High' : age <= 10 ? 'Medium' : 'Low',
      factors: [
        { label: 'Depreciation', value: `${Math.round((1 - priceMultiplier) * 100)}%`, impact: priceMultiplier < 0.5 ? 'negative' : 'neutral' },
        { label: 'Condition', value: form.condition, impact: conditionMult > 1 ? 'positive' : conditionMult < 1 ? 'negative' : 'neutral' },
        { label: 'KM Usage', value: kmRatio > 1.2 ? 'High' : kmRatio < 0.8 ? 'Low' : 'Normal', impact: kmMultiplier >= 1 ? 'positive' : 'negative' },
        { label: 'Owners', value: form.owners, impact: ownerMult >= 1 ? 'positive' : 'negative' },
        { label: 'Fuel Type', value: form.fuelType, impact: fuelMult >= 1 ? 'positive' : 'neutral' },
      ]
    }
  }, [form, effectiveBrand, effectiveModel])

  const handleUsePrice = () => {
    if (!aiResult) return
    const priceInRupees = Math.round(aiResult.suggestedPrice * 100000)
    if (returnTo) {
      navigate(returnTo + `&price=${priceInRupees}`)
    } else {
      navigate(`/post?price=${priceInRupees}`)
    }
  }

  const runAIAnalysis = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    next()
  }

  // Step 0: Vehicle Type
  if (step === 0) {
    return (
      <div className="pb-safe page-enter">
        <PageHeader title="Price Decider" showBack />
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <AutoAwesomeIcon sx={{ color: PURPLE, fontSize: 20 }} />
            <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base">AI-Powered Price Estimation</h3>
          </div>
          <p style={{ color: TEXT_SECONDARY }} className="text-sm mb-6">
            Get an accurate market price for your vehicle based on real data
          </p>

          <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>
            What type of vehicle?
          </p>
          <div className="flex flex-col gap-3 mb-6">
            {vehicleTypes.map(opt => (
              <button
                key={opt.key}
                onClick={() => setField('vehicleType', opt.key)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                  form.vehicleType === opt.key ? 'border-[#7C3AED] bg-[rgba(124,58,237,0.12)]' : 'border-[#1E2D47] bg-[#0D1526]'
                }`}
              >
                <div className="text-3xl">{opt.emoji}</div>
                <div>
                  <div style={{ color: TEXT_PRIMARY }} className="font-semibold">{opt.title}</div>
                  <div style={{ color: TEXT_SECONDARY }} className="text-sm">{opt.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          <Button
            fullWidth variant="contained"
            disabled={!form.vehicleType}
            onClick={next}
            sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 700, borderRadius: '14px', py: 1.5 }}
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  // Step 1: Vehicle Details (Brand, Model, Year)
  if (step === 1) {
    return (
      <div className="pb-safe page-enter">
        <PageHeader title="Price Decider" showBack />
        <div className="px-4 py-3">
          <Stepper activeStep={step} alternativeLabel>
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

        <div className="px-4 pb-4 flex flex-col gap-5">
          <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base">Vehicle Details</h3>

          {/* Brand Selection */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Make / Brand</p>
            <FormControl fullWidth size="small">
              <InputLabel>Select Brand</InputLabel>
              <Select
                value={form.brand}
                onChange={e => {
                  setField('brand', e.target.value)
                  setField('model', '')
                  setCustomBrand('')
                  setCustomModel('')
                }}
                label="Select Brand"
                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
              >
                {Object.keys(brandModels).map(b => (
                  <MenuItem key={b} value={b}>{b}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {showCustomBrand && (
              <TextField
                fullWidth size="small"
                placeholder="Enter brand name"
                value={customBrand}
                onChange={e => setCustomBrand(e.target.value)}
                sx={{ mt: 1.5 }}
              />
            )}
          </div>

          {/* Model Selection */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Model</p>
            <FormControl fullWidth size="small" disabled={!form.brand}>
              <InputLabel>Select Model</InputLabel>
              <Select
                value={form.model}
                onChange={e => {
                  setField('model', e.target.value)
                  setCustomModel('')
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
                onChange={e => setCustomModel(e.target.value)}
                sx={{ mt: 1.5 }}
              />
            )}
          </div>

          {/* Year Selection */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Year of Registration</p>
            <FormControl fullWidth size="small">
              <InputLabel>Select Year</InputLabel>
              <Select
                value={form.year}
                onChange={e => setField('year', e.target.value)}
                label="Select Year"
                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
              >
                {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </Select>
            </FormControl>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              variant="outlined"
              onClick={back}
              sx={{ borderColor: INACTIVE_BORDER, color: TEXT_SECONDARY, borderRadius: '12px', flex: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              disabled={!form.brand || !form.model || !form.year}
              onClick={next}
              sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 700, borderRadius: '12px', flex: 2 }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Condition Details
  if (step === 2) {
    return (
      <div className="pb-safe page-enter">
        <PageHeader title="Price Decider" showBack />
        <div className="px-4 py-3">
          <Stepper activeStep={step} alternativeLabel>
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

        <div className="px-4 pb-4 flex flex-col gap-5">
          <h3 style={{ color: TEXT_PRIMARY }} className="font-bold text-base">Condition & Usage</h3>

          {/* Fuel Type */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Fuel Type</p>
            <div className="flex gap-2 flex-wrap">
              {fuelOptions.map(opt => {
                const selected = form.fuelType === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setField('fuelType', opt.value)}
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
          </div>

          {/* Condition */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Current Condition</p>
            <div className="flex flex-col gap-2">
              {conditionOptions.map(opt => {
                const selected = form.condition === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setField('condition', opt.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: `2px solid ${selected ? PURPLE_BORDER : INACTIVE_BORDER}`,
                      background: selected ? PURPLE_BG : INACTIVE_BG,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: selected ? PURPLE : TEXT_PRIMARY }}>{opt.value}</div>
                      <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>{opt.desc}</div>
                    </div>
                    {selected && (
                      <CheckCircleIcon sx={{ color: PURPLE, ml: 'auto', fontSize: 22 }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* KM Driven */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold" style={{ color: TEXT_SECONDARY }}>KM Driven</p>
              <span style={{ color: PURPLE, fontWeight: 700, fontSize: 14 }}>{formatKmDisplay(form.km)}</span>
            </div>
            <Slider
              value={form.km}
              onChange={(_, v) => setField('km', v as number)}
              min={0}
              max={200000}
              step={1000}
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
              <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>2,00,000 km</span>
            </div>
          </div>

          {/* Number of Owners */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: TEXT_SECONDARY }}>Number of Owners</p>
            <div className="flex gap-2">
              {ownerOptions.map(opt => {
                const selected = form.owners === opt
                return (
                  <button
                    key={opt}
                    onClick={() => setField('owners', opt)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: 12,
                      border: `2px solid ${selected ? PURPLE_BORDER : INACTIVE_BORDER}`,
                      background: selected ? PURPLE_BG : INACTIVE_BG,
                      fontSize: 10,
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
          </div>

          {/* District */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: TEXT_SECONDARY }}>Your District</p>
            <FormControl fullWidth size="small">
              <InputLabel>Select District</InputLabel>
              <Select
                value={form.district}
                onChange={e => setField('district', e.target.value)}
                label="Select District"
              >
                {keralaDistricts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              variant="outlined"
              onClick={back}
              sx={{ borderColor: INACTIVE_BORDER, color: TEXT_SECONDARY, borderRadius: '12px', flex: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              disabled={!form.fuelType || !form.condition}
              onClick={runAIAnalysis}
              startIcon={loading ? undefined : <AutoAwesomeIcon />}
              sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 700, borderRadius: '12px', flex: 2 }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Calculate Price'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: AI Result
  if (step === 3 && aiResult) {
    return (
      <div className="pb-safe page-enter">
        <PageHeader title="Price Decider" showBack />
        <div className="px-4 py-3">
          <Stepper activeStep={step} alternativeLabel>
            {STEPS.map(label => (
              <Step key={label}>
                <StepLabel sx={{
                  '& .MuiStepLabel-label': { color: TEXT_SECONDARY, fontSize: '0.6rem' },
                  '& .MuiStepLabel-label.Mui-active': { color: PURPLE },
                  '& .MuiStepLabel-label.Mui-completed': { color: '#10b981' },
                  '& .MuiStepIcon-root': { color: '#10b981' },
                }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className="px-4 pb-4">
          {/* Vehicle Summary */}
          <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {form.vehicleType === 'car' ? '🚗' : form.vehicleType === 'twoWheeler' ? '🏍️' : '🚛'}
              </div>
              <div>
                <h3 style={{ color: TEXT_PRIMARY }} className="font-bold">
                  {form.year} {effectiveBrand} {effectiveModel}
                </h3>
                <p style={{ color: TEXT_SECONDARY }} className="text-sm">
                  {form.fuelType} • {form.condition} • {formatKmDisplay(form.km)}
                </p>
              </div>
            </div>
          </div>

          {/* AI Price Result */}
          <div style={{ background: `linear-gradient(135deg, ${PURPLE}15, ${PURPLE}08)`, border: `2px solid ${PURPLE}40`, borderRadius: 20 }} className="p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <AutoAwesomeIcon sx={{ color: PURPLE, fontSize: 20 }} />
              <span style={{ color: PURPLE, fontWeight: 700, fontSize: 14 }}>AI-ESTIMATED PRICE</span>
              <span style={{ background: PURPLE_BG, border: `1px solid ${PURPLE}`, borderRadius: 6, padding: '2px 6px', fontSize: 10, color: PURPLE, fontWeight: 600 }}>
                {aiResult.confidence}
              </span>
            </div>

            <div style={{ color: TEXT_PRIMARY }} className="text-4xl font-bold mb-1">
              {formatPriceFull(aiResult.estimatedPrice)}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: TEXT_SECONDARY }} className="text-sm">
                Market Range: {formatPriceDisplay(aiResult.minPrice)} - {formatPriceDisplay(aiResult.maxPrice)}
              </span>
            </div>

            {/* Price Bar */}
            <div className="relative mb-4">
              <div style={{ height: 8, backgroundColor: INACTIVE_BORDER, borderRadius: 4 }} />
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(100, Math.max(0, ((aiResult.estimatedPrice - aiResult.minPrice) / (aiResult.maxPrice - aiResult.minPrice)) * 100))}%`,
                  top: -4,
                  width: 16,
                  height: 16,
                  backgroundColor: PURPLE,
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  transform: 'translateX(-50%)',
                }}
              />
            </div>

            {/* Suggested Price */}
            <div style={{ background: '#0D1526', border: `1px solid ${PURPLE}30`, borderRadius: 12 }} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: TEXT_SECONDARY }} className="text-xs">Suggested Listing Price</p>
                  <p style={{ color: '#10b981', fontWeight: 700, fontSize: 18 }}>{formatPriceFull(aiResult.suggestedPrice)}</p>
                </div>
                <div className="text-right">
                  <p style={{ color: TEXT_SECONDARY }} className="text-xs">For quicker sale</p>
                  <div className="flex items-center gap-1">
                    {aiResult.trend === 'below' ? (
                      <TrendingDownIcon sx={{ color: '#10b981', fontSize: 16 }} />
                    ) : aiResult.trend === 'above' ? (
                      <TrendingUpIcon sx={{ color: '#EF4444', fontSize: 16 }} />
                    ) : (
                      <div style={{ width: 16, height: 2, backgroundColor: TEXT_SECONDARY }} />
                    )}
                    <span style={{ color: TEXT_SECONDARY, fontSize: 11 }}>
                      {aiResult.trend === 'below' ? 'Below market' : aiResult.trend === 'above' ? 'Above market' : 'At market'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Factors */}
          <div style={{ background: '#0D1526', border: '1px solid #1E2D47', borderRadius: 14 }} className="p-4 mb-4">
            <p style={{ color: TEXT_SECONDARY }} className="text-xs font-semibold mb-3">PRICE FACTORS</p>
            <div className="space-y-2">
              {aiResult.factors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#1E2D47] last:border-0">
                  <span style={{ color: TEXT_SECONDARY }} className="text-xs">{factor.label}</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: TEXT_PRIMARY }} className="text-xs font-medium">{factor.value}</span>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: factor.impact === 'positive' ? '#10b981' : factor.impact === 'negative' ? '#EF4444' : TEXT_SECONDARY,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-2 mb-6">
            <InfoOutlinedIcon sx={{ color: TEXT_SECONDARY, fontSize: 16, mt: 0.2 }} />
            <p style={{ color: TEXT_SECONDARY }} className="text-xs leading-relaxed">
              This estimate is based on market data, age, condition, and location. Actual price may vary based on demand and negotiation.
            </p>
          </div>

          <Button
            fullWidth variant="contained"
            onClick={handleUsePrice}
            sx={{ bgcolor: PURPLE, color: '#fff', fontWeight: 700, borderRadius: '14px', py: 1.5, fontSize: '1rem', mb: 2 }}
          >
            Use This Price
          </Button>

          <Button
            fullWidth variant="outlined"
            onClick={() => navigate('/post')}
            sx={{ borderColor: INACTIVE_BORDER, color: TEXT_SECONDARY, borderRadius: '14px', py: 1.5 }}
          >
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return null
}
