type DealScore = 'GREAT_DEAL' | 'FAIR' | 'OVERPRICED' | 'GREAT DEAL'

interface Props {
  score?: DealScore
  size?: 'sm' | 'md'
  status?: DealScore
}

const scoreConfig: Record<string, { bg: string; text: string; border: string }> = {
  'GREAT_DEAL': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'GREAT DEAL': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'FAIR': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  'OVERPRICED': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
}

export default function DealBadge({ score, status, size = 'sm' }: Props) {
  const value = score || status || ''
  const config = scoreConfig[value] || { bg: '', text: '', border: '' }

  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const displayValue = (value === 'GREAT_DEAL' ? 'GREAT DEAL' : value).toUpperCase()

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border font-bold tracking-wide ${config.bg} ${config.text} ${config.border} ${textSize}`}>
      {displayValue}
    </span>
  )
}
