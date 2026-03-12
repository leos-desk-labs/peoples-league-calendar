import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUser(session.user)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        loadUser(session.user)
      } else {
        setUser(null)
        setDisplayName('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUser = async (authUser) => {
    setUser(authUser)
    // Try to load display name from team_members table
    const { data } = await supabase
      .from('team_members')
      .select('display_name')
      .eq('email', authUser.email)
      .single()

    if (data?.display_name) {
      setDisplayName(data.display_name)
    } else {
      // Extract first name from email
      const emailName = authUser.email.split('@')[0]
      const firstName = emailName.split('.')[0].split('_')[0]
      const name = firstName.charAt(0).toUpperCase() + firstName.slice(1)
      setDisplayName(name)
      // Upsert team member record
      await supabase.from('team_members').upsert({
        email: authUser.email,
        display_name: name,
        last_seen: new Date().toISOString(),
      }, { onConflict: 'email' })
    }
    // Update last_seen
    await supabase.from('team_members').upsert({
      email: authUser.email,
      last_seen: new Date().toISOString(),
    }, { onConflict: 'email', ignoreDuplicates: false })
  }

  const signIn = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateDisplayName = async (name) => {
    if (!user) return
    setDisplayName(name)
    await supabase.from('team_members').upsert({
      email: user.email,
      display_name: name,
    }, { onConflict: 'email' })
  }

  return (
    <AuthContext.Provider value={{ session, user, displayName, loading, signIn, signOut, updateDisplayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
