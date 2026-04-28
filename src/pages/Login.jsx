import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usersService } from '../services/usersService'
import { Input, Button, Alert } from '../components/ui/index'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'El usuario es requerido'
    if (!form.password.trim()) e.password = 'La contraseña es requerida'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setApiError('')
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setLoading(true)

    setTimeout(() => {
      const user = usersService.findByCredentials(form.username, form.password)
      if (user) {
        login(user)
        navigate('/dashboard')
      } else {
        setApiError('Credenciales incorrectas o usuario inactivo')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.3,
      }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,255,0.08), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '420px', animation: 'fadeIn 0.5s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 0 30px var(--accent-glow)',
            fontSize: '1.8rem',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            color: '#000',
          }}>S</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-primary)' }}>STOCKMIND</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.2em', marginTop: '0.3rem' }}>SISTEMA INTELIGENTE DE INVENTARIO</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-bright)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px var(--accent-glow)',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>// INICIAR SESIÓN</p>

          {apiError && (
            <div style={{ marginBottom: '1rem' }}>
              <Alert variant="danger" onClose={() => setApiError('')}>{apiError}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Usuario"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Ingresa tu usuario"
              error={errors.username}
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              error={errors.password}
              required
            />
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'AUTENTICANDO...' : 'INGRESAR AL SISTEMA'}
            </Button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Regístrate aquí</Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: '1rem', background: 'var(--accent-glow)', border: '1px solid var(--border-bright)', borderRadius: '6px', padding: '0.75rem 1rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            <span style={{ color: 'var(--accent)' }}>DEMO</span> — Admin: <span style={{ color: 'var(--text-primary)' }}>admin / admin123</span> &nbsp;|&nbsp; Vendedor: <span style={{ color: 'var(--text-primary)' }}>vendedor1 / vendedor123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
