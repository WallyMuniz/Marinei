const fallbackProducts = [
  {
    id: "toalha-lavabo-rosa",
    name: "Toalha Lavabo Rosa",
    category: "Toalha Lavabo",
    price: 35,
    unit: "unidade",
    image: "assets/artes/toalha-lavabo-rosa.jpeg",
    description: "Toalha lavabo bordada com acabamento delicado e embalagem para presente.",
  },
  {
    id: "toalha-lavabo-lilas",
    name: "Toalha Lavabo Lilas",
    category: "Toalha Lavabo",
    price: 35,
    unit: "unidade",
    image: "assets/artes/toalha-lavabo-lilas.jpeg",
    description: "Modelo suave, personalizado e ideal para presentear com carinho.",
  },
  {
    id: "kit-toalhas-familia",
    name: "Kit Toalhas Familia",
    category: "Kit Toalhas",
    price: 105,
    unit: "kit",
    image: "assets/artes/kit-toalhas-familia.jpeg",
    description: "Kit de toalhas bordadas para familia, com nomes e iniciais personalizados.",
  },
  {
    id: "kit-toalhas-infantil",
    name: "Kit Toalhas Infantil",
    category: "Kit Toalhas",
    price: 70,
    unit: "kit",
    image: "assets/artes/kit-toalhas-infantil.jpeg",
    description: "Kit infantil com bordados coloridos e embalagem pronta para presente.",
  },
  {
    id: "kit-panos-prato-colorido",
    name: "Kit Pano de Prato Colorido",
    category: "Pano de Prato",
    price: 100,
    unit: "kit",
    image: "assets/artes/kit-panos-prato-colorido.jpeg",
    description: "Panos de prato 100% algodao com barrado e acabamento especial.",
  },
  {
    id: "kit-panos-prato-bordado",
    name: "Kit Pano de Prato Bordado",
    category: "Pano de Prato",
    price: 150,
    unit: "kit",
    image: "assets/artes/kit-panos-prato-bordado.jpeg",
    description: "Kit com 5 panos bordados, visual elegante e pronto para presentear.",
  },
  {
    id: "cesto-pao-kit",
    name: "Cesto de Pao Kit",
    category: "Cesto de Pao",
    price: 150,
    unit: "kit",
    image: "assets/artes/cesto-pao-kit.jpeg",
    description: "Cesto de pao com kit de 3 panos de prato, delicado e presenteavel.",
  },
];

const config = window.STORE_CONFIG || {};
let products = [];
let cart = JSON.parse(localStorage.getItem("fabric-cart") || "[]");

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const productGrid = document.querySelector("[data-products]");
const searchInput = document.querySelector("[data-search]");
const categorySelect = document.querySelector("[data-category]");
const cartCount = document.querySelector("[data-cart-count]");
const cartItems = document.querySelector("[data-cart-items]");
const cartItemsDrawer = document.querySelector("[data-cart-items-drawer]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartTotalDrawer = document.querySelector("[data-cart-total-drawer]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const overlay = document.querySelector("[data-overlay]");
const form = document.querySelector("[data-checkout-form]");
const formMessage = document.querySelector("[data-form-message]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");

function getWhatsappUrl(message = "Ola, vim pelo site do Atelie Muniz e quero fazer um pedido.") {
  const phone = config.whatsappNumber || "5500000000000";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function setupContactLinks() {
  whatsappLinks.forEach((link) => {
    link.href = getWhatsappUrl();
  });
}

async function loadProducts() {
  try {
    if (config.apiBaseUrl?.includes("sua-api.com")) {
      throw new Error("API ainda nao configurada");
    }

    const response = await fetch(`${config.apiBaseUrl}${config.productsEndpoint}`);
    if (!response.ok) throw new Error("Erro ao carregar produtos");
    products = await response.json();
  } catch (error) {
    products = fallbackProducts;
  }

  renderCategories();
  renderProducts();
  renderCart();
}

function renderCategories() {
  const categories = [...new Set(products.map((product) => product.category))];
  categorySelect.innerHTML = '<option value="todos">Todas</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search);
    const matchesCategory = category === "todos" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <div>
            <span>${product.category}</span>
            <h3>${product.name}</h3>
            <small>${product.description || "Produto bordado com acabamento especial."}</small>
            <p>${currency.format(product.price)} / ${product.unit}</p>
          </div>
          <div class="product-actions">
            <button type="button" data-buy-product="${product.id}">Comprar agora</button>
            <button class="ghost-button" type="button" data-add-product="${product.id}">Carrinho</button>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const current = cart.find((item) => item.id === productId);
  if (current) {
    current.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function buyProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const checkoutUrl = config.checkoutLinks?.[productId];
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
    return;
  }

  const message = `Ola, vim pelo site do Atelie Muniz e quero comprar: ${product.name}.`;
  window.open(getWhatsappUrl(message), "_blank", "noopener");
}

function updateQuantity(productId, quantity) {
  const nextQuantity = Number(quantity);

  if (nextQuantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  } else {
    cart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: nextQuantity } : item
    );
  }

  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("fabric-cart", JSON.stringify(cart));
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = currency.format(getTotal());
  cartCount.textContent = totalQuantity;
  cartTotal.textContent = total;
  cartTotalDrawer.textContent = total;

  const markup = cart.length
    ? cart
        .map(
          (item) => `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <span>${currency.format(item.price)} / ${item.unit}</span>
            </div>
            <label>
              qtd
              <input type="number" min="0" step="1" value="${item.quantity}" data-qty="${item.id}" />
            </label>
          </div>
        `
        )
        .join("")
    : '<p class="empty-cart">Seu carrinho esta vazio.</p>';

  cartItems.innerHTML = markup;
  cartItemsDrawer.innerHTML = markup;
}

function openCart() {
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("is-visible");
}

function closeCart() {
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("is-visible");
}

async function createPayment(order) {
  if (config.apiBaseUrl?.includes("sua-api.com")) {
    return {
      demo: true,
      message:
        "Pedido validado. Configure api-config.js para enviar pedidos e processar cartao.",
    };
  }

  if (window.PaymentGateway?.createPayment) {
    return window.PaymentGateway.createPayment(order);
  }

  const response = await fetch(`${config.apiBaseUrl}${config.ordersEndpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel enviar o pedido.");
  }

  return response.json();
}

function getCheckoutPayload(formData) {
  return {
    customer: Object.fromEntries(formData.entries()),
    items: cart.map(({ id, name, price, quantity }) => ({
      id,
      name,
      price,
      quantity,
    })),
    total: getTotal(),
    paymentProvider: config.payment?.provider,
  };
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  const buyButton = event.target.closest("[data-buy-product]");
  if (addButton) addToCart(addButton.dataset.addProduct);
  if (buyButton) buyProduct(buyButton.dataset.buyProduct);
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-qty]")) {
    updateQuantity(event.target.dataset.qty, event.target.value);
  }
});

searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);
document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document.querySelectorAll("[data-close-cart]").forEach((button) => {
  button.addEventListener("click", closeCart);
});
overlay.addEventListener("click", closeCart);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!cart.length) {
    formMessage.textContent = "Adicione pelo menos um produto ao carrinho.";
    return;
  }

  formMessage.textContent = "Enviando pedido...";

  try {
    const payload = getCheckoutPayload(new FormData(form));
    const result = await createPayment(payload);
    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }
    formMessage.textContent = result.message || "Pedido enviado com sucesso.";
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

setupContactLinks();
loadProducts();
