// ======== Datos iniciales ========

// Usuario simulado (se cargará o guardará en localStorage)
let user = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  limpiezaPurchases: 0, // para desbloquear limpieza profunda
  history: [] // historial de servicios contratados
};

// Mundos de limpieza
const worlds = {
  basico: {
    name: "Básico",
    icon: "https://img.icons8.com/ios-filled/50/000000/broom.png",
    description: "Limpieza básica",
    unlocksAt: 0
  },
  profundo: {
    name: "Limpieza Profunda",
    icon: "https://img.icons8.com/ios-filled/50/000000/vacuum.png",
    description: "Limpieza profunda",
    unlocksAt: 3
  },
  auto: {
    name: "Lavada de Auto",
    icon: "https://img.icons8.com/ios-filled/50/000000/car.png",
    description: "Lavado interior y exterior de auto",
    unlocksAt: 3 // se habilita después de 3 limpiezas básicas
  }
};

// Expertos
const experts = [
  { id: 1, name: "Juan Pérez", stars: 4, comments: "Limpia cocina y salas", photo: "https://randomuser.me/api/portraits/men/32.jpg", specialty: "Cocinas y salas" },
  { id: 2, name: "María Gómez", stars: 5, comments: "Especialista en baños", photo: "https://randomuser.me/api/portraits/women/45.jpg", specialty: "Baños profundos" },
  { id: 3, name: "Carlos Torres", stars: 3, comments: "Terrazas y exteriores impecables", photo: "https://randomuser.me/api/portraits/men/12.jpg", specialty: "Terrazas y exteriores" },
  { id: 4, name: "Lucía Martínez", stars: 5, comments: "Habitaciones y oficinas", photo: "https://randomuser.me/api/portraits/women/68.jpg", specialty: "Habitaciones y oficinas" },
  { id: 5, name: "Pedro Ruiz", stars: 4, comments: "Limpieza general rápida y eficiente", photo: "https://randomuser.me/api/portraits/men/75.jpg", specialty: "Limpieza general" }
];

// Áreas con precios
const areas = [
  { id: "habitaciones", label: "Habitaciones", price: 10 },
  { id: "cocina", label: "Cocina", price: 15 },
  { id: "comedor", label: "Comedor", price: 12 },
  { id: "sala", label: "Sala", price: 12 },
  { id: "terraza", label: "Terraza", price: 20 }
];

// ======== Estado de la aplicación ========
let selectedWorld = null;
let selectedExpert = null;
let selectedAreas = {};
let selectedSchedule = "inmediato";
let selectedDate = null;
let selectedPayment = null;

// ======== DOM elements ========
const defaultAddressEl = document.getElementById("defaultAddress");

const worldSelectionSection = document.getElementById("worldSelection");
const expertSection = document.getElementById("expertSection");
const expertsContainer = document.getElementById("expertsContainer");
const btnNextFromExperts = document.getElementById("btnNextFromExperts");

const areasSection = document.getElementById("areasSection");
const areasContainer = document.getElementById("areasContainer");
const scheduleRadios = document.querySelectorAll('input[name="schedule"]');
const scheduleDateInput = document.getElementById("scheduleDate");
const btnCalculateTotal = document.getElementById("btnCalculateTotal");

const summarySection = document.getElementById("summarySection");

const paymentSection = document.getElementById("paymentSection");
const paymentForm = document.getElementById("paymentForm");
const cardDetailsDiv = document.getElementById("cardDetails");
const btnConfirmPayment = document.getElementById("btnConfirmPayment");

const trackingSection = document.getElementById("trackingSection");
const trackStatus = document.getElementById("trackStatus");

const promosSection = document.getElementById("promosSection");
const historySection = document.getElementById("historySection");
const historyContainer = document.getElementById("historyContainer");

