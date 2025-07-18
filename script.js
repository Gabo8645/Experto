// script.js

document.addEventListener("DOMContentLoaded", () => {
  const pages = ["home", "promotions", "history", "profile"];
  const navLinks = document.querySelectorAll(".bottom-nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      showPage(target);
    });
  });

  function showPage(pageId) {
    pages.forEach(page => {
      document.getElementById(page).classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
    navLinks.forEach(link => link.classList.remove("active"));
    document.querySelector(`.bottom-nav a[data-target='${pageId}']`).classList.add("active");
  }

  // Inicializar Home por defecto
  showPage("home");

  // Cargar mundos en Home
  const worlds = [
    { id: "basico", name: "Básico", icon: "🧹" },
    { id: "profundo", name: "Profundo", icon: "🧼" },
    { id: "oficinas", name: "Oficinas", icon: "🏢" },
    { id: "hogar", name: "Hogar", icon: "🏠" },
    { id: "alfombras", name: "Alfombras", icon: "🪟" }
  ];

  const grid = document.getElementById("worldGrid");
  if (grid) {
    worlds.forEach(w => {
      const card = document.createElement("div");
      card.classList.add("card-world");
      card.innerHTML = `<div class="icon-world">${w.icon}</div><span>${w.name}</span>`;
      card.addEventListener("click", () => loadExperts(w.id));
      grid.appendChild(card);
    });
  }

  // Simular expertos
  const expertList = [
    { name: "Ana Pérez", rating: 4.5, img: "https://randomuser.me/api/portraits/women/1.jpg" },
    { name: "Luis Gómez", rating: 4.8, img: "https://randomuser.me/api/portraits/men/2.jpg" },
    { name: "Carla Díaz", rating: 4.9, img: "https://randomuser.me/api/portraits/women/3.jpg" },
    { name: "Mario Ruiz", rating: 4.7, img: "https://randomuser.me/api/portraits/men/4.jpg" },
    { name: "Sofía León", rating: 5.0, img: "https://randomuser.me/api/portraits/women/5.jpg" },
    { name: "Daniela Romero", rating: 4.6, img: "https://randomuser.me/api/portraits/women/6.jpg" },
    { name: "José Ortega", rating: 4.5, img: "https://randomuser.me/api/portraits/men/7.jpg" },
    { name: "Andrea Vargas", rating: 4.8, img: "https://randomuser.me/api/portraits/women/8.jpg" },
    { name: "Carlos Salas", rating: 4.9, img: "https://randomuser.me/api/portraits/men/9.jpg" },
    { name: "Valeria Mora", rating: 5.0, img: "https://randomuser.me/api/portraits/women/10.jpg" }
  ];

  function loadExperts(worldId) {
    const section = document.getElementById("home");
    section.innerHTML = "<h2>Selecciona un experto</h2>";
    expertList.forEach(expert => {
      const card = document.createElement("div");
      card.classList.add("expert-card");
      card.innerHTML = `
        <img class="expert-photo" src="${expert.img}" alt="${expert.name}">
        <div>
          <strong>${expert.name}</strong><br>
          <span class="stars">${"★".repeat(Math.floor(expert.rating))}</span>
        </div>
      `;
      card.addEventListener("click", () => selectExpert(expert));
      section.appendChild(card);
    });
  }

  function selectExpert(expert) {
    alert(`Has seleccionado a ${expert.name}`);
    // Continuar flujo hacia pantalla de fecha, pago, etc.
    // Puedes expandir aquí según el flujo del negocio
  }

  // Historial simulado
  const historyContainer = document.getElementById("historyList");
  if (historyContainer) {
    const mockHistory = [
      { date: "2025-07-15", world: "Básico", points: 10 },
      { date: "2025-07-05", world: "Profundo", points: 15 },
      { date: "2025-06-30", world: "Oficinas", points: 12 }
    ];
    mockHistory.forEach(entry => {
      const div = document.createElement("div");
      div.classList.add("section");
      div.innerHTML = `<strong>${entry.world}</strong><br>${entry.date}<br>Puntos: ${entry.points}`;
      historyContainer.appendChild(div);
    });
  }

  // Promociones simuladas
  const promoContainer = document.getElementById("promotionsList");
  if (promoContainer) {
    const promos = [
      "15% de descuento en limpieza profunda",
      "Gana 2x puntos en el Mundo Básico esta semana",
      "Invita a un amigo y recibe 5 puntos",
      "Promoción exclusiva para nuevos clientes"
    ];
    promos.forEach(promo => {
      const div = document.createElement("div");
      div.classList.add("section");
      div.innerHTML = `<strong>${promo}</strong>`;
      promoContainer.appendChild(div);
    });
  }
});

