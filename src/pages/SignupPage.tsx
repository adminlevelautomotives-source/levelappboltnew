import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '../lib/auth-context'
import { useToast } from '../lib/toast-context'

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid Indian phone number')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, displayName, phone)
      success('Account created! Welcome to LEVEL.')
      navigate('/')
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Sign up failed'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', bgcolor: '#050A14', pt: 2, pb: 4 }}>
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ color: '#00E5FF', mb: 1, fontWeight: 700 }}>
          LEVEL
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff', mb: 4, fontWeight: 600 }}>
          Create your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loading}
            required
            fullWidth
            slotProps={{
              input: { sx: { color: '#fff' } },
              inputLabel: { sx: { color: '#999' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: '#333',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00E5FF' },
              },
            }}
          />

          <TextField
            label="Phone (10 digits)"
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: '#333',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00E5FF' },
              },
            }}
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            fullWidth
            slotProps={{
              input: { sx: { color: '#fff' } },
              inputLabel: { sx: { color: '#999' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: '#333',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00E5FF' },
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            fullWidth
            slotProps={{
              input: { sx: { color: '#fff' } },
              inputLabel: { sx: { color: '#999' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: '#333',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00E5FF' },
              },
            }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            fullWidth
            slotProps={{
              input: { sx: { color: '#fff' } },
              inputLabel: { sx: { color: '#999' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: '#333',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00E5FF' },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              bgcolor: '#00E5FF',
              color: '#050A14',
              fontWeight: 600,
              py: 1.5,
              mt: 2,
              '&:hover': { bgcolor: '#00D4E8' },
              '&:disabled': { bgcolor: '#666', color: '#999' },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </Box>

        <Typography sx={{ color: '#999', mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
            Login
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}
