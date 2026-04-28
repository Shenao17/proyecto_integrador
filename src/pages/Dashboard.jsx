import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { productsService } from '../services/productsService'
import { salesService } from '../services/salesService'
import { inventoryService } from '../services/inventoryService'
import { StatCard, Card, Badge, PageHeader, Table, Tr, Td } from '../components/ui/index'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { currentUser, isAdmin } = useAuth()
  const [stats, setStats] = useState({ products: 0, lowStock: 0, sales: 0, revenue: 0 })
  const [recentSales, setRecentSales] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])

  useEffect(() => {
    const products = productsService.getAll()
    const lowStock = productsService.getLowStock()
    const salesStats = salesService.getStats()
    const allSales = salesService.getAll()

    setStats({
      products: products.length,
      lowStock: lowStock.length,
      sales: salesStats.totalSales,
      revenue: salesStats.totalRevenue,
    })
    setRecentSales(allSales.slice(-5).reverse())
    setLowStockProducts(lowStock)
  }, [])

  const formatCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="fade-in">
      <PageHeader
        title={`Bienvenido, ${currentUser?.username}`}
        subtitle={`Panel de control · ${new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard label="Productos activos" value={stats.products} icon="◈" variant="default" />
        <StatCard label="Stock crítico" value={stats.lowStock} icon="⚠" variant={stats.lowStock > 0 ? 'danger' : 'success'} sub={stats.lowStock > 0 ? 'Requieren reabastecimiento' : 'Todo en orden'} />
        <StatCard label="Total ventas" value={stats.sales} icon="◆" variant="purple" />
        <StatCard label="Ingresos totales" value={formatCOP(stats.revenue)} icon="$" variant="success" />
      </div>

      <div className="grid-2">
        {/* Alertas stock bajo */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>⚠ STOCK CRÍTICO</h3>
            <Link to="/products" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>Ver todos →</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--success)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              ✓ Sin alertas de stock
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lowStockProducts.map((p) => (
                <div key={p.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'var(--danger-dim)',
                  border: '1px solid rgba(255,51,102,0.2)',
                  borderRadius: '6px',
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.sku}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 700 }}>{p.stock_current}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>mín: {p.stock_minimum}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Ventas recientes */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>◆ VENTAS RECIENTES</h3>
            <Link to="/sales" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>Ver todas →</Link>
          </div>
          {recentSales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              Sin ventas registradas
            </div>
          ) : (
            <Table headers={['ID', 'Fecha', 'Items', 'Total']}>
              {recentSales.map((s) => (
                <Tr key={s.id}>
                  <Td mono>#{s.id}</Td>
                  <Td>{new Date(s.created_at).toLocaleDateString('es-CO')}</Td>
                  <Td>{s.sale_details.length}</Td>
                  <Td><span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>{formatCOP(s.total)}</span></Td>
                </Tr>
              ))}
            </Table>
          )}
        </Card>
      </div>

      {/* System info */}
      <div style={{ marginTop: '2rem' }}>
        <Card style={{ borderColor: 'var(--border)', background: 'transparent' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SISTEMA</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>StockMind v1.0- Momento 2 FrontEnd</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ROL ACTIVO</p>
              <Badge variant={currentUser?.role === 'Admin' ? 'accent' : 'purple'}>{currentUser?.role}</Badge>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>STORAGE</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>localStorage (Modo Demo)</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ESTADO</p>
              <Badge variant="success">ONLINE</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
