// services/salesService.js
// Mock service — en Momento 3 reemplazar con fetch() al gateway Node.js

const STORAGE_KEY = 'stockmind_sales'

const defaultSales = [
  {
    id: 1,
    user_id: 2,
    total: 4780000,
    status: 'completed',
    created_at: '2024-03-10T14:30:00.000Z',
    sale_details: [
      { id: 1, sale_id: 1, product_id: 1, quantity: 1, unit_price: 4500000, subtotal: 4500000 },
      { id: 2, sale_id: 1, product_id: 4, quantity: 1, unit_price: 280000, subtotal: 280000 },
    ],
  },
  {
    id: 2,
    user_id: 2,
    total: 675000,
    status: 'completed',
    created_at: '2024-03-11T10:15:00.000Z',
    sale_details: [
      { id: 3, sale_id: 2, product_id: 3, quantity: 1, unit_price: 350000, subtotal: 350000 },
      { id: 4, sale_id: 2, product_id: 4, quantity: 1, unit_price: 280000, subtotal: 280000 },
      { id: 5, sale_id: 2, product_id: 5, quantity: 1, unit_price: 45000, subtotal: 45000 },
    ],
  },
]

const getAll = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSales))
    return defaultSales
  }
  return JSON.parse(stored)
}

const save = (sales) => localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))

export const salesService = {
  getAll,

  getById: (id) => getAll().find((s) => s.id === id) || null,

  create: (userId, items) => {
    // items: [{ product_id, quantity, unit_price }]
    const sales = getAll()
    const sale_details = items.map((item, i) => ({
      id: Date.now() + i,
      sale_id: Date.now(),
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.quantity * item.unit_price,
    }))
    const total = sale_details.reduce((acc, d) => acc + d.subtotal, 0)
    const newSale = {
      id: Date.now(),
      user_id: userId,
      total,
      status: 'completed',
      created_at: new Date().toISOString(),
      sale_details,
    }
    save([...sales, newSale])
    return { data: newSale }
  },

  getStats: () => {
    const sales = getAll()
    const total = sales.reduce((acc, s) => acc + s.total, 0)
    const totalItems = sales.reduce((acc, s) => acc + s.sale_details.reduce((a, d) => a + d.quantity, 0), 0)
    return { totalSales: sales.length, totalRevenue: total, totalItems }
  },
}
