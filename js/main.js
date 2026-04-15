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

const API_BASE_URL = window.API_BASE_URL || "http://localhost:5222";
let cachedProducts = [];

const getCatalogCategory = () => {
  const params = new URLSearchParams(window.location.search);
  return (params.get("category") || "catalogo").toLowerCase();
};

const isAccessory = (product) => {
  const text = `${product.name} ${product.shortDesc} ${product.description}`.toLowerCase();
  const accessoryKeywords = [
    "mouse",
    "teclado",
    "headset",
    "auricular",
    "mochila",
    "cooler",
    "pad",
    "alfombrilla",
    "base",
  ];
  return accessoryKeywords.some((word) => text.includes(word));
};

const getProductsByCategory = (products, category) => {
  if (!Array.isArray(products)) return [];
  const normalizedCategory = (category || "catalogo").toLowerCase();

  switch (normalizedCategory) {
    case "catalogo":
      return products;
    case "accesorios":
      return products.filter((p) => isAccessory(p));
    case "perifericos":
      return products.filter((p) => {
        const text = `${p.name} ${p.shortDesc} ${p.description}`.toLowerCase();
        return (
          text.includes("mouse") ||
          text.includes("teclado") ||
          text.includes("headset") ||
          text.includes("auricular") ||
          text.includes("pad") ||
          text.includes("alfombrilla")
        );
      });
    case "audio":
      return products.filter((p) => {
        const text = `${p.name} ${p.shortDesc} ${p.description}`.toLowerCase();
        return text.includes("headset") || text.includes("auricular") || text.includes("audio");
      });
    case "rgb":
      return products.filter((p) => {
        const text = `${p.name} ${p.shortDesc} ${p.description}`.toLowerCase();
        return text.includes("rgb");
      });
    case "streaming":
      return products.filter((p) => {
        const text = `${p.name} ${p.shortDesc} ${p.description}`.toLowerCase();
        return text.includes("stream") || text.includes("microfono") || text.includes("captura");
      });
    case "monitores":
      return products.filter((p) => {
        const text = `${p.name} ${p.shortDesc} ${p.description}`.toLowerCase();
        return text.includes("monitor");
      });
    case "brands":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "ofertas":
      return products.filter((p) => Number(p.price) <= 100);
    default:
      return products;
  }
};

const normalizeProduct = (product) => {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name || "Producto",
    price: Number(product.price) || 0,
    imgSrc: product.imgSrc || product.imageUrl || "img/laptop-02.jpg",
    shortDesc: product.shortDesc || product.description || "Sin descripcion disponible.",
    description: product.description || "",
    category: product.category || "product",
    specs: product.specs || null,
  };
};

const fetchProducts = async () => {
  if (cachedProducts.length > 0) return cachedProducts;
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) throw new Error("No se pudo cargar el catalogo.");
  const products = await response.json();
  cachedProducts = Array.isArray(products)
    ? products.map(normalizeProduct).filter(Boolean)
    : [];
  return cachedProducts;
};

const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (!response.ok) return null;
  const product = await response.json();
  return normalizeProduct(product);
};

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

const displayProducts = async () => {
  if (!prodContProd) return;
  prodContProd.innerHTML = "";
  try {
    const products = await fetchProducts();
    const selectedCategory = getCatalogCategory();
    const filteredProducts = getProductsByCategory(products, selectedCategory);

    if (filteredProducts.length === 0) {
      prodContProd.innerHTML = "<p>No hay productos disponibles por ahora.</p>";
      return;
    }
    for (let i = 0; i < filteredProducts.length; i++) {
      createProd(filteredProducts[i], "prod");
    }
  } catch (error) {
    console.error(error);
    prodContProd.innerHTML = "<p>No se pudo cargar el catalogo en este momento.</p>";
  }
};

