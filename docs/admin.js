(function () {
  const CATALOG = [
    ["croquetas-jamon", "Croquetas de Jamón de la Abuela", 12.9, "Entrantes"],
    ["ensalada-tropical", "Ensalada Tropical de la Casa", 10, "Entrantes"],
    ["tamal-criollo", "Tamal Criollo Habanero", 15, "Entrantes"],
    ["ropa-vieja", "Ropa Vieja Tradicional", 29.9, "Platos fuertes"],
    ["lechon-asado", "Lechón Asado a lo Cubano", 27, "Platos fuertes"],
    ["arroz-imperial-personal", "Arroz Imperial · Personal", 25, "Platos fuertes"],
    ["arroz-imperial-familiar", "Arroz Imperial · Familiar", 45, "Platos fuertes"],
    ["lasana-habanera", "Lasaña Habanera de Carne", 20, "Platos fuertes"],
    ["bistec-malecon", "Bistec Encebollado del Malecón", 27, "Platos fuertes"],
    ["pollo-guajiro", "Pollo Rostizado del Guajiro", 25, "Platos fuertes"],
    ["cerdo-cazuela", "Asado de Cerdo en Cazuela", 27, "Platos fuertes"],
    ["flan-abuela", "Flan de la Abuela", 7, "Postres"],
    ["torrija-cubana", "Torrija Cubana Dorada", 9, "Postres"],
    ["arroz-leche", "Arroz con Leche y Chocolate", 10, "Postres"],
    ["platano-maduro", "Plátano Maduro Frito", 6, "Porciones extras"],
    ["tostones", "Tostones Crujientes", 6, "Porciones extras"],
    ["arroz-congris", "Arroz Congrí", 8, "Porciones extras"],
  ].map(([id, name, price, category]) => ({ id, name, price, category }));
  const STATUS_LABELS = { received: "Recibido", preparing: "Preparando", ready: "Listo", dispatched: "Enviado/Entregado", canceled: "Cancelado" };
  let draft = [];

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
  }

  function money(value) {
    const number = Number(value || 0);
    return `S/ ${number.toLocaleString("es-PE", { minimumFractionDigits: Number.isInteger(number) ? 0 : 2, maximumFractionDigits: 2 })}`;
  }

  function safe(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function toast(message) {
    const element = document.querySelector("[data-admin-toast]");
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("show"), 2200);
  }

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const result = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(result)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function setupLock() {
    const stored = localStorage.getItem("abdelito-admin-hash");
    const title = document.querySelector("[data-lock-title]");
    const copy = document.querySelector("[data-lock-copy]");
    if (stored) {
      title.textContent = "Acceso al panel";
      copy.textContent = "Introduce el PIN guardado en este navegador.";
    }
    document.querySelector("[data-lock-form]").addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.querySelector("[data-pin]");
      const error = document.querySelector("[data-lock-error]");
      if (!/^\d{4,12}$/.test(input.value)) {
        error.textContent = "Usa entre 4 y 12 dígitos.";
        return;
      }
      const value = await digest(input.value);
      if (!stored) localStorage.setItem("abdelito-admin-hash", value);
      if (stored && value !== stored) {
        error.textContent = "PIN incorrecto.";
        return;
      }
      document.querySelector("[data-lock]").hidden = true;
      input.value = "";
    });
  }

  function renderProductOptions() {
    document.querySelector("[data-order-product]").innerHTML = CATALOG.map((product) => `<option value="${product.id}">${safe(product.name)} · ${money(product.price)}</option>`).join("");
  }

  function renderAvailability() {
    const ops = read("abdelito-ops", {});
    const configured = window.ABDELITO_CONFIG?.availability || {};
    const availability = { ...configured, ...(ops.availability || {}) };
    document.querySelector("[data-catalog-admin]").innerHTML = CATALOG.map((product) => `<div class="catalog-row"><div><strong>${safe(product.name)}</strong><small>${safe(product.category)} · ${money(product.price)}</small></div><select data-product-status="${product.id}" aria-label="Estado de ${safe(product.name)}"><option value="available" ${availability[product.id] === "available" || !availability[product.id] ? "selected" : ""}>Disponible</option><option value="soldout" ${availability[product.id] === "soldout" ? "selected" : ""}>Agotado</option><option value="preorder" ${availability[product.id] === "preorder" ? "selected" : ""}>Por encargo</option></select></div>`).join("");
  }

  function renderService() {
    const ops = read("abdelito-ops", {});
    const service = { ...(window.ABDELITO_CONFIG?.service || {}), ...(ops.service || {}) };
    document.querySelector("[data-service-mode]").value = service.mode || "open";
    document.querySelector("[data-hours-label]").value = service.hoursLabel || "";
  }

  function draftTotal() {
    return draft.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function renderDraft() {
    const target = document.querySelector("[data-draft-items]");
    target.innerHTML = draft.length ? draft.map((item) => `<div class="draft-line"><span>${item.quantity}× ${safe(item.name)}</span><span><strong>${money(item.price * item.quantity)}</strong> <button type="button" data-remove-draft="${item.id}" aria-label="Eliminar">×</button></span></div>`).join("") : '<div class="empty">Aún no agregaste productos.</div>';
    document.querySelector("[data-draft-total]").textContent = money(draftTotal());
  }

  function addDraft() {
    const id = document.querySelector("[data-order-product]").value;
    const quantity = Math.max(1, Math.min(20, Number(document.querySelector("[data-order-qty]").value || 1)));
    const product = CATALOG.find((item) => item.id === id);
    const existing = draft.find((item) => item.id === id);
    if (existing) existing.quantity += quantity;
    else draft.push({ ...product, quantity });
    renderDraft();
  }

  function orders() { return read("abdelito-admin-orders", []); }
  function saveOrders(value) { localStorage.setItem("abdelito-admin-orders", JSON.stringify(value)); }

  function registerOrder(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!draft.length) {
      toast("Agrega al menos un producto");
      return;
    }
    const list = orders();
    list.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      code: String(data.get("code") || "").trim() || `AC-${Date.now().toString(36).slice(-6).toUpperCase()}`,
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      method: String(data.get("method") || "Delivery"),
      notes: String(data.get("notes") || "").trim(),
      items: draft.map((item) => ({ ...item })),
      total: draftTotal(),
      status: "received",
      createdAt: new Date().toISOString(),
    });
    saveOrders(list);
    draft = [];
    event.currentTarget.reset();
    renderDraft();
    renderAllData();
    toast("Pedido registrado");
  }

  function statusOptions(current) {
    return Object.entries(STATUS_LABELS).map(([value, label]) => `<option value="${value}" ${current === value ? "selected" : ""}>${label}</option>`).join("");
  }

  function renderOrders() {
    const target = document.querySelector("[data-order-table]");
    const list = orders();
    if (!list.length) {
      target.innerHTML = '<div class="empty">Todavía no hay pedidos registrados.</div>';
      return;
    }
    target.innerHTML = `<table class="order-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Detalle</th><th>Total</th><th>Estado</th><th></th></tr></thead><tbody>${list.map((order) => `<tr><td><strong>${safe(order.code)}</strong><br><small>${new Date(order.createdAt).toLocaleString("es-PE")}</small></td><td>${safe(order.name)}<br><small>${safe(order.method)} ${order.phone ? `· ${safe(order.phone)}` : ""}</small></td><td>${order.items.map((item) => `${item.quantity}× ${safe(item.name)}`).join("<br>")}${order.notes ? `<br><small>${safe(order.notes)}</small>` : ""}</td><td><strong>${money(order.total)}</strong></td><td><select class="status-select" data-order-status="${order.id}">${statusOptions(order.status)}</select></td><td><button class="button ghost small" type="button" data-delete-order="${order.id}">Eliminar</button></td></tr>`).join("")}</tbody></table>`;
  }

  function aggregateSales() {
    const counts = new Map();
    orders().filter((order) => order.status !== "canceled").forEach((order) => order.items.forEach((item) => counts.set(item.name, (counts.get(item.name) || 0) + item.quantity)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }

  function renderMetrics() {
    const list = orders();
    const valid = list.filter((order) => order.status !== "canceled");
    document.querySelector("[data-metric-orders]").textContent = list.length;
    document.querySelector("[data-metric-sales]").textContent = money(valid.reduce((sum, order) => sum + order.total, 0));
    document.querySelector("[data-metric-preparing]").textContent = list.filter((order) => order.status === "preparing").length;
    document.querySelector("[data-metric-top]").textContent = aggregateSales()[0]?.[0] || "—";
  }

  function renderSellers() {
    const data = aggregateSales().slice(0, 5);
    document.querySelector("[data-seller-list]").innerHTML = data.length ? data.map(([name, quantity], index) => `<div class="seller-row"><span>${index + 1}. ${safe(name)}</span><strong>${quantity} uds.</strong></div>`).join("") : '<div class="empty">Registra pedidos para ver el ranking.</div>';
  }

  function renderEvents() {
    const events = read("abdelito-analytics-local", []);
    const wanted = [["page_view", "Visitas"], ["search", "Búsquedas"], ["add_to_cart", "Agregados"], ["generate_lead", "Pedidos enviados"]];
    document.querySelector("[data-event-grid]").innerHTML = wanted.map(([name, label]) => `<div class="event-card"><small>${label}</small><strong>${events.filter((event) => event.name === name).length}</strong></div>`).join("");
  }

  function renderAllData() {
    renderOrders();
    renderMetrics();
    renderSellers();
    renderEvents();
  }

  function saveService() {
    const ops = read("abdelito-ops", {});
    ops.service = { mode: document.querySelector("[data-service-mode]").value, hoursLabel: document.querySelector("[data-hours-label]").value.trim() || "Horario se confirma por WhatsApp" };
    localStorage.setItem("abdelito-ops", JSON.stringify(ops));
    toast("Estado guardado en este equipo");
  }

  function saveAvailability() {
    const ops = read("abdelito-ops", {});
    ops.availability = {};
    document.querySelectorAll("[data-product-status]").forEach((select) => { ops.availability[select.dataset.productStatus] = select.value; });
    localStorage.setItem("abdelito-ops", JSON.stringify(ops));
    toast("Disponibilidad guardada en este equipo");
  }

  function exportConfig() {
    saveService();
    saveAvailability();
    const ops = read("abdelito-ops", {});
    const next = {
      ...(window.ABDELITO_CONFIG || {}),
      service: { ...(window.ABDELITO_CONFIG?.service || {}), ...(ops.service || {}) },
      availability: { ...(window.ABDELITO_CONFIG?.availability || {}), ...(ops.availability || {}) },
    };
    download("business-config.js", `window.ABDELITO_CONFIG = ${JSON.stringify(next, null, 2)};\n`, "text/javascript");
    toast("Configuración descargada");
  }

  function download(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportOrders() {
    const rows = [["Código", "Fecha", "Cliente", "WhatsApp", "Modalidad", "Productos", "Total", "Estado"]];
    orders().forEach((order) => rows.push([order.code, order.createdAt, order.name, order.phone, order.method, order.items.map((item) => `${item.quantity}x ${item.name}`).join(" | "), order.total, STATUS_LABELS[order.status]]));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    download(`pedidos-abdelito-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.matches("[data-add-draft]")) addDraft();
    if (target.matches("[data-remove-draft]")) { draft = draft.filter((item) => item.id !== target.dataset.removeDraft); renderDraft(); }
    if (target.matches("[data-save-service]")) saveService();
    if (target.matches("[data-save-availability]")) saveAvailability();
    if (target.matches("[data-export-config]")) exportConfig();
    if (target.matches("[data-export-orders]")) exportOrders();
    if (target.matches("[data-delete-order]")) { saveOrders(orders().filter((order) => order.id !== target.dataset.deleteOrder)); renderAllData(); }
    if (target.matches("[data-clear-completed]")) { const list = orders(); const archived = read("abdelito-admin-orders-archive", []); const finished = list.filter((order) => ["dispatched", "canceled"].includes(order.status)); localStorage.setItem("abdelito-admin-orders-archive", JSON.stringify([...finished, ...archived])); saveOrders(list.filter((order) => !["dispatched", "canceled"].includes(order.status))); renderAllData(); toast("Pedidos finalizados archivados"); }
  });
  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-order-status]")) return;
    const list = orders();
    const order = list.find((item) => item.id === event.target.dataset.orderStatus);
    if (order) order.status = event.target.value;
    saveOrders(list);
    renderAllData();
  });
  document.querySelector("[data-order-form]").addEventListener("submit", registerOrder);

  setupLock();
  renderProductOptions();
  renderAvailability();
  renderService();
  renderDraft();
  renderAllData();
})();
