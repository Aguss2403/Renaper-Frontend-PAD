import { useEffect, useState } from 'react'
import { PublicShell } from '../components/layout/PublicShell'
import { LandingPage } from '../pages/LandingPage'
import { AuthPage } from '../pages/AuthPage'
import { authApi } from '../services/authApi'

const sessionKey = 'renaper-session'
const pageFromPath = () => window.location.pathname === '/registro' ? 'register' : window.location.pathname === '/login' ? 'login' : 'home'

export default function App() {
  const [page, setPage] = useState(pageFromPath)
  const [session, setSession] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(sessionKey)
    if (!saved) return
    let restored
    try {
      restored = JSON.parse(saved)
    } catch {
      localStorage.removeItem(sessionKey)
      return
    }
    authApi.me(restored.accessToken).then((profile) => setSession({ ...restored, profile }))
      .catch(() => localStorage.removeItem(sessionKey))
  }, [])

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(nextPage) {
    setNotice('')
    window.history.pushState({}, '', nextPage === 'register' ? '/registro' : nextPage === 'login' ? '/login' : '/')
    setPage(nextPage)
  }

  async function authenticate(credentials) {
    const login = await authApi.login(credentials)
    const profile = await authApi.me(login.accessToken)
    const nextSession = { ...login, profile }
    localStorage.setItem(sessionKey, JSON.stringify(nextSession))
    setSession(nextSession)
    navigate('home')
  }

  async function register(values) {
    await authApi.register(values)
    try {
      await authenticate(values)
    } catch {
      navigate('login')
      setNotice('La cuenta fue creada. Iniciá sesión para continuar.')
    }
  }

  async function logout() {
    const currentSession = session
    setSession(null)
    localStorage.removeItem(sessionKey)
    navigate('home')
    if (currentSession) await authApi.logout(currentSession.accessToken).catch(() => {})
  }

  return (
    <PublicShell session={session} onNavigate={navigate} onLogout={logout}>
      {page === 'register' && <AuthPage mode="register" onSubmit={register} onNavigate={navigate} />}
      {page === 'login' && <AuthPage mode="login" onSubmit={authenticate} onNavigate={navigate} notice={notice} />}
      {page === 'home' && <LandingPage session={session} onNavigate={navigate} />}
    </PublicShell>
  )
}