const profileSection = document.getElementById("profileSection");
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileLastName = document.getElementById("profileLastName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileAddress = document.getElementById("profileAddress");

const navButtons = {
  worldSelection: document.getElementById("navHome"),
  promosSection: document.getElementById("navPromos"),
  historySection: document.getElementById("navHistory"),
  profileSection: document.getElementById("navProfile"),
};

// ======== Funciones para cargar y guardar usuario ========
function loadUser() {
  const saved = localStorage.getItem("xpertoUser");
  if(saved) {
    user = JSON.parse(saved);
    profileName.value = user.name || "";
    profileLastName.value = user.lastName || "";
    profileEmail.value = user.email || "";
    profilePhone.value = user.phone || "";
    profileAddress.value = user.address || "";
    updateDefaultAddress();
  }
}
function saveUser() {
  user.name = profileName.value.trim();
  user.lastName = profileLastName.value.trim();
  user.email = profileEmail.value.trim();
  user.phone = profilePhone.value.trim();
  user.address = profileAddress.value.trim();
  localStorage.setItem("xpertoUser", JSON.stringify(user));
  updateDefaultAddress();
  alert("Perfil guardado correctamente.");
  showSection("worldSelection");
}
function updateDefaultAddress() {
  if(user.address) {
    defaultAddressEl.textContent = `Dirección: ${user.address}`;
    defaultAddressEl.style.marginTop = "0.5rem";
  } else {
    defaultAddressEl.textContent = "Por favor, configura tu dirección en Perfil.";
    defaultAddressEl.style.marginTop = "0.5rem";
  }
}

// ======== Navegación entre secciones ========
function showSection(sectionId) {
  // Ocultar todas las secciones principales
  const sections = [worldSelectionSection, expertSection, areasSection, summarySection, paymentSection, trackingSection, promosSection, historySection, profileSection];
  sections.forEach(sec => sec.classList.add("hidden"));

  // Quitar clase active de todos los nav buttons
  Object.values(navButtons).forEach(btn => btn.classList.remove("active"));

  // Mostrar la sección solicitada
  switch(sectionId) {
    case "worldSelection":
      worldSelectionSection.classList.remove("hidden");
      navButtons.worldSelection.classList.add("active");
      resetApp();
      break;
    case "promosSection":
      promosSection.classList.remove("hidden");
      navButtons.promosSection.classList.add("active");
      break;
    case "historySection":
      historySection.classList.remove("hidden");
      navButtons.historySection.classList.add("active");
      renderHistory();
      break;
    case "profileSection":
      profileSection.classList.remove("hidden");
      navButtons.profileSection.classList.add("active");
      break;
  }
}

// ======== Reset app para iniciar nuevo servicio ========
function resetApp() {
  selectedWorld = null;
  selectedExpert = null;
  selectedAreas = {};
  selectedSchedule = "inmediato";
  selectedDate = null;
  selectedPayment = null;

  expertSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  btnNextFromExperts.disabled = true;
  scheduleDateInput.value = "";
  scheduleDateInput.classList.add("hidden");

  // Reset expertos container (enabled buttons)
  renderExperts();
}

// ======== Selección de mundo ========
function selectWorld(worldKey) {
  // Chequear desbloqueo limpieza profunda
  if(worldKey === "profundo" && user.limpiezaPurchases < worlds.profundo.unlocksAt) {
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios básicos para desbloquear limpieza profunda.`);
    return;
  }

  selectedWorld = worldKey;

  // Mostrar expertos
  expertSection.classList.remove("hidden");
  worldSelectionSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  renderExperts();
}

// ======== Renderizar expertos ========
function renderExperts() {
  expertsContainer.innerHTML = "";
  selectedExpert = null;
  btnNextFromExperts.disabled = true;

  experts.forEach(exp => {
    // Si seleccionó limpieza básico, ocultamos especialistas en limpieza profunda
    if(selectedWorld === "basico" && exp.specialty.toLowerCase().includes("profundo")) {
      return; // saltar
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `
      <img src="${exp.photo}" alt="Foto de ${exp.name}" />
      <h3>${exp.name}</h3>
      <p class="stars">${"★".repeat(exp.stars)}${"☆".repeat(5 - exp.stars)}</p>
      <p class="comment">${exp.comments}</p>
      <p><em>${exp.specialty}</em></p>
    `;
    card.addEventListener("click", () => {
      selectExpert(exp.id);
    });
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectExpert(exp.id);
      }
    });
    expertsContainer.appendChild(card);
  });
}

function selectExpert(id) {
  selectedExpert = experts.find(e => e.id === id);
  // marcar visualmente la selección
  [...expertsContainer.children].forEach(card => {
    card.classList.remove("selected");
  });
  const selectedCard = [...expertsContainer.children].find(card => card.querySelector("h3").textContent === selectedExpert.name);
  if(selectedCard) selectedCard.classList.add("selected");
  btnNextFromExperts.disabled = false;
}

// ======== Navegar a áreas ========
function goToAreas() {
  if(!selectedExpert) {
    alert("Por favor selecciona un experto.");
    return;
  }
  expertSection.classList.add("hidden");
  areasSection.classList.remove("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  renderAreas();
}

// ======== Renderizar áreas con input cantidad ========
function renderAreas() {
  areasContainer.innerHTML = "";
  selectedAreas = {};

  areas.forEach(area => {
    const label = document.createElement("label");
    label.innerHTML = `
      ${area.label} ($${area.price})
      <input type="number" min="0" max="10" value="0" data-area-id="${area.id}" />
    `;
    areasContainer.appendChild(label);
  });
}

// ======== Manejo de programación fecha ========
scheduleRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    selectedSchedule = document.querySelector('input[name="schedule"]:checked').value;
    if(selectedSchedule === "programado") {
      scheduleDateInput.classList.remove("hidden");
      scheduleDateInput.required = true;
    } else {
      scheduleDateInput.classList.add("hidden");
      scheduleDateInput.required = false;
      selectedDate = null;
      scheduleDateInput.value = "";
    }
  });
});
scheduleDateInput.addEventListener("change", e => {
  selectedDate = e.target.value;
});

// ======== Calcular total y mostrar resumen ========
btnCalculateTotal.addEventListener("click", () => {
  // Leer cantidades
  selectedAreas = {};
  let total = 0;
  let anyAreaSelected = false;

  areasContainer.querySelectorAll("input[type=number]").forEach(input => {
    const count = parseInt(input.value) || 0;
    if(count > 0) {
      anyAreaSelected = true;
      const areaId = input.dataset.areaId;
      const area = areas.find(a => a.id === areaId);
      selectedAreas[areaId] = count;
      total += area.price * count;
    }
  });

  if(!anyAreaSelected) {
    alert("Por favor selecciona al menos un área.");
    return;
  }

  if(selectedSchedule === "programado" && !selectedDate) {
    alert("Por favor selecciona una fecha para el servicio programado.");
    return;
  }

  // Mostrar resumen
  let summaryHTML = `<h2>Resumen del Servicio</h2>`;
  summaryHTML += `<p><strong>Mundo:</strong> ${worlds[selectedWorld].name}</p>`;
  summaryHTML += `<p><strong>Experto:</strong> ${selectedExpert.name}</p>`;
  summaryHTML += `<p><strong>Dirección:</strong> ${user.address || "No configurada"}</p>`;
  summaryHTML += `<p><strong>Áreas seleccionadas:</strong></p><ul>`;
  for(const [areaId, count] of Object.entries(selectedAreas)) {
    const area = areas.find(a => a.id === areaId);
    summaryHTML += `<li>${area.label}: ${count} x $${area.price} = $${area.price * count}</li>`;
  }
  summaryHTML += `</ul>`;
  summaryHTML += `<p><strong>Total:</strong> $${total}</p>`;
  summaryHTML += `<p><strong>Programación:</strong> ${selectedSchedule === "inmediato" ? "Inmediato" : selectedDate}</p>`;

  summarySection.innerHTML = summaryHTML;
  summarySection.classList.remove("hidden");

  areasSection.classList.add("hidden");
  paymentSection.classList.remove("hidden");
  trackingSection.classList.add("hidden");
});

// ======== Mostrar campos de tarjeta si pago es tarjeta ========
paymentForm.addEventListener("change", (e) => {
  if(e.target.name === "pay") {
    selectedPayment = e.target.value;
    if(selectedPayment === "tarjeta") {
      cardDetailsDiv.classList.remove("hidden");
    } else {
      cardDetailsDiv.classList.add("hidden");
    }
  }
});

// ======== Confirmar pago y contratar servicio ========
btnConfirmPayment.addEventListener("click", () => {
  if(!selectedPayment) {
    alert("Por favor selecciona un método de pago.");
    return;
  }

  if(selectedPayment === "tarjeta") {
    // Validar datos tarjeta (simple)
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value;
    const cardCVV = document.getElementById("cardCVV").value.trim();

    if(cardNumber.length < 13) {
      alert("Por favor ingresa un número de tarjeta válido.");
      return;
    }
    if(!cardExpiry) {
      alert("Por favor ingresa la fecha de expiración.");
      return;
    }
    if(cardCVV.length < 3) {
      alert("Por favor ingresa el código CVV.");
      return;
    }
  }

  // Guardar en historial
  const totalCost = calculateTotalCost();
  const now = new Date();
  const serviceRecord = {
    id: now.getTime(),
    date: now.toLocaleString(),
    world: worlds[selectedWorld].name,
    expert: selectedExpert.name,
    address: user.address,
    areas: {...selectedAreas},
    schedule: selectedSchedule === "inmediato" ? "Inmediato" : selectedDate,
    total: totalCost,
    paymentMethod: selectedPayment
  };
  user.history.push(serviceRecord);
  if(selectedWorld === "basico") {
    user.limpiezaPurchases++;
  }
  localStorage.setItem("xpertoUser", JSON.stringify(user));

  // Mostrar tracking
  paymentSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  trackingSection.classList.remove("hidden");
  trackStatus.textContent = "Asignando experto...";

  // Simular estados de tracking
  simulateTracking();

});

// ======== Calcular total para guardar ========
function calculateTotalCost() {
  let total = 0;
  for(const [areaId, count] of Object.entries(selectedAreas)) {
    const area = areas.find(a => a.id === areaId);
    total += area.price * count;
  }
  return total;
}

// ======== Simulación de tracking con estados y tiempos ========
function simulateTracking() {
  const statuses = [
    "Asignando experto...",
    "Experto en camino 🚗",
    "Experto ha llegado 🏠",
    "Limpieza en progreso 🧹",
    "Limpieza finalizada 🎉"
  ];
  let index = 0;

  function nextStatus() {
    if(index < statuses.length) {
      trackStatus.textContent = statuses[index];
      index++;
      setTimeout(nextStatus, 3000);
    } else {
      alert("Servicio completado. ¡Gracias por confiar en Xperto!");
      showSection("worldSelection");
      resetApp();
    }
  }
  nextStatus();
}

// ======== Renderizar historial ========
function renderHistory() {
  historyContainer.innerHTML = "";
  if(user.history.length === 0) {
    historyContainer.innerHTML = "<p>No tienes servicios contratados aún.</p>";
    return;
  }
  user.history.slice().reverse().forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    let areasDesc = "";
    for(const [areaId, count] of Object.entries(item.areas)) {
      const area = areas.find(a => a.id === areaId);
      areasDesc += `${area.label}: ${count}, `;
    }
    areasDesc = areasDesc.slice(0, -2);
    card.innerHTML = `
      <h3>${item.world} - ${item.expert}</h3>
      <p><strong>Fecha:</strong> ${item.date}</p>
      <p><strong>Dirección:</strong> ${item.address}</p>
      <p><strong>Áreas:</strong> ${areasDesc}</p>
      <p><strong>Programación:</strong> ${item.schedule}</p>
      <p><strong>Total:</strong> $${item.total}</p>
      <p><strong>Pago:</strong> ${item.paymentMethod}</p>
    `;
    historyContainer.appendChild(card);
  });
}

// ======== Eventos perfil ========
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveUser();
});
// ======== Variables y estado Lavada de Auto ========
let carCount = 1;
let carType = 'sedan';
const maxCars = 10;

const carsInput = document.getElementById('carsInput');
const totalCarsEl = document.getElementById('totalCars');
const totalCarCostEl = document.getElementById('totalCarCost');

const btnCarIncrease = document.getElementById('btnCarIncrease');
const btnCarDecrease = document.getElementById('btnCarDecrease');

// ======== Funciones para manejar cantidad de autos ========
function increaseCars() {
  if(carCount < maxCars) carCount++;
  updateCars();
}

function decreaseCars() {
  if(carCount > 1) carCount--;
  updateCars();
}

function updateCars() {
  carsInput.value = carCount;
  totalCarsEl.textContent = carCount;

  let basePrice = 10; // sedán
  if(carType === 'crossover') basePrice = 13;
  if(carType === 'suv') basePrice = 16;
  if(carType === 'camioneta') basePrice = 19;

  const total = basePrice + (carCount - 1) * 3;
  totalCarCostEl.textContent = total.toFixed(2);

  btnCarDecrease.disabled = carCount === 1;
  btnCarIncrease.disabled = carCount === maxCars;
}

// ======== Detectar cambio de tipo de auto ========
document.querySelectorAll('input[name="carType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    carType = document.querySelector('input[name="carType"]:checked').value;
    updateCars();
  });
});

// ======== Función para ir al resumen de auto ========
function goToCarSummary() {
  const carTotal = parseFloat(totalCarCostEl.textContent);

  let summaryHTML = `<h2>Resumen del Servicio</h2>`;
  summaryHTML += `<p><strong>Mundo:</strong> ${worlds[selectedWorld].name}</p>`;
  summaryHTML += `<p><strong>Experto:</strong> ${selectedExpert.name}</p>`;
  summaryHTML += `<p><strong>Dirección:</strong> ${user.address || "No configurada"}</p>`;
  summaryHTML += `<p><strong>Tipo de Auto:</strong> ${carType}</p>`;
  summaryHTML += `<p><strong>Cantidad de Autos:</strong> ${carCount}</p>`;
  summaryHTML += `<p><strong>Total:</strong> $${carTotal.toFixed(2)}</p>`;

  summarySection.innerHTML = summaryHTML;
  summarySection.classList.remove("hidden");

  document.getElementById('areasSection').classList.add("hidden");
  document.getElementById('carSection').classList.add("hidden");
  paymentSection.classList.remove("hidden");
  trackingSection.classList.add("hidden");
}

// ======== Modificación de selectWorld para manejar autos ========
function selectWorld(worldKey) {
  if(worldKey === "profundo" && user.limpiezaPurchases < worlds.profundo.unlocksAt) {
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios básicos para desbloquear limpieza profunda.`);
    return;
  }

  selectedWorld = worldKey;
  selectedService = worldKey;

  expertSection.classList.remove("hidden");
  worldSelectionSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  renderExperts();

  if(worldKey === 'auto') {
    // Mostrar sección de autos
    document.getElementById('carSection').classList.remove('hidden');
    carCount = 1;
    carType = 'sedan';
    updateCars();
  } else {
    // Mostrar sección de áreas
    document.getElementById('carSection').classList.add('hidden');
    spaces = 1;
    updateSpaces();
  }
}
// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  showSection("worldSelection");
});
// ================= Tooltips info servicios =================
function toggleInfo(event, infoId) {
  // evita que el click cierre el tooltip por el listener global
  event.stopPropagation();

  // cerrar otros tooltips abiertos
  document.querySelectorAll('.service-info').forEach(div => {
    if (div.id !== infoId) div.classList.add('hidden');
  });

  const div = document.getElementById(infoId);
  if (!div) return;
  const isHidden = div.classList.contains('hidden');
  // alternar y actualizar aria-hidden para accesibilidad
  div.classList.toggle('hidden', !isHidden ? true : false);
  div.setAttribute('aria-hidden', (isHidden ? 'false' : 'true'));
}

