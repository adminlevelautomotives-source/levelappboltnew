import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { insuranceProviders, rcServices } from '../data/mockData'
import WhatsAppButton from '../components/WhatsAppButton'
import PageHeader from '../components/PageHeader'

const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'CNG']
const years = Array.from({ length: 36 }, (_, i) => 2025 - i)
const tenureOptions = [12, 24, 36, 48, 60]

export default function InsurancePage() {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'value' ? 3 : 0
  const [tab, setTab] = useState(defaultTab)

  // Value estimator state
  const [veForm, setVeForm] = useState({ make: '', model: '', year: 2020, km: '', condition: 3, fuel: 'Petrol', owners: 1 })
  const [veResult, setVeResult] = useState<{ low: number; high: number; score: string } | null>(null)

  // EMI state
  const [emiForm, setEmiForm] = useState({ amount: '', rate: '9', tenure: 36 })
  const [emiResult, setEmiResult] = useState<{ emi: number; interest: number; total: number } | null>(null)

  // Challan state
  const [regNo, setRegNo] = useState('')

  const estimateValue = () => {
    const base = 500000
    const ageFactor = Math.max(0.3, 1 - (2025 - veForm.year) * 0.08)
    const kmFactor = Math.max(0.4, 1 - (parseInt(veForm.km) || 0) / 300000)
    const condFactor = veForm.condition / 5
    const ownerFactor = Math.max(0.7, 1 - (veForm.owners - 1) * 0.1)
    const estimated = Math.round(base * ageFactor * kmFactor * condFactor * ownerFactor * 100) * 100
    const low = Math.round(estimated * 0.9 / 1000) * 1000
    const high = Math.round(estimated * 1.1 / 1000) * 1000
    const score = estimated > 600000 ? 'GREAT' : estimated > 400000 ? 'FAIR' : 'CHECK'
    setVeResult({ low, high, score })
  }

  const calculateEmi = () => {
    const p = parseFloat(emiForm.amount) || 0
    const r = (parseFloat(emiForm.rate) || 0) / 100 / 12
    const n = emiForm.tenure
    if (r === 0) {
      const emi = p / n
      setEmiResult({ emi, interest: 0, total: p })
      return
    }
    const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const total = emi * n
    setEmiResult({ emi, interest: total - p, total })
  }

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Insurance & Docs" showBack />

      <div className="px-4">
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          variant="scrollable" scrollButtons={false}
          sx={{ borderBottom: '1px solid #1E2D47', mb: 3 }}
        >
          <Tab label="🛡️ Insurance" sx={{ fontSize: '0.7rem', minWidth: 0, px: 1.5 }} />
          <Tab label="📋 RC / DL" sx={{ fontSize: '0.7rem', minWidth: 0, px: 1.5 }} />
          <Tab label="🚨 Challan" sx={{ fontSize: '0.7rem', minWidth: 0, px: 1.5 }} />
          <Tab label="💰 Value & EMI" sx={{ fontSize: '0.7rem', minWidth: 0, px: 1.5 }} />
        </Tabs>

        {/* Tab 0: Insurance */}
        {tab === 0 && (
          <div>
            <div className="flex gap-2 mb-4">
              {['New Insurance', 'Renew Insurance'].map(opt => (
                <button key={opt} className="flex-1 bg-[#0D1526] border border-[#1E2D47] rounded-xl py-2.5 text-center">
                  <div className="text-[#E8EDF5] text-sm font-semibold">{opt}</div>
                </button>
              ))}
            </div>

            <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Insurance Providers</h3>
            <div className="flex flex-col gap-3">
              {insuranceProviders.map(p => (
                <div key={p.name} className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-[#E8EDF5] font-semibold text-sm">{p.name}</h4>
                      <span className="text-[#7A8BA8] text-xs">{p.type}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#00E5FF15] border border-[#00E5FF30] flex items-center justify-center text-xl">🛡️</div>
                  </div>
                  <WhatsAppButton phone={p.phone} size="small" label="Get Quote on WhatsApp" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: RC/DL */}
        {tab === 1 && (
          <div className="flex flex-col gap-3">
            {rcServices.map(service => (
              <div key={service.name} className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-[#E8EDF5] font-semibold text-sm">{service.name}</h4>
                    <p className="text-[#7A8BA8] text-xs">{service.nameML}</p>
                    <p className="text-[#7A8BA8] text-xs mt-1">{service.description}</p>
                    <p className="text-[#7A8BA8] text-[10px]">{service.descriptionML}</p>
                  </div>
                  <Button
                    size="small" variant="outlined" endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                    component="a" href={service.formLink} target="_blank"
                    sx={{ borderColor: '#00E5FF', color: '#00E5FF', borderRadius: '10px', fontSize: '0.65rem', shrink: 0 }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Challan */}
        {tab === 2 && (
          <div>
            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
              <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">Check Vehicle Info & Challan</h3>
              <TextField
                fullWidth label="Vehicle Registration Number" size="small"
                value={regNo} onChange={e => setRegNo(e.target.value.toUpperCase())}
                placeholder="e.g. KL 14 AB 1234"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth variant="contained"
                component="a"
                href={`https://vahan.parivahan.gov.in/vahan4dashboard/vahan/findVehicleDetails.xhtml`}
                target="_blank"
                sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 700, borderRadius: '12px', mb: 2 }}
              >
                Check on Parivahan
              </Button>
              <div className="text-center">
                <p className="text-[#7A8BA8] text-xs">Data from Government Parivahan portal</p>
              </div>
            </div>

            {/* Result placeholder */}
            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
              <h4 className="text-[#7A8BA8] text-xs font-semibold mb-3">Sample Result</h4>
              {[
                ['Owner Name', 'Will appear here'],
                ['RC Status', 'Active'],
                ['Fitness', 'Valid'],
                ['Insurance', 'Valid till —'],
                ['Tax Due', 'Check on portal'],
                ['Challan', 'Check on portal'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1.5 border-b border-[#1E2D47] last:border-0">
                  <span className="text-[#7A8BA8] text-xs">{k}</span>
                  <span className="text-[#E8EDF5] text-xs font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Value & EMI */}
        {tab === 3 && (
          <div>
            <div className="flex gap-2 mb-4">
              {['Market Value', 'EMI Calculator'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { }}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold border bg-[#0D1526] border-[#1E2D47] text-[#7A8BA8]"
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Market Value */}
            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4 mb-4">
              <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">⚡ Market Value Estimator</h3>
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    fullWidth label="Make" size="small"
                    value={veForm.make} onChange={e => setVeForm(f => ({ ...f, make: e.target.value }))}
                  />
                  <TextField
                    fullWidth label="Model" size="small"
                    value={veForm.model} onChange={e => setVeForm(f => ({ ...f, model: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FormControl fullWidth size="small">
                    <InputLabel>Year</InputLabel>
                    <Select value={veForm.year} onChange={e => setVeForm(f => ({ ...f, year: e.target.value as number }))} label="Year">
                      {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Fuel</InputLabel>
                    <Select value={veForm.fuel} onChange={e => setVeForm(f => ({ ...f, fuel: e.target.value }))} label="Fuel">
                      {fuelTypes.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                </div>
                <TextField
                  fullWidth label="KM Driven" size="small" type="number"
                  value={veForm.km} onChange={e => setVeForm(f => ({ ...f, km: e.target.value }))}
                />
                <div>
                  <p className="text-[#7A8BA8] text-xs mb-1.5">Condition ({['Poor','Fair','Good','Very Good','Excellent'][veForm.condition-1]})</p>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(c => (
                      <button key={c} onClick={() => setVeForm(f => ({ ...f, condition: c }))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${veForm.condition === c ? 'bg-[#00E5FF22] border-[#00E5FF] text-[#00E5FF]' : 'bg-[#111D35] border-[#1E2D47] text-[#7A8BA8]'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[#7A8BA8] text-xs mb-1.5">Owners</p>
                  <div className="flex gap-1.5">
                    {[1,2,3,4].map(o => (
                      <button key={o} onClick={() => setVeForm(f => ({ ...f, owners: o }))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${veForm.owners === o ? 'bg-[#00E5FF22] border-[#00E5FF] text-[#00E5FF]' : 'bg-[#111D35] border-[#1E2D47] text-[#7A8BA8]'}`}>
                        {o === 4 ? '4+' : o}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  fullWidth variant="contained" onClick={estimateValue}
                  sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 700, borderRadius: '12px' }}
                >
                  Estimate Value
                </Button>
              </div>

              {veResult && (
                <div className="mt-4 bg-[#111D35] border border-[#1E2D47] rounded-xl p-4 text-center">
                  <p className="text-[#7A8BA8] text-xs mb-2">Estimated Market Value</p>
                  <p className="text-[#00E5FF] font-black text-2xl">{fmt(veResult.low)} – {fmt(veResult.high)}</p>
                  <div className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-bold ${
                    veResult.score === 'GREAT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {veResult.score} VALUE
                  </div>
                </div>
              )}
            </div>

            {/* EMI Calculator */}
            <div className="bg-[#0D1526] border border-[#1E2D47] rounded-2xl p-4">
              <h3 className="text-[#E8EDF5] font-bold text-sm mb-3">💳 EMI Calculator</h3>
              <div className="flex flex-col gap-2.5">
                <TextField
                  fullWidth label="Loan Amount" size="small" type="number"
                  value={emiForm.amount} onChange={e => setEmiForm(f => ({ ...f, amount: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><span className="text-[#E8EDF5]">₹</span></InputAdornment> }}
                />
                <TextField
                  fullWidth label="Interest Rate" size="small" type="number"
                  value={emiForm.rate} onChange={e => setEmiForm(f => ({ ...f, rate: e.target.value }))}
                  InputProps={{ endAdornment: <InputAdornment position="end"><span className="text-[#7A8BA8] text-sm">% p.a.</span></InputAdornment> }}
                />
                <div>
                  <p className="text-[#7A8BA8] text-xs mb-1.5">Tenure (months)</p>
                  <div className="flex gap-1.5">
                    {tenureOptions.map(t => (
                      <button key={t} onClick={() => setEmiForm(f => ({ ...f, tenure: t }))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${emiForm.tenure === t ? 'bg-[#00E5FF22] border-[#00E5FF] text-[#00E5FF]' : 'bg-[#111D35] border-[#1E2D47] text-[#7A8BA8]'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  fullWidth variant="contained" onClick={calculateEmi}
                  sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 700, borderRadius: '12px' }}
                >
                  Calculate EMI
                </Button>
              </div>

              {emiResult && (
                <div className="mt-4 bg-[#111D35] border border-[#1E2D47] rounded-xl p-4">
                  {[
                    ['Monthly EMI', fmt(emiResult.emi), '#00E5FF'],
                    ['Total Interest', fmt(emiResult.interest), '#FF6B35'],
                    ['Total Amount', fmt(emiResult.total), '#E8EDF5'],
                  ].map(([label, value, color]) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#1E2D47] last:border-0">
                      <span className="text-[#7A8BA8] text-xs">{label}</span>
                      <span className="font-bold text-sm" style={{ color }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
