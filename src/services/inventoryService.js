// services/inventoryService.js
// Mock service — en Momento 3 reemplazar con fetch() al gateway Node.js

const STORAGE_KEY = 'stockmind_inventory'

const defaultMovements = [
  {
    id: 1,
    product_id: 1,
    user_id: 1,
    type: 'ENTRY',
    quantity: 10,
    reason: 'Stock inicial',
    stock_before: 0,
    stock_after: 10,
    created_at: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 2,
    product_id: 2,
    user_id: 1,
    type: 'ENTRY',
    quantity: 5,
    reason: 'Stock inicial',
    stock_before: 0,
    stock_after: 5,
    created_at: '2024-01-01T08:05:00.000Z',
  },
  {
    id: 3,
    product_id: 1,
    user_id: 2,
    type: 'SALE',
    quantity: 2,
    reason: 'Venta #1',
    stock_before: 10,
    stock_after: 8,
    created_at: '2024-03-10T14:30:00.000Z',
  },
]

const getAll = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMovements))
    return defaultMovements
  }
  return JSON.parse(stored)
}

const save = (movements) => localStorage.setItem(STORAGE_KEY, JSON.stringify(movements))

export const inventoryService = {
  getAll,

  getByProduct: (productId) => getAll().filter((m) => m.product_id === productId),

  create: (data) => {
    const movements = getAll()
    const newMovement = {
      id: Date.now(),
      product_id: Number(data.product_id),
      user_id: data.user_id,
      type: data.type, // ENTRY | EXIT | SALE | ADJUST
      quantity: Number(data.quantity),
      reason: data.reason,
      stock_before: data.stock_before,
      stock_after: data.stock_after,
      created_at: new Date().toISOString(),
    }
    save([...movements, newMovement])
    return { data: newMovement }
  },
}

export const MOVEMENT_TYPES = ['ENTRY', 'EXIT', 'ADJUST']