// cerrar tooltips al clicar fuera
document.addEventListener('click', () => {
  document.querySelectorAll('.service-info').forEach(div => {
    div.classList.add('hidden');
    div.setAttribute('aria-hidden', 'true');
  });
});
let spaces = 1;
let selectedService = 'basico'; // se actualizará al seleccionar un servicio
const maxSpaces = 10;

const spacesInput = document.getElementById('spacesInput');
const totalSpaces = document.getElementById('totalSpaces');
const totalCost = document.getElementById('totalCost');
const btnDecrease = document.getElementById('btnDecrease');
const btnIncrease = document.getElementById('btnIncrease');

const servicePrices = {
  basico: 30,
  profundo: 50
};
function selectWorld(worldKey) {
  // Bloqueo limpieza profunda
  if(worldKey === "profundo" && user.limpiezaPurchases < worlds.profundo.unlocksAt) {
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios básicos para desbloquear limpieza profunda.`);
    return;
  }

  selectedWorld = worldKey;
  selectedService = worldKey; // para el cálculo de espacios

  // Mostrar expertos
  expertSection.classList.remove("hidden");
  worldSelectionSection.classList.add("hidden");

  renderExperts();
  updateSpaces(); // para actualizar el contador de espacios y costo
}

function increaseSpaces() {
  if (spaces < maxSpaces) {
    spaces++;
    updateSpaces();
  }
}

function decreaseSpaces() {
  if (spaces > 1) {
    spaces--;
    updateSpaces();
  }
}

function updateSpaces() {
  spacesInput.value = spaces;
  totalSpaces.textContent = spaces;
  totalCost.textContent = (spaces * servicePrices[selectedService]).toFixed(2);

  // Deshabilitar botones si se llega al límite
  btnDecrease.disabled = spaces === 1;
  btnIncrease.disabled = spaces === maxSpaces;
}
