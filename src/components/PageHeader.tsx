import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ShareIcon from '@mui/icons-material/Share'

interface Props {
  title?: string
  showBack?: boolean
  showShare?: boolean
  rightElement?: React.ReactNode
}

export default function PageHeader({ title, showBack = true, showShare = false, rightElement }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-[#050A14]/95 backdrop-blur-sm border-b border-[#1E2D47]">
      <div className="flex items-center gap-2">
        {showBack && (
          <IconButton
            onClick={() => navigate(-1)}
            size="small"
            sx={{ color: '#E8EDF5', bgcolor: '#111D35', borderRadius: '10px', p: 0.75 }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}
        {title && (
          <h2 className="text-[#E8EDF5] font-semibold text-base">{title}</h2>
        )}
      </div>
      <div className="flex items-center gap-1">
        {showShare && (
          <IconButton size="small" sx={{ color: '#7A8BA8' }}>
            <ShareIcon fontSize="small" />
          </IconButton>
        )}
        {rightElement}
      </div>
    </div>
  )
}
