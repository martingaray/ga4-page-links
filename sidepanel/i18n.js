/* UI copy and public destinations. Campaign labels are constant; no report context is appended. */
globalThis.GA4PanelText = {
  es: {
    menu: "Menú", sections: "Secciones", links: "Enlaces", accounts: "Cuentas", audit: "Auditoría", help: "Ayuda",
    settingsKicker: "Configuración", settingsTitle: "De la ruta a la página", settingsIntro: "Elegí el sitio que querés abrir desde las filas del informe.",
    activeProperty: "Propiedad en esta pestaña", domain: "Dominio del sitio", originHint: "Ingresá solo el dominio. Podés incluir el protocolo y el puerto.",
    example: "Vista previa del enlace", examplePath: "/categoria/producto?variante=1", rowHost: "Usar el Hostname de cada fila",
    rowHint: "Si la tabla no tiene esa columna, se usa el dominio guardado. Si la tiene, las filas sin un host válido quedan sin enlace.",
    save: "Guardar y aplicar", reset: "Quitar esta configuración", goAccounts: "Administrar otras propiedades →",
    checking: "Buscando la propiedad abierta…", openReport: "Abrí un informe de GA4 para configurar su dominio acá. También podés agregarlo desde Cuentas sin abrir GA4.",
    storage: "No se pudo leer o guardar la configuración local. Volvé a abrir el panel.",
    invalid: "Ingresá un dominio válido, sin ruta, credenciales, parámetros ni fragmento.", changed: "Cambió la pestaña o la propiedad. Revisá el dominio antes de volver a guardar.",
    unconfigured: "Todavía no hay un dominio guardado para esta propiedad.",
    applied: "{count} enlaces en las filas visibles.", noColumns: "Dominio guardado. Abrí una tabla con una dimensión de ruta compatible.",
    noPaths: "Se reconoció la dimensión, pero no hay rutas web completas en las filas visibles.",
    hostActive: " Se usa el Hostname de cada fila.", hostFallback: " No hay columna Hostname; se usa el dominio guardado.",
    directoryKicker: "Directorio local", accountsTitle: "Cuentas y dominios",
    accountsIntro: "Cada entrada vincula una propiedad de GA4 con su sitio. Podés administrarla aunque no tengas abierto el informe.",
    newAccount: "Agregar propiedad", search: "Buscar en el directorio", searchHint: "Nombre, dominio o ID", noEntries: "Todavía no guardaste ninguna propiedad.",
    noMatches: "No hay propiedades que coincidan.", entriesCount: "Propiedades: {count}", edit: "Editar", editEntry: "Editar propiedad", propertyId: "ID de propiedad de GA4",
    idHint: "Usá el número de la propiedad, no el ID de medición que empieza con G-.", name: "Nombre de referencia (opcional)", nameHint: "Ej.: Tienda principal",
    saveEntry: "Guardar propiedad", cancel: "Cancelar", remove: "Quitar propiedad", confirmTitle: "¿Quitar esta propiedad?",
    confirmDetail: "Se quitarán el dominio guardado y sus enlaces de las pestañas abiertas para {target}. Tu cuenta de Google Analytics no cambia.",
    saved: "Propiedad guardada.", removed: "Propiedad quitada del directorio.", duplicate: "Ese ID ya está en el directorio. Buscalo y elegí Editar.",
    conflict: "Esta entrada cambió en otro panel. Volvé al directorio y abrila de nuevo.", invalidId: "Ingresá un ID numérico de propiedad válido.",
    auditKicker: "Autodiagnóstico · Google Analytics · Google Tag Manager", auditTitle: "¿Google Analytics mide mal?",
    auditIntro: "Si las compras no coinciden con su tienda o sus campañas muestran números distintos de los de Google Analytics, este checklist le ayuda a revisar dónde puede originarse la diferencia. Revise compras, campañas y configuración paso a paso, detecte señales para investigar y lleve preguntas concretas a quien administra su medición.",
    auditCTA: "Abrir el checklist de CookingMetrics", auditWhere: "Empezá por una diferencia",
    purchases: "Compras e importes", purchasesHint: "Compará pedidos, montos y productos con tu tienda.",
    campaigns: "Campañas y atribución", campaignsHint: "Revisá de dónde vienen las visitas y cómo se atribuyen.",
    config: "Configuración y responsables", configHint: "Revisá cambios, responsables y criterios de los informes.",
    auditPrivacy: "El checklist se abre en CookingMetrics. La revisión es manual: el panel no audita tu cuenta automáticamente ni envía el ID, el dominio o las filas del informe.",
    back: "← Volver", privacyTitle: "Privacidad", privacy: "El directorio y el idioma quedan en este navegador. No se guardan filas ni métricas. Solo se abre un sitio externo cuando elegís un enlace.",
    helpLinks: "En GA4, abrí Páginas y pantallas o Página de destino y elegí una dimensión de ruta. Guardá el dominio: cada ↗ abre esa página y conserva sus parámetros. Los totales, las clases de pantalla y las rutas truncadas sin valor completo quedan sin enlace.",
    helpAccounts: "En Cuentas podés crear, buscar, editar y quitar entradas por ID. Para propiedades con varios sitios, agregá Hostname a la tabla y activá el modo por fila. Quitar una propiedad solo borra sus enlaces y ajustes locales.",
    githubHelp: "Código y guía de instalación en GitHub ↗"
  },
  en: {
    menu: "Menu", sections: "Sections", links: "Links", accounts: "Accounts", audit: "Audit", help: "Help",
    settingsKicker: "Settings", settingsTitle: "From path to page", settingsIntro: "Choose which site to open from the rows of your report.",
    activeProperty: "Property in this tab", domain: "Website domain", originHint: "Enter just the domain. You can include the protocol and port.",
    example: "Link preview", examplePath: "/category/product?variant=1", rowHost: "Use the Hostname of each row",
    rowHint: "Without that column, links use the saved domain. With it, rows without a valid host receive no link.",
    save: "Save and apply", reset: "Remove these settings", goAccounts: "Manage other properties →",
    checking: "Looking for the open property…", openReport: "Open a GA4 report to set its domain here. You can also add it from Accounts without opening GA4.",
    storage: "Could not read or save local settings. Reopen the panel.",
    invalid: "Enter a valid domain without a path, credentials, query or fragment.", changed: "The tab or property changed. Check the domain before saving again.",
    unconfigured: "There is no saved domain for this property yet.",
    applied: "{count} links in visible rows.", noColumns: "Domain saved. Open a table with a supported path dimension.",
    noPaths: "Dimension recognized, but there are no complete web paths in the visible rows.",
    hostActive: " Using the Hostname of each row.", hostFallback: " No Hostname column; using the saved domain.",
    directoryKicker: "Local directory", accountsTitle: "Accounts and domains",
    accountsIntro: "Each entry links a GA4 property to its site. Manage it even when the report is closed.",
    newAccount: "Add property", search: "Search directory", searchHint: "Name, domain or ID", noEntries: "No properties saved yet.",
    noMatches: "No matching properties.", entriesCount: "Properties: {count}", edit: "Edit", editEntry: "Edit property", propertyId: "GA4 property ID",
    idHint: "Use the numeric property ID, not the measurement ID starting with G-.", name: "Reference name (optional)", nameHint: "E.g. Main store",
    saveEntry: "Save property", cancel: "Cancel", remove: "Remove property", confirmTitle: "Remove this property?",
    confirmDetail: "The saved domain and links in open tabs will be removed for {target}. Your Google Analytics account will not change.",
    saved: "Property saved.", removed: "Property removed from the directory.", duplicate: "This ID is already in the directory. Find it and choose Edit.",
    conflict: "This entry changed in another panel. Return to the directory and reopen it.", invalidId: "Enter a valid numeric property ID.",
    auditKicker: "Self-check · Google Analytics · Google Tag Manager", auditTitle: "Is Google Analytics accurate?",
    auditIntro: "If purchases don't match your store, or your campaigns report different numbers than Google Analytics, this checklist helps you review where the difference may come from. Check purchases, campaigns and configuration step by step, identify signals worth investigating and bring specific questions to the person managing your measurement.",
    auditCTA: "Open the CookingMetrics checklist", auditWhere: "Start with a discrepancy",
    purchases: "Purchases and amounts", purchasesHint: "Compare orders, amounts and products with your store.",
    campaigns: "Campaigns and attribution", campaignsHint: "Review traffic sources and how credit is assigned.",
    config: "Configuration and owners", configHint: "Review changes, ownership and reporting criteria.",
    auditPrivacy: "The checklist opens on CookingMetrics. This is a manual review: the panel does not automatically audit your account or send its ID, domain or report rows.",
    back: "← Back", privacyTitle: "Privacy", privacy: "The directory and language stay in this browser. No rows or metrics are stored. External sites open only when you follow a link.",
    helpLinks: "In GA4, open Pages and screens or Landing page and select a path dimension. Save the domain: each ↗ opens the page and preserves query parameters. Totals, screen classes and truncated paths without a full value are not linked.",
    helpAccounts: "In Accounts you can add, find, edit and remove entries by ID. For properties with multiple sites, add Hostname to the table and enable per-row mode. Removing a property deletes only its local settings and links.",
    githubHelp: "Source and installation guide on GitHub ↗"
  }
};

globalThis.GA4PanelResources = function (lang) {
  const en = lang === "en";
  const campaign = "?utm_source=chrome-extensions&utm_medium=ga4-page-links";
  const check = "https://cookingmetrics.com/" + (en ? "google-analytics-self-check/" : "es/google-analytics-autodiagnostico/") + campaign;
  const repo = "https://github.com/martingaray/ga4-page-links";
  return {
    cooking: "https://cookingmetrics.com/" + (en ? "" : "es/") + campaign,
    author: "https://www.martingaray.com.ar/" + campaign,
    github: repo, license: repo + "/blob/main/LICENSE",
    checklist: check + "#checklist", purchases: check + "#economica",
    campaigns: check + "#atribucion", config: check + "#gobierno"
  };
};
