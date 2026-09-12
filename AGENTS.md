# AGENTS.md — ALMPES Contact Center

Guía de directrices, contexto del proyecto y estándares de desarrollo para agentes de Inteligencia Artificial que trabajen en este repositorio.

---

## 1. Visión General del Proyecto

- **Empresa:** ALMPES Contact Center (BPO & Contact Center en Miraflores, Lima, Perú con +11 años de experiencia).
- **Tipo de Proyecto:** Sitio web corporativo multi-página estático de alto rendimiento y diseño premium.
- **Tecnologías Core:** HTML5 semántico, CSS3 moderno (Vanilla CSS con variables/tokens), JavaScript (Vanilla ES6+).
- **Idiomas:** Español (Perú / es-PE) como idioma principal de contenidos y UI.

---

## 2. Estructura de Directorios

```
almpes/
├── assets/                  # Imágenes, logotipos y recursos multimedia
├── css/
│   └── styles.css           # Hoja de estilos principal con tokens y responsive design
├── js/
│   └── main.js              # Lógica interactiva (menú móvil, validaciones, observers)
├── .agents/                 # Configuración de agentes y skills del workspace
├── brand-spec.md            # Especificación oficial de la marca y design tokens
├── DESIGN-HANDOFF.md        # Contrato de diseño e implementación responsive
├── DESIGN-MANIFEST.json     # Manifiesto estructurado de vistas y componentes
├── llms.txt                 # Resumen optimizado para modelos de lenguaje
├── robots.txt               # Configuración de indexación para motores de búsqueda
├── sitemap.xml              # Mapa de URLs del sitio web
└── *.html                   # Vistas y páginas del sitio (index, nosotros, servicios, etc.)
```

---

## 3. Sistema de Diseño y Tokens de Marca

