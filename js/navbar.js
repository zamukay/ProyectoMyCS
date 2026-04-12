// ---------- Cart Badge ----------

/**
 * Actualiza el número del badge del carrito.
 * Manolo (feature/detalle-carrito) puede llamar:
 *   window.TechStore.updateCartBadge(n)
 */
const updateCartBadge = (count) => {
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  const safeCount = Math.max(0, parseInt(count) || 0);
  badge.textContent = safeCount;
  localStorage.setItem('ts-cart-count', safeCount);

  // Mostrar u ocultar el badge
  badge.style.display = safeCount === 0 ? 'none' : 'flex';

  // Animación bump
  badge.classList.remove('bump');
  void badge.offsetWidth; // reflow
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 200);
};

const addToCart = (amount = 1) => {
  const current = parseInt(localStorage.getItem('ts-cart-count') || '0');
  updateCartBadge(current + amount);
};

const removeFromCart = (amount = 1) => {
  const current = parseInt(localStorage.getItem('ts-cart-count') || '0');
  updateCartBadge(current - amount);
};

const clearCart = () => updateCartBadge(0);

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  // Cargar count guardado
  const saved = localStorage.getItem('ts-cart-count') || '0';
  updateCartBadge(parseInt(saved));

  // Marcar link activo según página actual
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ts-nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });
});

// ---------- API global ----------
window.TechStore = { addToCart, removeFromCart, clearCart, updateCartBadge };
