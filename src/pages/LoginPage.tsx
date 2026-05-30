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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      success('Welcome back!')
      navigate('/')
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Login failed'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', bgcolor: '#050A14', pt: 2 }}>
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ color: '#00E5FF', mb: 1, fontWeight: 700 }}>
          LEVEL
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff', mb: 4, fontWeight: 600 }}>
          Login to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>

        <Typography sx={{ color: '#999', mt: 3, textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}
