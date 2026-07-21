const mediaStyles = document.createElement("link");
mediaStyles.rel = "stylesheet";
mediaStyles.href = "./media.css";
document.head.appendChild(mediaStyles);

const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/svg+xml";
favicon.href = "./assets/logo-header.svg";
document.head.appendChild(favicon);

const BUSINESS = {
  whatsapp: "51973604660",
  currency: "S/",
};

const DISH_PATH = "./assets/dishes/";

const products = [
  {
    id: "croquetas-jamon",
    name: "Croquetas de Jamón de la Abuela",
    category: "Entrantes",
    price: 12.9,
    description: "Seis croquetas caseras de jamón, crujientes por fuera y cremosas por dentro.",
    image: `${DISH_PATH}croquetas-jamon.webp`,
    icon: "🥖",
    favorite: false,
    available: true,
  },
  {
    id: "ensalada-tropical",
    name: "Ensalada Tropical de la Casa",
    category: "Entrantes",
    price: 10,
    description: "Ensalada fría cubana con pasta, piña, huevo, mayonesa y el sazón especial de la casa.",
    image: `${DISH_PATH}ensalada-tropical.webp`,
    icon: "🥗",
    favorite: false,
    available: true,
  },
  {
    id: "tamal-criollo",
    name: "Tamal Criollo Habanero",
    category: "Entrantes",
    price: 15,
    description: "Masa de maíz bien sazonada, rellena de cerdo criollo y envuelta al estilo tradicional.",
    image: `${DISH_PATH}tamal-criollo.webp`,
    icon: "🫔",
    favorite: false,
    available: true,
  },
  {
    id: "ropa-vieja",
    name: "Ropa Vieja Tradicional",
    category: "Platos fuertes",
    price: 29.9,
    description: "Res deshilachada en sazón cubana con arroz congrí, ensalada y yuca con mojo criollo.",
    image: `${DISH_PATH}ropa-vieja.webp`,
    icon: "🥘",
    favorite: true,
    available: true,
  },
  {
    id: "lechon-asado",
    name: "Lechón Asado a lo Cubano",
    category: "Platos fuertes",
    price: 27,
    description: "Cerdo al horno jugoso con arroz congrí, ensalada y yuca con mojo criollo.",
    image: `${DISH_PATH}lechon-asado.webp`,
    icon: "🍖",
    favorite: true,
    available: true,
  },
  {
    id: "arroz-imperial-personal",
    name: "Arroz Imperial de Abdelito · Personal",
    category: "Platos fuertes",
    price: 25,
    description: "Arroz amarillo por capas con mayonesa, pollo deshilachado, jamón y mozzarella gratinada.",
    image: `${DISH_PATH}arroz-imperial.webp`,
    icon: "🍚",
    favorite: true,
    available: true,
  },
  {
    id: "arroz-imperial-familiar",
    name: "Arroz Imperial de Abdelito · Familiar",
    category: "Platos fuertes",
    price: 45,
    description: "La versión familiar de nuestro arroz por capas con pollo, jamón, mayonesa y queso gratinado.",
    image: `${DISH_PATH}arroz-imperial.webp`,
    icon: "🍚",
    favorite: false,
    available: true,
  },
  {
    id: "lasana-habanera",
    name: "Lasaña Habanera de Carne",
    category: "Platos fuertes",
    price: 20,
    description: "Capas de pasta, carne sazonada al estilo de la casa, salsa roja y abundante queso gratinado.",
    image: `${DISH_PATH}lasana-carne.webp`,
    icon: "🍝",
    favorite: false,
    available: true,
  },
  {
    id: "bistec-malecon",
    name: "Bistec Encebollado del Malecón",
    category: "Platos fuertes",
    price: 27,
    description: "Bistec jugoso con cebolla salteada, arroz congrí, ensalada y yuca con mojo criollo.",
    image: `${DISH_PATH}bistec-encebollado.webp`,
    icon: "🥩",
    favorite: false,
    available: true,
  },
  {
    id: "pollo-guajiro",
    name: "Pollo Rostizado del Guajiro",
    category: "Platos fuertes",
    price: 25,
    description: "Pollo dorado y adobado con sazón de la casa, arroz congrí, ensalada y yuca con mojo.",
    image: `${DISH_PATH}pollo-rostizado.webp`,
    icon: "🍗",
    favorite: false,
    available: true,
  },
  {
    id: "cerdo-cazuela",
    name: "Asado de Cerdo en Cazuela del Fogón",
    category: "Platos fuertes",
    price: 27,
    description: "Cerdo cocinado lentamente en cazuela con sazón cubana, arroz congrí, ensalada y yuca.",
    image: `${DISH_PATH}cerdo-cazuela.webp`,
    icon: "🍲",
    favorite: false,
    available: true,
  },
  {
    id: "flan-abuela",
    name: "Flan de la Abuela",
    category: "Postres",
    price: 7,
    description: "Flan casero suave y cremoso con el dulzor clásico que recuerda a la cocina de casa.",
    image: `${DISH_PATH}flan-abuela.webp`,
    icon: "🍮",
    favorite: false,
    available: true,
  },
  {
    id: "torrija-cubana",
    name: "Torrija Cubana Dorada",
    category: "Postres",
    price: 9,
    description: "Pan suave dorado con canela y dulzor tradicional, perfecto para cerrar con sabor cubano.",
    image: `${DISH_PATH}torrija-cubana.webp`,
    icon: "🍞",
    favorite: false,
    available: true,
  },
  {
    id: "arroz-leche",
    name: "Arroz con Leche y Lluvia de Chocolate",
    category: "Postres",
    price: 10,
    description: "Arroz con leche cremoso, aromatizado con canela y coronado con lluvia de chocolate.",
    image: `${DISH_PATH}arroz-leche.webp`,
    icon: "🍫",
    favorite: false,
    available: true,
  },
  {
    id: "platano-maduro",
    name: "Plátano Maduro Frito",
    category: "Porciones extras",
    price: 6,
    description: "Tajadas de plátano maduro, doradas y caramelizadas al punto.",
    image: `${DISH_PATH}platano-maduro.webp`,
    icon: "🍌",
    favorite: false,
    available: true,
  },
  {
    id: "tostones",
    name: "Tostones Crujientes",
    category: "Porciones extras",
    price: 6,
    description: "Plátano verde frito dos veces, crujiente por fuera y tierno en el centro.",
    image: `${DISH_PATH}tostones.webp`,
    icon: "🟡",
    favorite: false,
    available: true,
  },
  {
    id: "arroz-congris",
    name: "Arroz Congrí",
    category: "Porciones extras",
    price: 8,
    description: "Arroz con frijoles negros y sazón cubana, listo para completar tu plato.",
    image: `${DISH_PATH}arroz-congris.webp`,
    icon: "🍚",
    favorite: false,
    available: true,
  },
];

