const handleContactSubmit = (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const asuntoInput = document.getElementById('asunto');
  const mensajeInput = document.getElementById('mensaje');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');
  const submitButton = document.querySelector('.contact-btn');

  const nombre = nombreInput?.value.trim();
  const email = emailInput?.value.trim();
  const asunto = asuntoInput?.value.trim();
  const mensaje = mensajeInput?.value.trim();

  const setButtonState = (disabled, label) => {
    if (!submitButton) return;
    submitButton.disabled = disabled;
    if (label) {
      submitButton.innerHTML = label;
    }
    if (disabled) {
      submitButton.classList.add('sending');
      submitButton.setAttribute('aria-busy', 'true');
    } else {
      submitButton.classList.remove('sending');
      submitButton.removeAttribute('aria-busy');
    }
  };

  if (!nombre || !email || !mensaje) {
    if (successMessage) successMessage.classList.add('hidden');
    if (errorMessage) {
      errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Por favor completa tu nombre, correo y mensaje.';
      errorMessage.classList.remove('hidden');
    }
    if (nombreInput && !nombre) nombreInput.focus();
    else if (emailInput && !email) emailInput.focus();
    else if (mensajeInput && !mensaje) mensajeInput.focus();
    return;
  }

  if (errorMessage) errorMessage.classList.add('hidden');
  setButtonState(true, '<i class="fas fa-spinner fa-spin"></i> Enviando...');

  if (successMessage) {
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado correctamente! Este es un envío simulado.';
    successMessage.classList.remove('hidden');
  }

  const form = document.querySelector('.contact-form');
  if (form) form.reset();

  setTimeout(() => {
    if (successMessage) successMessage.classList.add('hidden');
    setButtonState(false, '<i class="fas fa-paper-plane"></i> Enviar mensaje');
  }, 2500);
};

const initializeContactForm = () => {
  const errorMessage = document.getElementById('form-error');
  ['nombre', 'email', 'mensaje'].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', () => {
      if (errorMessage) errorMessage.classList.add('hidden');
    });
  });
};

initializeContactForm();
