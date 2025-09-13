// ======== DATOS INICIALES ========
let user = {
  name: "", lastName: "", email: "", phone: "", address: "",
  limpiezaPurchases: 0,
  history: []
};

const worlds = {
  basico: { name: "Básico", icon: "🧹", unlocksAt: 0 },
  profundo: { name: "Profundo", icon: "🧼", unlocksAt: 3 },
  auto: { name: "Auto", icon: "🚗", unlocksAt: 1 }
};

const experts = [
  { id: 1, name: "Juan Pérez", stars: 4, comments: "Limpia cocina y salas", photo: "https://randomuser.me/api/portraits/men/32.jpg", specialty: "Cocinas y salas" },
  { id: 2, name: "María Gómez", stars: 5, comments: "Especialista en baños", photo: "https://randomuser.me/api/portraits/women/45.jpg", specialty: "Baños profundos" },
  { id: 3, name: "Carlos Torres", stars: 3, comments: "Terrazas y exteriores impecables", photo: "https://randomuser.me/api/portraits/men/12.jpg", specialty: "Terrazas y exteriores" },
  { id: 4, name: "Lucía Martínez", stars: 5, comments: "Habitaciones y oficinas", photo: "https://randomuser.me/api/portraits/women/68.jpg", specialty: "Habitaciones y oficinas" },
  { id: 5, name: "Pedro Ruiz", stars: 4, comments: "Limpieza general rápida", photo: "https://randomuser.me/api/portraits/men/75.jpg", specialty: "Limpieza general" }
];

const areas = [
  { id: "habitacion", label: "Habitación", price: 10 },
  { id: "baño", label: "Baño", price: 8 },
  { id: "cocina", label: "Cocina", price: 12 },
  { id: "sala", label: "Sala", price: 10 },
  { id: "comedor", label: "Comedor", price: 10 },
  { id: "terraza", label: "Terraza", price: 15 }
];

const carTypes = { sedan: 10, crossover: 15, suv: 20, camioneta: 25 };

// ======== ESTADO ========
let selectedWorld = null;
let selectedExpert = null;
let selectedAreas = {};
let selectedSchedule = "inmediato";
let selectedDate = null;
let selectedPayment = null;
let selectedCarType = "sedan";
let carQuantity = 1;
const maxCount = 10;

// ======== DOM ========
const DOM = {
  worldSelection: document.getElementById("worldSelection"),
  expertSection: document.getElementById("expertSection"),
  areasSection: document.getElementById("areasSection"),
  carSection: document.getElementById("carSection"),
  summarySection: document.getElementById("summarySection"),
  paymentSection: document.getElementById("paymentSection"),
  trackingSection: document.getElementById("trackingSection"),
  profileSection: document.getElementById("profileSection"),
  expertsContainer: document.getElementById("expertsContainer"),
  areasContainer: document.getElementById("areasContainer"),
  scheduleRadios: document.querySelectorAll('input[name="schedule"]'),
  scheduleDate: document.getElementById("scheduleDate"),
  totalCost: document.getElementById("totalCost"),
  carsInput: document.getElementById("carsInput"),
  totalCars: document.getElementById("totalCars"),
  totalCarCost: document.getElementById("totalCarCost"),
  btnNextFromExperts: document.getElementById("btnNextFromExperts"),
  btnCalculateTotal: document.getElementById("btnCalculateTotal"),
  btnNextFromCars: document.getElementById("btnNextFromCars"),
  btnConfirmPayment: document.getElementById("btnConfirmPayment"),
  paymentForm: document.getElementById("paymentForm"),
  cardDetails: document.getElementById("cardDetails"),
  trackStatus: document.getElementById("trackStatus"),
  historyContainer: document.getElementById("historyContainer"),
  profileForm: document.getElementById("profileForm"),
  profileName: document.getElementById("profileName"),
  profileLastName: document.getElementById("profileLastName"),
  profileEmail: document.getElementById("profileEmail"),
  profilePhone: document.getElementById("profilePhone"),
  profileAddress: document.getElementById("profileAddress"),
  defaultAddress: document.getElementById("defaultAddress")
};

