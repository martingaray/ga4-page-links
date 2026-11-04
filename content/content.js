(() => {
  "use strict";
  if (globalThis.__ga4PageLinksLoaded) return;
  globalThis.__ga4PageLinksLoaded = true;

  const core = globalThis.GA4PageLinks;
  const TABLE = 'table, [role="table"], [role="grid"], mat-table, .mat-table, .mat-mdc-table';
  const ROW = 'tr, [role="row"], mat-row, mat-header-row, .mat-mdc-row, .mat-mdc-header-row';
  const CELL = 'th, td, [role="columnheader"], [role="rowheader"], [role="cell"], [role="gridcell"], mat-cell, mat-header-cell, .mat-mdc-cell, .mat-mdc-header-cell';
  const LINK = 'a[data-ga4-page-link]';
  let propertyId = null;
  let settings = null;
  let loadVersion = 0;
  let timer;
  let stopped = false;
  let storageError = false;
  let loading = Promise.resolve();
  let summary = { links: 0, columns: 0, hostnameTables: 0 };

  function removeLinks() {
    document.querySelectorAll(LINK).forEach(link => link.remove());
    summary = { links: 0, columns: 0, hostnameTables: 0 };
  }

  function watch() {
    if (!stopped) observer.observe(document.body, {
      subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ["aria-colindex", "aria-label", "title", "colspan", "hidden", "aria-hidden"]
    });
  }

  function schedule() {
    if (stopped || timer) return;
    timer = setTimeout(() => { timer = null; refresh(); }, 120);
  }

  function cellsIn(row) {
    let position = 1;
    return [...row.querySelectorAll(CELL)].filter(cell => cell.closest(ROW) === row).map(cell => {
      const explicit = Number(cell.getAttribute("aria-colindex"));
      const index = explicit > 0 ? explicit : position;
      position = index + Math.max(1, Number(cell.getAttribute("colspan")) || 1);
      return { cell, index };
    });
  }

  function kindOfHeader(cell) {
    const nodes = [cell, ...cell.querySelectorAll('button, [role="button"], [role="combobox"], span, [aria-label], [title]')];
    for (const node of nodes) {
      for (const label of [node.textContent, node.getAttribute("aria-label"), node.getAttribute("title")]) {
        const kind = label && core.headerKind(label);
        if (kind) return kind;
      }
    }
    return null;
  }

  function textWithoutLinks(cell) {
    const clone = cell.cloneNode(true);
    clone.querySelectorAll(`${LINK}, svg, [aria-hidden="true"]`).forEach(node => node.remove());
    return clone.textContent.trim();
  }

  function readPath(cell) {
    const text = textWithoutLinks(cell);
    // CSS ellipsis does not truncate textContent. For explicitly truncated text, only use
    // a matching full tooltip; never manufacture a URL from a visible prefix.
    if (!/(?:…|\.\.\.)$/.test(text)) return text;
    const prefix = text.replace(/(?:…|\.\.\.)$/, "");
    for (const node of [cell, ...cell.querySelectorAll('[title], [mattooltip], [data-tooltip], [aria-label]')]) {
      for (const attribute of ["title", "mattooltip", "data-tooltip", "aria-label"]) {
        const value = node.getAttribute(attribute)?.trim();
        if (value?.startsWith(prefix) && !/(?:…|\.\.\.)$/.test(value)) return value;
      }
    }
    return "";
  }

  function updateLink(cell, href, keep) {
    let link = [...cell.querySelectorAll(LINK)].find(node => node.closest(CELL) === cell);
    if (!link) {
      link = document.createElement("a");
      link.dataset.ga4PageLink = "";
      link.textContent = "↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.referrerPolicy = "no-referrer";
      // Keep GA4's row drill-down and selection handlers from receiving link gestures.
      for (const event of ["click", "auxclick", "mousedown", "pointerdown", "keydown"]) {
        link.addEventListener(event, e => {
          e.stopPropagation();
          // A recycled row or a property switch can precede the observer's next pass.
          // Revalidate the destination in the same event before the browser opens it.
          if (["click", "auxclick", "keydown"].includes(e.type)) {
            if (core.propertyIdFromUrl(location.href) !== propertyId) loadProperty();
            else refresh();
            if (!link.isConnected) e.preventDefault();
          }
        });
      }
      cell.append(link);
    }
    if (link.getAttribute("href") !== href) link.href = href;
    link.title = href;
    link.setAttribute("aria-label", `${document.documentElement.lang.startsWith("es") ? "Abrir en otra pestaña" : "Open in a new tab"}: ${href}`);
    keep.add(link);
  }

  function refresh() {
    if (stopped) return;
    if (core.propertyIdFromUrl(location.href) !== propertyId) { loadProperty(); return; }
    observer.disconnect();
    try {
      if (!propertyId || !settings) { removeLinks(); return; }
      const keep = new Set();
      let columns = 0;
      let hostnameTables = 0;
      for (const table of document.querySelectorAll(TABLE)) {
        if (!table.getClientRects().length || table.closest('[hidden], [aria-hidden="true"]')) continue;
        const rows = [...table.querySelectorAll(ROW)].filter(row => row.closest(TABLE) === table);
        const paths = new Set();
        let hostnameIndex = null;
        for (const row of rows) {
          for (const { cell, index } of cellsIn(row)) {
            if (!cell.matches('th, [role="columnheader"], mat-header-cell, .mat-mdc-header-cell')) continue;
            const kind = kindOfHeader(cell);
            if (kind === "path") paths.add(index);
            if (kind === "hostname") hostnameIndex = index;
          }
        }
        if (!paths.size) continue;
        columns += paths.size;
        if (hostnameIndex !== null) hostnameTables++;
        for (const row of rows) {
          if (!row.getClientRects().length || row.closest('[hidden], [aria-hidden="true"]')) continue;
          const cells = cellsIn(row);
          if (cells.some(({ cell }) => cell.matches('[role="columnheader"], mat-header-cell, .mat-mdc-header-cell')) || row.closest("thead")) continue;
          let origin = settings.origin;
          if (settings.useRowHostname && hostnameIndex !== null) {
            const hostCell = cells.find(({ index }) => index === hostnameIndex)?.cell;
            origin = hostCell ? core.rowOrigin(textWithoutLinks(hostCell), settings.origin) : null;
          }
          if (!origin) continue;
          for (const { cell, index } of cells) {
            if (!paths.has(index)) continue;
            const href = core.buildPageUrl(readPath(cell), origin);
            if (href) updateLink(cell, href, keep);
          }
        }
      }
      document.querySelectorAll(LINK).forEach(link => { if (!keep.has(link)) link.remove(); });
      summary = { links: keep.size, columns, hostnameTables };
    } finally {
      watch();
    }
  }

  function loadProperty() {
    loading = readProperty();
    return loading;
  }

  async function readProperty() {
    const version = ++loadVersion;
    const previousId = propertyId;
    propertyId = core.propertyIdFromUrl(location.href);
    const requestedId = propertyId;
    if (previousId !== requestedId) {
      // The panel independently re-reads the active tab. Only signal a route change.
      chrome.runtime.sendMessage({ type: "GA4_PAGE_LINKS_CONTEXT" }).catch(() => {});
    }
    settings = null;
    storageError = false;
    observer.disconnect();
    removeLinks();
    watch();
    if (!requestedId) return;
    try {
      const key = core.propertyKey(requestedId);
      const stored = (await chrome.storage.local.get(key))[key];
      if (stopped || version !== loadVersion || core.propertyIdFromUrl(location.href) !== requestedId) return;
      if (stored) settings = {
        origin: core.normalizeOrigin(stored.origin), useRowHostname: stored.useRowHostname === true
      };
    } catch {
      if (version === loadVersion) storageError = true;
    }
    if (version === loadVersion) schedule();
  }

  const observer = new MutationObserver(schedule);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && propertyId && Object.hasOwn(changes, core.propertyKey(propertyId))) loadProperty();
  });
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "GA4_PAGE_LINKS_STATUS") return;
    if (message.reload || core.propertyIdFromUrl(location.href) !== propertyId) loadProperty();
    (async () => {
      let pending;
      do { pending = loading; await pending; } while (pending !== loading);
      refresh();
      sendResponse({ propertyId, configured: Boolean(settings), storageError, ...summary });
    })().catch(() => sendResponse({ propertyId, storageError: true, configured: false, ...summary }));
    return true;
  });
  window.addEventListener("hashchange", loadProperty);
  window.addEventListener("popstate", loadProperty);
  // History API changes do not emit popstate; check only the route on this low-cost timer.
  const routeTimer = setInterval(() => {
    if (core.propertyIdFromUrl(location.href) !== propertyId) loadProperty();
  }, 800);
  window.addEventListener("pagehide", event => {
    if (event.persisted) return;
    stopped = true;
    clearTimeout(timer);
    clearInterval(routeTimer);
    observer.disconnect();
  });
  loadProperty();
})();
