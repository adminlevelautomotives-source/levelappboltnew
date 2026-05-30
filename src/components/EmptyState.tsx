import Button from '@mui/material/Button'

interface Props {
  emoji?: string
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ emoji = '🔍', title, subtitle, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-[#E8EDF5] font-semibold text-lg mb-2">{title}</h3>
      {subtitle && <p className="text-[#7A8BA8] text-sm mb-6">{subtitle}</p>}
      {actionLabel && onAction && (
        <Button
          variant="outlined"
          onClick={onAction}
          sx={{ borderColor: '#00E5FF', color: '#00E5FF', borderRadius: '12px' }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
