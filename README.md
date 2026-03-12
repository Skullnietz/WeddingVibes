<div align="center">

# 💍 Boda Ultra-Premium

### Plataforma web de bodas full-stack — elegante, animada y lista para producción

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

*Una invitación digital premium para la boda de Miriam & Gonzalo — 11 de abril de 2026*

---

[✨ Demo en vivo](#) · [📖 Documentación](#arquitectura) · [🚀 Despliegue rápido](#instalación-y-desarrollo)

</div>

---

## 📋 Tabla de Contenidos

- [¿Qué es esto?](#-qué-es-esto)
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [API — Endpoints tRPC](#-api--endpoints-trpc)
- [Instalación y Desarrollo](#-instalación-y-desarrollo)
- [Variables de Entorno](#-variables-de-entorno)
- [Despliegue](#-despliegue)
- [Roadmap](#-roadmap)

---

## ✨ ¿Qué es esto?

**Boda Ultra-Premium** es una plataforma web completa para bodas construida con un stack moderno de producción. Va mucho más allá de una página estática: incluye autenticación real, base de datos, galería privada para invitados, sistema de confirmación de asistencia (RSVP), solicitud de canciones integrada con Spotify, lista de regalos interactiva y un panel de administración.

Diseñada con una paleta dorada/beige y animaciones fluidas con Framer Motion, ofrece una experiencia elegante en cualquier dispositivo.

---

## 🎯 Características

### 🌐 Sitio Público (One-Page)

| Sección | Descripción |
|---|---|
| **Hero / Portada** | Pantalla completa con foto, nombres, fecha y countdown en tiempo real |
| **Countdown Animado** | Temporizador en vivo con días, horas, minutos y segundos |
| **Identidad Visual** | Paleta de colores, monograma, hashtag oficial `#MiriamGonzaloBoda2026` |
| **Detalles del Evento** | Dirección, horarios de ceremonia (14:30) y recepción (13:30) |
| **Timeline Interactiva** | Agenda visual animada de toda la noche con iconos |
| **Código de Vestimenta** | Guía visual con ejemplos de outfits y colores |
| **Formulario RSVP** | Confirmación con acompañantes, restricciones alimentarias y transporte |
| **Lista de Regalos** | Mesa de regalos interactiva con sistema de reserva/liberación |
| **Galería Pre-Boda** | Grid masonry con animaciones al hover |
| **Historia de los Novios** | Timeline romántica con hitos y animaciones de scroll |
| **FAQ** | Acordeón animado con preguntas frecuentes |
| **Solicitud de Canciones** | Búsqueda en Spotify y votación de canciones en vivo |
| **Sección de Cierre** | Mensaje de los novios y subida de fotos |

### 🔐 Área Privada (Invitados Autenticados)

| Sección | Descripción |
|---|---|
| **Login con Google** | OAuth 2.0 con JWT firmado — sin contraseñas |
| **Galería Post-Boda** | Fotos privadas con filtros por momento (ceremonia, recepción, baile) |
| **Slideshow Completo** | Presentación a pantalla completa con controles y transiciones |
| **Mi RSVP** | Vista y edición de la confirmación propia |

### 🛠️ Panel de Administración

| Función | Descripción |
|---|---|
| **Dashboard de Asistencia** | Lista completa de RSVPs con conteo de invitados |
| **Gestión de Galería** | Subida y organización de fotos |
| **Solicitudes de Canciones** | Vista de canciones solicitadas por invitados |
| **Acceso por rol** | Solo usuarios con `role: "admin"` acceden al panel |

### 💫 Experiencia y UX

- **Animaciones con Framer Motion** — entrada en viewport, parallax, transiciones de página
- **Diseño 100% responsive** — móvil, tablet y escritorio
- **Scroll suave** entre secciones con menú sticky anclado
- **Toast notifications** con Sonner
- **Dark/Light mode** listo con next-themes

---

## 🛠 Stack Tecnológico

### Frontend
```
React 19          — UI reactiva con concurrent features
TypeScript 5.9    — Tipado estricto end-to-end
Tailwind CSS v4   — Utility-first styling (plugin Vite nativo)
Radix UI          — Componentes accesibles sin estilos (headless)
Framer Motion     — Animaciones declarativas de producción
Wouter            — Router minimalista (~2.1KB)
TanStack Query    — Caché y sincronización de datos del servidor
Recharts          — Gráficos para el dashboard admin
Lucide React      — Iconografía consistente
```

### Backend
```
Node.js ≥20.19   — Runtime
Express 4         — Servidor HTTP
tRPC v11          — API type-safe sin código generado
Zod               — Validación de esquemas en tiempo de ejecución
jose 6            — JWT (firmado/verificado en edge-compatible)
Multer 2          — Upload de archivos multipart
```

### Base de Datos & Almacenamiento
```
MySQL             — Base de datos relacional principal
Drizzle ORM       — ORM type-safe con migraciones
AWS S3            — Almacenamiento de imágenes (presigned URLs)
```

### Integraciones Externas
```
Google OAuth 2.0  — Autenticación de invitados
Spotify Web API   — Búsqueda y solicitud de canciones
Google Maps       — Ubicaciones de ceremonia y recepción
OpenAI API        — Chat IA (AIChatBox)
```

### Tooling & DevOps
```
Vite 7            — Build ultrarrápido con HMR
esbuild           — Bundle del servidor para producción
pnpm 10           — Gestión de paquetes
Prettier          — Formateo de código
Vitest            — Tests unitarios
Vercel            — Deploy (vercel.json incluido)
```

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Cliente (SPA)                      │
│  React 19  ·  Wouter  ·  TanStack Query  ·  tRPC   │
└────────────────────────┬────────────────────────────┘
                         │ HTTP / tRPC over fetch
┌────────────────────────▼────────────────────────────┐
│               Servidor Express (Node.js)             │
│                                                     │
│   /api/trpc/*   →  tRPC Router (type-safe)          │
│   /api/oauth/*  →  Google OAuth callback            │
│   /api/upload   →  Multer → AWS S3                  │
│   /*            →  Sirve el SPA compilado           │
└──────────┬──────────────────────────┬───────────────┘
           │                          │
    ┌──────▼──────┐           ┌───────▼──────┐
    │    MySQL    │           │    AWS S3    │
    │  Drizzle ORM│           │   (Fotos)    │
    └─────────────┘           └──────────────┘
```

### Flujo de Autenticación

```
Usuario → Google OAuth 2.0 → Callback /api/oauth/callback
       → Upsert en DB (users table)
       → JWT firmado con jose → Cookie HttpOnly
       → Sesión válida por 1 año
```

### Modelo de Autorización

| Rol | Acceso |
|---|---|
| Visitante anónimo | Sitio público, RSVP (sin guardar), galería pre-boda |
| `user` (autenticado) | Todo lo anterior + galería privada, RSVP persistente, slideshow |
| `admin` | Todo lo anterior + dashboard, todos los RSVPs, gestión de galería |

El primer usuario cuyo `openId` coincida con `OWNER_OPEN_ID` en `.env` recibe rol `admin` automáticamente.

---

## 📁 Estructura del Proyecto

```
boda-ultra-premium/
├── client/                   # Frontend SPA
│   └── src/
│       ├── _core/            # Hooks, contextos y utilidades core
│       │   ├── hooks/        # useAuth, useScrollTo, etc.
│       │   └── sdk.ts        # tRPC + TanStack Query provider
│       ├── components/
│       │   ├── ui/           # Componentes Radix/shadcn (60+ componentes)
│       │   ├── Navigation.tsx
│       │   ├── AIChatBox.tsx
│       │   ├── SpotifyPlayer.tsx
│       │   ├── SongRequestBox.tsx
│       │   ├── CustomAudioPlayer.tsx
│       │   └── Map.tsx
│       ├── pages/
│       │   ├── Home.tsx          # Página principal (one-page completa)
│       │   ├── Gallery.tsx       # Galería pública
│       │   ├── MyGallery.tsx     # Galería privada (autenticada)
│       │   ├── AdminGallery.tsx  # Gestión de fotos (admin)
│       │   ├── AdminAsistencia.tsx # Dashboard RSVPs (admin)
│       │   └── NotFound.tsx
│       ├── lib/
│       │   └── trpc.ts           # Cliente tRPC configurado
│       ├── const.ts              # Constantes de la app (WEDDING_DATA, etc.)
│       └── index.css             # Estilos globales + variables CSS
│
├── server/                   # Backend Express + tRPC
│   ├── _core/                # Infraestructura del servidor
│   │   ├── index.ts          # Entry point del servidor
│   │   ├── trpc.ts           # Contexto, middlewares, procedimientos base
│   │   ├── oauth.ts          # Flujo Google OAuth
│   │   ├── sdk.ts            # Wrappers de servicios externos
│   │   ├── upload.ts         # Multer + AWS S3
│   │   ├── spotify.ts        # Integración Spotify API
│   │   ├── llm.ts            # Integración OpenAI
│   │   ├── env.ts            # Validación de variables de entorno
│   │   └── cookies.ts        # Opciones de cookie por entorno
│   ├── routers.ts            # Router tRPC principal (todos los endpoints)
│   ├── db.ts                 # Capa de acceso a datos (MySQL + Drizzle)
│   └── storage.ts            # Helpers de almacenamiento S3
│
├── shared/                   # Código compartido cliente/servidor
│   ├── const.ts              # Constantes compartidas
│   └── types.ts              # Tipos TypeScript compartidos
│
├── drizzle/                  # Migraciones y schema DB
│   ├── schema.ts             # Definición de tablas
│   ├── relations.ts          # Relaciones entre tablas
│   └── migrations/           # Archivos de migración SQL
│
├── drizzle.config.ts         # Configuración Drizzle Kit
├── vite.config.ts            # Configuración Vite
├── build.cjs                 # Script de build del servidor (esbuild)
├── vercel.json               # Configuración de rutas para Vercel
├── tsconfig.json             # TypeScript config
└── package.json
```

---

## 🗃 Base de Datos

### Esquema Completo

```sql
-- Usuarios (autenticación OAuth)
users            id, openId, name, email, loginMethod, role, timestamps

-- Confirmaciones de asistencia
rsvps            id, userId, guestName, email, phone, isAttending,
                 numberOfCompanions, dietaryRestrictions,
                 needsTransport, transportFrom, specialRequests,
                 invitationId, timestamps

-- Acompañantes por RSVP
companions       id, rsvpId, name, dietaryRestrictions, timestamps

-- Fotos de la boda (galería privada)
weddingPhotos    id, url, caption, category, uploadedBy, timestamps

-- Fotos pre-boda (galería pública)
preWeddingPhotos id, url, caption, order, timestamps

-- Invitaciones personalizadas (por URL slug)
invitations      id, slug, guestName, maxCompanions, isUsed, timestamps

-- Solicitudes de canciones (Spotify)
songRequests     id, trackId, title, artist, coverUrl, requestedBy, timestamps

-- Lista de regalos
gifts            id, name, description, price, category,
                 imageUrl, externalUrl, claimedBy, claimedAt, timestamps
```

### Relaciones

```
users     ──< rsvps     ──< companions
rsvps     >── invitations
users     ──< gifts     (claimedBy)
```

---

## 🔌 API — Endpoints tRPC

Todos los endpoints están bajo `/api/trpc/[procedure]` y son completamente tipados end-to-end.

### Auth
| Procedimiento | Tipo | Auth | Descripción |
|---|---|---|---|
| `auth.me` | Query | Público | Usuario de sesión actual |
| `auth.logout` | Mutation | Público | Cierra sesión (limpia cookie) |

### RSVP
| Procedimiento | Tipo | Auth | Descripción |
|---|---|---|---|
| `rsvp.create` | Mutation | 🔒 User | Crear confirmación de asistencia |
| `rsvp.getByUser` | Query | 🔒 User | Obtener mi RSVP |
| `rsvp.getAll` | Query | 👑 Admin | Lista completa de RSVPs |
| `rsvp.update` | Mutation | 🔒 User | Actualizar mi RSVP |

### Fotos
| Procedimiento | Tipo | Auth | Descripción |
|---|---|---|---|
| `photos.getWeddingPhotos` | Query | Público | Fotos de boda (filtrables por categoría) |
| `photos.getPreWeddingPhotos` | Query | Público | Fotos pre-boda |

### Spotify
| Procedimiento | Tipo | Auth | Descripción |
|---|---|---|---|
| `spotify.search` | Mutation | Público | Buscar canciones en Spotify |
| `spotify.requestSong` | Mutation | Público | Solicitar canción para la fiesta |
| `spotify.getRequestedSongs` | Query | Público | Lista de canciones solicitadas |

### Regalos
| Procedimiento | Tipo | Auth | Descripción |
|---|---|---|---|
| `gifts.getGifts` | Query | Público | Lista de regalos disponibles/reclamados |
| `gifts.claim` | Mutation | 🔒 User | Reservar un regalo |
| `gifts.unclaim` | Mutation | 🔒 User | Liberar un regalo reservado |

---

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- **Node.js** ≥ 20.19.0
- **pnpm** ≥ 10.4.1
- **MySQL** 8.x (local o remoto)
- Credenciales de **Google OAuth 2.0**

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/boda-ultra-premium.git
cd boda-ultra-premium
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales (ver sección de variables)
```

### 3. Crear la base de datos

```bash
# Aplicar el schema completo a MySQL
pnpm db:push

# (Opcional) Poblar regalos de ejemplo
npx tsx server/seed_gifts.ts
```

### 4. Iniciar en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:5000](http://localhost:5000)

El servidor sirve tanto la API como el frontend con HMR.

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción (frontend + servidor) |
| `pnpm start` | Inicia el servidor en modo producción |
| `pnpm check` | Verificación de tipos TypeScript |
| `pnpm format` | Formatear código con Prettier |
| `pnpm test` | Ejecutar tests con Vitest |
| `pnpm db:push` | Sincronizar schema con la base de datos |

---

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
# ─── Base de Datos ───────────────────────────────────────
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_seguro
DB_NAME=boda_db
# O alternativamente con URL completa:
# DATABASE_URL=mysql://user:password@host:3306/database

# ─── Autenticación Google OAuth ──────────────────────────
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
JWT_SECRET=una_cadena_aleatoria_muy_larga_y_segura

# ─── Administrador ───────────────────────────────────────
# El openId de Google del usuario que será admin automáticamente
OWNER_OPEN_ID=google_open_id_del_admin

# ─── AWS S3 (para fotos) ─────────────────────────────────
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=boda-fotos

# ─── Spotify (solicitud de canciones) ────────────────────
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret

# ─── OpenAI (chat IA, opcional) ──────────────────────────
OPENAI_API_KEY=sk-...

# ─── App ─────────────────────────────────────────────────
VITE_APP_TITLE=Miriam & Gonzalo
NODE_ENV=development
PORT=5000
```

> **Nota:** Las variables con prefijo `VITE_` están disponibles en el cliente. El resto solo en el servidor.

### Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto → Habilita **Google+ API**
3. Crea credenciales OAuth 2.0 → Aplicación web
4. URI de redirección autorizada: `http://localhost:5000/api/oauth/callback`
5. Copia `Client ID` y `Client Secret` al `.env`

---

## 📦 Despliegue

### Vercel (recomendado)

El proyecto incluye `vercel.json` preconfigurado con las reglas de rewrite para SPA + API.

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configura las variables de entorno en el dashboard de Vercel en **Settings → Environment Variables**.

### Servidor tradicional (VPS / Hostinger)

```bash
# Build de producción
pnpm build

# El servidor queda en dist/index.cjs
# Inicia con:
NODE_ENV=production node dist/index.cjs

# O con PM2 para producción:
pm2 start dist/index.cjs --name boda-ultra-premium
```

### Docker (opcional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 5000
CMD ["node", "dist/index.cjs"]
```

---

## 🗺 Roadmap

### En progreso
- [ ] Lightbox animado para galería
- [ ] Google Maps embebido en sección de venue
- [ ] Código de vestimenta con ejemplos visuales
- [ ] Widget de clima en vivo

### Próximamente
- [ ] QR codes para RSVP, regalos y ubicación
- [ ] Guía para invitados foráneos (hotel, aeropuerto, tips)
- [ ] Lista de hoteles recomendados
- [ ] Menú detallado del banquete
- [ ] Información de padrinos con fotos y roles
- [ ] Pruebas en dispositivos móviles

### Completado ✅
- [x] Sistema RSVP completo con base de datos
- [x] Autenticación Google OAuth con JWT
- [x] Galería privada con filtros por categoría
- [x] Slideshow a pantalla completa
- [x] Integración Spotify para solicitar canciones
- [x] Lista de regalos con sistema de reserva
- [x] Panel de administración de RSVPs
- [x] Countdown animado en tiempo real
- [x] Animaciones Framer Motion en toda la app
- [x] Diseño responsive (móvil, tablet, desktop)
- [x] Upload de fotos a AWS S3
- [x] Timeline de la historia de los novios
- [x] FAQ con acordeón animado

---

## 📄 Licencia

MIT © 2025 — Desarrollado con amor para Miriam & Gonzalo 💍

---

<div align="center">

**Hecho con** React · tRPC · Drizzle · Framer Motion · ☕

*"La mejor boda merece la mejor invitación digital"*

</div>
