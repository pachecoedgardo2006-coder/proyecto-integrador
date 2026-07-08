
# 🎓 TutorMatch - Plataforma SPA de Tutorías Universitarias  
  
TutorMatch es un prototipo funcional de panel administrativo y operativo de alta eficiencia, diseñado para la gestión y agendamiento de tutorías académicas entre estudiantes y docentes de programación.   
  
Aprovechando una arquitectura de ****\*\*Monorepo\*\***** desacoplada, el sistema elimina la sobrecarga de frameworks reactivos pesados en el frontend, utilizando manipulación atómica del DOM nativo y un sistema de control de sesiones simuladas por roles para agilizar la validación del flujo operativo.  
  
---  
  
## 🛠️ Stack Tecnológico  
  
- ****\*\*Frontend:\*\***** Vite + JavaScript Vanilla (Manipulación modular estructurada del DOM mediante funciones nativas con ciclo de vida limpio).  
- ****\*\*Estilos:\*\***** Tailwind CSS v4 con una estética unificada de alto contraste (Fondo oscuro extremo en \`bg-slate-950\`, bordes duros en \`slate-800\` / \`border-slate-800\`, acentuación cromática en Rojo Fuego y Mostaza, tipografías pesadas y texto estrictamente estructurado).  
- ****\*\*HTTP Client:\*\***** Axios (Configurado mediante una instancia centralizada orientada al prefijo `/api\` con proxy dinámico en desarrollo).  
- ****\*\*Backend:\*\***** Node.js + Express Framework.  
- ****\*\*Base de Datos:\*\***** SQLite 3 (Persistencia local integrada en un archivo \`.db\` controlado mediante consultas nativas por promesas \`async/await\`, garantizando cero costos de infraestructura).  
  
---  
  
# 📂 Arquitectura del Sistema  
  
```text  
tutorias-monorepo/  
├── backend/  
│   ├── data/  
│   │   └── tutorias.db                  # Base de datos SQLite nativa (Auto-creada)  
│   ├── src/  
│   │   ├── config/  
│   │   │   └── db.js                    # Inicialización del esquema SQL y helpers de promesas  
│   │   ├── controllers/                 # Lógica de negocio y consultas CRUD atómicas  
│   │   │   ├── citas.controller.js      # Gestión operativa de agendamientos  
│   │   │   └── tutores.controller.js    # Filtrado y extracción de perfiles/reseñas  
│   │   ├── routes/                      # Definición de endpoints de la API REST  
│   │   │   ├── citas.routes.js       
│   │   │   └── tutores.routes.js        
│   │   └── app.js                       # Configuración de Express, middlewares y montaje estático  
│   ├── index.js                         # Punto de entrada principal y arranque del servidor HTTP  
│   ├── nodemon.json                     # Reglas de aislamiento para evitar reinicios en bucle  
│   └── package.json                     # Dependencias del backend y scripts de inicio  
│   
├── frontend/  
│   ├── src/  
│   │   ├── services/  
│   │   │   └── api.js                   # Instancia de Axios configurada con prefijo relativo /api  
│   │   ├── views/                       # Secciones estructuradas bajo un esquema modular limpio  
│   │   │   ├── citas/  
│   │   │   │   └── index.js             # Panel adaptativo de agendamiento e historial por rol  
│   │   │   └── tutores/  
│   │   │       ├── detalle.js           # Orquestador del perfil detallado y reseñas del tutor  
│   │   │       └── index.js             # Catálogo de tutores con filtros reactivos por lenguaje  
│   │   ├── main.js                      # Orquestador global de la SPA y router basado en Hash (#)  
│   │   └── style.css                    # Estilos globales y configuraciones bases  
│   ├── index.html                       # Contenedor único (Main Wrapper) para el montaje de la interfaz  
│   ├── package.json                     # Dependencias del frontend (Vite, Axios)  
│   └── vite.config.js                   # Configuración de empaquetado y proxy de desarrollo  
│  
├── package.json                         # Configuración de scripts globales y Concurrently  
└── README.md                            # Documentación técnica e ingeniería del sistema  

```

## 📝 Reglas de Ingeniería y Ciclo de Vida (Para el Equipo)

Antes de modificar el código, el equipo de desarrollo debe comprender las directrices obligatorias del proyecto para no corromper la arquitectura:

1.  ****Sin Frameworks Reactivos:**** El frontend se rige por la manipulación directa de nodos del DOM (`document.createElement`).
2.  ****Limpieza Estricta de Memoria:**** Antes de montar una nueva vista en el orquestador (`main.js`), el contenedor principal (`#app`) se limpia obligatoriamente con `appElement.innerHTML = ''`. Esto destruye los nodos anteriores y previene fugas de memoria o duplicación de escuchadores de eventos (`EventListeners`).
3.  ****Enrutamiento por Hash:**** No se realizan peticiones de recarga al servidor para cambiar de página. La SPA escucha el evento `hashchange` del navegador (`#/`, `#/tutor`, `#/citas`) y renderiza el componente modular correspondiente en tiempo real.
4.  ****Persistencia Real:**** Se prohíbe el uso de almacenamiento volátil del navegador para el flujo transaccional; el agendamiento de citas interactúa de forma directa con la base de datos SQLite. El `localStorage` se reserva única y exclusivamente para mantener el estado de la sesión simulada.

## 🔄 Flujo Operativo del Proyecto

### \[A\] Flujo del Estudiante (Rol: ESTUDIANTE)

1.  El usuario ingresa a la plataforma y visualiza el catálogo de tutores disponibles.
2.  Puede filtrar la lista interactivamente mediante un selector de lenguajes (`JavaScript`, `Python`, `SQL`).
3.  Al hacer clic en "Ver Perfil Completo", la SPA cambia su hash a `#/tutor?id=X`, cargando los datos específicos del docente, su especialidad y el bloque de comentarios/calificaciones dejados por otros alumnos.
4.  Al pulsar "Agendar Cita", se le redirige al formulario de reserva (`#/citas?tutor=X`) con el docente preseleccionado.
5.  Llena sus datos y la cita se guarda en SQLite, actualizando inmediatamente la tabla de "Historial de Clases Solicitadas".

### \[B\] Flujo del Docente (Rol: TUTOR)

1.  El usuario cambia su cuenta en la barra de navegación al rol de ****TUTOR (DOCENTE)****.
2.  Al dirigirse al "Panel Citas", la SPA detecta el cambio de estado en el `localStorage`.
3.  El formulario de inscripción desaparece de forma automática del DOM para proteger el flujo.
4.  La interfaz muta y renderiza una tabla de control exclusiva: ****"Clases que debes Dictar"****, mostrando de forma directa los nombres de los estudiantes aspirantes y los bloques horarios reservados.

## 🚀 Manual de Instalación y Despliegue Local

### 📋 Requisitos Previos

-   ****Node.js**** (Versión v18 o superior recomendada).
-   ****Navegador Web**** moderno (Chrome / Brave / Edge).

### ⚙️ Paso 1: Instalación de Dependencias Integradas

Abre una terminal en la ****raíz del proyecto**** (`tutorias-monorepo/`) y ejecuta el script automatizado para descargar los módulos de todo el ecosistema de golpe:

Bash

npm run install:all  

### 💻 Paso 2: Ejecución en Entorno de Desarrollo

Para levantar el Backend (puerto 3000) y el Frontend (puerto 5173) de forma simultánea y en paralelo, ejecuta en la raíz:

Bash

npm run dev  

> 💡 __Nota:__ Al iniciar por primera vez, el backend creará automáticamente la carpeta `backend/data/`, el archivo `tutorias.db` e inyectará los primeros registros de prueba para que la plataforma no inicie vacía.

### 📦 Paso 3: Compilación para Producción (Entrega Final)

Cuando el equipo termine el pulido y se requiera unificar el proyecto en un solo servidor ejecutable:

1.  Compila el frontend para optimizar los archivos en producción:  
    Bash
    
    npm run build:frontend  
    
2.  Esto generará la carpeta `frontend/dist/`. Ahora, el servidor Express se encargará de servir de manera estática y unificada toda la SPA a través del puerto configurado (`http://localhost:3000`) sin necesidad de encender Vite.

## 🛠️ Tareas de Pulido sugeridas para el Equipo (Días 1 a 4)

Para destacar en la entrega del proyecto, el equipo de desarrollo puede enfocarse en implementar sobre esta base:

-   ****Persistencia de Reseñas:**** Crear el formulario en `views/tutores/detalle.js` y el endpoint `POST` en el backend para permitir a los estudiantes añadir nuevas calificaciones (1-5 estrellas) y comentarios a los tutores.
-   ****Gestión de Estados de la Cita:**** Programar la lógica del botón "Aceptar clase" en la vista del Tutor, conectándolo a un endpoint (`PATCH` o `PUT`) para cambiar el estado en la BD de `PENDIENTE` a `ACEPTADA` o `FINALIZADA`.

  
\---  
  