(() => {
  "use strict";
  const core = globalThis.GA4PageLinks;
  const $ = id => document.getElementById(id);
  const localeKey = "ga4-page-links:locale";
  let lang = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  let view = "settings", lastView = "settings", windowId, contextVersion = 0, listVersion = 0;
  let active = { tab: null, id: null, raw: undefined, report: null };
  let entries = [], editor = null, removal = null, busy = false, storageReady = false;
  const notices = { status: { key: "checking" }, "account-status": { key: "" } };
  const t = key => globalThis.GA4PanelText[lang][key];
  const storage = () => chrome.storage.local;
  const same = (a, b) => a?.origin === b?.origin && a?.name === b?.name && a?.useRowHostname === b?.useRowHostname;
  const setting = (origin, useRowHostname, name) => name ? { origin, useRowHostname, name } : { origin, useRowHostname };

  function notice(area, key, error = false, count = 0, suffix = "") {
    notices[area] = { key, error, count, suffix };
    renderNotice(area);
  }
  function renderNotice(area) {
    const { key, error, count, suffix } = notices[area];
    $(area).textContent = key ? t(key).replace("{count}", String(count)) + (suffix ? t(suffix) : "") : "";
    $(area).dataset.error = String(Boolean(error));
  }
  function preview() {
    const path = t("examplePath");
    $("preview").textContent = core.buildPageUrl(path, $("origin").value) || path + " → ↗";
  }
  function translate() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.aria)); });
    document.querySelectorAll("[data-ph]").forEach(el => { el.placeholder = t(el.dataset.ph); });
    const links = globalThis.GA4PanelResources(lang);
    document.querySelectorAll("[data-resource]").forEach(el => { el.href = links[el.dataset.resource]; });
    for (const code of ["en", "es"]) $(code).setAttribute("aria-pressed", String(code === lang));
    $("editor-title").textContent = t(editor?.id ? "editEntry" : "newAccount");
    Object.keys(notices).forEach(renderNotice);
    renderList(); preview(); renderRemoval();
  }
  function selectView(next) {
    if (next === "help" && view !== "help") lastView = view;
    view = next;
    for (const name of ["settings", "accounts", "audit", "help"]) {
      const visible = name === next;
      $(name + "-view").hidden = !visible;
      const button = $(name + "-nav");
      if (button && visible) button.setAttribute("aria-current", "page");
      else if (button) button.removeAttribute("aria-current");
    }
    $("menu").hidden = true; $("menu-toggle").setAttribute("aria-expanded", "false");
    document.querySelector("main").scrollTop = 0;
    $(next + "-view").querySelector("h1").focus({ preventScroll: true });
  }

  function controls() {
    const canSave = Boolean(storageReady && active.id && !active.report?.storageError && !busy);
    $("settings-form").hidden = !active.id;
    $("directory-shortcut").className = active.id ? "text-link" : "primary";
    $("settings-fields").disabled = !canSave; $("save").disabled = !canSave;
    $("reset").disabled = !canSave || !active.raw;
    $("new-account").disabled = !storageReady || busy;
    $("account-fields").disabled = !storageReady || busy;
    $("remove-confirm").disabled = busy;
  }
  function reportNotice() {
    const r = active.report;
    if (!active.id) { notice("status", "openReport"); return; }
    if (r.storageError) { notice("status", "storage", true); return; }
    if (!r.configured) { notice("status", "unconfigured"); return; }
    const key = !r.columns ? "noColumns" : !r.links ? "noPaths" : "applied";
    notice("status", key, false, r.links, active.raw?.useRowHostname ? (r.hostnameTables ? "hostActive" : "hostFallback") : "");
  }

  async function reportInWindow() {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (!tab) return { tab: null, id: null, report: null };
    // Only our analytics.google.com content script answers; no tab URLs or extra permissions.
    const report = await chrome.tabs.sendMessage(tab.id, { type: "GA4_PAGE_LINKS_STATUS" }).catch(() => null);
    return { tab: tab.id, id: report?.propertyId || null, report };
  }
  async function refreshActive(force = false) {
    const version = ++contextVersion;
    try {
      const next = await reportInWindow();
      const key = next.id && core.propertyKey(next.id);
      next.raw = key ? (await storage().get(key))[key] : undefined;
      if (version !== contextVersion) return;
      const moved = next.tab !== active.tab || next.id !== active.id;
      const repaint = moved || force || !same(next.raw, active.raw);
      if (moved && removal?.source === "settings") $("remove-dialog").close();
      active = next;
      $("property").textContent = active.id || "—";
      if (repaint) {
        $("origin").value = active.raw?.origin || "";
        $("row-hostname").checked = active.raw?.useRowHostname === true;
        preview();
      }
      reportNotice(); controls();
    } catch {
      if (version !== contextVersion) return;
      active = { tab: null, id: null, raw: undefined, report: null };
      $("property").textContent = "—"; $("origin").value = ""; $("row-hostname").checked = false;
      preview(); notice("status", "storage", true); controls();
    }
  }
  async function verifyActive(target) {
    const now = await reportInWindow();
    if (!target.id || now.tab !== target.tab || now.id !== target.id) throw Error("changed");
  }
  async function writeEntry(id, expected, value, creating = false, activeTarget = null) {
    const key = core.propertyKey(id);
    // Two windows may edit the same property. Check and write under one origin-local lock.
    await navigator.locks.request(key, async () => {
      const current = (await storage().get(key))[key];
      if (creating && current !== undefined) throw Error("duplicate");
      if (!creating && !same(current, expected)) throw Error("conflict");
      if (activeTarget) await verifyActive(activeTarget);
      if (value) await storage().set({ [key]: value });
      else await storage().remove(key);
    });
  }
  async function mutate(area, action) {
    if (busy || !storageReady) return;
    busy = true; controls();
    try { await action(); }
    catch (error) {
      const key = ["invalid", "changed", "duplicate", "conflict", "invalidId"].includes(error.message) ? error.message : "storage";
      if (key === "changed" || key === "conflict") await refreshActive(true);
      notice(area, key, true);
    } finally { busy = false; controls(); }
  }
  function normalized(value) {
    try { return core.normalizeOrigin(value); } catch { throw Error("invalid"); }
  }

  $("settings-form").addEventListener("submit", event => {
    event.preventDefault();
    const target = active, input = $("origin").value, rowHost = $("row-hostname").checked;
    if (!target.id) return;
    mutate("status", async () => {
      const origin = normalized(input);
      await writeEntry(target.id, target.raw, setting(origin, rowHost, target.raw?.name), false, target);
      await refreshActive(true);
    });
  });
  $("origin").addEventListener("input", preview);

  function renderList() {
    const q = core.normalizeLabel($("search").value);
    const filtered = entries.filter(e => core.normalizeLabel([e.id, e.name, e.origin].join(" ")).includes(q));
    $("list-info").textContent = !entries.length ? t("noEntries") : !filtered.length ? t("noMatches") : t("entriesCount").replace("{count}", String(filtered.length));
    const nodes = filtered.map(e => {
      const li = document.createElement("li"), text = document.createElement("div"), title = document.createElement("strong"), detail = document.createElement("small"), edit = document.createElement("button");
      title.textContent = e.name || e.origin;
      detail.textContent = (e.name ? e.origin + " · " : "") + "ID " + e.id;
      edit.type = "button"; edit.className = "secondary"; edit.textContent = t("edit");
      edit.setAttribute("aria-label", t("edit") + " · " + (e.name || e.origin) + " · " + e.id);
      edit.addEventListener("click", () => openEditor(e));
      text.append(title, detail); li.append(text, edit); return li;
    });
    $("account-list").replaceChildren(...nodes);
  }
  async function loadDirectory() {
    const version = ++listVersion;
    try {
      const stored = await storage().get(null);
      if (version !== listVersion) return;
      entries = core.directoryEntries(stored);
      // Keep the original snapshot for conflict detection, including unnamed 0.1 entries.
      for (const entry of entries) entry.raw = stored[core.propertyKey(entry.id)];
      storageReady = true; renderList(); controls();
    } catch {
      if (version !== listVersion) return;
      storageReady = false; notice("account-status", "storage", true); controls();
    }
  }
  function openEditor(entry) {
    editor = entry || {};
    $("directory-list-view").hidden = true; $("account-form").hidden = false;
    $("editor-title").textContent = t(entry ? "editEntry" : "newAccount");
    $("account-id").value = entry?.id || ""; $("account-id").readOnly = Boolean(entry);
    $("account-name").value = entry?.name || ""; $("account-origin").value = entry?.origin || "";
    $("account-hostname").checked = entry?.useRowHostname || false;
    $("account-remove").hidden = !entry;
    notice("account-status", ""); $(entry ? "account-name" : "account-id").focus();
  }
  function closeEditor() {
    editor = null;
    $("account-form").hidden = true; $("directory-list-view").hidden = false;
    $("new-account").focus();
  }
  $("new-account").addEventListener("click", () => openEditor(null));
  $("account-cancel").addEventListener("click", () => { closeEditor(); notice("account-status", ""); });
  $("search").addEventListener("input", renderList);
  $("account-form").addEventListener("submit", event => {
    event.preventDefault();
    const target = editor, id = target?.id || $("account-id").value.trim();
    const input = $("account-origin").value, name = $("account-name").value.trim(), rowHost = $("account-hostname").checked;
    if (!target) return;
    mutate("account-status", async () => {
      if (!/^[1-9]\d*$/.test(id)) throw Error("invalidId");
      await writeEntry(id, target.raw, setting(normalized(input), rowHost, name), !target.id);
      await loadDirectory(); closeEditor(); notice("account-status", "saved");
    });
  });

  function renderRemoval() {
    if (!removal) return;
    const target = [removal.raw?.name, removal.raw?.origin, "ID " + removal.id].filter(Boolean).join(" · ");
    $("remove-detail").textContent = t("confirmDetail").replace("{target}", () => target);
  }
  function askRemove(source, entry) {
    if (busy || !entry?.id || !entry.raw) return;
    removal = { source, id: entry.id, raw: entry.raw, tab: entry.tab };
    renderRemoval(); $("remove-dialog").showModal(); $("remove-cancel").focus();
  }
  $("reset").addEventListener("click", () => askRemove("settings", active));
  $("account-remove").addEventListener("click", () => askRemove("accounts", editor));
  $("remove-cancel").addEventListener("click", () => $("remove-dialog").close());
  $("remove-dialog").addEventListener("close", () => {
    // Chrome queues close events. An earlier cancellation must not clear a reopened dialog.
    if (!$("remove-dialog").open) removal = null;
  });
  $("remove-confirm").addEventListener("click", () => {
    const target = removal;
    if (!target) return;
    const area = target.source === "settings" ? "status" : "account-status";
    $("remove-dialog").close();
    mutate(area, async () => {
      await writeEntry(target.id, target.raw, null, false, target.source === "settings" ? target : null);
      await Promise.all([loadDirectory(), refreshActive(true)]);
      if (target.source === "accounts") closeEditor();
      notice(area, "removed");
    });
  });

  document.querySelectorAll("[data-open]").forEach(el => el.addEventListener("click", () => selectView(el.dataset.open)));
  $("help-back").addEventListener("click", () => selectView(lastView));
  $("menu-toggle").addEventListener("click", () => {
    $("menu").hidden = !$("menu").hidden;
    $("menu-toggle").setAttribute("aria-expanded", String(!$("menu").hidden));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !$("menu").hidden) {
      $("menu").hidden = true; $("menu-toggle").setAttribute("aria-expanded", "false"); $("menu-toggle").focus();
    }
  });
  for (const code of ["en", "es"]) $(code).addEventListener("click", async () => {
    lang = code; translate();
    try { await storage().set({ [localeKey]: code }); } catch { notice("status", "storage", true); }
  });

  async function init() {
    translate();
    try {
      windowId = (await chrome.windows.getCurrent()).id;
      const stored = (await storage().get(localeKey))[localeKey];
      if (stored === "es" || stored === "en") lang = stored;
      translate();
      chrome.tabs.onActivated.addListener(info => { if (info.windowId === windowId) refreshActive(); });
      chrome.tabs.onUpdated.addListener((id, change) => { if (id === active.tab && change.status) refreshActive(); });
      chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg?.type === "GA4_PAGE_LINKS_CONTEXT" && sender.tab?.windowId === windowId && sender.tab.id === active.tab) refreshActive();
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        const newLang = changes[localeKey]?.newValue;
        if ((newLang === "es" || newLang === "en") && newLang !== lang) { lang = newLang; translate(); }
        if (Object.keys(changes).some(key => key.startsWith("ga4-page-links:property:"))) loadDirectory();
        if (active.id && Object.hasOwn(changes, core.propertyKey(active.id))) refreshActive();
      });
      await Promise.all([loadDirectory(), refreshActive(true)]);
    } catch { notice("status", "storage", true); notice("account-status", "storage", true); }
  }
  init();
})();
