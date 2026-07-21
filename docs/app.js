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

const products = [
  {
    id: "tamal-habanero",
    name: "Tamal Habanero",
    category: "Entrantes",
    price: 15,
    description: "Tamal cubano casero, suave, bien sazonado y con relleno generoso.",
    icon: "🫔",
    image: "./assets/tamal-habanero.webp",
    favorite: true,
    available: true,
  },
  {
    id: "arroz-imperial",
    name: "Arroz Imperial",
    category: "Platos fuertes",
    price: 25,
    description: "Arroz cremoso por capas, pollo sazonado, mayonesa y queso gratinado.",
    icon: "🍚",
    favorite: true,
    available: true,
  },
  {
    id: "lasagna-carne",
    name: "Lasagna de Carne",
    category: "Platos fuertes",
    price: 20,
    description: "Capas generosas de pasta, carne sazonada, salsa y queso gratinado.",
    icon: "🍝",
    favorite: false,
    available: true,
  },
  {
    id: "bistec-encebollado",
    name: "Bistec Encebollado",
    category: "Platos fuertes",
    price: 27,
    description: "Bistec jugoso con abundante cebolla dorada y sazón casera.",
    icon: "🥩",
    favorite: false,
    available: true,
  },
  {
    id: "pollo-rostizado",
    name: "Pollo Rostizado",
    category: "Platos fuertes",
    price: 25,
    description: "Pollo marinado, dorado por fuera y jugoso por dentro.",
    icon: "🍗",
    image: "./assets/pollo-rostizado.webp",
    favorite: true,
    available: true,
  },
  {
    id: "asado-cerdo",
    name: "Asado de Cerdo en Cazuela",
    category: "Platos fuertes",
    price: 27,
    description: "Cerdo tierno cocinado lentamente con salsa criolla.",
    icon: "🍖",
    favorite: false,
    available: true,
  },
  {
    id: "flan-abuela",
    name: "Flan de la Abuela",
    category: "Dulces",
    price: 7,
    description: "Flan cremoso de receta tradicional con caramelo.",
    icon: "🍮",
    favorite: false,
    available: true,
  },
  {
    id: "arroz-leche",
    name: "Arroz con Leche y Lluvia de Chocolate",
    category: "Dulces",
    price: 10,
    description: "Arroz con leche cremoso terminado con una lluvia de chocolate.",
    icon: "🍫",
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

let cart = JSON.parse(localStorage.getItem("abdelito-cart") || "{}");
const cardQuantities = {};

function money(value) {
  return `${BUSINESS.currency} ${Number(value).toFixed(0)}`;
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

function productById(id) {
  return products.find((product) => product.id === id);
}

function photoMarkup(product, className, includeCategory = false) {
  const category = includeCategory
    ? `<span class="category-chip">${product.category}</span>`
    : "";

  if (product.image) {
    return `<div class="${className} has-photo">
      <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
      ${category}
    </div>`;
  }

  return `<div class="${className}" data-icon="${product.icon}">${category}</div>`;
}

function favoriteCard(product) {
  return `
    <article class="favorite-card reveal">
      ${photoMarkup(product, "favorite-art")}
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
      ${photoMarkup(product, "dish-art", true)}
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
  favoritesList.innerHTML = products
    .filter((product) => product.favorite)
    .map(favoriteCard)
    .join("");
}

function renderMenu(filter = "all") {
  const filtered = products.filter(
    (product) => product.available && (filter === "all" || product.category === filter),
  );
  menuList.innerHTML = filtered.map(productCard).join("");
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
  const total = entries.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  cartCount.textContent = totalItems;
  subtotal.textContent = money(total);
  cartEmpty.hidden = entries.length > 0;
  cartItems.innerHTML = entries
    .map(
      ({ product, quantity }) => `
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
        </div>`,
    )
    .join("");
}

function openCart() {
  cartOverlay.hidden = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  setTimeout(() => cartDrawer.querySelector("[data-close-cart]").focus(), 50);
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
  setTimeout(() => {
    cartOverlay.hidden = true;
  }, 320);
}

function sendOrder() {
  const entries = cartEntries();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const address = String(data.get("address") || "").trim();
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
  const total = entries.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const lines = entries.map(
    ({ product, quantity }) =>
      `• ${quantity}× ${product.name} — ${money(product.price * quantity)}`,
  );
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
    `Observaciones: ${notes || "Sin observaciones"}`,
    "",
    "¿Me confirman disponibilidad, costo de delivery y tiempo de entrega?",
  ].join("\n");

  window.open(
    `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener",
  );
}

function applyBrandMedia() {
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.classList.add("brand-with-logo");
    brand.innerHTML =
      '<img class="brand-logo" src="./assets/logo-header.svg" alt="Abdelito Cocina Cubana">';
  });

  const heroDish = document.querySelector(".hero-dish");
  if (heroDish) {
    heroDish.classList.add("has-photo");
    heroDish.innerHTML =
      '<img src="./assets/pollo-rostizado.webp" alt="Pollo Rostizado" fetchpriority="high" decoding="async">';
  }

  const heroLabel = document.querySelector(".hero-card-label");
  if (heroLabel) heroLabel.textContent = "Sazón de la casa";

  const heroInfo = document.querySelector(".hero-card-info");
  if (heroInfo) {
    heroInfo.innerHTML = `
      <div>
        <strong>Pollo Rostizado</strong>
        <small>Dorado por fuera, jugoso por dentro</small>
      </div>
      <b>S/ 25</b>`;
  }

  const aboutVisual = document.querySelector(".about-visual");
  if (aboutVisual) aboutVisual.classList.add("photo-about");
}

function handleClick(event) {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.matches("[data-open-cart]")) openCart();
  if (target.matches("[data-close-cart]")) closeCart();
  if (target.matches("[data-quick-add]")) addToCart(target.dataset.quickAdd, 1);

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
  }

  if (target.matches("[data-cart-minus]")) {
    updateCartItem(target.dataset.cartMinus, -1);
  }
  if (target.matches("[data-cart-plus]")) {
    updateCartItem(target.dataset.cartPlus, 1);
  }
  if (target.matches("[data-cart-remove]")) {
    removeCartItem(target.dataset.cartRemove);
  }
  if (target.matches("[data-send-order]")) sendOrder();

  if (target.matches(".filter")) {
    document.querySelectorAll(".filter").forEach((button) => {
      button.classList.remove("active");
    });
    target.classList.add("active");
    renderMenu(target.dataset.filter);
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

document.addEventListener("click", handleClick);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

applyBrandMedia();
renderFavorites();
renderMenu();
renderCart();
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();
