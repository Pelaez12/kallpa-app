# Revisión de UX y PWA

## Cambios

- Muay Thai para mujeres: afiche proporcionado, 8 clases S/ 160 y 12 clases
  S/ 250 (promo), martes y jueves de 7 a 8 p. m. Se añade al menú, catálogo,
  horarios y mapa del sitio. No se inventa sede ni vigencia de los paquetes.
- Los botones del catálogo usan el programa de la tarjeta pulsada. Antes podían
  enviar la selección de otro deporte o una consulta genérica.
- Un solo plan seleccionado por apartado, con selección accesible por teclado.
- Se conservan los mensajes editados al cambiar de programa.
- Pestañas con roles, relaciones accesibles, flechas, Inicio/Fin e historial.
- El afiche ampliado contiene el foco, se cierra con Escape y devuelve el foco.
- Se evitan IDs duplicados al mostrar un afiche en su sección y en el catálogo.
- Se omiten cinco imágenes de cero bytes del repositorio original. Sus programas,
  precios y horarios siguen disponibles como texto. No se sustituyen por afiches
  de otro deporte.
- El mapa del sitio ahora abre cada programa en vez de llevar todos a la portada.
- Se retira el límite de 520 px en escritorio y se adapta el contenido sin
  desbordamientos. Se conserva la identidad visual existente.
- Foco visible, movimiento reducido, regreso al menú y textos de consulta claros.
- PWA con instalación nativa cuando el navegador la ofrece, iconos, consulta
  offline y actualización explícita.
- Suscripción y baja voluntarias de notificaciones push, API protegida para
  campañas y almacén persistente fuera del contenido público.

## Validado localmente

- Pruebas HTTP del ciclo de suscripción, envío simulado, bajas y persistencia.
- Autorización administrativa, protección de secretos y rechazo de destinos
  ajenos a los proveedores push admitidos.
- Los 11 apartados en 320, 390, 768 y 1440 px sin desbordamientos horizontales.
- Mensajes correctos desde el catálogo y la sección de Muay Thai.
- Teclado, historial, borradores y cierre del afiche con restauración del foco.
- Recarga sin conexión y disponibilidad del afiche de Muay Thai.
- Manifest y criterios de instalación sin errores reportados por Chromium en
  un perfil persistente, fuera del modo incógnito.
- Interfaz de instalación y permisos mediante eventos simulados, sin enviar
  notificaciones reales.

## Requiere publicación y prueba en dispositivo

El servidor debe desplegarse con HTTPS, secretos y almacenamiento persistente
antes de activar avisos en la web pública. El diálogo de instalación lo decide
Chrome; no se puede forzar. La entrega real con la app cerrada requiere una prueba
con un dispositivo suscrito al servicio publicado.

Las promociones anteriores conservan sus precios y fechas originales. Se añade
una indicación para consultar la vigencia de la promoción agosto/octubre, sin
extenderla de forma automática. Conviene que el negocio confirme sus vigencias,
las condiciones de los paquetes nuevos y la sede de Muay Thai antes de publicar.
