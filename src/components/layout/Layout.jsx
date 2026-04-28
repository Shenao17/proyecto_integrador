import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '▣', adminOnly: false },
  { to: '/products', label: 'Productos', icon: '◈', adminOnly: false },
  { to: '/inventory', label: 'Inventario', icon: '◎', adminOnly: true },
  { to: '/sales', label: 'Ventas', icon: '◆', adminOnly: false },
  { to: '/users', label: 'Usuarios', icon: '◉', adminOnly: true },
]

export default function Layout({ children }) {
  const { currentUser, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin())

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '240px' : '60px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          minHeight: '70px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            minWidth: '32px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 900,
            color: '#000',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 0 15px var(--accent-glow)',
          }}>S</div>
          {sidebarOpen && (
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--accent)', lineHeight: 1 }}>STOCKMIND</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>v1.0 ALPHA</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.7rem 0.85rem',
                borderRadius: '6px',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                transition: 'all 0.2s',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                border: isActive ? '1px solid var(--border-bright)' : '1px solid transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              })}
            >
              <span style={{ fontSize: '1rem', minWidth: '20px', textAlign: 'center' }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid var(--border)' }}>
          {sidebarOpen && (
            <div style={{ padding: '0.5rem 0.85rem', marginBottom: '0.5rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>SESIÓN ACTIVA</p>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{currentUser?.username}</p>
              <span style={{
                display: 'inline-block',
                marginTop: '0.2rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                background: currentUser?.role === 'Admin' ? 'var(--accent-glow)' : 'var(--accent-secondary-glow)',
                color: currentUser?.role === 'Admin' ? 'var(--accent)' : 'var(--accent-secondary)',
              }}>{currentUser?.role}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.7rem 0.85rem',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid transparent',
              color: 'var(--danger)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              width: '100%',
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-dim)'; e.currentTarget.style.borderColor = 'var(--danger)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
          >
            <span style={{ fontSize: '1rem', minWidth: '20px', textAlign: 'center' }}>⏻</span>
            {sidebarOpen && 'Cerrar Sesión'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '240px' : '60px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
      }}>
        {/* Topbar */}
        <div style={{
          height: '70px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>SISTEMA ONLINE</span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
