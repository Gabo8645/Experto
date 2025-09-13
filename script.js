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
let selectedAreas = {};

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
  paymentForm: document.getElementById("paymentForm"),
  cardDetails: document.getElementById("cardDetails"),
  defaultAddress: document.getElementById("defaultAddress"),
  areasContainer: document.getElementById("areasContainer")
};

// ===================== TOOLTIP =====================
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
document.body.addEventListener("click", () => {
  document.querySelectorAll(".service-info").forEach(el => el.classList.add("hidden"));
});

// ===================== NAVEGACIÓN =====================
function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  const section = document.getElementById(sectionId);
  if (section) section.classList.remove("hidden");

  // Navegación inferior solo activa cuando corresponde
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

// ===================== EXPERTOS =====================
const experts = [
  { name: "Juan Pérez", rating: 4.8, activities: "Barrido, aspirado y limpieza general", photo: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "María López", rating: 4.9, activities: "Limpieza profunda, desinfección, cocina y baños", photo: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Carlos Ruiz", rating: 4.7, activities: "Aspirado de alfombras, lavado de pisos y muebles", photo: "https://randomuser.me/api/portraits/men/3.jpg" }
];

function loadExperts() {
  DOM.expertsContainer.innerHTML = "";
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${exp.photo}" alt="${exp.name}" class="expert-photo"/>
      <h3>${exp.name}</h3>
      <p>${exp.activities}</p>
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

// ===================== FLUJO =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;
  DOM.btnNextFromExperts.disabled = true;
  selectedAreas = {};
  loadExperts();
  showSection("expertSection");
  checkAutoAvailability();
}

// ===================== ÁREAS =====================
const areas = [
  { id: "habitacion", label: "Habitación", price: 5},
  { id: "bano", label: "Baño", price: 5},
  { id: "cocina", label: "Cocina", price: 10},
  { id: "sala", label: "Sala", price: 8},
  { id: "comedor", label: "Comedor", price: 5},
  { id: "terraza", label: "Terraza", price: 12}
];

function renderAreas() {
  selectedAreas = {};
  const container = DOM.areasContainer;
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
}

// ===================== BOTONES =====================
if (DOM.btnNextFromExperts) {
  DOM.btnNextFromExperts.addEventListener("click", () => {
    if (!selectedExpert) return;
    if (currentService === "auto") showSection("carSection");
    else {
      renderAreas();
      showSection("areasSection");
    }
  });
}

if (DOM.btnCalculateTotal) {
  DOM.btnCalculateTotal.addEventListener("click", () => {
    generateSummary(currentService);
    if (currentService === "basico") user.limpiezaPurchases.basico++;
    if (currentService === "profundo") user.limpiezaPurchases.profundo++;
    checkAutoAvailability();
  });
}

if (DOM.btnNextFromCars) {
  DOM.btnNextFromCars.addEventListener("click", () => {
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
    checkAutoAvailability();
  });
}

// ===================== AUTOS =====================
function updateCarCost() {
  let type = document.querySelector('input[name="carType"]:checked')?.value || "sedan";
  let cost = 7;
  if (type === "crossover") cost = 10;
  if (type === "suv") cost = 15;
  if (type === "camioneta") cost = 20;
  DOM.totalCarCost.textContent = (carsCount * cost).toFixed(2);
}

function updateCarsFromSelect() {
  carsCount = parseInt(document.getElementById("carsInputSelect").value) || 1;
  DOM.totalCars.textContent = carsCount;
  updateCarCost();
}

// ===================== DESBLOQUEO AUTO =====================
function checkAutoAvailability() {
  if (DOM.btnAuto) DOM.btnAuto.disabled = user.limpiezaPurchases.profundo < 1;
}

// ===================== RESUMEN =====================
function generateSummary(service) {
  let html = `<h2>Resumen del servicio</h2>`;
  html += `<p><strong>Dirección:</strong> ${user.address}</p>`;
  html += `<p><strong>Experto:</strong> ${selectedExpert?.name || "No asignado"}</p>`;

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
    let type = document.querySelector('input[name="carType"]:checked')?.value || "sedan";
    let cost = DOM.totalCarCost.textContent;
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${type}</p>`;
    html += `<p><strong>Autos:</strong> ${carsCount}</p>`;
    html += `<p><strong>Total:</strong> $${cost}</p>`;
  }

  html += `<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML = html;
  showSection("summarySection");

  user.history.push({ service, expert: selectedExpert?.name, address: user.address, date: new Date().toLocaleString() });
  renderHistory();
}

// ===================== PAGO =====================
function goToPayment() { showSection("paymentSection"); }

document.querySelectorAll('input[name="pay"]').forEach(r => {
  r.addEventListener("change", () => {
    if (r.value === "tarjeta" && r.checked) DOM.cardDetails.classList.remove("hidden");
    else DOM.cardDetails.classList.add("hidden");
  });
});

if (DOM.btnConfirmPayment) {
  DOM.btnConfirmPayment.addEventListener("click", () => {
    const selectedPay = document.querySelector('input[name="pay"]:checked');
    if (!selectedPay) { alert("Elija un método de pago"); return; }
    if (selectedPay.value === "tarjeta") {
      const num = document.getElementById("cardNumber").value.trim();
      const exp = document.getElementById("cardExpiry").value;
      const cvv = document.getElementById("cardCVV").value.trim();
      if (!num || !exp || !cvv) { alert("Complete los datos de tarjeta"); return; }
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
  DOM.historyContainer.innerHTML = "";
  user.history.forEach(entry => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<p><strong>Servicio:</strong> ${entry.service}</p>
                     <p><strong>Experto:</strong> ${entry.expert}</p>
                     <p><strong>Dirección:</strong> ${entry.address}</p>
                     <p><strong>Fecha:</strong> ${entry.date}</p>`;
    DOM.historyContainer.appendChild(div);
  });
}

// ===================== PROGRAMADO =====================
document.querySelectorAll('input[name="schedule"]').forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'programado' && radio.checked) DOM.scheduleDateInput.classList.remove('hidden');
    else if (radio.value === 'inmediato' && radio.checked) {
      DOM.scheduleDateInput.classList.add('hidden');
      DOM.scheduleDateInput.value = "";
    }
  });
});

// ===================== INIT =====================
updateCarsFromSelect();
updateCarCost();
showSection("worldSelection");
checkAutoAvailability();
