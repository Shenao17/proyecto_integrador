// services/usersService.js
// Mock service — en Momento 3 reemplazar con fetch() al gateway Node.js

const STORAGE_KEY = 'stockmind_users'

const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@stockmind.com',
    password_hash: 'admin123',
    role: 'Admin',
    active: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    username: 'vendedor1',
    email: 'vendedor@stockmind.com',
    password_hash: 'vendedor123',
    role: 'Vendedor',
    active: true,
    created_at: '2024-01-15T00:00:00.000Z',
  },
]

const getAll = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
    return defaultUsers
  }
  return JSON.parse(stored)
}

const save = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

export const usersService = {
  getAll,

  getById: (id) => getAll().find((u) => u.id === id) || null,

  findByCredentials: (username, password) =>
    getAll().find(
      (u) => u.username === username && u.password_hash === password && u.active
    ) || null,

  create: (data) => {
    const users = getAll()
    const exists = users.find((u) => u.username === data.username || u.email === data.email)
    if (exists) return { error: 'Usuario o email ya existe' }

    const newUser = {
      id: Date.now(),
      username: data.username,
      email: data.email,
      password_hash: data.password,
      role: data.role || 'Vendedor',
      active: true,
      created_at: new Date().toISOString(),
    }
    save([...users, newUser])
    return { data: newUser }
  },

  update: (id, data) => {
    const users = getAll()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return { error: 'Usuario no encontrado' }
    users[idx] = { ...users[idx], ...data }
    save(users)
    return { data: users[idx] }
  },

  remove: (id) => {
    const users = getAll().filter((u) => u.id !== id)
    save(users)
    return { data: true }
  },
}
