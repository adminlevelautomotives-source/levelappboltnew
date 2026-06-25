import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import OTPInput from '../components/OTPInput'
import { useAuth } from '../lib/auth-context'
import { useToast } from '../lib/toast-context'

type Step = 'phone' | 'otp'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const { signIn, verifyOtp } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number')
      return
    }

    setLoading(true)

    try {
      await signIn(phone)
      success('OTP sent to your mobile number')
      setStep('otp')
      startCountdown()
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to send OTP'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setLoading(true)

    try {
      await verifyOtp(phone, otp)
      success('Welcome back!')
      navigate('/')
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Invalid OTP'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return

    setLoading(true)
    setError('')

    try {
      await signIn(phone)
      success('OTP resent successfully')
      startCountdown()
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to resend OTP'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPhone = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setStep('phone')
    setOtp('')
    setError('')
    setCountdown(0)
  }

  return (
    <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', bgcolor: '#050A14', pt: 2 }}>
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ color: '#7C3AED', mb: 1, fontWeight: 700 }}>
          LEVEL
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff', mb: 4, fontWeight: 600 }}>
          {step === 'phone' ? 'Login to your account' : 'Enter OTP'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {step === 'phone' ? (
          <Box component="form" onSubmit={handleSendOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ color: '#D1D5DB', mb: 1 }}>
              Enter your mobile number
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                bgcolor: '#1A1A2E',
                border: '1px solid #374151',
                borderRadius: 2,
                color: '#D1D5DB',
                minWidth: '80px',
                justifyContent: 'center',
              }}>
                +91
              </Box>
              <TextField
                label="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={loading}
                required
                fullWidth
                placeholder="9876543210"
                slotProps={{
                  input: { sx: { color: '#fff' } },
                  inputLabel: { sx: { color: '#999' } },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loading || phone.length !== 10}
              fullWidth
              sx={{
                bgcolor: '#7C3AED',
                color: '#fff',
                fontWeight: 600,
                py: 1.5,
                mt: 2,
                '&:hover': { bgcolor: '#6D28D9' },
                '&:disabled': { bgcolor: '#374151', color: '#6B7280' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Send OTP'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerifyOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ color: '#D1D5DB' }}>
                OTP sent to +91 {phone}
              </Typography>
              <Button
                onClick={handleEditPhone}
                sx={{ color: '#7C3AED', textTransform: 'none', fontWeight: 600 }}
              >
                Change
              </Button>
            </Box>

            <Typography sx={{ color: '#D1D5DB', mb: 1 }}>
              Enter 6-digit OTP
            </Typography>

            <OTPInput value={otp} onChange={setOtp} disabled={loading} />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                sx={{
                  color: countdown > 0 ? '#6B7280' : '#7C3AED',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loading || otp.length !== 6}
              fullWidth
              sx={{
                bgcolor: '#7C3AED',
                color: '#fff',
                fontWeight: 600,
                py: 1.5,
                mt: 2,
                '&:hover': { bgcolor: '#6D28D9' },
                '&:disabled': { bgcolor: '#374151', color: '#6B7280' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Verify & Login'}
            </Button>
          </Box>
        )}

        <Typography sx={{ color: '#999', mt: 3, textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}