// ======== FUNCIONES DE PERFIL ========
function loadUser(){
  const saved = localStorage.getItem("xpertoUser");
  if(saved){ user = JSON.parse(saved); }
  if(DOM.profileName) DOM.profileName.value = user.name || "";
  if(DOM.profileLastName) DOM.profileLastName.value = user.lastName || "";
  if(DOM.profileEmail) DOM.profileEmail.value = user.email || "";
  if(DOM.profilePhone) DOM.profilePhone.value = user.phone || "";
  if(DOM.profileAddress) DOM.profileAddress.value = user.address || "";
  updateDefaultAddress();
  updateWorldButtons();
}

function saveUserFromForm(){
  user.name = DOM.profileName.value.trim();
  user.lastName = DOM.profileLastName.value.trim();
  user.email = DOM.profileEmail.value.trim();
  user.phone = DOM.profilePhone.value.trim();
  user.address = DOM.profileAddress.value.trim();
  localStorage.setItem("xpertoUser", JSON.stringify(user));
  updateDefaultAddress();
  updateWorldButtons();
  alert("Perfil guardado correctamente.");
  showSection("worldSelection");
}

function updateDefaultAddress(){
  if(DOM.defaultAddress) DOM.defaultAddress.textContent = user.address ? `Dirección: ${user.address}` : "Configura tu dirección en Perfil.";
}

// ======== WORLDS ========
function updateWorldButtons(){
  const btnAuto = document.getElementById("btnAuto");
  if(!btnAuto) return;
  btnAuto.disabled = !(user.limpiezaPurchases >= worlds.auto.unlocksAt);
}

function selectWorld(key){
  if(key === "profundo" && user.limpiezaPurchases < worlds.profundo.unlocksAt){
    alert(`Necesitas ${worlds.profundo.unlocksAt} servicios para desbloquear Limpieza Profunda.`);
    return;
  }
  if(key === "auto" && user.limpiezaPurchases < worlds.auto.unlocksAt){
    alert(`Necesitas ${worlds.auto.unlocksAt} servicios para desbloquear Auto.`);
    return;
  }
  selectedWorld = key;
  renderExperts();
  showSection("expertSection");
}

