import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import InputAdornment from '@mui/material/InputAdornment'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PageHeader from '../components/PageHeader'

const serviceOptions = ['Pre-purchase Inspection', 'Insurance Assessment', 'RC / DL Help', 'Accident Damage Check', 'Engine Diagnostics']

export default function ApplyInspectorPage() {
  const navigate = useNavigate()
  const [services, setServices] = useState<string[]>([])

  const toggleService = (s: string) => {
    setServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  return (
    <div className="pb-safe page-enter">
      <PageHeader title="Apply as Inspector" showBack />

      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="bg-[#00E5FF11] border border-[#00E5FF33] rounded-2xl p-4 mb-2">
          <p className="text-[#00E5FF] font-semibold text-sm">Join Kerala's trusted inspector network</p>
          <p className="text-[#7A8BA8] text-xs mt-1">Earn money by helping buyers make informed decisions</p>
        </div>

        <TextField fullWidth label="Full Name" size="small" />
        <TextField
          fullWidth label="WhatsApp Number" size="small" type="tel"
          InputProps={{ startAdornment: <InputAdornment position="start"><span className="text-[#7A8BA8] text-sm">+91</span></InputAdornment> }}
        />
        <TextField fullWidth label="City / Area" size="small" placeholder="e.g. Kasaragod Town" />
        <TextField fullWidth label="Years of Experience" size="small" type="number" />

        <div>
          <p className="text-[#7A8BA8] text-xs mb-2">Services Offered</p>
          <div className="flex flex-col gap-1">
            {serviceOptions.map(s => (
              <FormControlLabel
                key={s}
                control={
                  <Checkbox
                    checked={services.includes(s)}
                    onChange={() => toggleService(s)}
                    sx={{ color: '#1E2D47', '&.Mui-checked': { color: '#00E5FF' }, p: 0.75 }}
                  />
                }
                label={<span className="text-[#E8EDF5] text-sm">{s}</span>}
              />
            ))}
          </div>
        </div>

        <TextField fullWidth label="Certifications" size="small" placeholder="e.g. IAAI Certified, Government Authorized" multiline rows={2} />

        <div className="bg-[#111D35] border border-dashed border-[#1E2D47] rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer">
          <span className="text-2xl">📋</span>
          <span className="text-[#7A8BA8] text-sm">Upload ID Proof (Aadhaar / PAN)</span>
          <span className="text-[#7A8BA8] text-xs">Tap to upload</span>
        </div>

        <div className="bg-[#111D35] border border-dashed border-[#1E2D47] rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer">
          <span className="text-2xl">📸</span>
          <span className="text-[#7A8BA8] text-sm">Upload Your Photo</span>
          <span className="text-[#7A8BA8] text-xs">Tap to upload</span>
        </div>

        <Button
          fullWidth variant="contained"
          onClick={() => navigate(-1)}
          sx={{ bgcolor: '#00E5FF', color: '#050A14', fontWeight: 800, borderRadius: '14px', py: 1.5 }}
        >
          Submit Application
        </Button>

        <div className="flex gap-2 bg-[#111D35] border border-[#1E2D47] rounded-xl p-3">
          <InfoOutlinedIcon sx={{ color: '#7A8BA8', fontSize: 16, mt: 0.2, shrink: 0 }} />
          <p className="text-[#7A8BA8] text-xs leading-relaxed">
            Your profile will be reviewed and listed within 3–7 business days after document verification.
          </p>
        </div>
      </div>
    </div>
  )
}
