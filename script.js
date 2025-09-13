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
let selectedAreas = {};
let spacesCount = 1;
let carsCount = 1;

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
  paymentForm: document.getElementById("paymentForm"),
  cardDetails: document.getElementById("cardDetails")
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
    document.getElementById("defaultAddress").textContent = "Dirección: " + user.address;
    alert("Perfil guardado correctamente!");
  });
}

// ===================== EXPERTOS =====================
const experts = [
  { name: "Juan Pérez", rating: 4.8, photo: "https://randomuser.me/api/portraits/men/1.jpg", description: "Especialista en limpieza de interiores y exteriores." },
  { name: "María López", rating: 4.9, photo: "https://randomuser.me/api/portraits/women/2.jpg", description: "Experta en limpieza profunda y detallada." },
  { name: "Carlos Ruiz", rating: 4.7, photo: "https://randomuser.me/api/portraits/men/3.jpg", description: "Encargado de áreas amplias y organización del hogar." },
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

// ===================== SELECCIÓN SERVICIO =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;
  loadExperts();
  showSection("expertSection");
  checkAutoAvailability();
}

// ===================== SIGUIENTE EXPERTO =====================
if (DOM.btnNextFromExperts) {
  DOM.btnNextFromExperts.addEventListener("click", () => {
    if (!selectedExpert) { alert("Debes seleccionar un Xperto."); return; }
    if (currentService === "auto") {
      showSection("carSection");
      updateCars();
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
  selectedAreas = {};
  areas.forEach(area => {
    selectedAreas[area.id] = 0;
    const div = document.createElement("div");
    div.className = "area-item";
    div.innerHTML = `
      <span>${area.label} ($${area.price})</span>
      <button type="button" onclick="changeAreaCount('${area.id}', -1)">-</button>
      <span id="count-${area.id}">0</span>
      <button type="button" onclick="changeAreaCount('${area.id}', 1)">+</button>`;
    container.appendChild(div);
  });
}

function changeAreaCount(id, delta) {
  selectedAreas[id] = Math.max(0, Math.min(10, selectedAreas[id] + delta));
  document.getElementById(`count-${id}`).textContent = selectedAreas[id];
  updateSpaces();
}

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

// ===================== VER RESUMEN =====================
if (DOM.btnCalculateTotal) {
  DOM.btnCalculateTotal.addEventListener("click", () => {
    let hasSelected = Object.values(selectedAreas).some(c => c > 0);
    if (!hasSelected) { alert("Debes seleccionar al menos un área."); return; }
    generateSummary(currentService);
    if (currentService === "basico") user.limpiezaPurchases.basico++;
    if (currentService === "profundo") {
      user.limpiezaPurchases.profundo++;
      checkAutoAvailability();
    }
  });
}

// ===================== AUTOS =====================
function increaseCars() { carsCount = Math.min(10, carsCount + 1); updateCars(); }
function decreaseCars() { carsCount = Math.max(1, carsCount - 1); updateCars(); }
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

// ===================== SIGUIENTE AUTOS =====================
if (DOM.btnNextFromCars) {
  DOM.btnNextFromCars.addEventListener("click", () => {
    if (carsCount < 1) { alert("Debes seleccionar al menos un auto."); return; }
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
  });
}

// ===================== DESBLOQUEO AUTO =====================
function checkAutoAvailability() {
  if (DOM.btnAuto) DOM.btnAuto.disabled = user.limpiezaPurchases.profundo < 1;
}

// ===================== GENERAR RESUMEN =====================
function generateSummary(service) {
  let html = `<h2>Resumen del servicio</h2>`;
  html += `<p><strong>Cliente:</strong> ${user.name} ${user.lastName}</p>`;
  html += `<p><strong>Dirección:</strong> ${user.address}</p>`;
  html += `<p><strong>Xperto:</strong> ${selectedExpert?.name || ""}</p>`;

  if (service === "basico" || service === "profundo") {
    let total = 0;
    html += `<ul>`;
    for (const [id, count] of Object.entries(selectedAreas)) {
      if (count > 0) {
        const area = areas.find(a => a.id === id);
        total += area.price * count;
        html += `<li>${area.label}: ${count} x $${area.price}</li>`;
      }
    }
    html += `</ul>`;
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
    user.history.push({ service: currentService, expert: selectedExpert?.name, areas: {...selectedAreas}, total, date: new Date().toLocaleString() });
  } else if (service === "auto") {
    let type = document.querySelector('input[name="carType"]:checked')?.value || "sedan";
    let cost = DOM.totalCarCost.textContent;
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${type}</p>`;
    html += `<p><strong>Cantidad de autos:</strong> ${carsCount}</p>`;
    html += `<p><strong>Total:</strong> $${cost}</p>`;
    user.history.push({ service: "auto", expert: selectedExpert?.name, autos: {type, count: carsCount}, total: parseFloat(cost), date: new Date().toLocaleString() });
  }
  html += `<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML = html;
  showSection("summarySection");
  renderHistory();
}

// ===================== HISTORIAL =====================
function renderHistory() {
  if (!DOM.historyContainer) return;
  DOM.historyContainer.innerHTML = "";
  user.history.forEach(entry => {
    const div = document.createElement("div");
    div.className = "card";
    let content = `<p><strong>Servicio:</strong> ${entry.service}</p>`;
    content += `<p><strong>Xperto:</strong> ${entry.expert}</p>`;
    content += `<p><strong>Fecha:</strong> ${entry.date}</p>`;
   
