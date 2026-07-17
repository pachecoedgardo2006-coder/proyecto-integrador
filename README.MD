<h1 align="center">ConnecThor ⚡</h1>

<p align="center">
  <strong>Plataforma de Mentorías y Tutorías Académicas</strong><br>
  Un sistema web modular, robusto y seguro diseñado para conectar estudiantes (learners) con tutores (mentors) de manera eficiente, facilitando el agendamiento de citas, el seguimiento de actividades y la evaluación de sesiones.
</p>

<p align="center">
  <a href="https://git-scm.com/">
    <img src="https://img.shields.io/badge/Monorepo-111111?style=for-the-badge">
  </a>
  <a href="https://www.conventionalcommits.org/">
    <img src="https://img.shields.io/badge/Conventional_Commits-1.0.0-FE5196?style=for-the-badge&logo=conventionalcommits&logoColor=white">
  </a>
</p>

---

<p align="center">
ConnecThor es una plataforma interactiva orientada a la gestión académica. Permite a los estudiantes explorar un catálogo de mentores disponibles según sus especialidades, agendar mentorías especificando fecha, hora y motivo, y realizar un seguimiento de sus tutorías pasadas o pendientes. Asimismo, cuenta con un backend seguro protegido por políticas de autenticación centralizadas.
</p>

---

# Tabla de Contenidos

