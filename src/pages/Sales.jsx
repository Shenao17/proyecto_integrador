import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { salesService } from '../services/salesService'
import { productsService } from '../services/productsService'
import { inventoryService } from '../services/inventoryService'
import { PageHeader, Card, Table, Tr, Td, Badge, Button, Modal, Select, Alert, StatCard } from '../components/ui/index'

function NewSaleForm({ onSave, onCancel }) {
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setProducts(productsService.getAll().filter((p) => p.stock_current > 0))
  }, [])

  const formatCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const addItem = () => setItems([...items, { product_id: '', quantity: 1 }])
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))

  const updateItem = (i, field, value) => {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: value }
    setItems(updated)
  }

  const getProduct = (id) => products.find((p) => p.id === Number(id))

  const getTotal = () => items.reduce((acc, item) => {
    const p = getProduct(item.product_id)
    return acc + (p ? p.price * item.quantity : 0)
  }, 0)

  const validate = () => {
    const e = {}
    if (items.length === 0) { e.general = 'Agrega al menos un producto'; return e }
    items.forEach((item, i) => {
      if (!item.product_id) { e[`p${i}`] = 'Selecciona un producto' }
      else {
        const p = getProduct(item.product_id)
        if (!item.quantity || item.quantity < 1) { e[`q${i}`] = 'Cantidad inválida' }
        else if (p && item.quantity > p.stock_current) { e[`q${i}`] = `Máx disponible: ${p.stock_current}` }
      }
    })
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    const saleItems = items.map((item) => {
      const p = getProduct(item.product_id)
      return { product_id: p.id, quantity: Number(item.quantity), unit_price: p.price }
    })
    onSave(saleItems)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {errors.general && <Alert variant="danger">{errors.general}</Alert>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item, i) => {
          const p = getProduct(item.product_id)
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'end', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div>
                <Select label={`Producto ${i + 1}`} value={item.product_id} onChange={(e) => updateItem(i, 'product_id', e.target.value)} error={errors[`p${i}`]}>
                  <option value="">Seleccionar...</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>{prod.name} — Stock: {prod.stock_current} — {formatCOP(prod.price)}</option>
                  ))}
                </Select>
              </div>
              <div style={{ width: '80px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Cant.</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  style={{ background: 'var(--bg-card)', border: `1px solid ${errors[`q${i}`] ? 'var(--danger)' : 'var(--border-bright)'}`, borderRadius: '6px', padding: '0.65rem 0.5rem', color: 'var(--text-primary)', width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
                />
                {errors[`q${i}`] && <span style={{ fontSize: '0.7rem', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>{errors[`q${i}`]}</span>}
              </div>
              {items.length > 1 && (
                <Button variant="danger" size="sm" onClick={() => removeItem(i)}>✕</Button>
              )}
            </div>
          )
        })}
      </div>

      <Button variant="ghost" size="sm" onClick={addItem}>+ Agregar producto</Button>

      <div style={{ background: 'var(--success-dim)', border: '1px solid var(--success)', borderRadius: '6px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>TOTAL VENTA</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)' }}>{formatCOP(getTotal())}</span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Registrar Venta</Button>
      </div>
    </form>
  )
}

export default function Sales() {
  const { currentUser } = useAuth()
  const [sales, setSales] = useState([])
  const [modal, setModal] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [selectedSale, setSelectedSale] = useState(null)

  const load = () => setSales(salesService.getAll().slice().reverse())

  useEffect(() => { load() }, [])

  const formatCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const handleSave = (items) => {
    // Descontar stock y registrar movimientos
    items.forEach((item) => {
      const p = productsService.getById(item.product_id)
      if (p) {
        const newStock = p.stock_current - item.quantity
        productsService.updateStock(item.product_id, newStock)
        inventoryService.create({
          product_id: item.product_id,
          user_id: currentUser.id,
          type: 'SALE',
          quantity: item.quantity,
          reason: 'Venta registrada',
          stock_before: p.stock_current,
          stock_after: newStock,
        })
      }
    })
    const result = salesService.create(currentUser.id, items)
    if (result.error) { setFeedback({ type: 'danger', msg: result.error }); return }
    setFeedback({ type: 'success', msg: `Venta #${result.data.id} registrada — ${formatCOP(result.data.total)}` })
    setModal(false)
    load()
    setTimeout(() => setFeedback(null), 3000)
  }

  const stats = salesService.getStats()

  return (
    <div className="fade-in">
      <PageHeader
        title="Ventas"
        subtitle={`Historial de transacciones`}
        actions={<Button onClick={() => setModal(true)}>+ Nueva Venta</Button>}
      />

      {feedback && <div style={{ marginBottom: '1rem' }}><Alert variant={feedback.type} onClose={() => setFeedback(null)}>{feedback.msg}</Alert></div>}

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <StatCard label="Total ventas" value={stats.totalSales} icon="◆" variant="purple" />
        <StatCard label="Items vendidos" value={stats.totalItems} icon="📦" variant="default" />
        <StatCard label="Ingresos" value={formatCOP(stats.totalRevenue)} icon="$" variant="success" />
      </div>

      <Card>
        <Table headers={['#', 'Fecha', 'Productos', 'Items', 'Total', 'Estado']}>
          {sales.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Sin ventas registradas</td></tr>
          ) : sales.map((s) => (
            <Tr key={s.id} onClick={() => setSelectedSale(s)}>
              <Td mono>#{s.id}</Td>
              <Td>{new Date(s.created_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</Td>
              <Td>{s.sale_details.map((d) => {
                const p = productsService.getById(d.product_id)
                return p?.name || `#${d.product_id}`
              }).join(', ')}</Td>
              <Td mono>{s.sale_details.reduce((a, d) => a + d.quantity, 0)}</Td>
              <Td><span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{formatCOP(s.total)}</span></Td>
              <Td><Badge variant="success">COMPLETADA</Badge></Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nueva Venta">
        <NewSaleForm onSave={handleSave} onCancel={() => setModal(false)} />
      </Modal>

      <Modal isOpen={!!selectedSale} onClose={() => setSelectedSale(null)} title={`Detalle Venta #${selectedSale?.id}`}>
        {selectedSale && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Table headers={['Producto', 'Qty', 'P. Unit.', 'Subtotal']}>
              {selectedSale.sale_details.map((d) => {
                const p = productsService.getById(d.product_id)
                return (
                  <Tr key={d.id}>
                    <Td>{p?.name || `Producto #${d.product_id}`}</Td>
                    <Td mono>{d.quantity}</Td>
                    <Td mono>{formatCOP(d.unit_price)}</Td>
                    <Td><span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>{formatCOP(d.subtotal)}</span></Td>
                  </Tr>
                )
              })}
            </Table>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--success-dim)', borderRadius: '6px', border: '1px solid var(--success)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>TOTAL</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{formatCOP(selectedSale.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
