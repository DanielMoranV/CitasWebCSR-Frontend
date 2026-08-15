# CSR Consultas Web — Frontend

SPA en Vue 3 para la gestión de citas médicas de un centro de salud (CSR): agendamiento y pago de citas para pacientes, atención clínica para médicos, control de turnos/caja para admisión y administración de usuarios, médicos y horarios para el rol Administrador.

> Repositorio: `DanielMoranV/CitasWebCSR-Frontend` · Backend consumido vía REST (`VITE_API_URL`), no incluido en este repo.

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | Vue 3 (`<script setup>`, Composition API) |
| Build tool | Vite 4 |
| Enrutamiento | Vue Router 4 (hash history + guard de auth/roles) |
| Estado global | Pinia 2 (store por dominio) |
| UI Kit | PrimeVue 3.28 + PrimeFlex + PrimeIcons (temas intercambiables) |
| HTTP | Axios (instancia central con interceptores) |
| Tiempo real | Socket.IO client (estado de conexión de WhatsApp) |
| Pagos | Culqi Checkout v4 (tarjeta / Yape, modo test) |
| Utilidades | Day.js, qrcode / qrcode.vue, xlsx, file-saver |
| Calidad de código | ESLint + Prettier |
| Despliegue | gh-pages (`npm run deploy`) |

## Arquitectura

```
src/
├── api/            # Cliente HTTP: instancia Axios + interceptores (auth, errores) y endpoints REST
├── stores/          # Pinia: auth, dataUser, dataDoctor, dataAdmissionist, dataAppointment
├── router/          # Rutas + guard global (requiresAuth, roles)
├── layout/          # Shell de la app autenticada (topbar, sidebar, menú, config de tema)
├── views/
│   ├── public/       # Registro público (Signin)
│   ├── pages/        # Landing, login, error/unauthorized
│   ├── user/          # Paciente: perfil, dependientes, agendar cita, pago, seguimiento
│   ├── doctor/         # Médico: atenciones, ficha de paciente
│   ├── admission/       # Admisionista: turnos, pacientes, caja
│   ├── admin/            # Administrador: dashboard, usuarios, médicos, horarios
│   └── utilities/         # Vistas heredadas de la plantilla PrimeVue (referencia/demo)
├── composables/      # Lógica reutilizable (manejo de respuestas de API)
├── utils/            # cache.js (localStorage con codificación base64), day.js
└── config.js         # URL de backend (constante, en paralelo a VITE_API_URL)
```

**Patrones clave**

- **Capa API centralizada** (`src/api/axios.js`): una única instancia de Axios inyecta el token de sesión en cada request y normaliza los errores de respuesta antes de llegar a los stores.
- **Stores por dominio** (Pinia): cada store (`auth`, `dataUser`, `dataDoctor`, `dataAdmissionist`, `dataAppointment`) encapsula las llamadas a `src/api/index.js` relacionadas a su entidad.
- **Rutas protegidas por rol**: `router/index.js` define `meta.requiresAuth` y `meta.roles` por ruta; el guard global redirige a `/auth/login` o `/unauthorized` según corresponda.
- **Sesión persistida**: el store `auth` guarda el usuario autenticado en `localStorage` (vía `utils/cache.js`), codificado en base64 — no es cifrado, solo ofuscación.
- **Layout desacoplado**: `AppLayout.vue` envuelve todas las rutas privadas y resuelve menú/permisos según el rol activo.

## Roles y funcionalidades

| Rol | Rutas principales | Funcionalidad |
| --- | --- | --- |
| **Paciente** | `/quotes`, `/quote/payment`, `/quote/confirmation`, `/tracking`, `/listdoctor`, `/dependents`, `/profile` | Agendar cita por especialidad/médico, pagar con Culqi (tarjeta/Yape), ver confirmación, seguimiento de estado, gestión de dependientes |
| **Médico** | `/attentions`, `/patientcare` | Ver cola de atenciones, registrar atención clínica del paciente |
| **Admisionista** | `/shifts`, `/patients`, `/cashregister` | Gestión de turnos, registro/búsqueda de pacientes, apertura/cierre de caja y movimientos |
| **Administrador** | `/dashboard`, `/users`, `/doctors`, `/timetable` | Dashboard con estado de conexión de WhatsApp (Socket.IO + QR), CRUD de usuarios y médicos, gestión de horarios/agenda médica |
| **Invitado** | `/`, `/auth/login`, `/signin` | Landing pública, login, registro |

## Estado real del proyecto

Con base en el historial de commits y las vistas implementadas:

