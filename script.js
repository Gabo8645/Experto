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
let carsCount = 1;
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
  paymentForm: document.getElementById("paymentForm"),
  cardDetails: document.getElementById("cardDetails"),
  defaultAddress: document.getElementById("defaultAddress"),
  userName: document.getElementById("userName")
};

// ===================== TOOLTIP =====================
document.querySelectorAll(".info-icon").forEach(icon => {
  const infoDiv = icon.parentElement.querySelector(".service-info");
  if(infoDiv) icon.setAttribute("data-target", infoDiv.id);
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
  document.querySelectorAll("main section").forEach(s => s.classList.remove("active"));
  const section = document.getElementById(sectionId);
  if (section) section.classList.add("active");

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
    if(DOM.userName) DOM.userName.textContent = `Hola, ${user.name.split(" ")[0]} 👋`;
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
  if (!DOM.expertsContainer) return;
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
      if(DOM.btnNextFromExperts) DOM.btnNextFromExperts.disabled = false;
    };
    DOM.expertsContainer.appendChild(card);
  });
}

// ===================== FLUJO =====================
function selectWorld(service) {
  currentService = service;
  selectedExpert = null;
  loadExperts();
  showSection("expertSection");
  checkAutoAvailability();
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
  const countSpan = document.getElementById(`count-${areaId}`);
  if(countSpan) countSpan.textContent = selectedAreas[areaId];
}

// ===================== BOTONES =====================
if(DOM.btnNextFromExperts) {
  DOM.btnNextFromExperts.addEventListener("click", () => {
    if (!selectedExpert) return;
    if (currentService === "auto") showSection("carSection");
    else { renderAreas(); showSection("areasSection"); }
  });
}

if(DOM.btnCalculateTotal) {
  DOM.btnCalculateTotal.addEventListener("click", () => {
    generateSummary(currentService);
    if(currentService === "basico") user.limpiezaPurchases.basico++;
    if(currentService === "profundo") user.limpiezaPurchases.profundo++;
    if(currentService !== "auto") checkAutoAvailability();
  });
}

// ===================== AUTOS =====================
function updateCarCost() {
  let typeEl = document.querySelector('input[name="carType"]:checked');
  if(!typeEl) return;
  let type = typeEl.value;
  let cost = 10;
  if(type==="crossover") cost=15;
  if(type==="suv") cost=20;
  if(type==="camioneta") cost=18;
  if(DOM.totalCarCost) DOM.totalCarCost.textContent = (carsCount*cost).toFixed(2);
}

function updateCarsFromSelect() {
  if(!DOM.carsInputSelect) return;
  carsCount = parseInt(DOM.carsInputSelect.value);
  if(DOM.totalCars) DOM.totalCars.textContent = carsCount;
  updateCarCost();
}

if(DOM.btnNextFromCars) {
  DOM.btnNextFromCars.addEventListener("click", () => {
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
    checkAutoAvailability();
  });
}

// ===================== DESBLOQUEO AUTO =====================
function checkAutoAvailability() {
  if(DOM.btnAuto) DOM.btnAuto.disabled = user.limpiezaPurchases.profundo < 1;
}

// ===================== RESUMEN =====================
function generateSummary(service) {
  let html = `<h2>Resumen del servicio</h2>`;
  html += `<p><strong>Dirección:</strong> ${user.address}</p>`;
  html += `<p><strong>Experto:</strong> ${selectedExpert ? selectedExpert.name : "No asignado"}</p>`;

  if(service==="basico" || service==="profundo"){
    let total=0;
    for(const [id,count] of Object.entries(selectedAreas)){
      if(count>0){
        const area = areas.find(a=>a.id===id);
        total+=area.price*count;
        html+=`<p>${area.label}: ${count} x $${area.price}</p>`;
      }
    }
    html+=`<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  } else if(service==="auto"){
    let typeEl = document.querySelector('input[name="carType"]:checked');
    let type = typeEl ? typeEl.value : "No seleccionado";
    let cost = DOM.totalCarCost ? DOM.totalCarCost.textContent : "0";
    html+=`<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html+=`<p><strong>Tipo:</strong> ${type}</p>`;
    html+=`<p><strong>Autos:</strong> ${carsCount}</p>`;
    html+=`<p><strong>Total:</strong> $${cost}</p>`;
  }

  html+=`<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  if(DOM.summarySection) DOM.summarySection.innerHTML = html;

  // historial
  let historyEntry = { service, expert: selectedExpert?.name, address: user.address, date: new Date().toLocaleString() };
  user.history.push(historyEntry);
  renderHistory();
}

// ===================== PAGO =====================
function goToPayment() { showSection("paymentSection"); }

document.querySelectorAll('input[name="pay"]').forEach(r=>{
  r.addEventListener("change",()=>{
    if(r.value==="tarjeta" && r.checked) DOM.cardDetails.classList.remove("hidden");
    else DOM.cardDetails.classList.add("hidden");
  });
});

if(DOM.btnConfirmPayment){
  DOM.btnConfirmPayment.addEventListener("click",()=>{
    const selectedPay = document.querySelector('input[name="pay"]:checked');
    if(!selectedPay){ alert("Elija un método de pago"); return; }
    if(selectedPay.value==="tarjeta"){
      const num=document.getElementById("cardNumber").value.trim();
      const exp=document.getElementById("cardExpiry").value;
      const cvv=document.getElementById("cardCVV").value.trim();
      if(!num||!exp||!cvv){ alert("Complete los datos de tarjeta"); return; }
    }
    startTracking();
  });
}

// ===================== TRACKING =====================
function startTracking(){
  showSection("trackingSection");
  const steps=[
    "🧑‍🔧 Experto asignado",
    "🚗 En camino",
    "🧹 Servicio en progreso",
    "✅ Servicio finalizado",
    "🎉 Gracias por elegirnos Xperto, porque tu tiempo vale más"
  ];
  let i=0;
  const interval = setInterval(()=>{
    if(DOM.trackStatus) DOM.trackStatus.textContent=steps[i];
    i++;
    if(i>=steps.length) clearInterval(interval);
  },2000);
}

// ===================== HISTORIAL =====================
function renderHistory(){
  if(!DOM.historyContainer) return;
  DOM.historyContainer.innerHTML="";
  user.history.forEach(entry=>{
    const div=document.createElement("div");
    div.className="card";
    div.innerHTML=`<p><strong>Servicio:</strong> ${entry.service}</p>
                   <p><strong>Experto:</strong> ${entry.expert}</p>
                   <p><strong>Dirección:</strong> ${entry.address}</p>
                   <p><strong>Fecha:</strong> ${entry.date}</p>`;
    DOM.historyContainer.appendChild(div);
  });
}

// ===================== PROGRAMADO =====================
document.querySelectorAll('input[name="schedule"]').forEach(radio=>{
  radio.addEventListener('change',()=>{
    if(radio.value==='programado' && radio.checked) DOM.scheduleDateInput.classList.remove('hidden');
    else if(radio.value==='inmediato' && radio.checked){
      DOM.scheduleDateInput.classList.add('hidden');
      DOM.scheduleDateInput.value="";
    }
  });
});

// ===================== INIT =====================
window.addEventListener("DOMContentLoaded",()=>{
  updateCarsFromSelect();
  updateCarCost();
  showSection("worldSelection");
  checkAutoAvailability();
});