const displayProdIndex = async () => {
  if (!prodContIndex) return;
  prodContIndex.innerHTML = "";
  try {
    const products = await fetchProducts();
    const n = Math.min(3, products.length);
    for (let i = 0; i < n; i++) {
      createProd(products[i], "index");
    }
  } catch (error) {
    console.error(error);
    prodContIndex.innerHTML = "<p>No se pudieron cargar los productos destacados.</p>";
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
  const normalizedProduct = normalizeProduct(product);
  if (!normalizedProduct) return;
  let divProd = document.createElement("div");
  let imgProd = document.createElement("img");
  let nameProd = document.createElement("h4");
  let priceProd = document.createElement("p");
  let buttonProd = document.createElement("button");
  let divOverlay = document.createElement("div");
  let prodDesc = document.createElement("p");
  let buttonMore = document.createElement("button");

  imgProd.src = normalizedProduct.imgSrc;
  nameProd.innerText = normalizedProduct.name;
  priceProd.innerText = "$" + normalizedProduct.price;
  buttonProd.innerText = "Añadir al carrito";
  prodDesc.innerText = normalizedProduct.shortDesc || "";
  buttonMore.innerText = "Más información";

  const navigateToDetail = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(normalizedProduct));
    window.location.href = `detalle.html?id=${encodeURIComponent(normalizedProduct.id)}`;
  };

  buttonMore.addEventListener("click", navigateToDetail);
  imgProd.addEventListener("click", navigateToDetail);
  nameProd.addEventListener("click", navigateToDetail);

  imgProd.style.cursor = "pointer";
  nameProd.style.cursor = "pointer";

  buttonProd.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(normalizedProduct, 1);
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
  try {
    // Esperar a que el body esté disponible
    if (!document.body) {
      setTimeout(() => notificarAgregado(nombreProducto), 100);
      return;
    }

    // Inyectar estilos CSS críticos si no existen
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        #toast-container {
          position: fixed !important;
          top: 20px !important;
          right: 20px !important;
          left: auto !important;
          bottom: auto !important;
          z-index: 99999 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
          pointer-events: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: auto !important;
          height: auto !important;
        }
        
        .toast-notification {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(style);
    }

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
    toast.style.cssText = `
      display: flex !important;
      align-items: center !important;
      gap: 16px !important;
      background: linear-gradient(135deg, #00bc8c 0%, #009670 100%) !important;
      color: white !important;
      padding: 18px 20px !important;
      border-radius: 10px !important;
      box-shadow: 0 8px 24px rgba(0, 188, 140, 0.5), 0 0 0 1px rgba(0, 188, 140, 0.3) !important;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-weight: 700 !important;
      font-size: 16px !important;
      line-height: 1.5 !important;
      min-width: 280px !important;
      max-width: 380px !important;
      opacity: 0 !important;
      animation: slideInFromRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
      margin: 0 !important;
      border: none !important;
      position: relative !important;
    `;
    
    // Crear contenido del toast
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.innerHTML = '✓';
    icon.style.cssText = `
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 32px !important;
      height: 32px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      border-radius: 50% !important;
      flex-shrink: 0 !important;
      font-weight: bold !important;
      font-size: 18px !important;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15) !important;
      min-width: 32px !important;
    `;
    
    const message = document.createElement('span');
    message.className = 'toast-message';
    message.textContent = '¡Producto añadido con éxito!';
    message.style.cssText = `
      flex: 1 !important;
      margin: 0 !important;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.textContent = '×';
    closeBtn.type = 'button';
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2) !important;
      border: none !important;
      color: white !important;
      font-size: 20px !important;
      cursor: pointer !important;
      padding: 0 !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      flex-shrink: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 4px !important;
      transition: all 0.2s !important;
      margin: 0 !important;
    `;
    
    closeBtn.onmouseover = () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.35)';
      closeBtn.style.transform = 'scale(1.1)';
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
      closeBtn.style.transform = 'scale(1)';
    };
    
    closeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(320px)';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    };
    
    // Armar el toast
    toast.appendChild(icon);
    toast.appendChild(message);
    toast.appendChild(closeBtn);
    
    // Agregar al contenedor
    container.appendChild(toast);
    
    // Disparar animación de entrada con fuerza
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });
    
    // Remover automáticamente después de 4 segundos
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(320px)';
        setTimeout(() => {
          if (toast.parentElement) {
            toast.remove();
          }
        }, 300);
      }
    }, 4000);
    
    console.log('✅ Toast mostrado:', nombreProducto);
  } catch (error) {
    console.error('❌ Error al mostrar toast:', error);
  }
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

const displayProductDetail = async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  let selectedProduct = null;

  if (productId) {
    selectedProduct = await fetchProductById(productId);
  }

  if (!selectedProduct) {
    const raw = localStorage.getItem("selectedProduct");
    if (!raw) return;
    selectedProduct = normalizeProduct(JSON.parse(raw));
  }

  if (!selectedProduct) return;
  localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
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
  if (selectedProduct.category === "laptop" && selectedProduct.specs) {
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
  } else if (selectedProduct.specs) {
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
  } else {
    specsContainer.innerHTML = `
      <h4 class="mb-3" style="color:#00e5b0;">Descripcion del producto</h4>
      <p style="color:#fff;">
        ${selectedProduct.description || "No hay detalles adicionales para este producto."}
      </p>
    `;
  }
};
