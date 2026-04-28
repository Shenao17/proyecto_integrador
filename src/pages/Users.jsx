import { useState, useEffect } from 'react'
import { usersService } from '../services/usersService'
import { PageHeader, Card, Table, Tr, Td, Badge, Button, Modal, Input, Select, Alert } from '../components/ui/index'

function UserForm({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'Vendedor',
    active: user?.active ?? true,
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Requerido'
    if (!form.email.trim()) e.email = 'Requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!user && !form.password.trim()) e.password = 'Requerido'
    if (!user && form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    const data = { ...form }
    if (user && !form.password) delete data.password
    else if (form.password) data.password_hash = form.password
    onSave(data)
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-2">
        <Input label="Usuario" value={form.username} onChange={set('username')} error={errors.username} required />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} required />
      </div>
      <div className="grid-2">
        <Input label={user ? 'Nueva contraseña (opcional)' : 'Contraseña'} type="password" value={form.password} onChange={set('password')} error={errors.password} required={!user} />
        <Select label="Rol" value={form.role} onChange={set('role')}>
          <option value="Vendedor">Vendedor</option>
          <option value="Admin">Admin</option>
        </Select>
      </div>
      {user && (
        <Select label="Estado" value={form.active} onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })}>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </Select>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{user ? 'Actualizar' : 'Crear Usuario'}</Button>
      </div>
    </form>
  )
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const load = () => setUsers(usersService.getAll())
  useEffect(() => { load() }, [])

  const handleSave = (form) => {
    const result = modal === 'create'
      ? usersService.create({ ...form, password: form.password_hash || form.password })
      : usersService.update(modal.id, form)
    if (result.error) { setFeedback({ type: 'danger', msg: result.error }); return }
    setFeedback({ type: 'success', msg: modal === 'create' ? 'Usuario creado' : 'Usuario actualizado' })
    setModal(null)
    load()
    setTimeout(() => setFeedback(null), 2500)
  }

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return
    usersService.remove(id)
    load()
    setFeedback({ type: 'success', msg: 'Usuario eliminado' })
    setTimeout(() => setFeedback(null), 2000)
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Usuarios"
        subtitle={`${users.length} usuarios registrados`}
        actions={<Button onClick={() => setModal('create')}>+ Nuevo Usuario</Button>}
      />

      {feedback && <div style={{ marginBottom: '1rem' }}><Alert variant={feedback.type} onClose={() => setFeedback(null)}>{feedback.msg}</Alert></div>}

      <Card>
        <Table headers={['ID', 'Usuario', 'Email', 'Rol', 'Estado', 'Creado', 'Acciones']}>
          {users.map((u) => (
            <Tr key={u.id}>
              <Td mono>{u.id}</Td>
              <Td><div style={{ fontWeight: 600 }}>{u.username}</div></Td>
              <Td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{u.email}</span></Td>
              <Td><Badge variant={u.role === 'Admin' ? 'accent' : 'purple'}>{u.role}</Badge></Td>
              <Td><Badge variant={u.active ? 'success' : 'danger'}>{u.active ? 'ACTIVO' : 'INACTIVO'}</Badge></Td>
              <Td>{new Date(u.created_at).toLocaleDateString('es-CO')}</Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="secondary" size="sm" onClick={() => setModal(u)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>Eliminar</Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}>
        {modal && <UserForm user={modal === 'create' ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} />}
      </Modal>
    </div>
  )
}
