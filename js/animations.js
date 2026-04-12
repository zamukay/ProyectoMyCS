// ============================================================
// Animaciones scroll con IntersectionObserver
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Función que observa elementos con scroll
  const observeElements = (elements) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ts-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.10,
      rootMargin: '0px 0px -20px 0px'
    });

    elements.forEach((el, index) => {
      if (el.classList.contains('ts-why-card')) {
        el.style.transitionDelay = `${index * 0.1}s`;
      }
      observer.observe(el);
    });

    return observer;
  };

  // Elementos estáticos
  const staticElements = document.querySelectorAll(
    '.ts-why-card, .cat-icon, .icons-section .title, .products-section .title'
  );
  if (staticElements.length) observeElements(staticElements);

  // Productos dinámicos — cuando main.js los agrega al DOM
  const prodContainer = document.getElementById('prod-index');
  if (prodContainer) {
    let prodIndex = 0;

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains('img-products')) {
            node.style.opacity = '0';
            node.style.transform = 'translateY(30px)';
            node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            const delay = prodIndex * 150;
            prodIndex++;

            // Usar timeout porque el elemento ya está en pantalla al agregarse
            setTimeout(() => {
              node.style.opacity = '1';
              node.style.transform = 'translateY(0)';
            }, delay);
          }
        });
      });
    });

    mutationObserver.observe(prodContainer, { childList: true });
  }

});
