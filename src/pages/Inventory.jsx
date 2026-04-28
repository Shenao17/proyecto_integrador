import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { inventoryService, MOVEMENT_TYPES } from '../services/inventoryService'
import { productsService } from '../services/productsService'
import { usersService } from '../services/usersService'
import { PageHeader, Card, Table, Tr, Td, Badge, Button, Modal, Select, Input, Alert } from '../components/ui/index'

const TYPE_VARIANT = { ENTRY: 'success', EXIT: 'warning', SALE: 'accent', ADJUST: 'purple' }
const TYPE_LABEL = { ENTRY: 'ENTRADA', EXIT: 'SALIDA', SALE: 'VENTA', ADJUST: 'AJUSTE' }

function MovementForm({ onSave, onCancel, userId }) {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ product_id: '', type: 'ENTRY', quantity: '', reason: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => { setProducts(productsService.getAllAdmin()) }, [])

  const validate = () => {
    const e = {}
    if (!form.product_id) e.product_id = 'Selecciona un producto'
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = 'Cantidad inválida'
    if (!form.reason.trim()) e.reason = 'Motivo requerido'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    const p = products.find((x) => x.id === Number(form.product_id))
    const qty = Number(form.quantity)
    const stockBefore = p.stock_current
    const stockAfter = form.type === 'ENTRY' ? stockBefore + qty : Math.max(0, stockBefore - qty)
    productsService.updateStock(p.id, stockAfter)
    onSave({ ...form, user_id: userId, stock_before: stockBefore, stock_after: stockAfter })
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select label="Producto" value={form.product_id} onChange={set('product_id')} error={errors.product_id} required>
        <option value="">Seleccionar producto...</option>
        {products.map((p) => <option key={p.id} value={p.id}>{p.name} — Stock: {p.stock_current}</option>)}
      </Select>
      <div className="grid-2">
        <Select label="Tipo" value={form.type} onChange={set('type')}>
          {MOVEMENT_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
        </Select>
        <Input label="Cantidad" type="number" min="1" value={form.quantity} onChange={set('quantity')} error={errors.quantity} required />
      </div>
      <Input label="Motivo" value={form.reason} onChange={set('reason')} placeholder="Ej: Compra a proveedor, ajuste de inventario..." error={errors.reason} required />
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Registrar Movimiento</Button>
      </div>
    </form>
  )
}

export default function Inventory() {
  const { currentUser } = useAuth()
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [modal, setModal] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [filterType, setFilterType] = useState('')

  const load = () => {
    setMovements(inventoryService.getAll().slice().reverse())
    setProducts(productsService.getAllAdmin())
    setUsers(usersService.getAll())
  }

  useEffect(() => { load() }, [])

  const getProduct = (id) => products.find((p) => p.id === id)
  const getUser = (id) => users.find((u) => u.id === id)

  const handleSave = (form) => {
    inventoryService.create(form)
    setFeedback({ type: 'success', msg: 'Movimiento registrado correctamente' })
    setModal(false)
    load()
    setTimeout(() => setFeedback(null), 2500)
  }

  const filtered = filterType ? movements.filter((m) => m.type === filterType) : movements

  return (
    <div className="fade-in">
      <PageHeader
        title="Inventario"
        subtitle="Historial de movimientos de stock"
        actions={<Button onClick={() => setModal(true)}>+ Registrar Movimiento</Button>}
      />

      {feedback && <div style={{ marginBottom: '1rem' }}><Alert variant={feedback.type} onClose={() => setFeedback(null)}>{feedback.msg}</Alert></div>}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['', ...MOVEMENT_TYPES, 'SALE'].map((t) => (
          <button key={t} onClick={() => setFilterType(t)} style={{
            padding: '0.4rem 1rem',
            borderRadius: '4px',
            border: `1px solid ${filterType === t ? 'var(--accent)' : 'var(--border)'}`,
            background: filterType === t ? 'var(--accent-glow)' : 'transparent',
            color: filterType === t ? 'var(--accent)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            letterSpacing: '0.08em',
          }}>
            {t === '' ? 'TODOS' : TYPE_LABEL[t] || t}
          </button>
        ))}
      </div>

      <Card>
        <Table headers={['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Stock Antes', 'Stock Después', 'Motivo', 'Usuario']}>
          {filtered.length === 0 ? (
            <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Sin movimientos</td></tr>
          ) : filtered.map((m) => {
            const p = getProduct(m.product_id)
            const u = getUser(m.user_id)
            return (
              <Tr key={m.id}>
                <Td>{new Date(m.created_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</Td>
                <Td><div><p style={{ fontWeight: 600 }}>{p?.name || `#${m.product_id}`}</p><p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p?.sku}</p></div></Td>
                <Td><Badge variant={TYPE_VARIANT[m.type] || 'default'}>{TYPE_LABEL[m.type] || m.type}</Badge></Td>
                <Td mono>{m.quantity}</Td>
                <Td mono>{m.stock_before}</Td>
                <Td mono>{m.stock_after}</Td>
                <Td>{m.reason}</Td>
                <Td>{u?.username || `#${m.user_id}`}</Td>
              </Tr>
            )
          })}
        </Table>
      </Card>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Registrar Movimiento de Inventario">
        <MovementForm onSave={handleSave} onCancel={() => setModal(false)} userId={currentUser?.id} />
      </Modal>
    </div>
  )
}
