// ===================== DATOS GLOBALES =====================
let user = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  limpiezaPurchases: { basico: 0, profundo: 0, auto: 0 },
  history: []
};

let currentService = null;
let selectedExpert = null;
let spacesCount = 1;
let carsCount = 1;
let baseCost = 30;
let selectedAreas = {}; // Áreas dinámicas
let carType = "sedan"; // Tipo de auto seleccionado

// ===================== DOM =====================
const DOM = {
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
  scheduleDateInput: document.getElementById("scheduleDate"),
  spacesInput: document.getElementById("spacesInput"),
  totalSpaces: document.getElementById("totalSpaces"),
  totalCost: document.getElementById("totalCost"),
  carsInput: document.getElementById("carsInput"),
  totalCars: document.getElementById("totalCars"),
  totalCarCost: document.getElementById("totalCarCost"),
  btnNextFromExperts: document.getElementById("btnNextFromExperts"),
  btnCalculateTotal: document.getElementById("btnCalculateTotal"),
  btnNextFromCars: document.getElementById("btnNextFromCars"),
  btnConfirmPayment: document.getElementById("btnConfirmPayment"),
  expertsContainer: document.getElementById("expertsContainer"),
  historyContainer: document.getElementById("historyContainer"),
  trackStatus: document.getElementById("trackStatus"),
  btnAuto: document.getElementById("btnAuto"),
  profileForm: document.getElementById("profileForm"),
};

// ===================== TOOLTIP INFO =====================
document.querySelectorAll(".info-icon").forEach(icon => {
  const infoDiv = icon.parentElement.nextElementSibling;
  if (infoDiv) icon.setAttribute("data-target", infoDiv.id);
});

document.querySelectorAll(".info-icon").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const id = btn.getAttribute("data-target");
    if (!id) return;
    document.querySelectorAll(".service-info").forEach(el => {
      if (el.id !== id) el.classList.add("hidden");
    });
    document.getElementById(id).classList.toggle("hidden");
  });
});

// ===================== NAVEGACIÓN =====================
function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  const section = document.getElementById(sectionId);
  if (section) section.classList.remove("hidden");

  document.querySelectorAll(".bottom-nav button").forEach(btn => btn.classList.remove("active"));
  const navBtn = document.querySelector(
    `#nav${sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace("Section","")}`
  );
  if (navBtn) navBtn.classList.add("active");
}

// ===================== PERFIL =====================
if (DOM.profileForm) {
  DOM.profileForm.addEventListener("submit", e => {
    e.preventDefault();
    user.name = document.getElementById("profileName").value;
    user.lastName = document.getElementById("profileLastName").value;
    user.email = document.getElementById("profileEmail").value;
    user.phone = document.getElementById("profilePhone").value;
    user.address = document.getElementById("profileAddress").value;
    document.getElementById("defaultAddress").textContent = `Dirección: ${user.address}`;
    alert("Perfil guardado correctamente!");
  });
}

// ===================== FLUJO DE SERVICIOS =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;
  loadExperts();
  showSection("expertSection");
  checkAutoAvailability();
}

// ===================== EXPERTOS =====================
const experts = [
  { name: "Juan Pérez", rating: 4.8, photo: "https://randomuser.me/api/portraits/men/1.jpg", description: "Especialista en limpieza básica y profunda de hogares" },
  { name: "María López", rating: 4.9, photo: "https://randomuser.me/api/portraits/women/2.jpg", description: "Experta en detalles y limpieza profunda de áreas difíciles" },
  { name: "Carlos Ruiz", rating: 4.7, photo: "https://randomuser.me/api/portraits/men/3.jpg", description: "Encargado de lavadas de autos y mantenimiento general" },
];

