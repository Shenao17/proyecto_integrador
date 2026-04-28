import { useState } from 'react'

// ─── Button ───────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled = false, fullWidth = false }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
  }

  const sizes = {
    sm: { padding: '0.4rem 0.9rem', fontSize: '0.8rem' },
    md: { padding: '0.65rem 1.4rem', fontSize: '0.9rem' },
    lg: { padding: '0.85rem 2rem', fontSize: '1rem' },
  }

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
      color: '#000',
      boxShadow: '0 0 20px var(--accent-glow)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
      boxShadow: 'none',
    },
    danger: {
      background: 'var(--danger-dim)',
      color: 'var(--danger)',
      border: '1px solid var(--danger)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.boxShadow = '0 0 30px var(--accent-glow-strong)'
          if (variant === 'secondary') e.currentTarget.style.background = 'var(--accent-glow)'
          if (variant === 'ghost') e.currentTarget.style.borderColor = 'var(--border-bright)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'
          if (variant === 'secondary') e.currentTarget.style.background = 'transparent'
          if (variant === 'ghost') e.currentTarget.style.borderColor = 'var(--border)'
        }
      }}
    >
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────
export function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${glow ? 'var(--accent-dim)' : 'var(--border)'}`,
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: glow ? '0 0 20px var(--accent-glow), inset 0 1px 0 rgba(0,212,255,0.1)' : 'none',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────
export function Input({ label, error, type = 'text', value, onChange, placeholder, required = false, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {label && (
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          background: 'var(--bg-secondary)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-bright)'}`,
          borderRadius: '6px',
          padding: '0.65rem 1rem',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          fontFamily: 'var(--font-body)',
          outline: 'none',
          transition: 'border-color 0.2s',
          width: '100%',
        }}
        onFocus={(e) => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent-dim)' }}
        onBlur={(e) => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-bright)' }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>{error}</span>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────
export function Select({ label, error, value, onChange, children, required = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {label && (
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
          {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{
          background: 'var(--bg-secondary)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-bright)'}`,
          borderRadius: '6px',
          padding: '0.65rem 1rem',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          fontFamily: 'var(--font-body)',
          outline: 'none',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>{error}</span>}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: { bg: 'var(--border)', color: 'var(--text-secondary)' },
    success: { bg: 'var(--success-dim)', color: 'var(--success)' },
    warning: { bg: 'var(--warning-dim)', color: 'var(--warning)' },
    danger: { bg: 'var(--danger-dim)', color: 'var(--danger)' },
    accent: { bg: 'var(--accent-glow)', color: 'var(--accent)' },
    purple: { bg: 'var(--accent-secondary-glow)', color: 'var(--accent-secondary)' },
  }
  const v = variants[variant] || variants.default
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      letterSpacing: '0.05em',
      background: v.bg,
      color: v.color,
    }}>
      {children}
    </span>
  )
}

// ─── StatCard ─────────────────────────────────────────────
export function StatCard({ label, value, icon, variant = 'default', sub }) {
  const colors = {
    default: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
    purple: 'var(--accent-secondary)',
  }
  const color = colors[variant] || colors.default

  return (
    <Card style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>{label}</p>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color, lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{sub}</p>}
        </div>
        {icon && <span style={{ fontSize: '1.8rem', opacity: 0.6 }}>{icon}</span>}
      </div>
    </Card>
  )
}

// ─── Alert ────────────────────────────────────────────────
export function Alert({ children, variant = 'info', onClose }) {
  const variants = {
    info: { bg: 'var(--accent-glow)', border: 'var(--accent-dim)', color: 'var(--accent)' },
    success: { bg: 'var(--success-dim)', border: 'var(--success)', color: 'var(--success)' },
    warning: { bg: 'var(--warning-dim)', border: 'var(--warning)', color: 'var(--warning)' },
    danger: { bg: 'var(--danger-dim)', border: 'var(--danger)', color: 'var(--danger)' },
  }
  const v = variants[variant] || variants.info
  return (
    <div style={{
      background: v.bg,
      border: `1px solid ${v.border}`,
      borderRadius: '6px',
      padding: '0.75rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      color: v.color,
      fontFamily: 'var(--font-mono)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <span>{children}</span>
      {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem', marginLeft: '1rem' }}>✕</button>}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(5,5,8,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      backdropFilter: 'blur(4px)',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: '10px',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 20px var(--accent-glow)',
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--accent)', letterSpacing: '0.05em' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────
export function Table({ headers, children, emptyMessage = 'Sin datos' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-bright)' }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '0.75rem 1rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children, onClick }) {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.15s',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </tr>
  )
}

export function Td({ children, mono = false }) {
  return (
    <td style={{
      padding: '0.85rem 1rem',
      fontSize: '0.9rem',
      color: 'var(--text-primary)',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </td>
  )
}

// ─── PageHeader ───────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', fontSize: '0.9rem' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  )
}
