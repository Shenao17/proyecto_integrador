import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('stockmind_session')
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('stockmind_session')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (user) => {
    const session = { ...user, loginAt: new Date().toISOString() }
    localStorage.setItem('stockmind_session', JSON.stringify(session))
    setCurrentUser(session)
    return true
  }

  const logout = () => {
    localStorage.removeItem('stockmind_session')
    setCurrentUser(null)
  }

  const isAdmin = () => currentUser?.role === 'Admin'

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
