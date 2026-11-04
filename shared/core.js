/* Shared by the isolated content script, the side panel and dependency-free tests. */
(() => {
  "use strict";

  const dimensions = new Set([
    "Page path", "Page path and screen class", "Landing page", "Landing page + query string",
    "Page path + query string", "Page path + query string and screen class",
    "Ruta de pagina", "Ruta de la pagina", "Ruta de pagina y clase de pantalla",
    "Ruta de la pagina y clase de pantalla", "Pagina de destino",
    "Pagina de destino + cadena de consulta", "Pagina de destino y cadena de consulta",
    "Ruta de pagina + cadena de consulta", "Ruta de pagina y cadena de consulta",
    "Ruta de la pagina + cadena de consulta", "Ruta de la pagina y cadena de consulta",
    "Ruta de pagina + cadena de consulta y clase de pantalla",
    "Ruta de pagina y cadena de consulta y clase de pantalla",
    "Ruta de pagina + cadena de consulta + clase de pantalla",
    "Ruta de pagina y cadena de consulta + clase de pantalla",
    "Ruta de la pagina + cadena de consulta y clase de pantalla",
    "Ruta de la pagina y cadena de consulta y clase de pantalla",
    "Ruta de la pagina + cadena de consulta + clase de pantalla",
    "Ruta de la pagina y cadena de consulta + clase de pantalla"
  ].map(normalizeLabel));
  const hostnames = new Set(["Hostname", "Host name", "Nombre de host", "Nombre del host"].map(normalizeLabel));

  function normalizeLabel(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function headerKind(value) {
    const label = normalizeLabel(value).replace(/(?:\s+(?:arrow_drop_down|expand_more|add|\+))+$/, "");
    if (dimensions.has(label)) return "path";
    if (hostnames.has(label)) return "hostname";
    return null;
  }

  function propertyIdFromUrl(value) {
    try {
      const url = new URL(value);
      if (url.origin !== "https://analytics.google.com") return null;
      // GA4 uses /#/p123/... and /#/a123p456/...; do not read IDs from report filters.
      const route = decodeURIComponent(url.hash.replace(/^#/, "")).split("?")[0];
      return route.match(/^\/?(?:(?:analysis|admin)\/)?(?:a\d+)?p([1-9]\d*)(?=\/|$)/)?.[1] ?? null;
    } catch {
      return null;
    }
  }

  function propertyKey(propertyId) {
    if (!/^[1-9]\d*$/.test(String(propertyId))) throw new Error("Invalid property ID");
    return `ga4-page-links:property:${propertyId}`;
  }

  function normalizeOrigin(value) {
    const input = String(value ?? "").trim();
    if (!/^(?:https?:\/\/)?[^/?#@\\\s\u0000-\u001f\u007f]+\/?$/i.test(input)) throw new Error("Invalid origin");
    const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`;
    const url = new URL(candidate);
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) throw new Error("Invalid origin");
    return url.origin;
  }

  // Version 0.1 stored the same individual keys without a name. No migration or
  // second directory index is needed; unrelated keys and invalid records stay untouched.
  function directoryEntries(stored) {
    const entries = [];
    for (const [key, value] of Object.entries(stored)) {
      const id = /^ga4-page-links:property:([1-9]\d*)$/.exec(key)?.[1];
      if (!id || !value) continue;
      try {
        entries.push({ id, name: typeof value.name === "string" ? value.name.trim() : "",
          origin: normalizeOrigin(value.origin), useRowHostname: value.useRowHostname === true });
      } catch { /* Ignore invalid entries when listing; never invent a destination. */ }
    }
    return entries.sort((a, b) => (a.name || a.origin).localeCompare(b.name || b.origin) || a.id.localeCompare(b.id));
  }

  function rowOrigin(value, fallbackOrigin) {
    const host = String(value ?? "").trim();
    // The Hostname dimension contains only a host, not a URL or a path.
    if (!host || /[\s/\\?#@]/.test(host) || host.includes(":")) return null;
    try {
      const base = new URL(fallbackOrigin);
      const url = new URL(`${base.protocol}//${host}`);
      if (!url.hostname || url.port || url.username || url.password || url.pathname !== "/") return null;
      // Reject placeholders and bare labels such as "(not set)" or "Total".
      if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
      return url.origin;
    } catch {
      return null;
    }
  }

  function buildPageUrl(path, origin) {
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//") ||
        /[\\\u0000-\u001f\u007f]/.test(path) || /(?:…|\.\.\.)$/.test(path)) return null;
    try {
      const base = normalizeOrigin(origin);
      const url = new URL(path, `${base}/`);
      return url.origin === base ? url.href : null;
    } catch {
      return null;
    }
  }

  globalThis.GA4PageLinks = Object.freeze({
    normalizeLabel, headerKind, propertyIdFromUrl, propertyKey, normalizeOrigin, directoryEntries, rowOrigin, buildPageUrl
  });
})();
