import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usersService } from '../services/usersService'
import { Input, Select, Button, Alert } from '../components/ui/index'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', role: 'Vendedor' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'El usuario es requerido'
    else if (form.username.length < 3) e.username = 'Mínimo 3 caracteres'
    if (!form.email.trim()) e.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password.trim()) e.password = 'La contraseña es requerida'
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden'
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
      const result = usersService.create({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      })
      if (result.error) {
        setApiError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 1500)
      }
      setLoading(false)
    }, 400)
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

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
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '460px', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-primary)' }}>STOCKMIND</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.2em', marginTop: '0.3rem' }}>REGISTRO DE NUEVO USUARIO</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: '12px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>// CREAR CUENTA</p>

          {apiError && <div style={{ marginBottom: '1rem' }}><Alert variant="danger" onClose={() => setApiError('')}>{apiError}</Alert></div>}
          {success && <div style={{ marginBottom: '1rem' }}><Alert variant="success">Cuenta creada. Redirigiendo al login...</Alert></div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="grid-2">
              <Input label="Usuario" value={form.username} onChange={set('username')} placeholder="johndoe" error={errors.username} required />
              <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="john@empresa.com" error={errors.email} required />
            </div>
            <div className="grid-2">
              <Input label="Contraseña" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" error={errors.password} required />
              <Input label="Confirmar" type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" error={errors.confirm} required />
            </div>
            <Select label="Rol" value={form.role} onChange={set('role')}>
              <option value="Vendedor">Vendedor</option>
              <option value="Admin">Admin</option>
            </Select>
            <Button type="submit" fullWidth disabled={loading || success}>
              {loading ? 'CREANDO CUENTA...' : 'REGISTRAR USUARIO'}
            </Button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