function loadExperts() {
  DOM.expertsContainer.innerHTML = "";
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${exp.photo}" alt="${exp.name}" class="expert-photo"/>
      <h3>${exp.name}</h3>
      <p>⭐ ${exp.rating}</p>
      <p>${exp.description}</p>`;
    card.onclick = () => {
      selectedExpert = exp;
      document.querySelectorAll("#expertsContainer .card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      DOM.btnNextFromExperts.disabled = false;
    };
    DOM.expertsContainer.appendChild(card);
  });
}

// ===================== BOTÓN SIGUIENTE EXPERTOS =====================
if (DOM.btnNextFromExperts) {
  DOM.btnNextFromExperts.addEventListener("click", () => {
    if (!selectedExpert) return;
    if (currentService === "auto") {
      showSection("carSection");
    } else {
      renderAreas();
      showSection("areasSection");
    }
  });
}

// ===================== ÁREAS =====================
const areas = [
  { id: "habitacion", label: "Habitación", price: 10 },
  { id: "bano", label: "Baño", price: 8 },
  { id: "cocina", label: "Cocina", price: 12 },
  { id: "sala", label: "Sala", price: 9 },
  { id: "comedor", label: "Comedor", price: 7 },
  { id: "terraza", label: "Terraza", price: 11 }
];

function renderAreas() {
  const container = document.getElementById("areasContainer");
  if (!container) return;
  container.innerHTML = "";
  areas.forEach(area => {
    selectedAreas[area.id] = 0;
    const div = document.createElement("div");
    div.className = "area-item";
    div.innerHTML = `<span>${area.label} ($${area.price})</span>`;
    container.appendChild(div);
  });
}

// ===================== ESPACIOS =====================
function increaseSpaces() { spacesCount = Math.min(10, spacesCount + 1); updateSpaces(); }
function decreaseSpaces() { spacesCount = Math.max(1, spacesCount - 1); updateSpaces(); }
function updateSpaces() {
  DOM.spacesInput.value = spacesCount;
  DOM.totalSpaces.textContent = spacesCount;
  let total = 0;
  for (const [id, count] of Object.entries(selectedAreas)) {
    const area = areas.find(a => a.id === id);
    if (area) total += area.price * count;
  }
  DOM.totalCost.textContent = total.toFixed(2);
}

// ===================== BOTÓN VER RESUMEN ÁREAS =====================
if (DOM.btnCalculateTotal) {
  DOM.btnCalculateTotal.addEventListener("click", () => {
    if (spacesCount < 1) { alert("Debes seleccionar al menos 1 espacio"); return; }
    generateSummary(currentService);
    if (currentService === "basico") user.limpiezaPurchases.basico++;
    if (currentService === "profundo") {
      user.limpiezaPurchases.profundo++;
      checkAutoAvailability();
    }
    // Guardar en historial
    if(currentService !== "auto") {
      user.history.push({
        service: currentService,
        expert: selectedExpert ? selectedExpert.name : "-",
        date: new Date().toLocaleString(),
        address: user.address,
        areas: selectedAreas,
        spacesCount: spacesCount,
        carsCount: null,
        carType: null,
        total: DOM.totalCost.textContent
      });
      renderHistory();
    }
  });
}

// ===================== AUTOS =====================
function selectCar(type) {
  carType = type;
  document.querySelectorAll('.car-option').forEach(el => el.classList.remove('selected'));
  document.getElementById(`car-${type}`).classList.add('selected');
  updateCarTotal();
}

function increaseCars() { carsCount = Math.min(10, carsCount + 1); updateCarTotal(); }
function decreaseCars() { carsCount = Math.max(1, carsCount - 1); updateCarTotal(); }

function updateCarTotal() {
  const prices = { sedan: 10, crossover: 15, suv: 20, camioneta: 18 };
  let cost = prices[carType] || 10;
  DOM.carsInput.value = carsCount;
  DOM.totalCars.textContent = carsCount;
  DOM.totalCarCost.textContent = (carsCount * cost).toFixed(2);
}

// Botón siguiente autos
if (DOM.btnNextFromCars) {
  DOM.btnNextFromCars.addEventListener("click", () => {
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
    user.history.push({
      service: "auto",
      expert: selectedExpert ? selectedExpert.name : "-",
      date: new Date().toLocaleString(),
      address: user.address,
      areas: null,
      spacesCount: null,
      carsCount: carsCount,
      carType: carType,
      total: DOM.totalCarCost.textContent
    });
    renderHistory();
  });
}

// ===================== DESBLOQUEO AUTO =====================
function checkAutoAvailability() {
  if (DOM.btnAuto) {
    DOM.btnAuto.disabled = user.limpiezaPurchases.profundo < 1;
  }
}

// ===================== RESUMEN =====================
function generateSummary(service) {
  let html = `<h2>Resumen del servicio</h2>`;
  html += `<p><strong>Dirección:</strong> ${user.address || "-"}</p>`;
  html += `<p><strong>Experto:</strong> ${selectedExpert ? selectedExpert.name : "-"}</p>`;
  
  if (service === "basico" || service === "profundo") {
    let total = 0;
    html += `<p><strong>Áreas:</strong></p><ul>`;
    for (const [id, count] of Object.entries(selectedAreas)) {
      if (count > 0) {
        const area = areas.find(a => a.id === id);
        total += area.price * count;
        html += `<li>${area.label}: ${count} x $${area.price}</li>`;
      }
    }
    html += `</ul>`;
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  } else if (service === "auto") {
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${carType}</p>`;
    html += `<p><strong>Autos:</strong> ${carsCount}</p>`;
    html += `<p><strong>Total:</strong> $${DOM.totalCarCost.textContent}</p>`;
  }
  html += `<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML = html;
  showSection("summarySection");
}

// ===================== PAGO =====================
function goToPayment() { showSection("paymentSection"); }
if (DOM.btnConfirmPayment) {
  DOM.btnConfirmPayment.addEventListener("click", () => {
    startTracking();
  });
}

// ===================== TRACKING =====================
function startTracking() {
  showSection("trackingSection");
  const steps = [
    "🧑‍🔧 Experto asignado",
    "🚗 En camino",
    "🧹 Servicio en progreso",
    "✅ Servicio finalizado",
    "🎉 Gracias por elegirnos Xperto, porque tu tiempo vale más"
  ];
  let i = 0;
  const interval = setInterval(() => {
    DOM.trackStatus.textContent = steps[i];
    i++;
    if (i >= steps.length) clearInterval(interval);
  }, 2000);
}

// ===================== HISTORIAL =====================
function renderHistory() {
  if (!DOM.historyContainer) return;
  DOM.historyContainer.innerHTML = "";
  user.history.forEach((h, idx) => {
    const div = document.createElement("div");
    div.className = "card";
    let content = `<p><strong>Servicio:</strong> ${h.service}</p>
                   <p><strong>Fecha:</strong> ${h.date}</p>
                   <p><strong>Dirección:</strong> ${h.address}</p>
                   <p><strong>Experto:</strong> ${h.expert}</p>`;
    if (h.areas) {
      content += `<p><strong>Áreas:</strong></p><ul>`;
      for (const [id, count] of Object.entries(h.areas)) {
        if (count > 0) {
          const area = areas.find(a => a.id === id);
          content += `<li>${area.label}: ${count}</li>`;
        }
      }
      content += `</ul>`;
    }
    if (h.carsCount) {
      content += `<p><strong>Tipo de auto:</strong> ${h.carType}</p>
                  <p><strong>Autos:</strong> ${h.carsCount}</p>`;
    }
    content += `<p><strong>Total:</strong> $${h.total}</p>`;
    div.innerHTML = content;
    DOM.historyContainer.appendChild(div);
  });
}

// ===================== INIT =====================
updateCarTotal();
updateSpaces();
showSection("worldSelection");
checkAutoAvailability();
