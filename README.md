### 🧠📦 StockMind
Sistema Inteligente de Gestión de Inventario y Predicción de Demanda

Proyecto Integrador — Desarrollo de Software
Institución: CESDE
Estado: En desarrollo

## 📌 Descripción del Proyecto

StockMind es una plataforma web orientada a pequeñas y medianas empresas que integra:

Gestión de inventario
Registro de ventas
Control de stock en tiempo real
Predicción de demanda mediante machine learning

## El sistema busca resolver dos problemas críticos:

📉 Sobrestock → capital inmovilizado en productos que no se venden
📈 Quiebre de stock → pérdida de ventas por falta de productos

La solución no solo registra datos, sino que analiza el historial de ventas para predecir la demanda futura y recomendar cantidades óptimas de reabastecimiento.

## 🚀 Evolución del Proyecto

### 🧩 Momento 1 — Diseño y Arquitectura
Definición de la arquitectura distribuida
Modelado de base de datos
Diseño de módulos del sistema
Separación por servicios (Java, Python, Node)

### ⚛️ Momento 2 — Implementación Frontend con React

En esta fase se introduce React como tecnología principal del frontend, logrando:

Estructuración por componentes reutilizables
Manejo de estado con useState y Context API
Navegación dinámica con rutas protegidas
Simulación de backend mediante localStorage
Separación clara entre lógica y presentación

Esto permite escalar el sistema y prepararlo para integración con el backend real.


### 🧱 Tecnologías del Sistema

El proyecto está dividido en capas, cada una con una responsabilidad clara:

### ⚛️ Frontend — HTML + CSS + JavaScript (React)

Interfaz de usuario del sistema.

Inicialmente no se utilizó un framework para enfocarse en la arquitectura, pero posteriormente se implementó React para:

- Mejorar la escalabilidad
- Organizar componentes
- Facilitar el mantenimiento

📌 El frontend consume exclusivamente el API Gateway.


### 🌐 API Gateway — Node.js + Express

Punto de entrada único del sistema.

## Responsabilidades:

- Autenticación centralizada con JWT
- Enrutamiento hacia servicios internos
- Manejo de CORS y rate limiting

### ☕ Backend Principal — Java + Spring Boot

Encargado de la lógica de negocio crítica.

Se eligió por:

- Manejo de transacciones ACID
- Seguridad y robustez
- Integración con JPA / Hibernate

Ejemplo crítico:
Registrar una venta implica múltiples operaciones que deben ejecutarse de forma atómica.

### 🗄️ Base de Datos — MySQL

Base de datos relacional.

Garantiza:

- Integridad referencial
- Consistencia de datos
- Persistencia confiable del historial

### 🧠 Microservicio de Analítica — Python + Flask

Encargado del análisis predictivo.

Tecnologías:

- pandas → procesamiento de datos
- scikit-learn → modelos de regresión
- numpy → cálculos matemáticos

📌 Es independiente del sistema principal.


### 🏗️ Arquitectura del Sistema
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
        +-----------+---------------+
                    |
                    v
               [ MySQL :3306 ]


## 🧩 Módulos del Sistema

| Módulo          | Tecnología | Descripción                           |
| --------------- | ---------- | ------------------------------------- |
| Autenticación   | Java + JWT | Login con roles                       |
| Productos       | Java       | CRUD con control de stock             |
| Inventario      | Java       | Movimientos de stock                  |
| Ventas          | Java       | Registro con actualización automática |
| Reportes        | Java       | Análisis de ventas                    |
| Predicciones    | Python     | Estimación de demanda                 |
| Recomendaciones | Python     | Sugerencias de reabastecimiento       |

## 📊 Modelo de Predicción

El sistema selecciona automáticamente el modelo más adecuado:

📈 Regresión Lineal
Se usa con suficiente historial (≥ 4 semanas)
Requiere R² > 0.30



## 📉 Media Móvil Ponderada (WMA)
Se usa con pocos datos
Mayor estabilidad ante variaciones

## 📌 Fórmula de Reabastecimiento

recomendacion = demanda_proyectada 
              + (demanda × 20% seguridad) 
              - stock_actual 
              + stock_minimo

## 🗃️ Base de Datos

| Tabla               | Descripción          |
| ------------------- | -------------------- |
| users               | Usuarios del sistema |
| categories          | Categorías           |
| products            | Productos            |
| sales               | Ventas               |
| sale_details        | Detalle de ventas    |
| inventory_movements | Movimientos          |
| demand_predictions  | Predicciones         |


📌 Estado del Proyecto
[X]Arquitectura definida
[X]Modelo de datos
[X]Frontend en React (Momento 2)
[En Progreso]Backend Java
[En Progreso]Microservicio Python
[En Progreso]API Gateway
[En Progreso]Integración total


## 👨‍💻 Autor

Sebastian Henao
Técnico en Desarrollo de Software
CESDE — 2025

## 💬 Nota Final

Este proyecto está diseñado no solo como solución funcional, sino como una arquitectura escalable basada en microservicios, preparada para evolucionar hacia un sistema completo de analítica empresarial.

