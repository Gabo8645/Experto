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
let paymentMethod = null;
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
  carsInputSelect: document.getElementById("carsInputSelect"),
  totalCars: document.getElementById("totalCars"),
  totalCarCost: document.getElementById("totalCarCost"),
  btnNextFromExperts: document.getElementById("btnNextFromExperts"),
  btnCalculateTotal: document.getElementById("btnCalculateTotal"),
  btnNextFromCars: document.getElementById("btnNextFromCars"),
  btnConfirmPayment: document.getElementById("btnConfirmPayment"),
  expertsContainer: document.getElementById("expertsContainer"),
  areasContainer: document.getElementById("areasContainer"),
  cardDetails: document.getElementById("cardDetails"),
  historyContainer: document.getElementById("historyContainer"),
  trackStatus: document.getElementById("trackStatus"),
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

// ===================== EXPERTOS =====================
const experts = [
  { name: "Juan Pérez", rating: 4.8, photo: "https://randomuser.me/api/portraits/men/1.jpg", activities: "Limpieza de baños, pisos y cocina" },
  { name: "María López", rating: 4.9, photo: "https://randomuser.me/api/portraits/women/2.jpg", activities: "Limpieza profunda y organización de espacios" },
  { name: "Carlos Ruiz", rating: 4.7, photo: "https://randomuser.me/api/portraits/men/3.jpg", activities: "Lavado de autos y limpieza de interiores" }
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

// ===================== SELECCIONAR SERVICIO =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;
  loadExperts();
  showSection("expertSection");
  checkAutoAvailability();
}

// ===================== BOTÓN SIGUIENTE EXPERTOS =====================
if (DOM.btnNextFromExperts) {
  DOM.btnNextFromExperts.addEventListener("click", () => {
    if (!selectedExpert) return alert("Selecciona un experto");
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
  DOM.areasContainer.innerHTML = "";
  areas.forEach(area => {
    selectedAreas[area.id] = 0;
    const div = document.createElement("div");
    div.className = "area-item";
    div.innerHTML = `
      <span>${area.label} ($${area.price})</span>
      <button onclick="changeAreaCount('${area.id}', -1)">-</button>
      <span id="count-${area.id}">0</span>
      <button onclick="changeAreaCount('${area.id}', 1)">+</button>`;
    DOM.areasContainer.appendChild(div);
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
    // Validar que se haya seleccionado al menos un área
    const totalSelected = Object.values(selectedAreas).reduce((a,b)=>a+b,0);
    if(totalSelected === 0) return alert("Selecciona al menos un área");
    generateSummary(currentService);
    if (currentService === "basico") user.limpiezaPurchases.basico++;
    if (currentService === "profundo") user.limpiezaPurchases.profundo++;
    checkAutoAvailability();
  });
}

// ===================== FUNCIONES ESPACIOS =====================
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
  if(type === "crossover") cost = 15;
  if(type === "suv") cost = 20;
  if(type === "camioneta") cost = 18;
  DOM.totalCarCost.textContent = (carsCount * cost).toFixed(2);
}

function updateCarsFromSelect(){
  carsCount = parseInt(DOM.carsInputSelect.value);
  DOM.totalCars.textContent = carsCount;
  updateCarCost();
}

// ===================== BOTÓN SIGUIENTE AUTOS =====================
if(DOM.btnNextFromCars){
  DOM.btnNextFromCars.addEventListener("click", () => {
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
  });
}

// ===================== DESBLOQUEO AUTO =====================
function checkAutoAvailability(){
  const btn = document.getElementById("btnAuto");
  if(btn) btn.disabled = user.limpiezaPurchases.profundo < 1;
}

// ===================== RESUMEN =====================
function generateSummary(service){
  let html = `<h2>Resumen del servicio</h2>`;
  html += `<p><strong>Dirección:</strong> ${user.address || "No definida"}</p>`;
  html += `<p><strong>Experto:</strong> ${selectedExpert?.name || ""}</p>`;

  if(service === "basico" || service === "profundo"){
    let total = 0;
    html += "<h3>Áreas seleccionadas:</h3>";
    for(const [id,count] of Object.entries(selectedAreas)){
      if(count>0){
        const area = areas.find(a=>a.id===id);
        total += area.price * count;
        html += `<p>${area.label}: ${count} x $${area.price} = $${(area.price*count).toFixed(2)}</p>`;
      }
    }
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  } else if(service === "auto"){
    const type = document.querySelector('input[name="carType"]:checked').value;
    const cost = DOM.totalCarCost.textContent;
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${type}</p>`;
    html += `<p><strong>Autos:</strong> ${carsCount}</p>`;
    html += `<p><strong>Total:</strong> $${cost}</p>`;
  }
  html += `<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML = html;
  showSection("summarySection");

  // Guardar en historial
  addToHistory(service);
}

function addToHistory(service){
  const history = DOM.historyContainer;
  const now = new Date().toLocaleString();
  let description = "";

  if(service === "basico" || service === "profundo"){
    description = Object.entries(selectedAreas)
      .filter(([_,c])=>c>0)
      .map(([id,c])=>`${areas.find(a=>a.id===id).label}: ${c}`)
      .join(", ");
  } else if(service === "auto"){
    const type = document.querySelector('input[name="carType"]:checked').value;
    description = `Tipo: ${type}, Autos: ${carsCount}`;
  }

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<p><strong>${service}</strong> - ${now}</p><p>${description}</p><p>Experto: ${selectedExpert?.name || ""}</p>`;
  history.prepend(div);
}

// ===================== PAGO =====================
function goToPayment(){ showSection("paymentSection"); }

document.querySelectorAll('input[name="pay"]').forEach(radio=>{
  radio.addEventListener('change',()=>{
    paymentMethod = document.querySelector('input[name="pay"]:checked')?.value;
    if(paymentMethod === "tarjeta"){
      DOM.cardDetails.classList.remove("hidden");
    } else {
      DOM.cardDetails.classList.add("hidden");
    }
  });
});

if(DOM.btnConfirmPayment){
  DOM.btnConfirmPayment.addEventListener("click",()=>{
    paymentMethod = document.querySelector('input[name="pay"]:checked')?.value;
    if(!paymentMethod) return alert("Selecciona un método de pago");

    if(paymentMethod === "tarjeta"){
      const number = document.getElementById("cardNumber").value.trim();
      const expiry = document.getElementById("cardExpiry").value.trim();
      const cvv = document.getElementById("cardCVV").value.trim();
      if(!number || !expiry || !cvv) return alert("Ingresa todos los datos de la tarjeta");
    }

    startTracking();
  });
}

// ===================== TRACKING =====================
function startTracking(){
  showSection("trackingSection");
  const steps = [
    "🧑‍🔧 Experto asignado",
    "🚗 En camino",
    "🧹 Servicio en progreso",
    "✅ Servicio finalizado",
    "🎉 Gracias por elegirnos Xperto, porque tu tiempo vale más"
  ];
  let i = 0;
  const interval = setInterval(()=>{
    DOM.trackStatus.textContent = steps[i];
    i++;
    if(i>=steps.length) clearInterval(interval);
  },2000);
}

// ===================== INIT =====================
loadExperts();
updateCarsFromSelect();
updateCarCost();
showSection("worldSelection");
checkAutoAvailability();
