import Button from '@mui/material/Button'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

interface Props {
  phone: string
  message?: string
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  label?: string
}

export default function WhatsAppButton({ phone, message = 'Hi, I saw your listing on Level Automotives.', fullWidth = true, size = 'large', label = 'Chat on WhatsApp' }: Props) {
  const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`

  return (
    <Button
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      fullWidth={fullWidth}
      size={size}
      startIcon={<WhatsAppIcon />}
      sx={{
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        color: '#fff',
        fontWeight: 700,
        borderRadius: '12px',
        '&:hover': {
          background: 'linear-gradient(135deg, #2de370, #15a68a)',
        },
      }}
    >
      {label}
    </Button>
  )
}
