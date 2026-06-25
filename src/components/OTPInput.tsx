import { useRef, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  length?: number
}

export default function OTPInput({ value, onChange, disabled = false, length = 6 }: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, char: string) => {
    if (disabled) return

    const numericChar = char.replace(/\D/g, '')
    if (!numericChar && char !== '') return

    const newValue = value.split('')
    newValue[index] = numericChar.slice(-1) || ''
    const newOTP = newValue.join('')

    onChange(newOTP)

    // Move to next input if value entered
    if (numericChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValue = value.split('')

      if (value[index]) {
        // Clear current field
        newValue[index] = ''
        onChange(newValue.join(''))
      } else if (index > 0) {
        // Move to previous field and clear it
        newValue[index - 1] = ''
        onChange(newValue.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pastedData)

    // Focus the last filled input or the next empty one
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
    inputRefs.current[index]?.select()
  }

  const handleBlur = () => {
    setFocusedIndex(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        justifyContent: 'center',
        maxWidth: '400px',
        mx: 'auto',
      }}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, index) => (
        <TextField
          key={index}
          inputRef={(el) => { inputRefs.current[index] = el }}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          disabled={disabled}
          error={false}
          slotProps={{
            input: {
              sx: {
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#fff',
                '&::selection': {
                  bgcolor: 'rgba(124, 58, 237, 0.3)',
                },
              },
            },
          }}
          inputProps={{ maxLength: 1 }}
          sx={{
            width: '48px',
            '& .MuiOutlinedInput-root': {
              bgcolor: focusedIndex === index ? 'rgba(124, 58, 237, 0.1)' : '#1A1A2E',
              borderRadius: 2,
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& fieldset': {
                borderColor: focusedIndex === index ? '#7C3AED' : '#374151',
                borderWidth: focusedIndex === index ? 2 : 1,
                transition: 'border-color 0.2s, border-width 0.2s',
              },
              '&:hover fieldset': {
                borderColor: '#7C3AED',
              },
              '&.Mui-disabled': {
                bgcolor: '#1A1A2E',
                '& fieldset': {
                  borderColor: '#374151',
                },
                '& input': {
                  color: '#6B7280',
                },
              },
            },
          }}
        />
      ))}
    </Box>
  )
}
