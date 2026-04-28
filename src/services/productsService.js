// services/productsService.js
// Mock service — en Momento 3 reemplazar con fetch() al gateway Node.js

const STORAGE_KEY = 'stockmind_products'

const defaultProducts = [
  {
    id: 1,
    category_id: 1,
    name: 'Laptop Dell XPS 15',
    sku: 'DELL-XPS15-001',
    description: 'Laptop de alto rendimiento para desarrollo',
    price: 4500000,
    stock_current: 8,
    stock_minimum: 3,
    unit: 'unidad',
    active: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    category_id: 1,
    name: 'Monitor LG 27"',
    sku: 'LG-MON27-002',
    description: 'Monitor 4K IPS 27 pulgadas',
    price: 1200000,
    stock_current: 2,
    stock_minimum: 5,
    unit: 'unidad',
    active: true,
    created_at: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    category_id: 2,
    name: 'Teclado Mecánico HyperX',
    sku: 'HYP-TEC-003',
    description: 'Teclado mecánico RGB switches Cherry MX',
    price: 350000,
    stock_current: 15,
    stock_minimum: 5,
    unit: 'unidad',
    active: true,
    created_at: '2024-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    category_id: 2,
    name: 'Mouse Logitech MX Master 3',
    sku: 'LOG-MX3-004',
    description: 'Mouse inalámbrico profesional',
    price: 280000,
    stock_current: 20,
    stock_minimum: 8,
    unit: 'unidad',
    active: true,
    created_at: '2024-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    category_id: 3,
    name: 'Cable HDMI 2.1',
    sku: 'CBL-HDMI-005',
    description: 'Cable HDMI 2.1 de 2 metros 8K',
    price: 45000,
    stock_current: 4,
    stock_minimum: 10,
    unit: 'unidad',
    active: true,
    created_at: '2024-01-05T00:00:00.000Z',
  },
]

const getAll = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts))
    return defaultProducts
  }
  return JSON.parse(stored)
}

const save = (products) => localStorage.setItem(STORAGE_KEY, JSON.stringify(products))

export const productsService = {
  getAll: () => getAll().filter((p) => p.active),

  getAllAdmin: () => getAll(),

  getById: (id) => getAll().find((p) => p.id === id) || null,

  getLowStock: () => getAll().filter((p) => p.stock_current <= p.stock_minimum && p.active),

  create: (data) => {
    const products = getAll()
    const exists = products.find((p) => p.sku === data.sku)
    if (exists) return { error: 'SKU ya existe' }

    const newProduct = {
      id: Date.now(),
      category_id: Number(data.category_id) || 1,
      name: data.name,
      sku: data.sku,
      description: data.description || '',
      price: Number(data.price),
      stock_current: Number(data.stock_current),
      stock_minimum: Number(data.stock_minimum),
      unit: data.unit || 'unidad',
      active: true,
      created_at: new Date().toISOString(),
    }
    save([...products, newProduct])
    return { data: newProduct }
  },

  update: (id, data) => {
    const products = getAll()
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) return { error: 'Producto no encontrado' }
    products[idx] = { ...products[idx], ...data }
    save(products)
    return { data: products[idx] }
  },

  updateStock: (id, newStock) => {
    const products = getAll()
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) return { error: 'Producto no encontrado' }
    products[idx].stock_current = newStock
    save(products)
    return { data: products[idx] }
  },

  remove: (id) => {
    const products = getAll()
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) return { error: 'Producto no encontrado' }
    products[idx].active = false
    save(products)
    return { data: true }
  },
}

export const CATEGORIES = [
  { id: 1, name: 'Computadores' },
  { id: 2, name: 'Periféricos' },
  { id: 3, name: 'Accesorios' },
  { id: 4, name: 'Componentes' },
]
