import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

type VerificationStatus = 'verified' | 'pending'

interface Props {
  status?: VerificationStatus
  size?: 'sm' | 'md'
}

export default function VerifiedBadge({ status = 'verified', size = 'sm' }: Props) {
  const iconSz = size === 'sm' ? 'text-sm' : 'text-base'
  const textSz = size === 'sm' ? 'text-[10px]' : 'text-xs'

  if (status === 'verified' || !status) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold ${textSz}`}>
        <CheckCircleIcon className={iconSz} style={{ fontSize: size === 'sm' ? 12 : 14 }} />
        Verified
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold ${textSz}`}>
      <AccessTimeIcon style={{ fontSize: size === 'sm' ? 12 : 14 }} />
      Pending
    </span>
  )
}
