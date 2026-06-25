import { createClient, type AuthUser } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Listing = {
  id: string
  user_id: string
  title: string
  description?: string
  category: 'Car' | 'TwoWheeler' | 'HeavyVehicle' | 'SparePart' | 'Service'
  type?: string
  price?: number
  location: string
  latitude?: number
  longitude?: number
  year?: number
  kilometers?: number
  fuel_type?: string
  condition?: string
  color?: string
  owners?: number
  status: 'Active' | 'Pending' | 'Sold' | 'Expired'
  deal_status?: 'GREAT_DEAL' | 'FAIR' | 'OVERPRICED'
  verified: boolean
  photos: string[]
  created_at: string
  updated_at: string
  user_profiles?: UserProfile
}

export type UserProfile = {
  id: string
  phone?: string
  display_name?: string
  avatar_url?: string
  location?: string
  bio?: string
  seller_type: 'individual' | 'dealer' | 'inspector' | 'garage'
  rating: number
  rating_count: number
  verified: boolean
  verified_at?: string
  created_at: string
  updated_at: string
}

export type SavedListing = {
  id: string
  user_id: string
  listing_id: string
  created_at: string
}

export type Rating = {
  id: string
  listing_id: string
  user_id: string
  seller_id: string
  rating: number
  review?: string
  created_at: string
  updated_at: string
  user_profiles?: UserProfile
}

export type AuthContextType = {
  user: AuthUser | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (phone: string, displayName: string) => Promise<void>
  signIn: (phone: string) => Promise<void>
  verifyOtp: (phone: string, token: string) => Promise<void>
  signOut: () => Promise<void>
}
