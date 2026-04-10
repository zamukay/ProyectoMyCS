document.addEventListener("DOMContentLoaded", () => {
    // window.productos sale de data/productos.js que ya fue cargado previamente
    if (window.productos) {
        renderizarProductos(window.productos);
    } else {
        console.error("No se pudo cargar la data de productos");
    }
});

/**
 * Función que recibe un array de productos y los inyecta en el contenedor principal.
 * @param {Array} lista - La lista de objetos producto
 */
function renderizarProductos(lista) {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;
    
    // Vaciamos primero el contenedor. (Uso permitido de innerHTML solo para setear a un string vacío)
    contenedor.innerHTML = "";

    // CONCEPTOS > CÓDIGO: DocumentFragment es como armar muebles en tu taller antes de llevarlos a la obra.
    // En vez de clavarle un nodo al DOM en cada iteración (y causar reflow = lag), armamos todo en la RAM
    // y lo inyectamos de un solo saque. Esto es pensar como Senior.
    const fragmento = document.createDocumentFragment();

    lista.forEach(producto => {
        // En nuestro contenedor inyectamos la tarjeta atómica
        const tarjeta = crearTarjetaProducto(producto);
        fragmento.appendChild(tarjeta);
    });

    contenedor.appendChild(fragmento);
}

/**
 * Función que construye el nodo DOM de una sola tarjeta con JS vainilla.
 * Componente atómico estilo Presentational Pattern.
 * @param {Object} producto 
 * @returns {HTMLElement} article
 */
function crearTarjetaProducto(producto) {
    const card = document.createElement("article");
    card.classList.add("producto-card");
    // Siempre es útil atar un dataset en componentes listados
    card.dataset.id = producto.id;
    card.dataset.categoria = producto.categoria;

    // --- Header de contenedor imagen ---
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("producto-img-container");

    const img = document.createElement("img");
    img.src = producto.imagen;
    img.alt = `Imagen de ${producto.nombre}`;
    img.classList.add("producto-img");

    imgContainer.appendChild(img);

    // --- Lógica del Badge ---
    if (producto.badge) {
        const badge = document.createElement("span");
        badge.classList.add("producto-badge");
        // Si es "Oferta" arma "badge-oferta", si es "Nuevo" arma "badge-nuevo"
        badge.classList.add(`badge-${producto.badge.toLowerCase()}`);
        badge.textContent = producto.badge;
        imgContainer.appendChild(badge);
    }

    card.appendChild(imgContainer);

    // --- Cuerpo de tarjeta ---
    const body = document.createElement("div");
    body.classList.add("producto-body");

    const categoria = document.createElement("span");
    categoria.classList.add("producto-categoria");
    categoria.textContent = producto.categoria;

    const titulo = document.createElement("h3");
    titulo.classList.add("producto-titulo");
    titulo.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.classList.add("producto-precio");
    precio.textContent = `$${producto.precio.toFixed(2)}`;

    const stock = document.createElement("p");
    stock.classList.add("producto-stock");
    // Mini ternario de control:
    stock.textContent = producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin stock";
    if (producto.stock === 0) stock.classList.add("text-danger", "fw-bold");

    // --- Botón --- (Inerte por ahora, lo maneja tu compañero)
    const divBoton = document.createElement("div");
    divBoton.classList.add("mt-auto", "pt-3"); // mt-auto para empujar el botón abajo

    const boton = document.createElement("button");
    boton.classList.add("btn", "btn-primary", "w-100", "producto-btn-agregar");
    boton.textContent = "Añadir al carrito";
    // Si no hay stock, lo matamos
    if (producto.stock === 0) boton.disabled = true;

    divBoton.appendChild(boton);

    // Inserción en orden
    body.appendChild(categoria);
    body.appendChild(titulo);
    body.appendChild(precio);
    body.appendChild(stock);
    body.appendChild(divBoton);

    card.appendChild(body);

    return card;
}