const menuList = document.querySelector("#menu-list");
const favoritesList = document.querySelector("#favorites-list");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartOverlay = document.querySelector("[data-cart-overlay]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartCount = document.querySelector("[data-cart-count]");
const subtotal = document.querySelector("[data-subtotal]");
const toast = document.querySelector("[data-toast]");
const form = document.querySelector("[data-checkout-form]");
const formError = document.querySelector("[data-form-error]");
const menuSearch = document.querySelector("[data-menu-search]");
const menuResultCount = document.querySelector("[data-menu-result-count]");
const clearSearchButton = document.querySelector("[data-clear-search]");
const mobileCartBar = document.querySelector("[data-mobile-cart]");
const mobileCartCount = document.querySelector("[data-mobile-cart-count]");
const mobileCartTotal = document.querySelector("[data-mobile-cart-total]");

let cart = readStorage("abdelito-cart", {});
const cardQuantities = {};
let currentFilter = "all";
let currentSearch = "";
let lastFocusedElement = null;

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function normalizeText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function money(value) {
  const number = Number(value);
  const decimals = Number.isInteger(number) ? 0 : 2;
  return `${BUSINESS.currency} ${number.toLocaleString("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  })}`;
}

function saveCart() {
  localStorage.setItem("abdelito-cart", JSON.stringify(cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function confirmButton(button) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = "¡Agregado! ✓";
  button.classList.add("is-confirmed");
  button.disabled = true;
  window.setTimeout(() => {
    button.textContent = original;
    button.classList.remove("is-confirmed");
    button.disabled = false;
  }, 900);
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function photo(product, className, eager = false) {
  return `<img class="dish-photo ${className}" src="${product.image}" alt="${product.name}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.parentElement.classList.remove('has-photo');this.remove()">`;
}

function favoriteCard(product) {
  return `
    <article class="favorite-card reveal">
      <div class="favorite-art has-photo" data-icon="${product.icon}">${photo(product, "favorite-photo")}</div>
      <div class="favorite-content">
        <p class="eyebrow">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="card-row">
          <span class="price">${money(product.price)}</span>
          <button class="small-add" type="button" data-quick-add="${product.id}">Agregar +</button>
        </div>
      </div>
    </article>`;
}

function productCard(product) {
  const qty = cardQuantities[product.id] || 1;
  return `
    <article class="product-card" data-category="${product.category}" data-product-id="${product.id}">
      <div class="dish-art has-photo" data-icon="${product.icon}">
        ${photo(product, "menu-photo")}
        <span class="category-chip">${product.category}</span>
      </div>
      <div class="product-content">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <div>
            <span class="price">${money(product.price)}</span>
            <div class="qty-control" aria-label="Cantidad de ${product.name}">
              <button type="button" data-card-minus="${product.id}" aria-label="Restar uno">−</button>
              <output data-card-qty="${product.id}">${qty}</output>
              <button type="button" data-card-plus="${product.id}" aria-label="Sumar uno">+</button>
            </div>
          </div>
          <button class="add-product" type="button" data-add-product="${product.id}">Agregar</button>
        </div>
      </div>
    </article>`;
}

function renderFavorites() {
  favoritesList.innerHTML = products.filter((product) => product.favorite).map(favoriteCard).join("");
}

function renderMenu() {
  const query = normalizeText(currentSearch);
  const filtered = products.filter((product) => {
    if (!product.available) return false;
    if (currentFilter !== "all" && product.category !== currentFilter) return false;
    if (!query) return true;
    return normalizeText(`${product.name} ${product.description} ${product.category}`).includes(query);
  });

  menuList.innerHTML = filtered.length
    ? filtered.map(productCard).join("")
    : `<div class="menu-empty-state">
        <span aria-hidden="true">🔎</span>
        <h3>No encontramos ese plato</h3>
        <p>Prueba otra palabra o vuelve a ver toda la carta.</p>
        <button type="button" class="button button-ghost" data-reset-menu>Ver toda la carta</button>
      </div>`;

  if (menuResultCount) {
    menuResultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "opción" : "opciones"}`;
  }
  if (clearSearchButton) clearSearchButton.hidden = !currentSearch;
}

function addToCart(id, quantity = 1) {
  cart[id] = (cart[id] || 0) + quantity;
  saveCart();
  renderCart();
  showToast(`${productById(id).name} agregado`);
}

function updateCartItem(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function removeCartItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

function cartEntries() {
  return Object.entries(cart)
    .map(([id, quantity]) => ({ product: productById(id), quantity }))
    .filter((entry) => entry.product && entry.quantity > 0);
}

function renderCart() {
  const entries = cartEntries();
  const totalItems = entries.reduce((sum, item) => sum + item.quantity, 0);
  const total = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  subtotal.textContent = money(total);
  if (mobileCartCount) mobileCartCount.textContent = totalItems;
  if (mobileCartTotal) mobileCartTotal.textContent = money(total);
  if (mobileCartBar) mobileCartBar.classList.toggle("has-items", totalItems > 0);
  document.querySelectorAll("[data-clear-cart]").forEach((button) => {
    button.hidden = !entries.length;
  });
  cartEmpty.hidden = entries.length > 0;
  cartItems.innerHTML = entries.map(({ product, quantity }) => `
    <div class="cart-line">
      <div>
        <div class="cart-line-title">${product.name}</div>
        <div class="cart-line-meta">${money(product.price)} × ${quantity}</div>
        <div class="cart-line-actions">
          <button type="button" data-cart-minus="${product.id}" aria-label="Restar ${product.name}">−</button>
          <strong>${quantity}</strong>
          <button type="button" data-cart-plus="${product.id}" aria-label="Sumar ${product.name}">+</button>
          <button type="button" class="remove-line" data-cart-remove="${product.id}">Eliminar</button>
        </div>
      </div>
      <strong>${money(product.price * quantity)}</strong>
    </div>`).join("");
}

function openCart() {
  lastFocusedElement = document.activeElement;
  cartOverlay.hidden = false;
  cartDrawer.inert = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  setTimeout(() => cartDrawer.querySelector("[data-close-cart]").focus(), 50);
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.inert = true;
  document.body.classList.remove("cart-open");
  setTimeout(() => {
    cartOverlay.hidden = true;
    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
  }, 320);
}

function clearCart() {
  if (!cartEntries().length) return;
  cart = {};
  saveCart();
  renderCart();
  showToast("Pedido vaciado");
}

function saveCustomerDetails() {
  const details = {
    name: form.elements.name?.value || "",
    address: form.elements.address?.value || "",
    schedule: form.elements.schedule?.value || "Lo antes posible",
  };
  localStorage.setItem("abdelito-customer", JSON.stringify(details));
}

function restoreCustomerDetails() {
  const details = readStorage("abdelito-customer", {});
  ["name", "address", "schedule"].forEach((field) => {
    if (form.elements[field] && details[field]) form.elements[field].value = details[field];
  });
}

function sendOrder() {
  const entries = cartEntries();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const address = String(data.get("address") || "").trim();
  const schedule = String(data.get("schedule") || "Lo antes posible").trim();
  const notes = String(data.get("notes") || "").trim();

  if (!entries.length) {
    formError.textContent = "Agrega al menos un producto antes de enviar el pedido.";
    return;
  }
  if (!name || !address) {
    formError.textContent = "Completa tu nombre y distrito/dirección.";
    (!name ? form.elements.name : form.elements.address).focus();
    return;
  }

  formError.textContent = "";
  const total = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const lines = entries.map(({ product, quantity }) => `• ${quantity}× ${product.name} — ${money(product.price * quantity)}`);
  const message = [
    "Hola Abdelito 👋 Quiero confirmar este pedido:",
    "",
    ...lines,
    "",
    `Subtotal: ${money(total)}`,
    "Delivery: pendiente de confirmar según zona",
    "",
    `Nombre: ${name}`,
    `Distrito/dirección: ${address}`,
    `Horario preferido: ${schedule}`,
    `Observaciones: ${notes || "Sin observaciones"}`,
    "",
    "¿Me confirman disponibilidad, costo de delivery y tiempo de entrega?",
  ].join("\n");
  window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

function handleClick(event) {
  const target = event.target.closest("button, a");
  if (!target) return;
  if (target.matches("[data-open-cart]")) openCart();
  if (target.matches("[data-close-cart]")) closeCart();
  if (target.matches("[data-quick-add]")) {
    addToCart(target.dataset.quickAdd, 1);
    confirmButton(target);
  }
  if (target.matches("[data-card-minus]")) {
    const id = target.dataset.cardMinus;
    cardQuantities[id] = Math.max(1, (cardQuantities[id] || 1) - 1);
    document.querySelector(`[data-card-qty="${id}"]`).textContent = cardQuantities[id];
  }
  if (target.matches("[data-card-plus]")) {
    const id = target.dataset.cardPlus;
    cardQuantities[id] = Math.min(20, (cardQuantities[id] || 1) + 1);
    document.querySelector(`[data-card-qty="${id}"]`).textContent = cardQuantities[id];
  }
  if (target.matches("[data-add-product]")) {
    const id = target.dataset.addProduct;
    addToCart(id, cardQuantities[id] || 1);
    cardQuantities[id] = 1;
    const output = document.querySelector(`[data-card-qty="${id}"]`);
    if (output) output.textContent = "1";
    confirmButton(target);
  }
  if (target.matches("[data-cart-minus]")) updateCartItem(target.dataset.cartMinus, -1);
  if (target.matches("[data-cart-plus]")) updateCartItem(target.dataset.cartPlus, 1);
  if (target.matches("[data-cart-remove]")) removeCartItem(target.dataset.cartRemove);
  if (target.matches("[data-clear-cart]")) clearCart();
  if (target.matches("[data-send-order]")) sendOrder();
  if (target.matches("[data-clear-search]")) {
    currentSearch = "";
    menuSearch.value = "";
    menuSearch.focus();
    renderMenu();
  }
  if (target.matches("[data-reset-menu]")) {
    currentFilter = "all";
    currentSearch = "";
    if (menuSearch) menuSearch.value = "";
    document.querySelectorAll(".filter").forEach((button) => {
      const active = button.dataset.filter === "all";
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderMenu();
  }
  if (target.matches(".filter")) {
    currentFilter = target.dataset.filter;
    document.querySelectorAll(".filter").forEach((button) => {
      const active = button === target;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderMenu();
  }
  if (target.matches(".menu-toggle")) {
    const nav = document.querySelector("#main-nav");
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    target.setAttribute("aria-expanded", String(open));
  }
  if (target.matches(".main-nav a")) {
    document.querySelector("#main-nav").classList.remove("open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  }
}

function installPhotoStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .favorite-art.has-photo::before,.favorite-art.has-photo::after,
    .dish-art.has-photo::before,.dish-art.has-photo::after,
    .hero-dish.has-photo::before,.hero-dish.has-photo::after{display:none}
    .dish-photo{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
    .favorite-art .dish-photo,.dish-art .dish-photo{transition:transform .45s ease}
    .favorite-card:hover .dish-photo,.product-card:hover .dish-photo{transform:scale(1.035)}
    .category-chip{z-index:2}
  `;
  document.head.appendChild(style);
}

function applyBrandMedia() {
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.classList.add("brand-with-logo");
    brand.innerHTML = '<img class="brand-logo" src="./assets/logo-header.svg" alt="Abdelito Cocina Cubana">';
  });

  const heroDish = document.querySelector(".hero-dish");
  const heroProduct = productById("arroz-imperial-personal");
  if (heroDish) {
    heroDish.classList.add("has-photo");
    heroDish.innerHTML = photo(heroProduct, "hero-photo", true);
  }

  const heroLabel = document.querySelector(".hero-card-label");
  if (heroLabel) heroLabel.textContent = "Favorito de la casa";

  const heroInfo = document.querySelector(".hero-card-info");
  if (heroInfo) {
    heroInfo.innerHTML = `
      <div>
        <strong>Arroz Imperial</strong>
        <small>Capas de puro sabor cubano</small>
      </div>
      <b>S/ 25</b>`;
  }

  const aboutVisual = document.querySelector(".about-visual");
  if (aboutVisual) {
    aboutVisual.classList.add("photo-about");
    aboutVisual.style.backgroundImage =
      'linear-gradient(180deg, rgba(10,10,12,.16), rgba(10,10,12,.86)), url("./assets/dishes/ropa-vieja.webp")';
  }
}

document.addEventListener("click", handleClick);
cartOverlay.addEventListener("click", closeCart);
menuSearch?.addEventListener("input", (event) => {
  currentSearch = event.target.value;
  renderMenu();
});
form.addEventListener("input", () => {
  formError.textContent = "";
  saveCustomerDetails();
});
form.addEventListener("change", saveCustomerDetails);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
  if (event.key === "Tab" && cartDrawer.classList.contains("open")) {
    const focusable = [...cartDrawer.querySelectorAll('button:not([hidden]), input, select, textarea, [href], [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.disabled && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

installPhotoStyles();
applyBrandMedia();
renderFavorites();
renderMenu();
renderCart();
restoreCustomerDetails();
cartDrawer.inert = true;
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();
