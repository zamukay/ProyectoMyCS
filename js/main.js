// Variables
const prodContProd = document.querySelector("#products");
const prodContIndex = document.querySelector("#prod-index");
const prodContCart = document.querySelector("#prod-cart");

// Inicializar contenedor de notificaciones
const initToastContainer = () => {
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initToastContainer);
} else {
  initToastContainer();
}

const arr = window.CATALOGO_PRODUCTOS || [];

const getCart = () => {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

/** Añade o incrementa cantidad; formato compatible con checkout.js */
const addToCart = (product, qty = 1) => {
  const cart = getCart();
  const id = product.id;
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.quantity = (parseInt(existing.quantity, 10) || 1) + qty;
  } else {
    cart.push({
      id,
      name: product.name,
      price: product.price,
      quantity: qty,
      imgSrc: product.imgSrc,
    });
  }
  saveCart(cart);
  notificarAgregado(product.name);
};

const removeLineFromCart = (productId) => {
  saveCart(getCart().filter((line) => line.id !== productId));
};

/** delta +1 / -1; si la cantidad queda ≤ 0 se elimina la línea */
const changeLineQuantity = (productId, delta) => {
  const cart = getCart();
  const idx = cart.findIndex((line) => line.id === productId);
  if (idx === -1) return;
  const line = cart[idx];
  const q = (parseInt(line.quantity, 10) || 1) + delta;
  if (q <= 0) {
    cart.splice(idx, 1);
  } else {
    line.quantity = q;
  }
  saveCart(cart);
};

const displayProducts = () => {
  if (!prodContProd) return;
  for (let i = 0; i < arr.length; i++) {
    createProd(arr[i], "prod");
  }
};

const displayProdIndex = () => {
  if (!prodContIndex) return;
  const n = Math.min(3, arr.length);
  for (let i = 0; i < n; i++) {
    createProd(arr[i], "index");
  }
};

const displayProdCart = () => {
  if (!prodContCart) return;
  prodContCart.innerHTML = "";
  const cart = getCart();
  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cart-empty-msg";
    empty.textContent = "Tu carrito está vacío. Explora el catálogo y añade productos.";
    prodContCart.appendChild(empty);
  } else {
    cart.forEach((line) => createCartProd(line));
  }
  updateCartSummarySidebar();
};

const createProd = (product, check) => {
  let divProd = document.createElement("div");
  let imgProd = document.createElement("img");
  let nameProd = document.createElement("h4");
  let priceProd = document.createElement("p");
  let buttonProd = document.createElement("button");
  let divOverlay = document.createElement("div");
  let prodDesc = document.createElement("p");
  let buttonMore = document.createElement("button");

  imgProd.src = product.imgSrc;
  nameProd.innerText = product.name;
  priceProd.innerText = "$" + product.price;
  buttonProd.innerText = "Añadir al carrito";
  prodDesc.innerText = product.shortDesc || "";
  buttonMore.innerText = "Más información";

  buttonMore.addEventListener("click", () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "detalle.html";
  });

  buttonProd.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  });

  priceProd.className = "price";
  buttonProd.className = "atc-btn";
  buttonMore.className = "rm-btn";
  divOverlay.className = "overlay";
  prodDesc.className = "description";
  divProd.className = "img-products";

  divOverlay.appendChild(prodDesc);
  divOverlay.appendChild(buttonMore);
  divOverlay.appendChild(buttonProd);
  divProd.appendChild(imgProd);
  divProd.appendChild(nameProd);
  divProd.appendChild(priceProd);
  divProd.appendChild(divOverlay);
  if (check === "prod" && prodContProd) {
    prodContProd.appendChild(divProd);
  } else if (check === "index" && prodContIndex) {
    prodContIndex.appendChild(divProd);
  }
};

const createCartProd = (line) => {
  const qty = parseInt(line.quantity, 10) || 1;
  const productId = line.id;
  let divProd = document.createElement("div");
  let imgProd = document.createElement("img");
  let descProd = document.createElement("div");
  let nameProd = document.createElement("h4");
  let priceProd = document.createElement("p");
  let amountDiv = document.createElement("div");
  let amount = document.createElement("p");
  let icons = document.createElement("div");

  const btnMinus = document.createElement("button");
  btnMinus.type = "button";
  btnMinus.className = "cart-qty-btn";
  btnMinus.setAttribute("aria-label", "Reducir cantidad");
  const minusIcon = document.createElement("i");
  minusIcon.className = "fa-regular fa-square-minus";
  btnMinus.appendChild(minusIcon);

  const btnPlus = document.createElement("button");
  btnPlus.type = "button";
  btnPlus.className = "cart-qty-btn";
  btnPlus.setAttribute("aria-label", "Aumentar cantidad");
  const plusIcon = document.createElement("i");
  plusIcon.className = "fa-regular fa-square-plus";
  btnPlus.appendChild(plusIcon);

  const btnRemove = document.createElement("button");
  btnRemove.type = "button";
  btnRemove.className = "cart-remove-btn";
  btnRemove.setAttribute("aria-label", "Quitar del carrito");
  const closeIcon = document.createElement("i");
  closeIcon.className = "fa-regular fa-rectangle-xmark";
  btnRemove.appendChild(closeIcon);

  let favoriteIcon = document.createElement("i");
  favoriteIcon.className = "fa-solid fa-heart cart-favorite-icon";
  favoriteIcon.setAttribute("aria-hidden", "true");

  imgProd.src = line.imgSrc;
  nameProd.innerText = line.name;
  priceProd.innerText = "$" + line.price;
  amount.innerText = " " + qty + " ";

  divProd.className = "cart-prod";
  descProd.className = "desc-prod";
  amountDiv.className = "amount-div";
  icons.className = "cart-icons";

  btnRemove.addEventListener("click", () => {
    removeLineFromCart(productId);
    displayProdCart();
  });
  btnPlus.addEventListener("click", () => {
    changeLineQuantity(productId, 1);
    displayProdCart();
  });
  btnMinus.addEventListener("click", () => {
    changeLineQuantity(productId, -1);
    displayProdCart();
  });

  divProd.appendChild(imgProd);
  descProd.appendChild(nameProd);
  descProd.appendChild(priceProd);
  amountDiv.appendChild(btnMinus);
  amountDiv.appendChild(amount);
  amountDiv.appendChild(btnPlus);
  descProd.appendChild(amountDiv);
  divProd.appendChild(descProd);
  icons.appendChild(btnRemove);
  icons.appendChild(favoriteIcon);
  divProd.appendChild(icons);
  prodContCart.appendChild(divProd);
};

