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
  defaultAddress: document.getElementById("defaultAddress")
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
    DOM.defaultAddress.textContent = `Dirección: ${user.address}`;
    alert("Perfil guardado correctamente!");
  });
}

// ===================== FLUJO DE SERVICIOS =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;
  loadExperts();
  if (service === "auto") showSection("carSection");
  else showSection("expertSection");
  checkAutoAvailability();
}

// ===================== EXPERTOS =====================
const experts = [
  { name: "Juan Pérez", rating: 4.8, photo: "https://randomuser.me/api/portraits/men/1.jpg", description: "Especialista en limpieza rápida y detallada." },
  { name: "María López", rating: 4.9, photo: "https://randomuser.me/api/portraits/women/2.jpg", description: "Experta en limpieza profunda y organización." },
  { name: "Carlos Ruiz", rating: 4.7, photo: "https://randomuser.me/api/portraits/men/3.jpg", description: "Encargado de mantenimiento y servicios especiales." }
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
  for (const area of areas) selectedAreas[area.id] = 0;
  areas.forEach(area => {
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
  selectedAreas[areaId] = Math.max(0, selectedAreas[areaId] + delta);
  document.getElementById(`count-${areaId}`).textContent = selectedAreas[areaId];
}

// ===================== BOTÓN VER RESUMEN =====================
if (DOM.btnCalculateTotal) {
  DOM.btnCalculateTotal.addEventListener("click", () => {
    let totalSelected = Object.values(selectedAreas).reduce((a,b) => a+b, 0);
    if (totalSelected === 0) return alert("Debes seleccionar al menos un espacio.");
    generateSummary(currentService);
    if (currentService === "basico") user.limpiezaPurchases.basico++;
    if (currentService === "profundo") {
      user.limpiezaPurchases.profundo++;
      checkAutoAvailability();
    }
  });
}

// ===================== AUTOS =====================
function increaseCars() { if (carsCount < 10) carsCount++; updateCars(); }
function decreaseCars() { if (carsCount > 1) carsCount--; updateCars(); }
function updateCars() {
  DOM.carsInput.value = carsCount;
  DOM.totalCars.textContent = carsCount;
  let type = document.querySelector('input[name="carType"]:checked')?.value || "sedan";
  let cost = 10;
  if (type === "crossover") cost = 15;
  if (type === "suv") cost = 20;
  if (type === "camioneta") cost = 18;
  DOM.totalCarCost.textContent = (carsCount * cost).toFixed(2);
}

if (DOM.btnNextFromCars) {
  DOM.btnNextFromCars.addEventListener("click", () => {
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
    addToHistory("auto");
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
  let total = 0;
  if (service === "basico" || service === "profundo") {
    for (const [id, count] of Object.entries(selectedAreas)) {
      if (count > 0) {
        const area = areas.find(a => a.id === id);
        total += area.price * count;
        html += `<p>${area.label}: ${count} x $${area.price}</p>`;
      }
    }
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  } else if (service === "auto") {
    let type = document.querySelector('input[name="carType"]:checked').value;
    total = parseFloat(DOM.totalCarCost.textContent);
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${type}</p>`;
    html += `<p><strong>Autos:</strong> ${carsCount}</p>`;
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  }
  html += `<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML = html;
  showSection("summarySection");
}

// ===================== HISTORIAL =====================
function addToHistory(service) {
  let record = { service, date: new Date().toLocaleString() };
  if (service !== "auto") record.details = {...selectedAreas};
  user.history.push(record);
  renderHistory();
}

function renderHistory() {
  DOM.historyContainer.innerHTML = "";
  user.history.forEach(item => {
    let html = `<div class="card"><h4>${item.service.toUpperCase()}</h4>`;
    if (item.details) {
      for (const [area,count] of Object.entries(item.details)) {
        if (count>0) html += `<p>${area}: ${count}</p>`;
      }
    }
    html += `<small>${item.date}</small></div>`;
    DOM.historyContainer.innerHTML += html;
  });
}

// ===================== PAGO =====================
function goToPayment() { 
  addToHistory(currentService);
  showSection("paymentSection"); 
}

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

// ===================== INIT =====================
updateCars();
showSection("worldSelection");
checkAutoAvailability();
