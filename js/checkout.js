/**
 * Lógica para la página de Checkout.
 * Maneja la lectura del carrito desde localStorage,
 * renderiza el resumen, valida el formulario de envío
 * y envía la orden al API mediante fetch.
 */

/** URL base de la API — ajusta si tu backend corre en otro puerto */
const API_BASE_URL = 'https://localhost:7001';

/**
 * Transforma los ítems del carrito (formato localStorage) al
 * shape que espera el endpoint POST /api/orders (CreateOrderDto).
 *
 * @param {Array<{id:string|number, name:string, price:number|string, quantity:number|string}>} cartItems
 * @returns {{ items: Array<{productId:number, quantity:number, unitPrice:number}> }}
 */
const buildOrderPayload = (cartItems) => ({
    items: cartItems.map(item => ({
        productId : parseInt(item.id, 10),
        quantity  : parseInt(item.quantity, 10) || 1,
        unitPrice : parseFloat(item.price)      || 0,
    })),
});

/**
 * Envía los datos de la orden al endpoint POST /api/orders.
 * Incluye el JWT almacenado en localStorage en el header Authorization.
 * Si la respuesta es exitosa limpia el carrito y redirige a confirmation.html.
 *
 * @param {Array} cartItems  - Ítems actuales del carrito.
 * @param {HTMLButtonElement} submitBtn   - Botón de submit (para restaurar estado si hay error).
 * @param {HTMLElement}       spinner     - Spinner que se muestra mientras procesa.
 * @returns {Promise<void>}
 */
const submitOrder = async (cartItems, submitBtn, spinner) => {
    // --- 1. Obtener token JWT ---
    const token = localStorage.getItem('authToken')
             || localStorage.getItem('token')
             || sessionStorage.getItem('authToken')
             || sessionStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión antes de completar tu compra.');
        window.location.href = 'login.html';
        return;
    }

    // --- 2. Construir payload ---
    const payload = buildOrderPayload(cartItems);

    try {
        // --- 3. Llamada fetch al API ---
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method : 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            // --- 4a. Éxito: limpiar carrito y redirigir ---
            localStorage.removeItem('cart');
            window.location.href = 'confirmation.html';
        } else if (response.status === 401) {
            // Token expirado o inválido
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        } else {
            // Otro error del servidor
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.message || `Error del servidor (${response.status}). Inténtalo de nuevo.`;
            alert(msg);
            // Restaurar botón para que el usuario pueda reintentar
            _restoreSubmitButton(submitBtn, spinner);
        }
    } catch (networkError) {
        // Error de red / servidor no disponible
        console.error('Error al conectar con el servidor:', networkError);
        alert('No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde.');
        _restoreSubmitButton(submitBtn, spinner);
    }
};

/**
 * Restaura el botón de submit a su estado original tras un error.
 * @param {HTMLButtonElement} btn
 * @param {HTMLElement} spinner
 */
const _restoreSubmitButton = (btn, spinner) => {
    btn.disabled = false;
    const label = btn.querySelector('span:not(.spinner-border)');
    if (label) label.textContent = 'Pagar Ahora';
    const lockIcon = btn.querySelector('.bi-lock-fill');
    if (lockIcon) lockIcon.classList.remove('d-none');
    if (spinner)  spinner.classList.add('d-none');
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummaryContent = document.getElementById('order-summary-content');
    const totalAmountElement = document.getElementById('total-amount');
    const cartBadge = document.getElementById('cart-badge');
    const submitButton = document.getElementById('submit-button');
    const emptyCartAlert = document.getElementById('empty-cart-alert');
    const form = document.getElementById('checkout-form');
    const submitSpinner = document.getElementById('submit-spinner');
    
    // Formateador de moneda USD
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // 2. Renderizar Resumen de Compra
    const renderOrderSummary = () => {
        if (cartItems.length === 0) {
            // Estado UI cuando el carrito está vacío
            emptyCartAlert.classList.remove('d-none');
            submitButton.disabled = true;
            
            orderSummaryContent.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-cart-x display-4 mb-3 d-block"></i>
                    <p class="mb-0">Tu carrito está vacío.</p>
                </div>
            `;
            totalAmountElement.textContent = formatter.format(0);
            cartBadge.textContent = '0';
        } else {
            // Renderizar items del carrito
            let total = 0;
            let totalItems = 0;
            let summaryHTML = '';

            cartItems.forEach(item => {
                const name = item.name || item.title || 'Producto';
                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 1;
                const subtotal = price * quantity;
                
                total += subtotal;
                totalItems += quantity;

                summaryHTML += `
                    <div class="d-flex justify-content-between align-items-center order-summary-item">
                        <div>
                            <h6 class="my-0 text-white">${name}</h6>
                            <small class="text-muted">Cantidad: ${quantity}</small>
                        </div>
                        <span class="text-white fw-medium">${formatter.format(subtotal)}</span>
                    </div>
                `;
            });

            orderSummaryContent.innerHTML = summaryHTML;
            totalAmountElement.textContent = formatter.format(total);
            cartBadge.textContent = totalItems.toString();
        }
    };

    renderOrderSummary();

    // 3. Validación de Formulario y Submit
    if (form) {
        form.addEventListener('submit', async event => {
            // Prevenir comportamiento por defecto siempre
            event.preventDefault();
            event.stopPropagation();
            
            // Validar si el carrito está vacío (leer estado actual)
            const cartNow = JSON.parse(localStorage.getItem('cart')) || [];
            if (cartNow.length === 0) {
                alert('No puedes procesar una compra con el carrito vacío.');
                return;
            }

            // Validar formulario HTML5 y Bootstrap
            if (!form.checkValidity()) {
                // Agregar clase de Bootstrap para mostrar errores visuales
                form.classList.add('was-validated');
                
                // UX: Hacemos scroll suave hacia el primer elemento inválido
                const firstInvalidElement = form.querySelector(':invalid');
                if (firstInvalidElement) {
                    firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalidElement.focus({ preventScroll: true });
                }
                return;
            }

            // Todo válido — actualizar estado UI y enviar al API
            form.classList.add('was-validated');

            // Bloquear botón y mostrar spinner mientras se procesa
            submitButton.disabled = true;
            const labelSpan = submitButton.querySelector('span:not(.spinner-border)');
            if (labelSpan) labelSpan.textContent = 'Procesando pago...';
            submitButton.querySelector('.bi-lock-fill')?.classList.add('d-none');
            submitSpinner.classList.remove('d-none');

            // Leer carrito fresco y enviar al endpoint real
            const cartNowFresh = JSON.parse(localStorage.getItem('cart')) || [];
            await submitOrder(cartNowFresh, submitButton, submitSpinner);

        }, false);
    }
    
    // (Opcional) Formateo automático de tarjeta de crédito
    const ccInput = document.getElementById('cc-number');
    if(ccInput) {
        ccInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/\D/g, '').substring(0, 16);
            this.value = this.value.replace(/(\d{4})(?=\d)/g, '$1 ');
        });
    }
});
