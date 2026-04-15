/**
 * Catálogo estático: laptops gaming y accesorios (sin base de datos).
 * Expone window.CATALOGO_PRODUCTOS para main.js
 */
(function () {
  window.CATALOGO_PRODUCTOS = [
    {
      id: "lap-asus-rog-g16",
      category: "laptop",
      name: "ASUS ROG Strix G16",
      price: 1299,
      imgSrc: "img/laptop-01.jpg",
      shortDesc:
        "Potencia RTX 4060 y pantalla QHD 165 Hz para competir con fluidez.",
      specs: {
        ram: "16 GB DDR5",
        cpu: "Intel Core i7-13650HX",
        storage: "1 TB NVMe SSD",
        gpu: "NVIDIA GeForce RTX 4060",
        screen: '16" QHD 165 Hz',
      },
    },
    {
      id: "lap-lenovo-legion-5",
      category: "laptop",
      name: "Lenovo Legion 5 Pro",
      price: 1199,
      imgSrc: "img/laptop-02.jpg",
      shortDesc:
        "Equilibrio entre refrigeración y rendimiento para sesiones largas.",
      specs: {
        ram: "32 GB DDR5",
        cpu: "AMD Ryzen 7 7840HS",
        storage: "1 TB NVMe SSD",
        gpu: "NVIDIA GeForce RTX 4070",
        screen: '16" WQXGA 165 Hz',
      },
    },
    {
      id: "lap-msi-katana",
      category: "laptop",
      name: "MSI Katana 15",
      price: 999,
      imgSrc: "img/laptop-03.jpg",
      shortDesc:
        "Entrada sólida al gaming con GPU dedicada y teclado retroiluminado.",
      specs: {
        ram: "16 GB DDR5",
        cpu: "Intel Core i7-13620H",
        storage: "512 GB NVMe SSD",
        gpu: "NVIDIA GeForce RTX 4050",
        screen: '15.6" FHD 144 Hz',
      },
    },
    {
      id: "lap-hp-omen",
      category: "laptop",
      name: "HP OMEN 16",
      price: 1099,
      imgSrc: "img/laptop-04.jpg",
      shortDesc:
        "Diseño agresivo y OMEN Gaming Hub para ajustar rendimiento en vivo.",
      specs: {
        ram: "16 GB DDR5",
        cpu: "AMD Ryzen 9 7940HS",
        storage: "1 TB NVMe SSD",
        gpu: "NVIDIA GeForce RTX 4060",
        screen: '16.1" QHD 165 Hz',
      },
    },
    {
      id: "lap-acer-nitro",
      category: "laptop",
      name: "Acer Nitro 5",
      price: 849,
      imgSrc: "img/laptop-05.jpg",
      shortDesc:
        "Relación calidad-precio con buena ventilación y panel de alta frecuencia.",
      specs: {
        ram: "16 GB DDR5",
        cpu: "Intel Core i5-12500H",
        storage: "512 GB NVMe SSD",
        gpu: "NVIDIA GeForce RTX 3050",
        screen: '15.6" FHD 144 Hz',
      },
    },
    {
      id: "lap-dell-g15",
      category: "laptop",
      name: "Dell G15 5520",
      price: 949,
      imgSrc: "img/laptop-06.jpg",
      shortDesc:
        "Alienware-inspired cooling y opciones de RAM expandibles.",
      specs: {
        ram: "16 GB DDR5",
        cpu: "Intel Core i7-12700H",
        storage: "512 GB NVMe SSD",
        gpu: "NVIDIA GeForce RTX 3060",
        screen: '15.6" FHD 120 Hz',
      },
    },
    {
      id: "acc-teclado-rgb",
      category: "accessory",
      name: "Teclado mecánico RGB",
      price: 89,
      imgSrc: "img/acc-teclado.jpg",
      shortDesc:
        "Switches táctiles, iluminación por tecla y software de personalización.",
      specs: {
        destacado: "Switches mecánicos hot-swap",
        conexion: "USB-C desmontable",
        compatibilidad: "Windows / macOS / Linux",
      },
    },
    {
      id: "acc-mouse-inalambrico",
      category: "accessory",
      name: "Mouse gaming inalámbrico",
      price: 99,
      imgSrc: "img/acc-mouse.jpg",
      shortDesc:
        "Sensor de alta precisión, peso ajustable y batería de larga duración.",
      specs: {
        destacado: "Hasta 26K DPI",
        conexion: "2.4 GHz + Bluetooth",
        compatibilidad: "Recarga USB-C",
      },
    },
    {
      id: "acc-auriculares",
      category: "accessory",
      name: "Auriculares gaming 7.1",
      price: 129,
      imgSrc: "img/acc-headset.jpg",
      shortDesc:
        "Audio envolvente virtual, micrófono retráctil y almohadillas memory foam.",
      specs: {
        destacado: "Sonido espacial y mezcla de chat",
        conexion: "USB / jack 3.5 mm",
        compatibilidad: "PC y consolas",
      },
    },
    {
      id: "acc-alfombrilla",
      category: "accessory",
      name: "Alfombrilla XL RGB",
      price: 29,
      imgSrc: "img/acc-pad.jpg",
      shortDesc:
        "Superficie de tela de precisión con borde cosido y base antideslizante.",
      specs: {
        destacado: "900 x 400 mm",
        conexion: "USB para borde RGB",
        compatibilidad: "Todos los sensores ópticos",
      },
    },
    {
      id: "acc-base-refrigeracion",
      category: "accessory",
      name: "Base de refrigeración",
      price: 45,
      imgSrc: "img/acc-cooler.jpg",
      shortDesc:
        "Ventiladores silenciosos e inclinación ergonómica para tu laptop.",
      specs: {
        destacado: "6 niveles de inclinación",
        conexion: "Alimentación USB passthrough",
        compatibilidad: "Hasta 17 pulgadas",
      },
    },
    {
      id: "acc-mochila",
      category: "accessory",
      name: "Mochila gaming",
      price: 59,
      imgSrc: "img/acc-backpack.jpg",
      shortDesc:
        "Compartimentos acolchados para laptop, cables y periféricos.",
      specs: {
        destacado: "Compartimento antirrobo",
        conexion: "Puerto USB externo (power bank no incluido)",
        compatibilidad: "Laptops hasta 17.3\"",
      },
    },
  ];
})();
