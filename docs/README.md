# Abdelito Cocina Cubana

Sitio web estático, mobile-first, para recibir pedidos por WhatsApp.

## Funcionalidades

- Catálogo filtrable por categorías.
- Carrito persistente mediante localStorage.
- Cantidades editables.
- Combos calculados con los precios vigentes y venta adicional automática.
- Estados de disponibilidad: disponible, agotado o por encargo.
- Formulario de entrega/recojo, horario, pago preferido y observaciones.
- Generación automática del mensaje para WhatsApp.
- Código de pedido y acceso al chat para enviar el comprobante.
- Consentimiento de medición y adaptadores para GA4, Meta Pixel y TikTok Pixel.
- Panel operativo local en `admin.html` para registrar y gestionar pedidos.
- Diseño responsive y accesible.
- Sin cobro online ni base de datos centralizada.

## Editar el menú

Modifica el arreglo `products` dentro de `app.js`.

La configuración comercial está en `business-config.js`. Los identificadores de analítica, datos/QR de pago, horarios, testimonios y estados globales deben publicarse en ese archivo.

## Panel operativo

Abre `admin.html` y crea un PIN local. Los pedidos y métricas del panel se guardan en el navegador actual. La configuración se puede descargar desde el panel para después publicarla como `business-config.js`.

## Publicar con GitHub Pages

En GitHub abre **Settings → Pages**, selecciona **Deploy from a branch**, elige la rama `abdelito-cocina` y la carpeta `/docs`.