/** Actualiza subtotal/total en shopping-cart.html si existen los nodos */
const updateCartSummarySidebar = () => {
  const subEl = document.getElementById("cart-subtotal-amount");
  const totalEl = document.getElementById("cart-total-amount");
  if (!subEl && !totalEl) return;
  const cart = getCart();
  let sub = 0;
  cart.forEach((line) => {
    const price = parseFloat(line.price) || 0;
    const q = parseInt(line.quantity, 10) || 1;
    sub += price * q;
  });
  const formatted = "$" + sub.toFixed(2);
  if (subEl) subEl.textContent = formatted;
  if (totalEl) totalEl.textContent = formatted;
};

const initDetalleAddToCart = () => {
  const btn = document.getElementById("btn-agregar");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const raw = localStorage.getItem("selectedProduct");
    if (!raw) return;
    addToCart(JSON.parse(raw), 1);
  });
};

document.addEventListener("DOMContentLoaded", initDetalleAddToCart);

/**
 * Función robusta para mostrar notificación de producto agregado
 * @param {string} nombreProducto - Nombre del producto agregado
 */
const notificarAgregado = (nombreProducto = '') => {
  // Obtener o crear el contenedor
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Crear elemento del toast
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  
  // Crear contenido del toast
  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.innerHTML = '✓';
  
  const message = document.createElement('span');
  message.className = 'toast-message';
  message.textContent = '¡Producto añadido con éxito!';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '×';
  closeBtn.type = 'button';
  closeBtn.onclick = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  };
  
  // Armar el toast
  toast.appendChild(icon);
  toast.appendChild(message);
  toast.appendChild(closeBtn);
  
  // Agregar al contenedor
  container.appendChild(toast);
  
  // Disparar animación de entrada
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remover automáticamente después de 4 segundos
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }
  }, 4000);
};

/**
 * Función alternativa para compatibilidad hacia atrás
 * (llamada por código antiguo)
 */
const showToast = (message) => {
  notificarAgregado();
};

const hamburgerMenu = () => {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
};

const displayProductDetail = () => {
  const raw = localStorage.getItem("selectedProduct");
  if (!raw) return;
  const selectedProduct = JSON.parse(raw);
  const imgEl = document.querySelector(".product-detail img");
  const titleElement = document.querySelector(".product-detail .card-title");
  const priceElement = document.querySelector(".product-detail .price");
  const specsContainer = document.querySelector(".specs-section");
  if (!imgEl || !titleElement || !priceElement || !specsContainer) return;

  imgEl.src = selectedProduct.imgSrc;
  titleElement.innerText = selectedProduct.name;
  titleElement.style.color = "#fff";
  priceElement.innerText = "$" + selectedProduct.price;
  priceElement.style.color = "#00e5b0";

  const s = selectedProduct.specs || {};
  if (selectedProduct.category === "laptop") {
    specsContainer.innerHTML = `
      <h4 class="mb-3" style="color:#00e5b0;">Especificaciones técnicas</h4>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-memory fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">RAM:</strong> <span style="color:#00e5b0;">${s.ram}</span>
        </div>
      </div>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-microchip fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">CPU:</strong> <span style="color:#00e5b0;">${s.cpu}</span>
        </div>
      </div>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-gamepad fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">GPU:</strong> <span style="color:#00e5b0;">${s.gpu}</span>
        </div>
      </div>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-hdd fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">Almacenamiento:</strong> <span style="color:#00e5b0;">${s.storage}</span>
        </div>
      </div>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-tv fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">Pantalla:</strong> <span style="color:#00e5b0;">${s.screen}</span>
        </div>
      </div>
    `;
  } else {
    specsContainer.innerHTML = `
      <h4 class="mb-3" style="color:#00e5b0;">Características</h4>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-star fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">Destacado:</strong> <span style="color:#00e5b0;">${s.destacado}</span>
        </div>
      </div>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-plug fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">Conexión:</strong> <span style="color:#00e5b0;">${s.conexion}</span>
        </div>
      </div>
      <div class="spec-item d-flex align-items-center mb-3">
        <i class="fas fa-check-circle fa-lg me-3" style="color:#00e5b0;"></i>
        <div>
          <strong style="color:#fff;">Compatibilidad:</strong> <span style="color:#00e5b0;">${s.compatibilidad}</span>
        </div>
      </div>
    `;
  }
};
