# StockMind React — Sistema Inteligente de Gestión de Inventario

> Segundo avance — Proyecto Integrador · Frontend con React

---

## Descripción

StockMind es una plataforma web para la gestión de inventario y ventas con roles diferenciados. Esta versión React implementa todas las funcionalidades del segundo hito: gestión de estado, comunicación entre componentes via props y context, navegación dinámica con rutas protegidas y lógica de autenticación local.

---

## Tecnologías

| Tecnología | Versión | Rol |
|---|---|---|
| React | 18.2 | Framework UI |
| React Router DOM | 6.x | Navegación dinámica |
| Vite | 5.x | Build tool |
| localStorage | — | Persistencia de datos (demo) |

---

## Instalación

```bash
# Clonar el repositorio
git clone <https://github.com/Shenao17/proyecto_integrador.git>
cd stockmind-react

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Credenciales demo

| Rol | Usuario | Contraseña |
|---|---|---|
| Admin | `admin` | `admin123` |
| Vendedor | `vendedor1` | `vendedor123` |

---

## Mapa de Rutas

```
/login          → Pública  · Inicio de sesión
/register       → Pública  · Registro de usuario

/dashboard      → Privada  · Panel principal (Admin + Vendedor)
/products       → Privada  · Gestión de productos (Admin + Vendedor)
/sales          → Privada  · Registro y listado de ventas (Admin + Vendedor)
/inventory      → Privada  · Movimientos de inventario (Solo Admin)
/users          → Privada  · Gestión de usuarios (Solo Admin)
```

---

## Lógica de Protección de Rutas (HU07)

La protección se implementa mediante el componente `ProtectedRoute`:

```jsx
// src/components/ProtectedRoute.jsx
function ProtectedRoute({ children, adminOnly }) {
  const { currentUser } = useAuth()

  if (!currentUser) return <Navigate to="/login" replace />
  if (adminOnly && currentUser.role !== 'Admin') return <Navigate to="/dashboard" replace />

  return children
}
```

El estado de autenticación vive en `AuthContext` y se persiste en `localStorage` bajo la clave `stockmind_session`. Al intentar acceder manualmente a cualquier ruta privada sin sesión activa, el sistema redirige automáticamente al login.

---

## Arquitectura de Componentes

```
src/
├── context/
│   └── AuthContext.jsx        → Estado global de autenticación (useContext)
├── services/
│   ├── usersService.js        → Mock CRUD de usuarios (localStorage)
│   ├── productsService.js     → Mock CRUD de productos (localStorage)
│   ├── salesService.js        → Mock registro de ventas (localStorage)
│   └── inventoryService.js    → Mock movimientos de inventario (localStorage)
├── components/
│   ├── ProtectedRoute.jsx     → HOC de protección de rutas
│   ├── layout/
│   │   └── Layout.jsx         → Sidebar + topbar (recibe children via props)
│   └── ui/
│       └── index.jsx          → Button, Card, Input, Select, Modal, Table, Badge...
└── pages/
    ├── Login.jsx              → HU06 · Inicio de sesión
    ├── Register.jsx           → HU05 · Registro de usuario
    ├── Dashboard.jsx          → Vista principal con métricas
    ├── Products.jsx           → HU08/HU09 · Listado y registro de productos
    ├── Sales.jsx              → HU09 · Registro y visualización de ventas
    ├── Inventory.jsx          → Movimientos de stock (Admin)
    └── Users.jsx              → CRUD de usuarios (Admin)
```

---

## Conceptos implementados

### useState
Gestión de formularios controlados en todas las páginas. Ejemplo en `Products.jsx`:
```jsx
const [form, setForm] = useState({ name: '', sku: '', price: '' })
```

### Props
Los datos fluyen desde páginas hacia componentes UI. Ejemplo: `ProductCard` recibe `product`, `onEdit`, `onDelete`, `isAdmin` y `formatCOP` como props desde `Products.jsx`.

### Context API
`AuthContext` provee `currentUser`, `login`, `logout` e `isAdmin` a todos los componentes sin prop drilling.

### React Router
Navegación declarativa con rutas anidadas y redirección condicional basada en estado de autenticación y rol.

---

## Dependencias instaladas

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0"
}
```

---

## Proyección Momento 3

Los servicios en `src/services/` están diseñados para ser reemplazados por llamadas `fetch()` al gateway Node.js con mínimo esfuerzo. Solo se requiere:

1. Agregar `useEffect` en cada página para la carga inicial
2. Reemplazar funciones del servicio por `async/await fetch()`
3. El gateway ya está implementado en puerto `3000`

Los nombres de atributos respetan exactamente el modelo de base de datos definido en el README del sistema completo.
