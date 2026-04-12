/**
 * Lógica para la página de Checkout.
 * Maneja la lectura del carrito desde localStorage, 
 * renderiza el resumen, y valida el formulario de envío.
 */

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
        form.addEventListener('submit', event => {
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

            // Todo válido, simular el procesamiento del pago
            form.classList.add('was-validated');
            
            // Cambiar estado del botón
            submitButton.disabled = true;
            submitButton.querySelector('span:not(.spinner-border)').textContent = 'Procesando pago... ';
            submitButton.querySelector('.bi-lock-fill').classList.add('d-none');
            submitSpinner.classList.remove('d-none');

            // Simulación de delay de red / API (2 segundos)
            setTimeout(() => {
                // Vaciar localStorage (excepto otras cosas preferidas, solo 'cart')
                localStorage.removeItem('cart');
                
                // Redirigir a confirmación (hito siguiente)
                window.location.href = 'confirmation.html';
            }, 2000);

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
