# Brigada Ambiental FEC · Plataforma RSU 2026-A

Plataforma web del proyecto de Responsabilidad Social Universitaria **"Brigada Ambiental Universitaria – Facultad de Economía"** (UNSA, semestre 2026-A): prevención frente a la radiación solar en Arequipa (D.S. N.° 003-2026-SA), gestión de la brigada estudiantil y Foro Ambiental y de Salud con control de aforo.

## Stack

- **Frontend:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion (framer-motion)
- **Backend:** Supabase (Postgres + RLS, Auth, Realtime) — proyecto `dypkkwbxrgwokeppkdce`
- **Datos UV:** Open-Meteo (Arequipa, sin API key), con persistencia horaria en `uv_readings`

## Módulos (Etapa 1)

| Ruta | Descripción |
|---|---|
| `/` | Landing: hero con mesh gradient, **Monitor UV en vivo**, justificación económica (externalidades), marco normativo, metas y cronograma |
| `/foro` | Inscripción al Foro 2026 con **aforo de 130 sellado en la BD** (trigger + advisory lock) y barra de progreso **en tiempo real** (Supabase Realtime) |
| `/login` · `/registro` | Auth de brigadistas con código de invitación por sección (A/B) y aprobación del coordinador |
| `/brigada` | Portal protegido (proxy + RLS): perfil, estado, y shells de turnos/asistencia/evidencias (etapa 2) |
| `/api/uv` | Índice UV actual con caché de 15 min y fallback a la última lectura persistida |

## Desarrollo

```bash
npm install
npm run dev   # http://localhost:3000
```

### Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=…       # ya configurada
NEXT_PUBLIC_SUPABASE_ANON_KEY=…  # clave publishable (ya configurada)
SUPABASE_SECRET_KEY=…            # ⚠️ pégala desde Dashboard → Settings → API keys
```

`SUPABASE_SECRET_KEY` es **server-only** y habilita: persistencia de lecturas UV y validación de códigos de invitación en el registro. Sin ella, el sitio público y el foro funcionan igual; solo el registro de brigadistas queda deshabilitado.

## Seguridad (resumen)

- RLS activo en **todas** las tablas; `anon` solo puede **insertar** en `forum_registrations` (nunca leerla) y leer contadores sin PII, eventos y lecturas UV.
- Aforo de 130 garantizado a nivel de base de datos: `pg_advisory_xact_lock` + verificación en trigger (`AFORO_COMPLETO`). Verificado con prueba de carga de 131 inserts.
- Roles (`coordinator`/`brigadista`) y estados viven en `profiles`, nunca en `user_metadata`; columnas protegidas por trigger.
- Helpers `SECURITY DEFINER` en el esquema **`private`** (no expuesto por la Data API).
- Advisors de seguridad de Supabase: **0 hallazgos**.

## Estructura

```
src/
  app/(marketing)/        # landing + foro (público)
  app/(auth)/             # login + registro
  app/brigada/            # portal protegido
  app/api/uv/             # proxy Open-Meteo
  components/ui|site/     # design system (guinda #8B004A, estilo Stripe adaptado)
  features/foro|brigada/  # server actions, schemas zod, componentes de dominio
  lib/supabase/           # clientes @supabase/ssr (browser/server/proxy)
supabase/migrations/      # espejo del SQL aplicado vía MCP
docs/                     # hipotesis.md, desing.md (referencia de diseño)
```

## Etapas siguientes

- **Etapa 2:** turnos, asistencia y bitácora de evidencias (Storage) — el esquema y las RLS ya existen.
- **Etapa 3:** dashboard de indicadores del coordinador + exportación `.xlsx` (exceljs, con sanitización anti fórmula-injection) + datos abiertos.

---
Proyecto RSU · Facultad de Economía UNSA · Docente coordinador: José Zuzunaga Melgar
