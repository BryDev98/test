(function () {
  const config = window.ABDELITO_CONFIG || {};
  const localOps = readStorage("abdelito-ops", {});
  const service = { ...(config.service || {}), ...(localOps.service || {}) };
  const availability = { ...(config.availability || {}), ...(localOps.availability || {}) };
  const analyticsConfig = config.analytics || {};
  const paymentConfig = config.payments || {};

  const bundles = [
    {
      id: "familiar-imperial",
      name: "Combo Familiar Imperial",
      tag: "Para compartir",
      description: "Una selección completa para resolver la mesa familiar en pocos clics.",
      items: [
        ["arroz-imperial-familiar", 1],
        ["croquetas-jamon", 1],
        ["flan-abuela", 2],
      ],
    },
    {
      id: "cubanazo",
      name: "Combo Cubanazo",
      tag: "Mesa completa",
      description: "Dos platos fuertes, acompañamiento crujiente y postre para cerrar arriba.",
      items: [
        ["ropa-vieja", 1],
        ["lechon-asado", 1],
        ["tostones", 1],
        ["arroz-leche", 2],
      ],
    },
    {
      id: "antojo-criollo",
      name: "Combo Antojo Criollo",
      tag: "Entrada + fondo",
      description: "Una entrada cubana, un plato fuerte y un dulce casero en una sola jugada.",
      items: [
        ["tamal-criollo", 1],
        ["pollo-guajiro", 1],
        ["torrija-cubana", 1],
      ],
    },
  ];

  function productStatus(product) {
    return availability[product.id] || (product.available ? "available" : "soldout");
  }

  function statusMeta(status) {
    if (status === "soldout") return { label: "Agotado hoy", className: "is-soldout" };
    if (status === "preorder") return { label: "Solo por encargo", className: "is-preorder" };
    return { label: "Disponible", className: "is-available" };
  }

  function safeText(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function bundleTotal(bundle) {
    return bundle.items.reduce((sum, [id, quantity]) => {
      const product = productById(id);
      return sum + (product ? product.price * quantity : 0);
    }, 0);
  }

  function bundleAvailable(bundle) {
    return bundle.items.every(([id]) => productStatus(productById(id)) !== "soldout");
  }

  const originalAddToCart = addToCart;
  addToCart = function enhancedAddToCart(id, quantity = 1) {
    const product = productById(id);
    if (!product || productStatus(product) === "soldout") {
      showToast("Este plato está agotado por ahora");
      return;
    }
    originalAddToCart(id, quantity);
    track("add_to_cart", { item_id: id, item_name: product.name, value: product.price * quantity });
  };

  productCard = function enhancedProductCard(product) {
    const qty = cardQuantities[product.id] || 1;
    const status = productStatus(product);
    const meta = statusMeta(status);
    const unavailable = status === "soldout";
    const action = unavailable ? "Agotado" : status === "preorder" ? "Encargar" : "Agregar";
    return `
      <article class="product-card ${meta.className}" data-category="${safeText(product.category)}" data-product-id="${safeText(product.id)}">
        <div class="dish-art has-photo" data-icon="${safeText(product.icon)}">
          ${photo(product, "menu-photo")}
          <span class="category-chip">${safeText(product.category)}</span>
          <span class="availability-chip ${meta.className}">${meta.label}</span>
        </div>
        <div class="product-content">
          <h3>${safeText(product.name)}</h3>
          <p>${safeText(product.description)}</p>
          <div class="product-bottom">
            <div>
              <span class="price">${money(product.price)}</span>
              <div class="qty-control" aria-label="Cantidad de ${safeText(product.name)}">
                <button type="button" data-card-minus="${product.id}" aria-label="Restar uno" ${unavailable ? "disabled" : ""}>−</button>
                <output data-card-qty="${product.id}">${qty}</output>
                <button type="button" data-card-plus="${product.id}" aria-label="Sumar uno" ${unavailable ? "disabled" : ""}>+</button>
              </div>
            </div>
            <button class="add-product" type="button" data-add-product="${product.id}" ${unavailable ? "disabled" : ""}>${action}</button>
          </div>
        </div>
      </article>`;
  };

  favoriteCard = function enhancedFavoriteCard(product) {
    const status = productStatus(product);
    const unavailable = status === "soldout";
    return `
      <article class="favorite-card ${unavailable ? "is-soldout" : ""}">
        <div class="favorite-art has-photo" data-icon="${safeText(product.icon)}">${photo(product, "favorite-photo")}</div>
        <div class="favorite-content">
          <p class="eyebrow">${safeText(product.category)} · ${statusMeta(status).label}</p>
          <h3>${safeText(product.name)}</h3>
          <p>${safeText(product.description)}</p>
          <div class="card-row">
            <span class="price">${money(product.price)}</span>
            <button class="small-add" type="button" data-quick-add="${product.id}" ${unavailable ? "disabled" : ""}>${unavailable ? "Agotado" : "Agregar +"}</button>
          </div>
        </div>
      </article>`;
  };

  renderMenu = function enhancedRenderMenu() {
    const query = normalizeText(currentSearch);
    const filtered = products.filter((product) => {
      if (currentFilter !== "all" && product.category !== currentFilter) return false;
      if (!query) return true;
      return normalizeText(`${product.name} ${product.description} ${product.category}`).includes(query);
    });
    menuList.innerHTML = filtered.length
      ? filtered.map(productCard).join("")
      : `<div class="menu-empty-state"><span aria-hidden="true">🔎</span><h3>No encontramos ese plato</h3><p>Prueba otra palabra o vuelve a ver toda la carta.</p><button type="button" class="button button-ghost" data-reset-menu>Ver toda la carta</button></div>`;
    if (menuResultCount) menuResultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "opción" : "opciones"}`;
    if (clearSearchButton) clearSearchButton.hidden = !currentSearch;
  };

  function renderBundles() {
    const target = document.querySelector("[data-combo-grid]");
    if (!target) return;
    target.innerHTML = bundles.map((bundle) => {
      const enabled = bundleAvailable(bundle);
      const totalUnits = bundle.items.reduce((sum, [, quantity]) => sum + quantity, 0);
      const itemPhotos = bundle.items.slice(0, 3).map(([id]) => {
        const item = productById(id);
        return item ? `<img src="${safeText(item.image)}" alt="" loading="lazy">` : "";
      }).join("");
      const itemLines = bundle.items.map(([id, quantity]) => {
        const item = productById(id);
        return `<li><b>${quantity}×</b><span>${safeText(item?.name || id)}</span></li>`;
      }).join("");
      return `<article class="combo-card">
        <div class="combo-media">
          <div class="combo-photo-stack">${itemPhotos}</div>
          <span class="combo-tag">${safeText(bundle.tag)}</span>
        </div>
        <div class="combo-content">
          <div class="combo-card-top">
            <div><span class="combo-kicker">Combo Abdelito</span><h3>${safeText(bundle.name)}</h3></div>
            <span class="combo-count">${totalUnits} ${totalUnits === 1 ? "producto" : "productos"}</span>
          </div>
          <p class="combo-description">${safeText(bundle.description)}</p>
          <div class="combo-includes"><strong>Esto incluye</strong><span>Todo se agrega al carrito</span></div>
          <ul class="combo-items">${itemLines}</ul>
          <div class="combo-bottom"><span class="combo-price"><small>Precio total</small><strong>${money(bundleTotal(bundle))}</strong></span><button class="combo-add" type="button" data-add-bundle="${bundle.id}" ${enabled ? "" : "disabled"}>${enabled ? "Agregar combo" : "No disponible"}</button></div>
        </div>
      </article>`;
    }).join("");
  }

  function addBundle(bundleId) {
    const bundle = bundles.find((item) => item.id === bundleId);
    if (!bundle || !bundleAvailable(bundle)) return;
    bundle.items.forEach(([id, quantity]) => { cart[id] = (cart[id] || 0) + quantity; });
    saveCart();
    renderCart();
    showToast(`${bundle.name} agregado`);
    track("add_bundle", { bundle_id: bundle.id, value: bundleTotal(bundle) });
  }

  function recommendationCandidates() {
    const entries = cartEntries();
    if (!entries.length) return [];
    const categories = new Set(entries.map(({ product }) => product.category));
    const ordered = [];
    if (!categories.has("Entrantes")) ordered.push("croquetas-jamon", "tamal-criollo");
    if (!categories.has("Porciones extras")) ordered.push("tostones", "platano-maduro", "arroz-congris");
    if (!categories.has("Postres")) ordered.push("flan-abuela", "arroz-leche");
    return [...new Set(ordered)]
      .map(productById)
      .filter((product) => product && !cart[product.id] && productStatus(product) !== "soldout")
      .slice(0, 3);
  }

  function renderUpsell() {
    const shell = document.querySelector("[data-cart-upsell]");
    const list = document.querySelector("[data-upsell-list]");
    if (!shell || !list) return;
    const candidates = recommendationCandidates();
    shell.hidden = !candidates.length;
    list.innerHTML = candidates.map((product) => `
      <button class="upsell-item" type="button" data-upsell="${product.id}">
        <img src="${product.image}" alt="" loading="lazy"><span><strong>${safeText(product.name)}</strong><span>Agregar · ${money(product.price)}</span></span>
      </button>`).join("");
  }

  const originalRenderCart = renderCart;
  renderCart = function enhancedRenderCart() {
    originalRenderCart();
    renderUpsell();
  };

  function renderService() {
    const strip = document.querySelector("[data-service-strip]");
    const status = document.querySelector("[data-service-status]");
    const hours = document.querySelector("[data-service-hours]");
    const isClosed = service.mode === "closed";
    if (strip) strip.classList.toggle("is-closed", isClosed);
    if (status) status.textContent = isClosed ? service.closedLabel || "Pedidos programados" : service.openLabel || "Cocina recibiendo pedidos";
    if (hours) hours.textContent = service.hoursLabel || "Horario se confirma por WhatsApp";
  }

  function enabledPayments() {
    return Object.entries(paymentConfig).filter(([, value]) => value?.enabled !== false);
  }

  function renderPayments() {
    const target = document.querySelector("[data-payment-options]");
    if (!target) return;
    target.innerHTML = enabledPayments().map(([id, payment], index) => `
      <label class="payment-option"><input type="radio" name="payment" value="${id}" ${index === 0 ? "checked" : ""}><span>${safeText(payment.label || id)}</span></label>`).join("");
  }

  function orderCode() {
    const stamp = Date.now().toString(36).slice(-4).toUpperCase();
    const random = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `AC-${stamp}${random}`;
  }

  function persistCustomerOrder(order) {
    const orders = readStorage("abdelito-customer-orders", []);
    orders.unshift(order);
    localStorage.setItem("abdelito-customer-orders", JSON.stringify(orders.slice(0, 20)));
  }

  function openConfirmation(code, whatsappUrl, paymentLabel) {
    const modal = document.querySelector("[data-order-confirmation]");
    if (!modal) return;
    modal.querySelector("[data-order-code]").textContent = code;
    modal.querySelector("[data-confirmation-payment]").textContent = paymentLabel;
    const receipt = modal.querySelector("[data-send-receipt]");
    receipt.href = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hola Abdelito, envío el comprobante del pedido ${code}.`)}`;
    receipt.dataset.orderUrl = whatsappUrl;
    modal.hidden = false;
  }

  sendOrder = function enhancedSendOrder() {
    const entries = cartEntries();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const method = String(data.get("method") || "Delivery");
    const address = String(data.get("address") || "").trim();
    const schedule = String(data.get("schedule") || "Lo antes posible").trim();
    const notes = String(data.get("notes") || "").trim();
    const paymentId = String(data.get("payment") || "yape");
    const paymentLabel = paymentConfig[paymentId]?.label || paymentId;

    if (!entries.length) {
      formError.textContent = "Agrega al menos un producto antes de enviar el pedido.";
      return;
    }
    if (!name || (method === "Delivery" && !address)) {
      formError.textContent = method === "Delivery" ? "Completa tu nombre y distrito/dirección." : "Completa tu nombre.";
      (!name ? form.elements.name : form.elements.address).focus();
      return;
    }
    if (service.mode === "closed" && schedule === "Lo antes posible") {
      formError.textContent = "La cocina está recibiendo pedidos programados. Elige otro horario o coordina por WhatsApp.";
      form.elements.schedule.focus();
      return;
    }

    const code = orderCode();
    const total = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const lines = entries.map(({ product, quantity }) => {
      const preorder = productStatus(product) === "preorder" ? " · por encargo" : "";
      return `• ${quantity}× ${product.name}${preorder} — ${money(product.price * quantity)}`;
    });
    const message = [
      `Hola Abdelito 👋 Quiero confirmar el pedido ${code}:`,
      "",
      ...lines,
      "",
      `Subtotal: ${money(total)}`,
      `Modalidad: ${method}`,
      method === "Delivery" ? "Delivery: pendiente de confirmar según zona" : "Recojo: punto y hora pendientes de confirmar",
      `Pago preferido: ${paymentLabel}`,
      "",
      `Nombre: ${name}`,
      method === "Delivery" ? `Distrito/dirección: ${address}` : "Dirección: no aplica — recojo",
      `Horario preferido: ${schedule}`,
      `Observaciones: ${notes || "Sin observaciones"}`,
      "",
      "¿Me confirman disponibilidad, total final, horario y datos de pago?",
    ].join("\n");
    const whatsappUrl = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
    const order = { code, createdAt: new Date().toISOString(), name, method, address, schedule, notes, payment: paymentLabel, total, status: "draft", items: entries.map(({ product, quantity }) => ({ id: product.id, name: product.name, quantity, price: product.price })) };
    persistCustomerOrder(order);
    track("generate_lead", { order_id: code, value: total, payment_type: paymentId, fulfillment: method });
    window.open(whatsappUrl, "_blank", "noopener");
    openConfirmation(code, whatsappUrl, paymentLabel);
  };

  function analyticsLog() {
    return readStorage("abdelito-analytics-local", []);
  }

  function track(name, params = {}) {
    const events = analyticsLog();
    events.push({ name, params, at: new Date().toISOString(), path: location.pathname });
    localStorage.setItem("abdelito-analytics-local", JSON.stringify(events.slice(-500)));
    if (localStorage.getItem("abdelito-consent") !== "accepted") return;
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    if (typeof window.fbq === "function") window.fbq("trackCustom", name, params);
    if (window.ttq?.track) window.ttq.track(name, params);
  }

  function loadAnalytics() {
    const ga4 = analyticsConfig.ga4Id;
    if (ga4 && !document.querySelector("script[data-ga4]")) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.ga4 = "true";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ga4, { anonymize_ip: true });
    }
    const meta = analyticsConfig.metaPixelId;
    if (meta && !window.fbq) {
      window.fbq = function () { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments); };
      window.fbq.queue = [];
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
      window.fbq("init", meta);
      window.fbq("track", "PageView");
    }
    const tiktok = analyticsConfig.tiktokPixelId;
    if (tiktok && !window.ttq) {
      window.ttq = { _events: [], track: function (name, data) { this._events.push([name, data]); } };
    }
  }

  function renderConsent() {
    const banner = document.querySelector("[data-consent]");
    if (!banner) return;
    const decision = localStorage.getItem("abdelito-consent");
    banner.hidden = Boolean(decision);
    if (decision === "accepted") loadAnalytics();
  }

  function renderTestimonials() {
    const target = document.querySelector("[data-testimonials]");
    if (!target) return;
    const testimonials = Array.isArray(config.testimonials) ? config.testimonials : [];
    if (!testimonials.length) return;
    target.innerHTML = testimonials.map((item) => `<blockquote><p>“${safeText(item.quote)}”</p><footer>${safeText(item.name)}</footer></blockquote>`).join("");
  }

  function saveExtendedCustomerDetails() {
    const previous = readStorage("abdelito-customer", {});
    const next = {
      ...previous,
      method: form.elements.method?.value || "Delivery",
      payment: form.elements.payment?.value || "yape",
    };
    localStorage.setItem("abdelito-customer", JSON.stringify(next));
  }

  function restoreExtendedCustomerDetails() {
    const details = readStorage("abdelito-customer", {});
    if (form.elements.method && details.method) form.elements.method.value = details.method;
    if (details.payment) {
      const option = form.querySelector(`[name="payment"][value="${CSS.escape(details.payment)}"]`);
      if (option) option.checked = true;
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.matches("[data-add-bundle]")) addBundle(target.dataset.addBundle);
    if (target.matches("[data-upsell]")) addToCart(target.dataset.upsell, 1);
    if (target.matches("[data-consent-accept]")) {
      localStorage.setItem("abdelito-consent", "accepted");
      document.querySelector("[data-consent]").hidden = true;
      loadAnalytics();
      track("consent_accepted");
    }
    if (target.matches("[data-consent-decline]")) {
      localStorage.setItem("abdelito-consent", "declined");
      document.querySelector("[data-consent]").hidden = true;
    }
    if (target.matches("[data-confirmation-close]")) document.querySelector("[data-order-confirmation]").hidden = true;
    if (target.matches("[data-send-receipt]")) track("receipt_chat_opened", { order_id: document.querySelector("[data-order-code]")?.textContent });
    if (target.matches(".filter")) track("filter_menu", { filter: target.dataset.filter });
    if (target.matches("[data-open-cart]")) track("begin_checkout", { items: cartEntries().length });
  });

  form.addEventListener("change", (event) => {
    saveExtendedCustomerDetails();
    if (event.target.name === "payment") track("select_payment", { payment_type: event.target.value });
  });
  menuSearch?.addEventListener("search", () => track("search", { search_term: menuSearch.value }));
  menuSearch?.addEventListener("change", () => { if (menuSearch.value) track("search", { search_term: menuSearch.value }); });

  renderService();
  renderPayments();
  restoreExtendedCustomerDetails();
  renderBundles();
  renderFavorites();
  renderMenu();
  renderCart();
  renderConsent();
  renderTestimonials();
  track("page_view");
})();
