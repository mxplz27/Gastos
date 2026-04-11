# 💰 Gastotrack App

Aplicación web para la gestión de gastos personales. Permite registrar, visualizar y controlar ingresos y egresos de manera sencilla.

---

## 📁 Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### 🔙 Backend (`gastotrack-backend`)

Encargado de la lógica del servidor, autenticación y conexión a la base de datos.

```
gastotrack-backend/
│── middleware/        # Funciones intermedias (ej: validación de JWT)
│── Models/            # Modelos de la base de datos
│── Routes/            # Rutas de la API
│── node_modules/      # Dependencias del backend
│── .env               # Variables de entorno
│── index.js           # Archivo principal del servidor
│── package.json       # Configuración del proyecto
│── package-lock.json  # Control de versiones de dependencias
```

📌 **Funciones principales del backend:**

* Autenticación con JWT
* Conexión a base de datos
* CRUD de datos (gastos, usuarios, etc.)

---

### 🎨 Frontend

Encargado de la interfaz de usuario.

```
/
│── public/
│   ├── img/           # Imágenes
│   ├── icons/         # Iconos
│   ├── robots.txt     # Configuración SEO
│
│── src/
│   ├── assets/        # Recursos estáticos
│   ├── features/      # Funcionalidades principales
     ├── api/
│   │   │   ├── Components.jsx
│   │   │   ├── ApiRyC.jsx
    ├── auth/
│     │   ├── inicio.jsx
│   │ │   ├── MisGastos.jsx
│         ├── Registro.jsx
│         ├── Seguimiento.jsx
│   ├── layout/
│   │   ├── Components/
│   │   │   ├── Components.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   ├── App.jsx    # Componente principal
│   │   ├── main.jsx   # Punto de entrada
│
│── .gitignore
│── eslint.config.js
│── index.html
│── package.json
│── package-lock.json
│── vite.config.js
│── README.md
```

📌 **Funciones principales del frontend:**

* Interfaz de usuario
* Manejo de rutas
* Consumo de la API

---

## 🚀 Tecnologías utilizadas

### Backend

* Node.js
* Express
* JWT (autenticación)
* Base de datos (MySQL o MongoDB según configuración)

### Frontend

* React
* Vite
* JavaScript
* CSS

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```
git clone https://github.com/tu-usuario/tu-repo.git
```

### 2. Backend

```
cd gastotrack-backend
npm install
npm run dev
```

### 3. Frontend

```
npm install
npm run dev
```

---

## 🔐 Variables de entorno

Crear un archivo `.env` en el backend con:

```
PORT=3000
DB_URI=tu_conexion
JWT_SECRET=tu_clave_secreta
```

---

## 📌 Funcionalidades

* Registro e inicio de sesión
* Autenticación con JWT
* Gestión de gastos
* Visualización de datos

---

## 👩‍💻 Autor

Desarrollado por Mariana Lopez

---

## ⭐ Recomendaciones

* No subir el archivo `.env`
* Usar `.gitignore` correctamente
* Mantener organizado el código por módulos

---

💡 *Proyecto académico enfocado en el uso de JWT y estructuras organizadas en frontend y backend.*
