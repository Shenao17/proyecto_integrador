import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { productsService, CATEGORIES } from '../services/productsService'
import { PageHeader, Card, Table, Tr, Td, Badge, Button, Modal, Input, Select, Alert } from '../components/ui/index'

function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
    category_id: product?.category_id || 1,
    price: product?.price || '',
    stock_current: product?.stock_current || '',
    stock_minimum: product?.stock_minimum || '',
    unit: product?.unit || 'unidad',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nombre requerido'
    if (!form.sku.trim()) e.sku = 'SKU requerido'
    if (!form.price || Number(form.price) <= 0) e.price = 'Precio inválido'
    if (form.stock_current === '' || Number(form.stock_current) < 0) e.stock_current = 'Stock inválido'
    if (form.stock_minimum === '' || Number(form.stock_minimum) < 0) e.stock_minimum = 'Mínimo inválido'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSave(form)
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-2">
        <Input label="Nombre" value={form.name} onChange={set('name')} error={errors.name} required />
        <Input label="SKU" value={form.sku} onChange={set('sku')} error={errors.sku} required />
      </div>
      <Input label="Descripción" value={form.description} onChange={set('description')} />
      <div className="grid-2">
        <Select label="Categoría" value={form.category_id} onChange={set('category_id')}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Input label="Unidad" value={form.unit} onChange={set('unit')} />
      </div>
      <div className="grid-3">
        <Input label="Precio (COP)" type="number" value={form.price} onChange={set('price')} error={errors.price} required />
        <Input label="Stock actual" type="number" value={form.stock_current} onChange={set('stock_current')} error={errors.stock_current} required />
        <Input label="Stock mínimo" type="number" value={form.stock_minimum} onChange={set('stock_minimum')} error={errors.stock_minimum} required />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{product ? 'Actualizar' : 'Crear Producto'}</Button>
      </div>
    </form>
  )
}

// ─── ProductCard — pasa datos via props (HU08) ────────────
function ProductCard({ product, onEdit, onDelete, isAdmin, formatCOP }) {
  const cat = CATEGORIES.find((c) => c.id === product.category_id)
  const isLow = product.stock_current <= product.stock_minimum

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '1rem' }}>{product.name}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{product.sku}</p>
        </div>
        <Badge variant={isLow ? 'danger' : 'success'}>{isLow ? 'CRÍTICO' : 'OK'}</Badge>
      </div>
      {product.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.description}</p>}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {cat && <Badge variant="accent">{cat.name}</Badge>}
        <Badge variant="default">{product.unit}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>PRECIO</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--success)', fontWeight: 700 }}>{formatCOP(product.price)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>STOCK</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: isLow ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 700 }}>{product.stock_current} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/ mín {product.stock_minimum}</span></p>
        </div>
      </div>
      {isAdmin && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <Button variant="secondary" size="sm" onClick={() => onEdit(product)} fullWidth>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(product.id)} fullWidth>Eliminar</Button>
        </div>
      )}
    </Card>
  )
}

export default function Products() {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [modal, setModal] = useState(null) // null | 'create' | product
  const [feedback, setFeedback] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')

  const load = () => setProducts(isAdmin() ? productsService.getAllAdmin() : productsService.getAll())

  useEffect(() => { load() }, [])

  const formatCOP = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const handleSave = (form) => {
    const result = modal === 'create'
      ? productsService.create(form)
      : productsService.update(modal.id, form)
    if (result.error) { setFeedback({ type: 'danger', msg: result.error }); return }
    setFeedback({ type: 'success', msg: modal === 'create' ? 'Producto creado correctamente' : 'Producto actualizado' })
    setModal(null)
    load()
    setTimeout(() => setFeedback(null), 2500)
  }

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    productsService.remove(id)
    load()
    setFeedback({ type: 'success', msg: 'Producto eliminado' })
    setTimeout(() => setFeedback(null), 2000)
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.category_id === Number(filterCat) : true
    return matchSearch && matchCat
  })

  return (
    <div className="fade-in">
      <PageHeader
        title="Productos"
        subtitle={`${products.length} productos registrados`}
        actions={isAdmin() && <Button onClick={() => setModal('create')}>+ Nuevo Producto</Button>}
      />

      {feedback && <div style={{ marginBottom: '1rem' }}><Alert variant={feedback.type} onClose={() => setFeedback(null)}>{feedback.msg}</Alert></div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Input placeholder="Buscar por nombre o SKU..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
        <Select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>No se encontraron productos</p>
        </Card>
      ) : (
        <div className="grid-3">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={(prod) => setModal(prod)}
              onDelete={handleDelete}
              isAdmin={isAdmin()}
              formatCOP={formatCOP}
            />
          ))}
        </div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Nuevo Producto' : 'Editar Producto'}>
        {modal && <ProductForm product={modal === 'create' ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} />}
      </Modal>
    </div>
  )
}