- [Badges](#badges)
- [Características Clave](#características-clave)
- [Arquitectura y Tecnologías](#arquitectura-y-tecnologías)
- [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
- [Flujos Clave del Sistema](#flujos-clave-del-sistema)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Roadmap](#roadmap)
- [Equipo](#equipo)
- [Documentación](#documentación)
- [Contribuciones](#contribuciones)

---

<div align="center">

# Badges

### Build & Tooling

<p>
<a href="https://vite.dev/">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</a>

<a href="https://git-scm.com/">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
</a>

<a href="https://www.notion.so/">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
</a>

</p>

### Frontend

<p>

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
<img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</a>

<a href="https://vite.dev/">
<img src="https://img.shields.io/badge/Vite-SPA-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</a>

<a href="https://tailwindcss.com/">
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
</a>

</p>

### Backend

<p>

<a href="https://expressjs.com/">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
</a>

<a href="https://www.postgresql.org/">
<img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white">
</a>

<a href="#">
<img src="https://img.shields.io/badge/API-REST-25A162?style=for-the-badge">
</a>

</p>

### Deployment

<p>

<a href="https://vercel.com/">
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</a>

<a href="https://github.com/">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
</a>

</p>

</div>

---

# Características Clave

- **Autenticación Segura (RBAC):** Control de acceso basado en roles con JWT sin estado (stateless) para perfiles como *learner*, *mentor*, *admin* y *superadmin*.
- **Calendario de Disponibilidad:** Visualización de horarios activos configurados por los mentores.
- **Agendamiento Inteligente:** Reserva de tutorías especificando fechas, horas exactas y motivos de la sesión.
- **Seguimiento de Actividades:** Monitoreo del estado de los encuentros y progreso académico de los estudiantes.
- **Interceptor Global en Cliente:** Axios configurado para inyectar automáticamente los tokens de sesión en cada petición.
- **Seguridad Backend:** Encriptación de contraseñas mediante hashing y salting con Bcrypt.
- **Arquitectura SPA:** Frontend ligero, reactivo y desacoplado de frameworks pesados.

---

# Arquitectura y Tecnologías

| Capa | Tecnología / Dependencia | Propósito |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla ES6+) | Interfaz SPA responsiva, moderna y limpia. |
| **Styling** | Tailwind CSS v4 | Estilizado moderno sin hojas de estilo pesadas. |
| **HTTP Client** | Axios | Cliente HTTP con interceptores globales para Bearer Token. |
| **Backend** | Node.js & Express.js | API REST modular basada en ECMAScript modules (import/export). |
| **Base de Datos** | PostgreSQL | Integridad referencial y alto rendimiento relacional. |
| **Seguridad** | `jsonwebtoken` (^9.0.3) / `bcrypt` (^6.0.0) | Gestión de sesiones y hashing seguro de credenciales. |
| **Utilidades Core** | `uuid` (^14.0.1) / `dotenv` (^17.4.2) / `cors` (^2.8.5) | Identificadores únicos, variables de entorno y habilitación de CORS. |

---

# Estructura de la Base de Datos

El diseño relacional mitiga la redundancia mediante tablas normalizadas y UUIDs autogenerados para garantizar escalabilidad física y lógica:

```text
                  ┌──────────────┐
                  │     role     │
                  └──────┬───────┘
                         │ 1:N
                  ┌──────▼───────┐
                  │     user     │
                  └─┬────┬─────┬─┘
         1:1 (CC)   │    │     │ 1:1 (CC)
      ┌─────────────┘    │     └─────────────┐
┌─────▼──────┐           │             ┌─────▼──────┐
│   mentor   │           │ 1:N         │  learner   │
└─────┬──────┘           │             └─────┬──────┘
      │ 1:N              │                   │ 1:N
┌─────▼──────┐     ┌─────▼──────┐      ┌─────▼──────┐
│availability│     │notification│      │ mentorship │◄── [Citas/Tutorías]
└────────────┘     └────────────┘      └─────┬──────┘
                                             │ 1:N
                                       ┌─────▼──────┐
                                       │  activity  │
                                       └────────────┘
```


### Tablas Principales

-   ****role / user:**** Control de acceso basado en roles (RBAC). Soporta roles como __learner__, __mentor__, __admin__ y __superadmin__.
-   ****mentor / learner:**** Perfiles especializados enlazados mediante integridad referencial a la tabla base de usuarios.
-   ****mentorship:**** Registro central de tutorías, el cual almacena la relación física entre el mentor, el estudiante, la fecha, horas exactas y el estado del encuentro.

# Flujos Clave del Sistema

### 1\. Registro e Inicio de Sesión (Auth)

-   El usuario se registra enviando sus datos. El backend mapea su rol (por ejemplo, aprendiz se traduce internamente a __learner__).
-   Si el rol es __learner__, el sistema genera automáticamente un perfil de estudiante en la tabla `learner` para mantener la integridad académica.
-   Al iniciar sesión, las credenciales son validadas y el backend genera un token firmado con JWT que contiene el `idNumber` y su respectivo `role`.

### 2\. Flujo de Autenticación en Rutas (Middleware)

-   Cualquier petición hacia módulos privados (como `/api/citas`) es interceptada por el middleware `protect`.
-   Este middleware extrae el token del header `Authorization: Bearer <token>`, valida su vigencia y firma, e inyecta la información del usuario logueado en el objeto de petición (`req.user`) antes de que llegue a los controladores.


### 3\. Agendamiento de Mentorías

Plaintext

\[Frontend\] ──( POST /api/citas/book )──► \[Middleware protect\] ──► \[citas.controller.js\]  
  Envia:                                   Valida el token e          1. Busca el UUID del learner.  
  - mentorId, date,                        inyecta "req.user"         2. Inserta en la tabla "mentorship".  
  - startTime, endTime, reason                                        3. Retorna la cita agendada.


### ESTRUCTURA DEL PROYECTO
```text
  ConnecThor/
  │
  ├── apps/
  │   ├── frontend/
  │   │   ├── public/
  │   │   ├── src/
  │   │   │   ├── assets/
  │   │   │   ├── components/
  │   │   │   ├── layouts/
  │   │   │   ├── pages/
  │   │   │   ├── router/
  │   │   │   ├── services/
  │   │   │   ├── store/
  │   │   │   ├── styles/
  │   │   │   └── main.js
  │   │   ├── index.html
  │   │   └── package.json
  │   │
  │   └── backend/
  │       ├── src/
  │       │   ├── config/
  │       │   ├── controllers/
  │       │   ├── middlewares/
  │       │   ├── models/
  │       │   ├── routes/
  │       │   ├── services/
  │       │   ├── utils/
  │       │   └── app.js
  │       │
  │       ├── package.json
  │       └── server.js
  │
  ├── docs/
  │   ├── frontend/
  │   ├── backend/
  │   ├── database/
  │   ├── scrum/
  │   └── api/
  │
  ├── README.md
  └── .gitignore
```

# Instalación y Configuración

### Prerrequisitos

-   Node.js (versión 16 o superior)
-   PostgreSQL de manera local o remota

### Clonar el repositorio

Bash

git clone \[https://github.com/your-organization/connector.git\](https://github.com/your-organization/connector.git)  
cd ConnecThor  

### Configuración del Servidor (Backend)

1.  Navega al directorio del backend e instala las dependencias:  
    Bash
    
    cd apps/backend  
    npm install  
    
2.  Crea un archivo `.env` en la raíz de la carpeta `apps/backend` (ver la sección[Variables de Entorno](https://www.google.com/search?q=%23variables-de-entorno)).
3.  Ejecuta tu base de datos importando el esquema de SQL diseñado para crear las tablas, relaciones y triggers automáticos.
4.  Inicia el servidor de desarrollo:  
    Bash
    
    npm run dev # Iniciará nodemon index.js / server.js  
    

### Configuración del Cliente (Frontend)

1.  Abre una nueva terminal, navega a la carpeta del frontend e instala sus respectivas dependencias:  
    Bash
    
    cd apps/frontend  
    npm install  
    
2.  Inicia el servidor de desarrollo del frontend (Vite):  
    Bash
    
    npm run dev  
    

# Variables de Entorno

### Backend (`apps/backend/.env`)

Fragmento de código

PORT=3000  
DB\_HOST=localhost  
DB\_PORT=5432  
DB\_NAME=connector\_db  
DB\_USER=tu\_usuario  
DB\_PASSWORD=tu\_contraseña  
JWT\_SECRET=tu\_clave\_secreta\_super\_segura