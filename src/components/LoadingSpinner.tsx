import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

interface Props {
  fullPage?: boolean
}

export default function LoadingSpinner({ fullPage = false }: Props) {
  if (fullPage) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#00E5FF' }} />
      </Box>
    )
  }
  return <CircularProgress size={24} sx={{ color: '#00E5FF' }} />
}
