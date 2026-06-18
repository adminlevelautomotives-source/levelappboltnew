import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import theme from './theme'

import BottomNav from './components/BottomNav'
import { AuthProvider, useAuth } from './lib/auth-context'
import { ToastProvider } from './lib/toast-context'

import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import PostPage from './pages/PostPage'
import ServicesPage from './pages/ServicesPage'
import ProfilePage from './pages/ProfilePage'
import ListingDetailPage from './pages/ListingDetailPage'
import SearchPage from './pages/SearchPage'
import InspectorsPage from './pages/InspectorsPage'
import InspectorDetailPage from './pages/InspectorDetailPage'
import ApplyInspectorPage from './pages/ApplyInspectorPage'
import SparePartsPage from './pages/SparePartsPage'
import GaragesPage from './pages/GaragesPage'
import GarageDetailPage from './pages/GarageDetailPage'
import InsurancePage from './pages/InsurancePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SavedListingsPage from './pages/SavedListingsPage'
import PriceDeciderPage from './pages/PriceDeciderPage'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100svh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

function AppContent() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100svh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div style={{ minHeight: '100svh', position: 'relative' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/post" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedListingsPage /></ProtectedRoute>} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/inspectors" element={<InspectorsPage />} />
        <Route path="/inspectors/apply" element={<ProtectedRoute><ApplyInspectorPage /></ProtectedRoute>} />
        <Route path="/inspectors/:id" element={<InspectorDetailPage />} />
        <Route path="/spare-parts" element={<SparePartsPage />} />
        <Route path="/garages" element={<GaragesPage />} />
        <Route path="/garages/:id" element={<GarageDetailPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/price-decider" element={<PriceDeciderPage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <InitColorSchemeScript defaultMode="dark" />
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
