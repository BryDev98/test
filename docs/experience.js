(function () {
  const config = window.ABDELITO_CONFIG || {};
  const deliveryConfig = config.delivery || { districts: [] };
  const detailsConfig = config.productDetails || {};
  const serviceConfig = config.service || {};
  const districtList = Array.isArray(deliveryConfig.districts) ? deliveryConfig.districts : [];
  const bundlePrices = new Map((config.bundles || []).map((bundle) => [bundle.id, bundle]));

  const bundleCatalog = [
    { id: "familiar-imperial", name: "Combo Familiar Imperial", tag: "Para compartir", description: "Arroz Imperial familiar, entrada y dos postres para resolver la mesa.", items: [["arroz-imperial-familiar", 1], ["croquetas-jamon", 1], ["flan-abuela", 2]] },
    { id: "cubanazo", name: "Combo Cubanazo", tag: "Mesa completa", description: "Dos platos fuertes, acompañamiento crujiente y dos postres.", items: [["ropa-vieja", 1], ["lechon-asado", 1], ["tostones", 1], ["arroz-leche", 2]] },
    { id: "antojo-criollo", name: "Combo Antojo Criollo", tag: "Entrada + fondo", description: "Entrada cubana, plato fuerte y dulce casero en una sola jugada.", items: [["tamal-criollo", 1], ["pollo-rostizado", 1], ["torrija-cubana", 1]] },
  ].map((bundle) => ({ ...bundle, ...(bundlePrices.get(bundle.id) || {}) }));

  let bundleClaims = readStorage("abdelito-bundle-claims", {});
  let productNotes = readStorage("abdelito-product-notes", {});
  let detailProductId = null;
  let detailReturnFocus = null;

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  function statusOf(product) {
    return config.availability?.[product.id] || (product.available ? "available" : "soldout");
  }

  function statusInfo(status) {
    if (status === "soldout") return { label: "Agotado hoy", className: "is-soldout" };
    if (status === "preorder") return { label: "Solo por encargo", className: "is-preorder" };
    return { label: "Disponible", className: "is-available" };
  }

  function productDetails(product) {
    return {
      serves: "1 persona",
      portion: "Porción individual",
      prep: "Confirmar al pedir",
      includes: [product.description],
      allergens: [],
      options: "Escribe cualquier ajuste antes de agregarlo.",
      ...(detailsConfig[product.id] || {}),
    };
  }

  productCard = function experienceProductCard(product) {
    const qty = cardQuantities[product.id] || 1;
    const status = statusOf(product);
    const meta = statusInfo(status);
    const details = productDetails(product);
    const unavailable = status === "soldout";
    return `
      <article class="product-card ${meta.className}" data-category="${esc(product.category)}" data-product-id="${esc(product.id)}">
        <div class="dish-art has-photo" data-open-product="${esc(product.id)}">
          ${iconMarkup("chef", "dish-fallback")}${photo(product, "menu-photo", false, product.name)}
          <span class="category-chip">${esc(product.category)}</span><span class="availability-chip ${meta.className}">${meta.label}</span>
        </div>
        <div class="product-content">
          <h3>${esc(product.name)}</h3><p>${esc(product.description)}</p>
          <div class="product-meta-row"><span>${esc(details.serves)}</span><span>${esc(details.portion)}</span></div>
          <button class="product-more" type="button" data-open-product="${esc(product.id)}">Ver detalles, ingredientes y alérgenos</button>
          <div class="product-bottom"><div><span class="price">${money(product.price)}</span><div class="qty-control" aria-label="Cantidad de ${esc(product.name)}"><button type="button" data-card-minus="${product.id}" aria-label="Restar una unidad" ${unavailable ? "disabled" : ""}>−</button><output data-card-qty="${product.id}" aria-live="polite">${qty}</output><button type="button" data-card-plus="${product.id}" aria-label="Sumar una unidad" ${unavailable ? "disabled" : ""}>+</button></div></div><button class="add-product" type="button" data-add-product="${product.id}" ${unavailable ? "disabled" : ""}>${unavailable ? "Agotado" : status === "preorder" ? "Encargar" : "Agregar"}</button></div>
        </div>
      </article>`;
  };

  favoriteCard = function experienceFavoriteCard(product) {
    const unavailable = statusOf(product) === "soldout";
    const details = productDetails(product);
    return `<article class="favorite-card ${unavailable ? "is-soldout" : ""}" data-product-id="${esc(product.id)}"><div class="favorite-art has-photo" data-open-product="${esc(product.id)}">${iconMarkup("chef", "dish-fallback")}${photo(product, "favorite-photo", false, product.name)}</div><div class="favorite-content"><p class="eyebrow">${esc(product.category)} · ${statusInfo(statusOf(product)).label}</p><h3>${esc(product.name)}</h3><p>${esc(product.description)}</p><div class="product-meta-row"><span>${esc(details.serves)}</span><span>${esc(details.portion)}</span></div><button class="product-more" type="button" data-open-product="${esc(product.id)}">Ver ficha completa</button><div class="card-row"><span class="price">${money(product.price)}</span><button class="small-add" type="button" data-quick-add="${product.id}" ${unavailable ? "disabled" : ""}>${unavailable ? "Agotado" : "Agregar +"}</button></div></div></article>`;
  };

  function bundleRegular(bundle) {
    return bundle.items.reduce((sum, [id, quantity]) => sum + (productById(id)?.price || 0) * quantity, 0);
  }

  function bundlePrice(bundle) {
    return Number(bundle.comboPrice) || bundleRegular(bundle);
  }

  function bundleDiscount(bundle) {
    return Math.max(0, bundleRegular(bundle) - bundlePrice(bundle));
  }

  function bundleAvailable(bundle) {
    return bundle.items.every(([id]) => {
      const product = productById(id);
      return product && statusOf(product) !== "soldout";
    });
  }

  function renderExperienceBundles() {
    const target = document.querySelector("[data-combo-grid]");
    if (!target) return;
    target.innerHTML = bundleCatalog.map((bundle) => {
      const enabled = bundleAvailable(bundle);
      const regular = bundleRegular(bundle);
      const combo = bundlePrice(bundle);
      const saving = bundleDiscount(bundle);
      const totalUnits = bundle.items.reduce((sum, [, quantity]) => sum + quantity, 0);
      const photos = bundle.items.slice(0, 3).map(([id]) => `<img src="${esc(productById(id)?.image || "")}" alt="" loading="lazy">`).join("");
      const lines = bundle.items.map(([id, quantity]) => `<li><b>${quantity}×</b><span>${esc(productById(id)?.name || id)}</span></li>`).join("");
      return `<article class="combo-card"><div class="combo-media"><div class="combo-photo-stack">${photos}</div><span class="combo-tag">${esc(bundle.tag)}</span></div><div class="combo-content"><div class="combo-card-top"><div><span class="combo-kicker">Combo Abdelito</span><h3>${esc(bundle.name)}</h3></div><span class="combo-count">${totalUnits} productos</span></div><p class="combo-description">${esc(bundle.description)}</p><span class="combo-serves">Rinde para ${esc(bundle.serves || "compartir")}</span><div class="combo-includes"><strong>Esto incluye</strong><span>Todo se agrega al carrito</span></div><ul class="combo-items">${lines}</ul><div class="combo-bottom"><span class="combo-price"><small>Precio combo</small><strong>${money(combo)}</strong><span class="combo-regular">Regular: <s>${money(regular)}</s></span>${saving ? `<span class="combo-savings">Ahorras ${money(saving)}</span>` : ""}</span><button class="combo-add" type="button" data-add-bundle="${bundle.id}" ${enabled ? "" : "disabled"}>${enabled ? "Agregar combo" : "No disponible"}</button></div></div></article>`;
    }).join("");
  }

  function saveClaims() {
    localStorage.setItem("abdelito-bundle-claims", JSON.stringify(bundleClaims));
  }

  function reconcileClaims() {
    const remaining = { ...cart };
    const next = {};
    bundleCatalog.forEach((bundle) => {
      const requested = Math.max(0, Number(bundleClaims[bundle.id]) || 0);
      if (!requested) return;
      const possible = Math.min(...bundle.items.map(([id, quantity]) => Math.floor((remaining[id] || 0) / quantity)));
      const accepted = Math.min(requested, Math.max(0, possible));
      if (!accepted) return;
      next[bundle.id] = accepted;
      bundle.items.forEach(([id, quantity]) => { remaining[id] -= quantity * accepted; });
    });
    if (JSON.stringify(next) !== JSON.stringify(bundleClaims)) {
      bundleClaims = next;
      saveClaims();
    }
  }

  function discountTotal() {
    return bundleCatalog.reduce((sum, bundle) => sum + bundleDiscount(bundle) * (Number(bundleClaims[bundle.id]) || 0), 0);
  }

  function selectedDistrict() {
    const id = form.elements.district?.value || "";
    return districtList.find((district) => district.id === id) || null;
  }

  function currentPricing() {
    const productsTotal = cartEntries().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = discountTotal();
    const subtotalAfterDiscount = Math.max(0, productsTotal - discount);
    const method = form.elements.method?.value || "Delivery";
    const district = selectedDistrict();
    const deliveryFee = method === "Recojo" ? 0 : district && Number.isFinite(Number(district.fee)) ? Number(district.fee) : null;
    return { productsTotal, discount, subtotalAfterDiscount, deliveryFee, total: subtotalAfterDiscount + (deliveryFee || 0), method, district };
  }

  const baseRenderCart = renderCart;
  renderCart = function experienceRenderCart() {
    baseRenderCart();
    reconcileClaims();
    const pricing = currentPricing();
    const entries = cartEntries();
    entries.forEach(({ product }, index) => {
      const note = String(productNotes[product.id] || "").trim();
      const line = cartItems.children[index];
      if (note && line) line.querySelector(".cart-line-meta")?.insertAdjacentHTML("afterend", `<small class="cart-line-note">Nota: ${esc(note)}</small>`);
    });
    bundleCatalog.forEach((bundle) => {
      const count = Number(bundleClaims[bundle.id]) || 0;
      if (!count || !bundleDiscount(bundle)) return;
      cartItems.insertAdjacentHTML("beforeend", `<div class="cart-discount-line"><span>Ahorro ${esc(bundle.name)}${count > 1 ? ` × ${count}` : ""}</span><span>− ${money(bundleDiscount(bundle) * count)}</span></div>`);
    });
    updatePricingUI(pricing);
  };

  function updatePricingUI(pricing = currentPricing()) {
    document.querySelector("[data-subtotal]").textContent = money(pricing.productsTotal);
    const savingsRow = document.querySelector("[data-savings-row]");
    savingsRow.hidden = pricing.discount <= 0;
    document.querySelector("[data-savings-total]").textContent = `− ${money(pricing.discount)}`;
    const deliveryLabel = pricing.method === "Recojo" ? "Sin costo" : pricing.deliveryFee === null ? "Selecciona distrito" : money(pricing.deliveryFee);
    document.querySelector("[data-delivery-total]").textContent = deliveryLabel;
    document.querySelector("[data-grand-total]").textContent = pricing.deliveryFee === null ? `${money(pricing.subtotalAfterDiscount)} + delivery` : money(pricing.total);
    document.querySelector("[data-live-products]").textContent = money(pricing.productsTotal);
    document.querySelector("[data-live-discount]").textContent = pricing.discount ? `− ${money(pricing.discount)}` : "—";
    document.querySelector("[data-live-delivery]").textContent = deliveryLabel;
    document.querySelector("[data-live-total]").textContent = pricing.deliveryFee === null ? `${money(pricing.subtotalAfterDiscount)} + delivery` : money(pricing.total);
    const sendLabel = document.querySelector("[data-send-order-label]");
    sendLabel.textContent = pricing.deliveryFee === null ? `Enviar pedido · ${money(pricing.subtotalAfterDiscount)} + delivery` : `Enviar pedido · ${money(pricing.total)}`;
    if (mobileCartTotal) mobileCartTotal.textContent = money(pricing.subtotalAfterDiscount);
  }

  function populateDistricts() {
    const options = districtList.map((district) => `<option value="${esc(district.id)}">${esc(district.name)}</option>`).join("");
    [form.elements.district, document.querySelector("[data-delivery-preview]")].forEach((select) => {
      if (select) select.insertAdjacentHTML("beforeend", options);
    });
  }

  function districtQuote(district) {
    if (!district) return { price: "Selecciona una zona", detail: "El monto final se confirma al validar la dirección." };
    if (!Number.isFinite(Number(district.fee))) return { price: "Cotización por WhatsApp", detail: `Tiempo estimado: ${district.eta || "por confirmar"}.` };
    return { price: `Desde ${money(Number(district.fee))}`, detail: `Tiempo estimado: ${district.eta}. ${deliveryConfig.disclaimer || "Costo final sujeto a confirmación."}` };
  }

  function updateDeliveryPreview() {
    const select = document.querySelector("[data-delivery-preview]");
    const result = document.querySelector("[data-delivery-preview-result]");
    if (!select || !result) return;
    const quote = districtQuote(districtList.find((district) => district.id === select.value));
    result.querySelector("strong").textContent = quote.price;
    result.querySelector("small").textContent = quote.detail;
  }

  function updateFulfillment() {
    const isDelivery = form.elements.method.value === "Delivery";
    const fields = document.querySelector("[data-delivery-fields]");
    fields.hidden = !isDelivery;
    form.elements.district.required = isDelivery;
    form.elements.address.required = isDelivery;
    const district = selectedDistrict();
    const help = document.querySelector("[data-district-help]");
    if (help) {
      const quote = districtQuote(district);
      help.textContent = district ? `${quote.price} · ${quote.detail}` : "Te mostraremos el costo estimado antes de enviar.";
      help.classList.toggle("is-quote", Boolean(district));
    }
    updatePricingUI();
  }

  function limaNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: serviceConfig.timezone || "America/Lima" }));
  }

  function serviceState() {
    if (serviceConfig.mode === "open") return { open: true, label: serviceConfig.openLabel || "Cocina recibiendo pedidos", detail: serviceConfig.hoursLabel || "Confirma el tiempo por WhatsApp" };
    if (serviceConfig.mode === "closed") return { open: false, label: serviceConfig.closedLabel || "Cocina cerrada", detail: serviceConfig.hoursLabel || "Puedes programar tu pedido" };
    if (serviceConfig.mode !== "auto") return { open: false, scheduled: true, label: serviceConfig.scheduledLabel || "Pedidos programados disponibles", detail: serviceConfig.hoursLabel || "Confirma disponibilidad por WhatsApp" };
    const now = limaNow();
    const hours = serviceConfig.weeklyHours?.[now.getDay()];
    if (!hours?.open || !hours?.close) return { open: false, label: "Cocina cerrada hoy", detail: "Puedes dejar un pedido programado por WhatsApp" };
    const minutes = now.getHours() * 60 + now.getMinutes();
    const toMinutes = (time) => Number(time.split(":")[0]) * 60 + Number(time.split(":")[1]);
    const open = minutes >= toMinutes(hours.open) && minutes < toMinutes(hours.close);
    return { open, label: open ? "Cocina recibiendo pedidos" : "Cocina cerrada ahora", detail: `Horario de hoy: ${hours.open}–${hours.close}` };
  }

  function renderAutomaticService() {
    const state = serviceState();
    const strip = document.querySelector("[data-service-strip]");
    strip?.classList.toggle("is-closed", !state.open);
    document.querySelector("[data-service-status]").textContent = state.label;
    document.querySelector("[data-service-hours]").textContent = state.detail;
    const asap = [...form.elements.schedule.options].find((option) => option.value === "Lo antes posible");
    if (asap) asap.disabled = !state.open;
    if (!state.open && form.elements.schedule.value === "Lo antes posible") form.elements.schedule.value = "Coordinar por WhatsApp";
  }

  function openProduct(id) {
    const product = productById(id);
    if (!product) return;
    const details = productDetails(product);
    const modal = document.querySelector("[data-product-detail]");
    detailProductId = id;
    detailReturnFocus = document.activeElement;
    modal.querySelector("[data-product-detail-image]").src = product.image;
    modal.querySelector("[data-product-detail-image]").alt = product.name;
    modal.querySelector("[data-product-detail-category]").textContent = product.category;
    modal.querySelector("[data-product-detail-title]").textContent = product.name;
    modal.querySelector("[data-product-detail-description]").textContent = product.description;
    modal.querySelector("[data-product-detail-portion]").textContent = details.portion;
    modal.querySelector("[data-product-detail-serves]").textContent = details.serves;
    modal.querySelector("[data-product-detail-prep]").textContent = details.prep;
    modal.querySelector("[data-product-detail-includes]").innerHTML = details.includes.map((item) => `<li>${esc(item)}</li>`).join("");
    modal.querySelector("[data-product-detail-allergens]").innerHTML = details.allergens.length ? details.allergens.map((item) => `<span>${esc(item)}</span>`).join("") : '<span class="allergen-none">Sin alérgenos declarados</span>';
    modal.querySelector("[data-product-detail-options]").textContent = details.options;
    modal.querySelector("[data-product-detail-price]").textContent = money(product.price);
    modal.querySelector("[data-product-note]").value = productNotes[id] || "";
    const add = modal.querySelector("[data-detail-add]");
    const soldout = statusOf(product) === "soldout";
    add.disabled = soldout;
    add.textContent = soldout ? "Agotado hoy" : "Agregar al pedido";
    modal.hidden = false;
    document.body.classList.add("cart-open");
    window.setTimeout(() => modal.querySelector("[data-close-product]").focus(), 20);
  }

  function closeProduct() {
    const modal = document.querySelector("[data-product-detail]");
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("cart-open");
    detailProductId = null;
    if (detailReturnFocus && document.contains(detailReturnFocus)) detailReturnFocus.focus();
  }

  function persistOrder(order) {
    const orders = readStorage("abdelito-customer-orders", []);
    orders.unshift(order);
    localStorage.setItem("abdelito-customer-orders", JSON.stringify(orders.slice(0, 20)));
  }

  function showConfirmation(code, paymentLabel) {
    const modal = document.querySelector("[data-order-confirmation]");
    modal.querySelector("[data-order-code]").textContent = code;
    modal.querySelector("[data-confirmation-payment]").textContent = paymentLabel;
    modal.querySelector("[data-send-receipt]").href = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hola Abdelito, envío el comprobante del pedido ${code}.`)}`;
    modal.hidden = false;
    window.setTimeout(() => modal.querySelector("[data-send-receipt]").focus(), 20);
  }

  function orderCode() {
    return `AC-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  }

  sendOrder = function experienceSendOrder() {
    const entries = cartEntries();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const method = String(data.get("method") || "Delivery");
    const district = selectedDistrict();
    const address = String(data.get("address") || "").trim();
    const schedule = String(data.get("schedule") || "Coordinar por WhatsApp").trim();
    const notes = String(data.get("notes") || "").trim();
    const paymentId = String(data.get("payment") || "yape");
    const paymentLabel = config.payments?.[paymentId]?.label || paymentId;
    if (!entries.length) return void (formError.textContent = "Agrega al menos un producto antes de enviar el pedido.");
    if (!name) { formError.textContent = "Completa tu nombre."; form.elements.name.focus(); return; }
    if (method === "Delivery" && !district) { formError.textContent = "Selecciona el distrito de entrega."; form.elements.district.focus(); return; }
    if (method === "Delivery" && !address) { formError.textContent = "Completa la dirección y una referencia."; form.elements.address.focus(); return; }
    if (!serviceState().open && schedule === "Lo antes posible") { formError.textContent = "En este momento solo recibimos pedidos programados. Elige otra franja."; form.elements.schedule.focus(); return; }
    formError.textContent = "";
    const pricing = currentPricing();
    const code = orderCode();
    const itemLines = entries.map(({ product, quantity }) => {
      const note = String(productNotes[product.id] || "").trim();
      return `• ${quantity}× ${product.name} — ${money(product.price * quantity)}${note ? `\n  ↳ ${note}` : ""}`;
    });
    const discountLines = bundleCatalog.filter((bundle) => bundleClaims[bundle.id]).map((bundle) => `• Ahorro ${bundle.name}${bundleClaims[bundle.id] > 1 ? ` × ${bundleClaims[bundle.id]}` : ""}: −${money(bundleDiscount(bundle) * bundleClaims[bundle.id])}`);
    const deliveryLine = method === "Recojo" ? "Recojo: sin costo de delivery" : pricing.deliveryFee === null ? `Delivery a ${district.name}: por cotizar` : `Delivery estimado a ${district.name}: ${money(pricing.deliveryFee)}`;
    const finalLine = pricing.deliveryFee === null ? `Total parcial: ${money(pricing.subtotalAfterDiscount)} + delivery` : `Total estimado: ${money(pricing.total)}`;
    const message = [`Hola Abdelito 👋 Quiero confirmar el pedido ${code}:`, "", ...itemLines, ...(discountLines.length ? ["", ...discountLines] : []), "", `Productos: ${money(pricing.productsTotal)}`, pricing.discount ? `Ahorro total: −${money(pricing.discount)}` : null, deliveryLine, finalLine, "", `Modalidad: ${method}`, `Pago preferido: ${paymentLabel}`, `Nombre: ${name}`, method === "Delivery" ? `Distrito: ${district.name}` : null, method === "Delivery" ? `Dirección: ${address}` : "Recojo: punto por confirmar", `Horario preferido: ${schedule}`, `Observaciones generales: ${notes || "Sin observaciones"}`, "", "¿Me confirman disponibilidad, total final, hora y datos de pago?"].filter((line) => line !== null).join("\n");
    const whatsappUrl = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
    const order = { code, createdAt: new Date().toISOString(), name, method, district: district?.name || "", address, schedule, notes, payment: paymentLabel, productsTotal: pricing.productsTotal, discount: pricing.discount, deliveryFee: pricing.deliveryFee, total: pricing.total, status: "draft", bundleClaims: { ...bundleClaims }, productNotes: { ...productNotes }, items: entries.map(({ product, quantity }) => ({ id: product.id, name: product.name, quantity, price: product.price })) };
    persistOrder(order);
    renderRecentOrder();
    window.open(whatsappUrl, "_blank", "noopener");
    showConfirmation(code, paymentLabel);
  };

  function renderRecentOrder() {
    const shell = document.querySelector("[data-order-history]");
    const order = readStorage("abdelito-customer-orders", [])[0];
    if (!shell || !order?.items?.length) return;
    const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const date = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", timeZone: "America/Lima" }).format(new Date(order.createdAt));
    shell.querySelector("[data-recent-order-summary]").textContent = `${itemCount} ${itemCount === 1 ? "producto" : "productos"} · ${date} · ${money(order.total || order.productsTotal || 0)}`;
    shell.hidden = false;
  }

  function repeatLastOrder() {
    const order = readStorage("abdelito-customer-orders", [])[0];
    if (!order?.items?.length) return;
    cart = {};
    order.items.forEach((item) => { if (productById(item.id) && statusOf(productById(item.id)) !== "soldout") cart[item.id] = Number(item.quantity) || 1; });
    bundleClaims = { ...(order.bundleClaims || {}) };
    productNotes = { ...productNotes, ...(order.productNotes || {}) };
    saveCart(); saveClaims(); localStorage.setItem("abdelito-product-notes", JSON.stringify(productNotes));
    renderCart(); openCart(); showToast("Pedido anterior recuperado");
  }

  function renderVerifiedReviews() {
    const target = document.querySelector("[data-testimonials]");
    const reviews = (Array.isArray(config.testimonials) ? config.testimonials : []).filter((review) => review.verified === true);
    if (!target || !reviews.length) return;
    target.classList.add("reviews-grid");
    target.innerHTML = reviews.slice(0, 6).map((review) => `<blockquote class="review-card"><span class="review-verified">Compra verificada</span><span class="review-stars" aria-label="${Number(review.rating) || 5} de 5 estrellas">${"★".repeat(Number(review.rating) || 5)}</span><p>“${esc(review.quote)}”</p><footer><strong>${esc(review.name)}</strong><span>${esc(review.dish || "Cliente Abdelito")} · ${esc(review.date || "")}</span></footer></blockquote>`).join("");
  }

  function saveExperienceCustomer() {
    const previous = readStorage("abdelito-customer", {});
    localStorage.setItem("abdelito-customer", JSON.stringify({ ...previous, district: form.elements.district?.value || "" }));
  }

  function restoreExperienceCustomer() {
    const details = readStorage("abdelito-customer", {});
    if (details.district && form.elements.district) form.elements.district.value = details.district;
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, [data-open-product], [data-repeat-order]");
    if (!target) return;
    if (target.matches("[data-open-product]")) openProduct(target.dataset.openProduct);
    if (target.matches("[data-close-product]")) closeProduct();
    if (target.matches("[data-detail-add]") && detailProductId) {
      const note = document.querySelector("[data-product-note]").value.trim();
      if (note) productNotes[detailProductId] = note; else delete productNotes[detailProductId];
      localStorage.setItem("abdelito-product-notes", JSON.stringify(productNotes));
      addToCart(detailProductId, 1); closeProduct(); openCart();
    }
    if (target.matches("[data-add-bundle]")) {
      bundleClaims[target.dataset.addBundle] = (Number(bundleClaims[target.dataset.addBundle]) || 0) + 1;
      saveClaims(); renderCart();
    }
    if (target.matches("[data-repeat-order]")) repeatLastOrder();
  });

  document.querySelector("[data-product-detail]")?.addEventListener("click", (event) => {
    if (event.target.matches("[data-product-detail]")) closeProduct();
  });
  document.querySelector("[data-product-note]")?.addEventListener("input", (event) => {
    if (!detailProductId) return;
    const note = event.target.value.trim();
    if (note) productNotes[detailProductId] = note; else delete productNotes[detailProductId];
    localStorage.setItem("abdelito-product-notes", JSON.stringify(productNotes));
  });
  form.addEventListener("change", (event) => {
    if (["method", "district"].includes(event.target.name)) { updateFulfillment(); saveExperienceCustomer(); }
  });
  document.querySelector("[data-delivery-preview]")?.addEventListener("change", updateDeliveryPreview);

  document.addEventListener("keydown", (event) => {
    const modal = document.querySelector("[data-product-detail]");
    if (!modal || modal.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); closeProduct(); return; }
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]), textarea, [href], [tabindex]:not([tabindex="-1"])')].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  populateDistricts();
  restoreExperienceCustomer();
  renderAutomaticService();
  updateFulfillment();
  renderExperienceBundles();
  renderFavorites();
  renderMenu();
  renderCart();
  renderRecentOrder();
  renderVerifiedReviews();
  window.setInterval(renderAutomaticService, 60000);
})();
