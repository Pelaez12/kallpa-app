# Especificación Técnica: Componentes de Flyers Promocionales e Integración en Kallpa & Búnker Cross App

**Fecha**: 2026-08-08  
**Proyecto**: `kallpa-app`  
**Estado**: Aprobado por el usuario  

---

## 1. Resumen Ejecutivo
Esta especificación define la arquitectura, diseño visual, parámetros de datos e integración de 5 flyers promocionales diseñados en HTML/CSS como componentes dinámicos y reutilizables dentro del aplicativo web móvil `kallpa-app`.

Se preservará la identidad visual de cada marca (Búnker Cross en tono concreto/naranja `#ff5a1f` y Kallpa Natación en azul marino/aqua `#25b7e0`) sin mezclar temas globales, usando tipografía de alto impacto ('Anton' para títulos, 'Inter' para texto) y manteniendo la adaptabilidad responsive sin depender de tamaños fijos de 540x540px.

---

## 2. Requisitos de Datos (Los 5 Flyers Promocionales)

### Flyer 1: Búnker Cross — Natación
- **Marca**: `Bünker Cross`
- **Color de Acento**: `#ff5a1f` (Naranja)
- **Categoría**: `NATACIÓN PERSONALIZADA`
- **Título**: `CLASES DE NATACIÓN`
- **Descripción**: `Entrenamiento individual 1 a 1 en Piscina Temperada El Fanning`
- **Opciones de Precio**:
  - `1 clase (1 hora)`: S/ 70 (normal)
  - `Paquete x4 clases`: S/ 240 (destacado, badge: "AHORRA S/ 40")
- **Horarios**:
  - Sábados 2:00 pm
  - Domingos 9:00 am
- **CTA**: `RESERVAR AHORA`

### Flyer 2: Búnker Cross — Musculación (GymBox)
- **Marca**: `Búnker Cross`
- **Color de Acento**: `#ff5a1f` (Naranja)
- **Categoría**: `MUSCULACIÓN (GYMBOX)`
- **Título**: `ENTRENAMIENTO PERSONALIZADO`
- **Descripción**: `Rutina de musculación y mejora física guiada por Coach`
- **Opciones de Precio**:
  - `8 sesiones`: S/ 200 (normal)
  - `12 sesiones`: S/ 250 (destacado, badge: "MEJOR PRECIO")
- **Horarios**:
  - Lunes a Viernes: 9:00 am – 4:00 pm
  - Sábados: 8:00 am, 9:00 am u 11:00 am
- **CTA**: `RESERVAR AHORA`

### Flyer 3: Búnker Cross — Paddle Surf
- **Marca**: `Búnker Cross`
- **Color de Acento**: `#ff5a1f` (Naranja)
- **Categoría**: `PADDLE SURF`
- **Título**: `PADDLE SURF EXPERIENCIA`
- **Descripción**: `Aventura en el mar con equipo completo e instructor`
- **Opciones de Precio**:
  - `1 sesión`: S/ 110 (normal)
  - `Paquete x4 clases`: S/ 360 (destacado, badge: "AHORRA S/ 80")
- **Incluye**:
  - Traslado ida y vuelta
  - Wetsuit térmico
  - Tabla + Chaleco salvavidas
  - Instructor guiado
- **CTA**: `RESERVAR AHORA`

### Flyer 4: Búnker Cross — OpenBox
- **Marca**: `Búnker Cross`
- **Color de Acento**: `#ff5a1f` (Naranja)
- **Categoría**: `OPENBOX`
- **Título**: `OPENBOX ENTRENAMIENTO LIBRE`
- **Descripción**: `Uso libre de instalaciones y equipamiento GymBox`
- **Opciones de Precio**:
  - `Mensualidad`: S/ 70 (normal)
  - `Paquete x2 meses`: S/ 120 (destacado, badge: "AHORRA S/ 20")
- **Horarios**:
  - Lunes a Viernes: 9:00 am – 4:00 pm
- **CTA**: `RESERVAR AHORA`

### Flyer 5: Kallpa Natación (Marca Independiente)
- **Marca**: `Kallpa Natación`
- **Color de Acento**: `#25b7e0` (Aqua/Cian)
- **Color de Fondo**: `#04192e` (Azul Marino Profundo)
- **Categoría**: `KALLPA NATACIÓN`
- **Título**: `CLASES DE NATACIÓN`
- **Descripción**: `Formación técnica y entrenamiento personalizado de natación`
- **Opciones de Precio**:
  - `1 clase (1 hora)`: S/ 70 (normal)
  - `Paquete x4 clases`: S/ 240 (destacado, badge: "AHORRA S/ 40")
- **Horarios**:
  - Sábados 2:00 pm
  - Domingos 9:00 am
- **CTA**: `RESERVAR AHORA`

---

## 3. Componente Reutilizable (`renderPromoFlyer`)

El componente se implementará en JavaScript Vanilla mediante la función creadora `renderPromoFlyer(flyerData)` y generará la estructura HTML con clasesCSS modulares:

```javascript
function renderPromoFlyer(data) {
  // data: { brand, accentColor, bgTheme, category, title, description, priceOptions, schedule, includes, ctaText, ctaSubtext }
  // Retorna string HTML o elemento DOM estilizado
}
```

### Reglas Visuales y CSS:
- Fuentes importadas de Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap');`
- Fondo con textura diagonal sutil mediante CSS `repeating-linear-gradient`.
- Tarjeta de precio destacada `.price-card-flyer.featured` con borde en el color de acento de la marca y badge estilizado.
- Botón/Barra CTA `.flyer-cta-bar` con fondo sólido en el color de acento (`#ff5a1f` o `#25b7e0`) y texto oscuro contrastante `#0e1117`.

---

## 4. Distribución en el Aplicativo SPA

1. **Sección `Natación Personalizada`** (`#panel-natacion-pers`): Integra el flyer interactivo de *Búnker Cross — Natación*.
2. **Sección `Gimnasio Personalizado`** (`#panel-gimnasio-pers`): Integra el flyer interactivo de *Búnker Cross — Musculación (GymBox)*.
3. **Sección `Clases Natación`** (`#panel-kallpa`): Integra el flyer interactivo de *Kallpa Natación*.
4. **Sección `Paddle Surf & OpenBox`** (`#panel-paddle-openbox`): Nueva pestaña dedicada que renderiza los flyers de *Paddle Surf* y *OpenBox*.
5. **Sección `Catálogo de Promociones`**: Vista completa en grilla responsive (2 columnas en desktop, 1 columna en mobile) con los 5 flyers.

---

## 5. Integración con WhatsApp
Al presionar una opción de precio dentro de un flyer, el plan se selecciona activamente y actualiza en tiempo real el campo de mensaje de WhatsApp con el formato exacto:
> *"¡Hola! Deseo información y reservar la promoción: [Bünker Cross - Musculación 12 sesiones x S/ 250]. Por favor brindar vacantes disponibles."*

---

## 6. Verificación y Despliegue
- Servidor local en `http://localhost:8080`.
- Commit en la rama `main` del repositorio Git (`https://github.com/Pelaez12/kallpa-app`).
