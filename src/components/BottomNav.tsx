import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import HomeIcon from '@mui/icons-material/Home'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GridViewIcon from '@mui/icons-material/GridView'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import WorkIcon from '@mui/icons-material/Work'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import PersonIcon from '@mui/icons-material/Person'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import { useAuth } from '../lib/auth-context'

const tabs = [
  { label: 'Home', path: '/', IconActive: HomeIcon, IconInactive: HomeOutlinedIcon },
  { label: 'Browse', path: '/browse', IconActive: GridViewIcon, IconInactive: GridViewOutlinedIcon },
  { label: 'POST', path: '/post', IconActive: AddIcon, IconInactive: AddIcon },
  { label: 'Services', path: '/services', IconActive: WorkIcon, IconInactive: WorkOutlineIcon },
  { label: 'Profile', path: '/profile', IconActive: PersonIcon, IconInactive: PersonOutlineIcon },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const currentTab = tabs.findIndex(t => {
    if (t.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(t.path)
  })

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 1000,
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation
        value={currentTab === -1 ? false : currentTab}
        onChange={(_, newValue) => {
          if (newValue !== 2) navigate(tabs[newValue].path)
        }}
        sx={{
          backgroundColor: '#080F1E',
          borderTop: '1px solid #1E2D47',
          height: 64,
          px: 1,
        }}
      >
        {tabs.map((tab, idx) => {
          if (idx === 2) {
            return (
              <BottomNavigationAction
                key={tab.label}
                label=""
                icon={
                  <Box
                    onClick={() => isAuthenticated ? navigate('/post') : navigate('/login')}
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00E5FF, #00B8CC)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: -3,
                      boxShadow: '0 4px 20px rgba(0,229,255,0.4)',
                      cursor: 'pointer',
                      '&:active': { transform: 'scale(0.95)' },
                      transition: 'transform 0.1s',
                      opacity: isAuthenticated ? 1 : 0.6,
                    }}
                  >
                    <AddIcon sx={{ color: '#050A14', fontSize: 28, fontWeight: 900 }} />
                  </Box>
                }
                sx={{ minWidth: 0, pb: 0 }}
              />
            )
          }

          const isActive = currentTab === idx
          const Icon = isActive ? tab.IconActive : tab.IconInactive

          return (
            <BottomNavigationAction
              key={tab.label}
              label={tab.label}
              icon={<Icon />}
              sx={{
                minWidth: 0,
                color: isActive ? '#00E5FF' : '#7A8BA8',
                '&.Mui-selected': { color: '#00E5FF' },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  '&.Mui-selected': { fontSize: '0.6rem' },
                },
              }}
            />
          )
        })}
      </BottomNavigation>
    </Box>
  )
}