// ======== EXPERTOS ========
function renderExperts(){
  if(!DOM.expertsContainer) return;
  DOM.expertsContainer.innerHTML = "";
  DOM.btnNextFromExperts.disabled = true;
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${exp.photo}" alt="Foto ${exp.name}" onerror="this.src='https://img.icons8.com/ios-filled/50/000000/user.png'"/>
      <h3>${exp.name}</h3>
      <p>${"★".repeat(exp.stars)}${"☆".repeat(5-exp.stars)}</p>
      <p>${exp.comments}</p>
    `;
    card.addEventListener("click", () => {
      selectedExpert = exp;
      document.querySelectorAll("#expertsContainer .card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      DOM.btnNextFromExperts.disabled = false;
    });
    DOM.expertsContainer.appendChild(card);
  });
}

// ======== ÁREAS ========
function renderAreasInputs(){
  DOM.areasContainer.innerHTML = "";
  selectedAreas = {};
  areas.forEach(area => {
    selectedAreas[area.id] = 0;
    const div = document.createElement("div");
    div.className = "area-input";
    div.innerHTML = `
      <label>${area.label} ($${area.price}) 
        <button type="button" class="infoBtn" data-tooltip="info_${area.id}">ℹ️</button>
      </label>
      <div id="info_${area.id}" class="tooltip hidden">Detalle de ${area.label}</div>
      <div class="counter">
        <button class="area-decrease" data-area="${area.id}">-</button>
        <input type="text" id="area_${area.id}" value="0" readonly/>
        <button class="area-increase" data-area="${area.id}">+</button>
      </div>
    `;
    DOM.areasContainer.appendChild(div);
  });

  DOM.areasContainer.querySelectorAll(".area-increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.area;
      if(selectedAreas[id] < maxCount){ selectedAreas[id]++; document.getElementById(`area_${id}`).value = selectedAreas[id]; }
    });
  });
  DOM.areasContainer.querySelectorAll(".area-decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.area;
      if(selectedAreas[id] > 0){ selectedAreas[id]--; document.getElementById(`area_${id}`).value = selectedAreas[id]; }
    });
  });

  setupTooltips();
}

// ======== TOOLTIP ========
function setupTooltips(){
  let openTooltip = null;
  document.querySelectorAll(".infoBtn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const tip = document.getElementById(btn.dataset.tooltip);
      if(!tip) return;
      if(openTooltip && openTooltip !== tip){ openTooltip.classList.add("hidden"); }
      tip.classList.toggle("hidden");
      openTooltip = tip.classList.contains("hidden") ? null : tip;
    });
  });
  document.addEventListener("click", () => {
    if(openTooltip){ openTooltip.classList.add("hidden"); openTooltip = null; }
  });
}

// ======== AUTOS ========
function updateCarDisplay(){
  if(DOM.carsInput) DOM.carsInput.value = carQuantity;
  if(DOM.totalCars) DOM.totalCars.textContent = carQuantity;
  const type = document.querySelector('input[name="carType"]:checked')?.value || selectedCarType;
  selectedCarType = type;
  const pricePer = carTypes[type] || 10;
  if(DOM.totalCarCost) DOM.totalCarCost.textContent = (carQuantity * pricePer).toFixed(2);
}

// ======== TRACKING ========
function simulateTracking(){
  const statuses = [
    "Asignando experto...",
    "Experto en camino 🚗",
    "Experto ha llegado 🏠",
    "Servicio en progreso 🧹",
    "Servicio finalizado 🎉"
  ];
  let i = 0;
  function next(){
    if(i < statuses.length){
      DOM.trackStatus.textContent = statuses[i];
      i++;
      setTimeout(next, 3000);
    } else {
      alert("¡Gracias por elegirnos Xperto! Porque tu tiempo vale más.");
      showSection("worldSelection");
    }
  }
  next();
}

// ======== NAVEGACIÓN ========
function showSection(id){
  [DOM.worldSelection, DOM.expertSection, DOM.areasSection, DOM.carSection, DOM.summarySection, DOM.paymentSection, DOM.trackingSection, DOM.profileSection]
    .forEach(s => { if(s) s.classList.add("hidden"); });
  const t = document.getElementById(id);
  if(t) t.classList.remove("hidden");
}

// ======== LISTENERS ========
if(DOM.profileForm){
  DOM.profileForm.addEventListener("submit", e => { e.preventDefault(); saveUserFromForm(); });
}

if(DOM.btnNextFromExperts){
  DOM.btnNextFromExperts.addEventListener("click", () => {
    if(selectedWorld === "auto"){ showSection("carSection"); updateCarDisplay(); }
    else { renderAreasInputs(); showSection("areasSection"); }
  });
}

if(DOM.btnCalculateTotal){
  DOM.btnCalculateTotal.addEventListener("click", () => {
    let total = 0, html = `<h2>Resumen</h2>`;
    for(const [id, count] of Object.entries(selectedAreas)){
      if(count > 0){
        const area = areas.find(a=>a.id===id);
        total += area.price * count;
        html += `<p>${area.label}: ${count} x $${area.price}</p>`;
      }
    }
    html += `<p>Total: $${total}</p>`;
    DOM.summarySection.innerHTML = html;
    showSection("summarySection");
    DOM.paymentSection.classList.remove("hidden");
  });
}

if(DOM.btnNextFromCars){
  DOM.btnNextFromCars.addEventListener("click", () => {
    const pricePer = carTypes[selectedCarType];
    const total = pricePer * carQuantity;
    let html = `<h2>Resumen</h2><p>Tipo: ${selectedCarType}</p><p>Cantidad: ${carQuantity}</p><p>Total: $${total}</p>`;
    DOM.summarySection.innerHTML = html;
    showSection("summarySection");
    DOM.paymentSection.classList.remove("hidden");
  });
}

if(DOM.btnConfirmPayment){
  DOM.btnConfirmPayment.addEventListener("click", () => {
    showSection("trackingSection");
    simulateTracking();
  });
}

// ======== INIT ========
window.addEventListener("DOMContentLoaded", () => {
  loadUser();
  updateCarDisplay();
  setupTooltips();
  showSection("worldSelection");
});
