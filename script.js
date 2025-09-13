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
let selectedAreas = {}; // Áreas dinámicas
let history = [];

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
  carsInputSelect: document.getElementById("carsInputSelect"),
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
  defaultAddress: document.getElementById("defaultAddress"),
  paymentForm: document.getElementById("paymentForm"),
  cardDetails: document.getElementById("cardDetails")
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
  const navBtn = document.getElementById("nav" + sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
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
    DOM.defaultAddress.textContent = "Dirección: " + user.address;
    alert("Perfil guardado correctamente!");
  });
}

// ===================== FLUJO DE SERVICIOS =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;
  loadExperts();
  if(service === "auto") {
    showSection("carSection");
  } else {
    renderAreas();
    showSection("expertSection");
  }
  checkAutoAvailability();
}

// ===================== EXPERTOS =====================
const experts = [
  { name: "Juan Pérez", rating: 4.8, photo: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "María López", rating: 4.9, photo: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Carlos Ruiz", rating: 4.7, photo: "https://randomuser.me/api/portraits/men/3.jpg" },
];

function loadExperts() {
  DOM.expertsContainer.innerHTML = "";
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${exp.photo}" alt="${exp.name}" class="expert-photo"/>
      <h3>${exp.name}</h3>
      <p>⭐ ${exp.rating}</p>`;
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
    renderAreas();
    showSection("areasSection");
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
    div.innerHTML = `
      <span>${area.label} ($${area.price})</span>
      <button onclick="changeAreaCount('${area.id}', -1)">-</button>
      <span id="count-${area.id}">0</span>
      <button onclick="changeAreaCount('${area.id}', 1)">+</button>`;
    container.appendChild(div);
  });
}

function changeAreaCount(areaId, delta) {
  selectedAreas[areaId] = Math.max(0, Math.min(10, selectedAreas[areaId] + delta));
  document.getElementById(`count-${areaId}`).textContent = selectedAreas[areaId];
  updateSpaces();
}

// ===================== BOTÓN VER RESUMEN =====================
if (DOM.btnCalculateTotal) {
  DOM.btnCalculateTotal.addEventListener("click", () => {
    generateSummary(currentService);
    if (currentService === "basico") user.limpiezaPurchases.basico++;
    if (currentService === "profundo") user.limpiezaPurchases.profundo++;
    checkAutoAvailability();
  });
}

// ===================== FUNCIONES DE ESPACIOS =====================
function updateSpaces() {
  let total = 0;
  for (const [id, count] of Object.entries(selectedAreas)) {
    const area = areas.find(a => a.id === id);
    if (area) total += area.price * count;
  }
  DOM.totalCost.textContent = total.toFixed(2);
}

// ===================== AUTOS =====================
function updateCarCost() {
  const type = document.querySelector('input[name="carType"]:checked').value;
  let cost = 10;
  if (type === "crossover") cost = 15;
  if (type === "suv") cost = 20;
  if (type === "camioneta") cost = 18;
  DOM.totalCarCost.textContent = (carsCount * cost).toFixed(2);
}

function updateCarsFromSelect() {
  carsCount = parseInt(DOM.carsInputSelect.value);
  DOM.totalCars.textContent = carsCount;
  updateCarCost();
}

// ===================== BOTÓN SIGUIENTE AUTOS =====================
if (DOM.btnNextFromCars) {
  DOM.btnNextFromCars.addEventListener("click", () => {
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
    checkAutoAvailability();
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
  html += `<p><strong>Dirección:</strong> ${user.address || "No registrada"}</p>`;
  if(service !== "auto" && selectedExpert) {
    html += `<p><strong>Experto:</strong> ${selectedExpert.name} ⭐${selectedExpert.rating}</p>`;
  }

  if (service === "basico" || service === "profundo") {
    let total = 0;
    for (const [id, count] of Object.entries(selectedAreas)) {
      if (count > 0) {
        const area = areas.find(a => a.id === id);
        total += area.price * count;
        html += `<p>${area.label}: ${count} x $${area.price}</p>`;
      }
    }
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  } else if (service === "auto") {
    const type = document.querySelector('input[name="carType"]:checked').value;
    const cost = DOM.totalCarCost.textContent;
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${type}</p>`;
    html += `<p><strong>Autos:</strong> ${carsCount}</p>`;
    html += `<p><strong>Total:</strong> $${cost}</p>`;
  }

  // Guardar en historial
  history.push({ service, expert: selectedExpert?.name || "-", total: DOM.totalCost.textContent || DOM.totalCarCost.textContent, date: new Date().toLocaleString() });
  renderHistory();

  html += `<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML = html;
  showSection("summarySection");
}

// ===================== PAGO =====================
function goToPayment() { showSection("paymentSection"); }

if(DOM.paymentForm) {
  DOM.paymentForm.addEventListener("change", () => {
    const payMethod = document.querySelector('input[name="pay"]:checked')?.value;
    DOM.cardDetails.classList.toggle("hidden", payMethod !== "tarjeta");
  });
}

if(DOM.btnConfirmPayment) {
  DOM.btnConfirmPayment.addEventListener("click", () => {
    const payMethod = document.querySelector('input[name="pay"]:checked')?.value;
    if(!payMethod) { alert("Selecciona un método de pago"); return; }
    if(payMethod === "tarjeta") {
      const number = document.getElementById("cardNumber").value.trim();
      const expiry = document.getElementById("cardExpiry").value.trim();
      const cvv = document.getElementById("cardCVV").value.trim();
      if(!number || !expiry || !cvv) { alert("Ingresa los datos de tarjeta completos"); return; }
    }
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
    "🎉 Gracias por elegir Xperto, tu tiempo vale más"
  ];
  let i = 0;
  const interval = setInterval(() => {
    DOM.trackStatus.textContent = steps[i];
    i++;
    if(i >= steps.length) clearInterval(interval);
  }, 2000);
}

// ===================== HISTORIAL =====================
function renderHistory() {
  DOM.historyContainer.innerHTML = "";
  history.forEach(h => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<p><strong>Servicio:</strong> ${h.service}</p>
                     <p><strong>Experto:</strong> ${h.expert}</p>
                     <p><strong>Total:</strong> $${h.total}</p>
                     <p><strong>Fecha:</strong> ${h.date}</p>`;
    DOM.historyContainer.appendChild(div);
  });
}

// ===================== FECHA PROGRAMADA =====================
document.querySelectorAll('input[name="schedule"]').forEach(radio => {
  radio.addEventListener('change', () => {
    DOM.scheduleDateInput.classList.toggle('hidden', radio.value !== 'programado');
  });
});

// ===================== INIT =====================
updateCarsFromSelect();
updateCarCost();
showSection("worldSelection");
checkAutoAvailability();
