# Usar GA4 Page Links

[Descargá el ZIP](https://github.com/martingaray/ga4-page-links/releases/latest/download/ga4-page-links.zip) y seguí la [instalación en Chrome](../README.md#instalación). Fijá la extensión si querés abrirla con un clic. Todos los ajustes viven en el panel lateral y podés cambiar entre ES y EN.

1. **Enlaces:** abrí un informe de GA4 con una dimensión de ruta. Verificá el ID que muestra el panel, ingresá el dominio sin ruta y elegí **Guardar y aplicar**. Si omitís el protocolo, se usa HTTPS. El **↗** de cada fila abre el destino en otra pestaña y conserva los parámetros originales.
2. **Cuentas:** agregá una propiedad por ID numérico (el ID de medición `G-…` no sirve). Podés darle un nombre y buscarla por nombre, dominio o ID. **Editar** cambia solo esa entrada. **Quitar propiedad** pide confirmación y retira sus enlaces de todas las pestañas abiertas; no modifica la cuenta en Google.
3. **Auditoría:** abrí el [autodiagnóstico de GA4 y GTM](https://cookingmetrics.com/es/google-analytics-autodiagnostico/?utm_source=github&utm_medium=ga4-page-links#checklist) o uno de sus apartados de compras, campañas y configuración. Es una revisión manual. El panel no envía IDs, dominios ni filas al checklist.

**Propiedades con varios sitios:** agregá Hostname como dimensión secundaria y activá el modo por fila. Si la columna existe y el host es inválido, esa fila queda sin enlace. Si la columna no está, se usa el dominio guardado.

**Si no aparecen enlaces:** si la pestaña de Analytics ya estaba abierta cuando instalaste la extensión, recargala. Verificá que la tabla tenga una dimensión de ruta en inglés o español y que las filas contengan rutas completas que empiecen con `/`. No se enlazan totales, títulos, clases de pantalla ni rutas truncadas sin valor completo. Un cambio de HTML en GA4 puede requerir una actualización; no necesitás compartir datos de la cuenta para usar la extensión.

[CookingMetrics](https://cookingmetrics.com/es/?utm_source=github&utm_medium=ga4-page-links) · [Martín Garay](https://www.martingaray.com.ar/?utm_source=github&utm_medium=ga4-page-links) · [English](HELP.md)
