// ===================== DATOS GLOBALES =====================
let user = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  limpiezaPurchases: { basico: 0, profundo: 0, auto: 0 }
};

let currentService = null;
let selectedExpert = null;
let spacesCount = 1;
let carsCount = 1;
let baseCost = 30;

// ===================== DOM =====================
const DOM = {
  // Secciones
  worldSelection: document.getElementById("worldSelection"),
  expertSection: document.getElementById("expertSection"),
  areasSection: document.getElementById("areasSection"),
  carSection: document.getElementById("carSection"),
  summarySection: document.getElementById("summarySection"),
  paymentSection: document.getElementById("paymentSection"),
  trackingSection: document.getElementById("trackingSection"),
  promosSection: document.getElementById("promosSection"),
  historySection: document.getElementById("historySection"),
  profileSection: document.getElementById("profileSection"),

  // Inputs
  scheduleDateInput: document.getElementById("scheduleDate"),
  spacesInput: document.getElementById("spacesInput"),
  totalSpaces: document.getElementById("totalSpaces"),
  totalCost: document.getElementById("totalCost"),
  carsInput: document.getElementById("carsInput"),
  totalCars: document.getElementById("totalCars"),
  totalCarCost: document.getElementById("totalCarCost"),

  // Botones
  btnNextFromExperts: document.getElementById("btnNextFromExperts"),
  btnCalculateTotal: document.getElementById("btnCalculateTotal"),
  btnNextFromCars: document.getElementById("btnNextFromCars"),
  btnConfirmPayment: document.getElementById("btnConfirmPayment"),

  // Containers
  expertsContainer: document.getElementById("expertsContainer"),
  historyContainer: document.getElementById("historyContainer"),

  // Otros
  trackStatus: document.getElementById("trackStatus"),
};

// ===================== TOOLTIP INFO =====================
function toggleInfo(event, id) {
  event.stopPropagation();
  document.querySelectorAll(".service-info").forEach(el => {
    if (el.id !== id) el.classList.add("hidden");
  });
  document.getElementById(id).classList.toggle("hidden");
}

// ===================== NAVEGACIÓN =====================
function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  const section = document.getElementById(sectionId);
  if (section) section.classList.remove("hidden");

  document.querySelectorAll(".bottom-nav button").forEach(btn => btn.classList.remove("active"));
  const navBtn = document.querySelector(`#nav${sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace("Section","")}`);
  if (navBtn) navBtn.classList.add("active");
}

// ===================== FLUJO DE SERVICIOS =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;

  if (service === "basico" || service === "profundo") {
    loadExperts();
    showSection("expertSection");
  } else if (service === "auto") {
    showSection("carSection");
  }
}

// ===================== EXPERTOS =====================
const experts = [
  { name: "Juan Pérez", rating: 4.8 },
  { name: "María López", rating: 4.9 },
  { name: "Carlos Ruiz", rating: 4.7 },
];

function loadExperts() {
  DOM.expertsContainer.innerHTML = "";
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${exp.name}</h3><p>⭐ ${exp.rating}</p>`;
    card.onclick = () => {
      selectedExpert = exp;
      document.querySelectorAll("#expertsContainer .card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      DOM.btnNextFromExperts.disabled = false;
    };
    DOM.expertsContainer.appendChild(card);
  });
}

function goToAreas() {
  if (!selectedExpert) return;
  showSection("areasSection");
}

// ===================== ÁREAS =====================
function increaseSpaces() {
  if (spacesCount < 10) spacesCount++;
  updateSpaces();
}
function decreaseSpaces() {
  if (spacesCount > 1) spacesCount--;
  updateSpaces();
}
function updateSpaces() {
  DOM.spacesInput.value = spacesCount;
  DOM.totalSpaces.textContent = spacesCount;
  DOM.totalCost.textContent = (spacesCount * baseCost).toFixed(2);
}

// ===================== AUTOS =====================
function increaseCars() {
  if (carsCount < 10) carsCount++;
  updateCars();
}
function decreaseCars() {
  if (carsCount > 1) carsCount--;
  updateCars();
}
function updateCars() {
  DOM.carsInput.value = carsCount;
  DOM.totalCars.textContent = carsCount;

  let type = document.querySelector('input[name="carType"]:checked').value;
  let cost = 10;
  if (type === "crossover") cost = 15;
  if (type === "suv") cost = 20;
  if (type === "camioneta") cost = 18;

  DOM.totalCarCost.textContent = (carsCount * cost).toFixed(2);
}

function updateCarCost() {
  updateCars();
}

function goToCarSummary() {
  generateSummary("auto");
}

// ===================== RESUMEN =====================
function generateSummary(service) {
  let html = `<h2>Resumen del servicio</h2>`;

  if (service === "basico" || service === "profundo") {
    html += `<p><strong>Servicio:</strong> Limpieza ${service}</p>`;
    html += `<p><strong>Espacios:</strong> ${spacesCount}</p>`;
    html += `<p><strong>Total:</strong> $${(spacesCount * baseCost).toFixed(2)}</p>`;
  } else if (service === "auto") {
    let type = document.querySelector('input[name="carType"]:checked').value;
    let cost = DOM.totalCarCost.textContent;
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${type}</p>`;
    html += `<p><strong>Autos:</strong> ${carsCount}</p>`;
    html += `<p><strong>Total:</strong> $${cost}</p>`;
  }

  html += `<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML = html;
  showSection("summarySection");
}

// ===================== PAGO =====================
function goToPayment() {
  showSection("paymentSection");
}

DOM.paymentForm = document.getElementById("paymentForm");
DOM.paymentForm.addEventListener("change", e => {
  if (e.target.name === "pay" && e.target.value === "tarjeta") {
    document.getElementById("cardDetails").classList.remove("hidden");
  } else {
    document.getElementById("cardDetails").classList.add("hidden");
  }
});

DOM.btnConfirmPayment.addEventListener("click", () => {
  showSection("trackingSection");
  setTimeout(() => {
    DOM.trackStatus.textContent = "✅ Servicio confirmado. Gracias por confiar en Xperto!";
  }, 2000);
});

// ===================== INIT =====================
updateSpaces();
updateCars();
showSection("worldSelection");
