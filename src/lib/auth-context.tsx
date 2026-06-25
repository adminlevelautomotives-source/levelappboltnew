import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '@supabase/supabase-js'
import { supabase, type AuthContextType, type UserProfile } from './supabase'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (phone: string, displayName: string) => {
    try {
      const formattedPhone = `+91${phone}`

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })

      if (error) throw error
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signIn = async (phone: string) => {
    try {
      const formattedPhone = `+91${phone}`

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (error) throw error
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const verifyOtp = async (phone: string, token: string) => {
    try {
      const formattedPhone = `+91${phone}`

      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      })

      if (error) throw error

      if (data.user) {
        setUser(data.user)

        // Check if profile exists, create if not
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle()

        if (!existingProfile) {
          const displayName = data.user.user_metadata?.display_name || 'User'
          const phoneFromUser = data.user.phone || formattedPhone

          await supabase.from('user_profiles').insert({
            id: data.user.id,
            display_name: displayName,
            phone: phoneFromUser.replace('+91', ''),
            seller_type: 'individual',
          })
        }

        await fetchProfile(data.user.id)
      }
    } catch (error) {
      console.error('OTP verify error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    verifyOtp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
