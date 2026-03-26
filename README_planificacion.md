# StockMind 🧠📦
### Sistema Inteligente de Gestión de Inventario y Predicción de Demanda

> Proyecto Integrador — Desarrollo de Software 
> Curso: Desarrollo de Software, - CESDE

---

## ¿De qué trata el proyecto?

StockMind es una plataforma web para pequeñas y medianas empresas que combina la gestión operativa de inventario y ventas con un módulo de **predicción de demanda basado en machine learning**.

El problema que resuelve es simple pero costoso: las empresas pequeñas pierden dinero de dos formas:
- Compran demasiado de lo que no se vende (sobrestock = capital inmovilizado)
- Se les acaba lo que más se vende (quiebre de stock = perdida de ventas)

La solución es un sistema que no solo registre ventas e inventario, sino que **aprenda del historial de ventas para predecir cuánto se va a vender la próxima semana o mes**, y recomiende exactamente cuánto reabastecer a un futuro.

---

## Tecnologías y por qué cada una

El sistema está dividido en capas, y cada tecnología fue elegida porque hace algo que las demás no hacen igual de bien o son complejos de hacer.

### Frontend — HTML + CSS + JavaScript
La interfaz de usuario. Se decidió no usar un framework como React o Vue para mantener el foco en la arquitectura del sistema. El frontend consume exclusivamente las rutas del gateway, nunca habla directamente con Java ni con Python.

### API Gateway — Node.js + Express
El punto de entrada único del sistema. Toda petición del frontend pasa primero por aquí. Sus responsabilidades son:
- Verificar el token JWT de autenticación en un solo lugar
- Enrutar hacia Java o Python según el módulo solicitado
- Aplicar rate limiting y CORS

Node.js es ideal para este rol por su naturaleza no bloqueante, perfecta para manejar múltiples conexiones concurrentes hacia servicios distintos.

### Backend Principal — Java + Spring Boot ( el mas importane :D )
La lógica de negocio crítica. Java fue elegido por su robustez en el manejo de transacciones. La operación más sensible del sis-tema es registrar una venta: en una sola transacción ACID debe descontarse el stock de cada producto, registrarse la venta, guardarse el detalle y registrarse el movimiento de inventario. Si algo falla, todo se revierte. Spring Boot con JPA e Hibernate sobre MySQL garantiza esto (Q complicadoxd).

### Base de Datos — MySQL
Base de datos relacional. La elección se justifica por la naturaleza de los datos: productos, ventas, inventario y usuarios tienen relaciones estrictas de integridad referencial. MySQL garantiza que nunca se pierda el historial de ventas aunque se elimine un producto, y que el stock nunca quede en un estado inconsistente.

### Microservicio de Analítica — Python + Flask
El componente de inteligencia del sistema. Python fue elegido porque su ecosistema científico no tiene equivalente real en los otros lenguajes del stack:

- **pandas** — manipulación y agregación de series temporales de ventas
- **scikit-learn** — implementación de regresión lineal con cálculo de R² 
- **numpy** — operaciones vectoriales para media móvil ponderada

Este microservicio es independiente del resto del sistema. Si no está disponible, el inventario y las ventas siguen funcionando. Su único trabajo es analizar datos históricos y generar predicciones(algo basico pero que hace la diferencia)

---

## Arquitectura propuesta

```
[ Navegador Web ]
      |
      | HTTP/REST
      v
[ API Gateway — Node.js :3000 ]
      |                    |
      | /api/*             | /api/predictions/*
      v                    v
[ Java Spring Boot :8080 ] [ Python Flask :8000 ]
      |                           |
      +----------+  +-------------+
                 |  |
                 v  v
           [ MySQL :3306 ]
```

El frontend NUNCA accede directamente a Java ni a Python. Todo pasa por el gateway. Esta decisión permite cambiar la implementación interna de cualquier servicio sin afectar al usuario.

---

## Módulos del sistema

| Módulo | Tecnología | Descripción |
|--------|-----------|-------------|
| Autenticación | Java + JWT | Login con roles Admin y Vendedor |
| Productos | Java | CRUD completo con control de stock mínimo |
| Inventario | Java | Registro de entradas, salidas y ajustes con trazabilidad |
| Ventas | Java | Registro con descuento automático de stock |
| Reportes | Java | Ventas por período, top productos |
| Predicciones | Python | Estimación de demanda semanal y mensual |
| Recomendaciones | Python | Cantidad sugerida a reabastecer por producto |

---

## Modelo de predicción de demanda

El microservicio Python implementa dos estrategias con selección automática:

**Regresión Lineal Simple**  
Se aplica cuando el producto tiene 4 o más semanas de historial y el coeficiente de determinación R² supera el 0.30. Esto significa que la tendencia lineal explica al menos el 30% de la varianza de los datos, indicando que el modelo es confiable para proyectar hacia el futuro.

**Media Móvil Ponderada (WMA)**  
Se aplica cuando hay pocos datos o cuando la tendencia no es clara (R² bajo). Promedia las últimas semanas dándole más peso a las más recientes. Es más conservador pero más robusto con historial irregular.

La selección es automática. El sistema evalúa la calidad del ajuste y elige el modelo más apropiado para cada producto en cada consulta.

**Fórmula de recomendación de reabastecimiento:**
```
recomendacion = demanda_mensual_proyectada 
              + (demanda_mensual × 20% de stock de seguridad) 
              - stock_actual 
              + stock_minimo
```

---

## Base de datos — Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios del sistema con roles |
| `categories` | Clasificación de productos |
| `products` | Catálogo con stock actual y mínimo |
| `sales` | Cabecera de ventas |
| `sale_details` | Detalle de productos por venta |
| `inventory_movements` | Historial completo de movimientos de stock |
| `demand_predictions` | Predicciones generadas por el microservicio Python |

---

## Estado del proyecto

- [x] Diseño de arquitectura
- [x] Modelo de base de datos
- [ ] Backend Java — en desarrollo
- [ ] Microservicio Python — en desarrollo
- [ ] Gateway Node.js — en desarrollo
- [ ] Frontend — en desarrollo
- [ ] Integración y pruebas

---

## Equipo

Desarrollado por **Sebastian Henao**  
Programa: Tecnico en Desarrollo de Software
Institución: CESDE  
Período: 2025-1
:D 