- ✅ Autenticación por rol (Administrador, Admisionista, Médico, Paciente) con guard de rutas.
- ✅ Flujo completo de agendamiento de citas: especialidad → médico/horario → pago → confirmación.
- ✅ Integración de pagos con Culqi (checkout v4) en **modo test/sandbox**; falta habilitar credenciales de producción.
- ✅ Gestión de turnos y caja para admisión (apertura, movimientos, cierre).
- ✅ Panel administrativo: usuarios, médicos, horarios de atención con validaciones de disponibilidad.
- ✅ Notificación/estado de conexión de WhatsApp vía Socket.IO + QR desde el dashboard.
- ✅ Validación de horarios de consulta y turnos habilitados (últimos commits).
- 🚧 **Deuda técnica pendiente**: la vista `src/views/user/quote/Payment original.vue` es un duplicado obsoleto de `Payment.vue` y debería eliminarse; el consumo de DNI (`stores/auth.js`) depende de un túnel `serveo.net` de terceros, poco confiable para producción; el módulo `utils/cache.js` usa base64 (no es cifrado) para el usuario/token en `localStorage`.
- 📋 Sin pruebas automatizadas (unitarias/E2E) configuradas.

## Análisis de credenciales sensibles (seguimiento en Git)

Se auditó el repositorio en busca de secretos versionados. Hallazgo relevante corregido en esta rama:

| Hallazgo | Severidad | Estado |
| --- | --- | --- |
| El archivo `.env` estaba **rastreado por Git** desde el commit `f5f8b50` (2023-10-09) pese a existir la regla `*.env` en `.gitignore` (la regla no aplica retroactivamente a archivos ya trackeados). Exponía la URL del backend, una `PUBLIC_KEY` de prueba (`TEST-807e4e58-…`) sin uso en el código, y un comando de túnel SSH (`serveo.net`) con los puertos internos del backend/frontend. | Media (credenciales de entorno *test*, pero expuestas en el historial público del repo) | ✅ Se dejó de rastrear (`git rm --cached .env`) y se añadió `.env.example` como plantilla sin secretos reales. |
| Llave pública de Culqi (`pk_test_73e0f77c30643c37`) hardcodeada en `Payment.vue` y en el archivo duplicado `Payment original.vue`. | Baja (las *publishable keys* de Culqi están diseñadas para ser públicas, igual que las de Stripe) | ✅ Movida a `VITE_CULQI_PUBLIC_KEY` en `Payment.vue`; pendiente limpiar el duplicado. |
| Token de sesión guardado en `localStorage` codificado solo en base64. | Informativo | No corregido en esta tarea (requiere decisión de arquitectura, p. ej. httpOnly cookies). |

**Recomendaciones pendientes (requieren decisión/acción del propietario del repo):**

1. **Rotar** cualquier credencial real de Culqi/backend que haya estado en uso, aunque el `.env` filtrado solo contenía valores de *test*.
2. **Purgar el historial de Git** (`git filter-repo` o BFG Repo-Cleaner) si se desea eliminar `.env` de los commits antiguos — es una operación destructiva que reescribe hashes y requiere coordinarla con cualquier colaborador/fork; no se ejecutó automáticamente.
3. Eliminar `src/views/user/quote/Payment original.vue` (código muerto, no referenciado por el router).
4. Revisar si el túnel `serveo.net` sigue en uso en producción; de ser así, migrar la consulta de DNI a un endpoint propio del backend.

## Configuración del entorno

```sh
cp .env.example .env
# Editar .env con la URL real del backend y la llave pública de Culqi
```

Variables requeridas (ver `.env.example`):

- `VITE_API_URL` — URL base de la API REST del backend.
- `VITE_CULQI_PUBLIC_KEY` — llave pública (*publishable key*) de Culqi para el checkout de pagos.

## Puesta en marcha

```sh
npm install       # Instalar dependencias
npm run dev        # Servidor de desarrollo (Vite, --host)
npm run build        # Build de producción en dist/
npm run preview        # Previsualizar el build de producción
npm run lint             # ESLint + Prettier (--fix)
npm run deploy              # Publicar dist/ en GitHub Pages (gh-pages)
```

## Referencia de API consumida

El cliente (`src/api/index.js`) consume los siguientes recursos del backend: `access` (login/sesión), `users`, `collaborators`, `infodoctors` / `doctors` (+ horarios), `users/dependents`, `patients`, `appointment` (+ historial), `cashregister`, `payment`, `imgqrwp` / `connection/wp` (integración WhatsApp).