Consulte siempre [`brand-spec.md`](file:///d:/GitHub/almpes/brand-spec.md) antes de alterar estilos.

### Paleta de Colores (`css/styles.css`)
- `--bg`: `#FFFFFF` (Fondo principal blanco)
- `--bg-warm`: `#FAF8F6` (Fondo secundario cálido)
- `--surface`: `#F5F2EF` (Superficies de tarjetas y paneles)
- `--surface-hi`: `#EDEAE6` (Hover sobre superficies)
- `--fg`: `#2D2024` (Texto principal / tinta oscura)
- `--fg-sub`: `#4A3C40` (Texto secundario)
- `--muted`: `#6B5E62` (Texto atenuado)
- `--accent`: `#822F32` (Burdeos corporativo — CTAs, acentos principales)
- `--accent-dk`: `#6A2528` (Burdeos oscuro — estado hover de CTAs)
- `--rose`: `#9B6270` (Rosa burdeos — subtítulos, badges, tags)
- `--rose-lt`: `#C4A0A6` (Rosa claro — contrastes sutiles y footer)
- `--border`: `rgba(45, 32, 36, 0.08)` (Bordes sutiles)
- `--border-hi`: `rgba(45, 32, 36, 0.15)` (Bordes de énfasis)
- `--success`: `#3A7D5C` (Verde para estados de confirmación)

### Tipografía
- **Display / Títulos:** `'Plus Jakarta Sans', sans-serif` (600–700, tracking sutilmente negativo en títulos grandes)
- **Body / Párrafos:** `'Inter', sans-serif` (400–500)
- **Mono / Códigos & Badges:** `'IBM Plex Mono', monospace` (500)

### Reglas de Estilo Visual
1. **Fondo blanco dominante:** Mantener estética limpia, ejecutiva y moderna.
2. **Uso moderado del Burdeos (`#822F32`):** Solo en CTAs primarios y elementos de conversión clave (máximo 2 por viewport).
3. **Rosa (`#9B6270`) para acentos secundarios:** Eyebrows, pills, indicadores de categoría.
4. **Sin gradientes invasivos:** Mantener layouts limpios, bordes geométricos elegantes y sombras de baja opacidad.

---

## 4. Estándares de Código y Desarrollo

### HTML5
- Mantener estructura semántica estricta (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- Un único `<h1>` por página representativo del objetivo de la vista.
- Etiquetas `title` y `<meta name="description">` descriptivas en cada documento HTML.
- Atributos `alt` obligatorios y descriptivos en todas las imágenes.
- Enlaces accesibles y botones con nombres accesibles (`aria-label` donde sea necesario).

### CSS3
- No usar TailwindCSS ni frameworks CSS a menos que sea explícitamente solicitado por el usuario.
- Usar variables CSS centralizadas en `:root` dentro de [`css/styles.css`](file:///d:/GitHub/almpes/css/styles.css).
- Utilizar `clamp()` para tipografías y espaciados fluidos.
- Respetar los breakpoints del contrato responsive:
  - Mobile compact: 360px – 430px
  - Tablet: 768px – 1024px
  - Desktop: 1366px – 1920px
- Prohibido el desbordamiento horizontal (`overflow-x: hidden` o contenedor restringido).

### JavaScript
- Vanilla JS (ES6+) estructurado en [`js/main.js`](file:///d:/GitHub/almpes/js/main.js).
- Manejo limpio de eventos, delegación de eventos y `IntersectionObserver` para animaciones on-scroll.
- Validación accesible y segura en formularios de contacto y postulación laboral.
- Evitar dependencias externas pesadas innecesarias.

---

## 5. Páginas y Rutas del Sitio

| Archivo | Ruta | Propósito |
|---|---|---|
| [`index.html`](file:///d:/GitHub/almpes/index.html) | `/` | Página de inicio / Propuesta de valor ALMPES |
| [`nosotros.html`](file:///d:/GitHub/almpes/nosotros.html) | `/nosotros.html` | Historia, cultura, liderazgo y certificaciones |
| [`servicios.html`](file:///d:/GitHub/almpes/servicios.html) | `/servicios.html` | Catálogo consolidado de servicios BPO |
| [`inbound.html`](file:///d:/GitHub/almpes/inbound.html) | `/inbound.html` | Atención al cliente, soporte y help desk |
| [`outbound.html`](file:///d:/GitHub/almpes/outbound.html) | `/outbound.html` | Telemarketing, cobranzas y prospección |
| [`venta-digital.html`](file:///d:/GitHub/almpes/venta-digital.html) | `/venta-digital.html` | Leads, WhatsApp automation & RRSS |
| [`campo.html`](file:///d:/GitHub/almpes/campo.html) | `/campo.html` | Gestión en campo, verificaciones y BTL |
| [`consultoria.html`](file:///d:/GitHub/almpes/consultoria.html) | `/consultoria.html` | Asesoría y dimensionamiento de contact centers |
| [`hosting.html`](file:///d:/GitHub/almpes/hosting.html) | `/hosting.html` | Servidores e infraestructura dedicada para campañas |
| [`trabaja.html`](file:///d:/GitHub/almpes/trabaja.html) | `/trabaja.html` | Bolsa de trabajo y formulario de postulación |
| [`contacto.html`](file:///d:/GitHub/almpes/contacto.html) | `/contacto.html` | Formulario comercial y datos de contacto directo |
| [`politica-diversidad-inclusion.html`](file:///d:/GitHub/almpes/politica-diversidad-inclusion.html) | `/politica-diversidad-inclusion.html` | Política corporativa de diversidad e inclusión |
| [`politica-sistema-integrado-gestion.html`](file:///d:/GitHub/almpes/politica-sistema-integrado-gestion.html) | `/politica-sistema-integrado-gestion.html` | Política del Sistema Integrado de Gestión (SIG) |

---

## 6. Información Corporativa y de Contacto

- **Ubicación:** Calle Bolívar 472, Miraflores 15074, Lima, Perú.
- **Teléfono:** +51 957 250 995
- **Email Comercial:** `contactos@almpes.com`
- **Email RRHH / Reclutamiento:** `reclutamiento@almpes.com`
- **Horario:** Lunes a sábado de 9:00 a.m. a 6:00 p.m.
- **Redes Oficiales:** LinkedIn, Facebook, Instagram, TikTok.

---

## 7. Instrucciones para Agentes al Realizar Modificaciones

1. **Mantener coherencia entre páginas:** Al cambiar el `<header>`, `<nav>` o `<footer>`, replicar los cambios de manera consistente en las 13 páginas HTML del proyecto.
2. **Preservar la identidad de marca:** No cambiar fuentes ni paleta sin consultar o actualizar `brand-spec.md`.
3. **Validar URLs y recursos:** Asegurarse de que los enlaces relativos apunten a los archivos HTML correctos y los assets existan en `assets/`.
4. **Sincronizar metadatos y SEO:** Si se crean o renombran páginas, actualizar [`sitemap.xml`](file:///d:/GitHub/almpes/sitemap.xml), [`robots.txt`](file:///d:/GitHub/almpes/robots.txt) y [`llms.txt`](file:///d:/GitHub/almpes/llms.txt).
