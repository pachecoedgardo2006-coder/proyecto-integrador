# Frontend - Authentication Module

Este documento describe la implementación realizada en el **Frontend** para el módulo de autenticación de **ConnecThor**. Incluye la instalación del proyecto, la ejecución del frontend y una explicación de los archivos creados y modificados.

---

# Requisitos

Antes de ejecutar el proyecto asegúrate de tener instalado:

* Node.js (versión 18 o superior)
* npm

Puedes verificar las versiones con:

```bash
node -v
npm -v
```

---

# Instalación

1. Clonar el repositorio.

```bash
git clone <repository-url>
```

2. Entrar a la carpeta del frontend.

```bash
cd frontend
```

3. Instalar las dependencias.

```bash
npm install
```

---

# Ejecutar el proyecto

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Por defecto, Vite ejecutará la aplicación en:

```
http://localhost:5173
```

---

# Funcionalidades implementadas

Se desarrolló el flujo completo de autenticación del frontend, incluyendo:

* Login de usuarios.
* Registro de usuarios.
* Validación de formularios.
* Manejo de errores.
* Persistencia de sesión mediante Local Storage.
* Protección de rutas.
* Interceptor JWT para solicitudes autenticadas.
* Actualización del diseño del módulo de autenticación.

---

# Archivos creados

## frontend/src/utils/validators.js

Contiene funciones reutilizables para validar la información ingresada por el usuario.

### Funciones

* **validateEmail()**

  * Verifica que el correo tenga un formato válido.

* **validatePassword()**

  * Requiere mínimo 8 caracteres.
  * Requiere al menos un carácter especial.

* **validateName()**

  * Verifica la longitud mínima del nombre.

---

## frontend/src/utils/formHelpers.js

Centraliza la lógica reutilizable de los formularios.

### Funciones

* **showError()**

  * Muestra mensajes de error debajo del campo correspondiente.

* **clearError()**

  * Elimina mensajes de error existentes.

* **toggleButtonLoading()**

  * Deshabilita el botón durante una petición.
  * Cambia el texto del botón mientras la operación está en proceso.

* **formField()**

  * Genera dinámicamente los campos reutilizables de los formularios.

---

## frontend/src/services/authService.js

Servicio encargado de la comunicación entre el frontend y la API de autenticación.

### Funciones

* **login()**

  * Envía las credenciales al backend.
  * Guarda el token JWT y la información del usuario en Local Storage.

* **register()**

  * Envía la información del nuevo usuario para crear la cuenta.

* **logout()**

  * Elimina la sesión del usuario.

* **getCurrentUser()**

  * Obtiene la información almacenada del usuario autenticado.

---

## frontend/src/views/auth/login.js

Vista correspondiente al inicio de sesión.

Implementaciones:

* Renderizado dinámico.
* Validaciones en tiempo real.
* Validación antes del envío.
* Manejo de errores.
* Estado de carga del botón.
* Integración con el servicio de autenticación.

---

## frontend/src/views/auth/register.js

Vista correspondiente al registro de usuarios.

Implementaciones:

* Validación de nombre.
* Validación de correo electrónico.
* Validación de contraseña.
* Confirmación de contraseña.
* Manejo de errores.
* Estado de carga del botón.
* Integración con el servicio de autenticación.

---

# Archivos modificados

## frontend/src/services/api.js

Se agregó un interceptor para incluir automáticamente el token JWT en las solicitudes autenticadas.

```text
Authorization: Bearer <token>
```

El token se obtiene desde Local Storage.

---

## frontend/src/main.js

Se actualizaron las rutas de autenticación.

### Cambios realizados

* Registro de la ruta `/login`.
* Registro de la ruta `/register`.
* Implementación de un Route Guard para restringir el acceso a rutas protegidas.
* Ocultamiento automático del Navbar y Footer en las pantallas de autenticación.

---

## frontend/index.html

Se realizaron mejoras visuales en la aplicación:

* Integración de la fuente **Inter**.
* Actualización del favicon.
* Cambio de identidad visual a **ConnecThor**.
* Actualización del nombre y colores del Navbar.

---

# Flujo de autenticación

## Registro

```
Usuario
    │
    ▼
Formulario
    │
    ▼
register()
    │
    ▼
Backend
    │
    ▼
Respuesta
```

## Inicio de sesión

```
Usuario
    │
    ▼
Formulario
    │
    ▼
login()
    │
    ▼
JWT
    │
    ▼
Local Storage
    │
    ▼
Usuario autenticado
```

## Protección de rutas

```
Usuario
    │
    ▼
main.js
    │
¿Existe un token?
    │
 ├── Sí → Permitir acceso
 └── No → Redirigir a /login
```

---

# Local Storage

Durante la autenticación se almacenan las siguientes claves:

| Clave      | Descripción                         |
| ---------- | ----------------------------------- |
| auth-token | Token JWT del usuario autenticado   |
| user       | Información del usuario autenticado |

---

# Resumen de la implementación

✔ Validaciones reutilizables.

✔ Componentes reutilizables para formularios.

✔ Servicio centralizado de autenticación.

✔ Login y registro de usuarios.

✔ Persistencia de sesión.

✔ Interceptor JWT.

✔ Protección de rutas.

✔ Mejoras en la experiencia de usuario mediante estados de carga y manejo de errores.

✔ Actualización de la identidad visual del frontend.
