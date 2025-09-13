// ======== Datos iniciales ========
let user = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  limpiezaPurchasesi: 0,
  history: []
};

const worlds = {
  basico: { name: "Básico", icon: "https://img.icons8.com/ios-filled/50/000000/broom.png", description: "Limpieza básica", unlocksAt: 0 },
  profundo: { name: "Limpieza Profunda", icon: "https://img.icons8.com/ios-filled/50/000000/vacuum.png", description: "Limpieza profunda", unlocksAt: 3 },
  auto: { name: "Lavada de Auto", icon: "https://img.icons8.com/ios-filled/50/000000/car.png", description: "Lavado interior y exterior de auto", unlocksAt: 1 }
};

const experts = [
  { id: 1, name: "Juan Pérez", stars: 4, comments: "Limpia cocina y salas", photo: "https://randomuser.me/api/portraits/men/32.jpg", specialty: "Cocinas y salas" },
  { id: 2, name: "María Gómez", stars: 5, comments: "Especialista en baños", photo: "https://randomuser.me/api/portraits/women/45.jpg", specialty: "Baños profundos" },
  { id: 3, name: "Carlos Torres", stars: 3, comments: "Terrazas y exteriores impecables", photo: "https://randomuser.me/api/portraits/men/12.jpg", specialty: "Terrazas y exteriores" },
  { id: 4, name: "Lucía Martínez", stars: 5, comments: "Habitaciones y oficinas", photo: "https://randomuser.me/api/portraits/women/68.jpg", specialty: "Habitaciones y oficinas" },
  { id: 5, name: "Pedro Ruiz", stars: 4, comments: "Limpieza general rápida y eficiente", photo: "https://randomuser.me/api/portraits/men/75.jpg", specialty: "Limpieza general" }
];

const servicePrices = { basico: 30, profundo: 50 };

// ======== Estado de la app ========
let selectedWorld = null;     // 'basico' | 'profundo' | 'auto'
let selectedService = 'basico';
let selectedExpert = null;    // object from experts
let spaces = 1;
let maxSpaces = 10;
let carCount = 1;
let carType = 'sedan';
const maxCars = 10;
let selectedSchedule = "inmediato"; // 'inmediato'|'programado'
let selectedPayment = null; // 'tarjeta'|'efectivo'

// ======== DOM Elements ========
const defaultAddressEl = document.getElementById("defaultAddress");
const worldSelectionSection = document.getElementById("worldSelection");
const expertSection = document.getElementById("expertSection");
const expertsContainer = document.getElementById("expertsContainer");
const btnNextFromExperts = document.getElementById("btnNextFromExperts");
const areasSection = document.getElementById("areasSection");
const summarySection = document.getElementById("summarySection");
const paymentSection = document.getElementById("paymentSection");
const paymentForm = document.getElementById("paymentForm");
const cardDetailsDiv = document.getElementById("cardDetails");
const btnConfirmPayment = document.getElementById("btnConfirmPayment");
const trackingSection = document.getElementById("trackingSection");
const trackStatus = document.getElementById("trackStatus");
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
const spacesInput = document.getElementById('spacesInput');
const totalSpaces = document.getElementById('totalSpaces');
const totalCost = document.getElementById('totalCost');
const btnDecrease = document.getElementById('btnDecrease');
const btnIncrease = document.getElementById('btnIncrease');
const carsInput = document.getElementById('carsInput');
const totalCarsEl = document.getElementById('totalCars');
const totalCarCostEl = document.getElementById('totalCarCost');
const btnCarIncrease = document.getElementById('btnCarIncrease');
const btnCarDecrease = document.getElementById('btnCarDecrease');
const scheduleDateInput = document.getElementById("scheduleDateInput");
const btnCalculateTotal = document.getElementById("btnCalculateTotal");
const carSection = document.getElementById('autoSection');
const btnNextFromCars = document.getElementById('btnNextFromCars'); // existe en tu HTML

// ======== Utilidades ========
function safeGet(el, name) {
  if(!el) console.warn(`Elemento faltante: ${name}`);
  return el;
}

// ======== User functions (localStorage) ========
function loadUser() {
  const saved = localStorage.getItem("xpertoUser");
  if(saved) {
    user = JSON.parse(saved);
    if(profileName) profileName.value = user.name || "";
    if(profileLastName) profileLastName.value = user.lastName || "";
    if(profileEmail) profileEmail.value = user.email || "";
    if(profilePhone) profilePhone.value = user.phone || "";
    if(profileAddress) profileAddress.value = user.address || "";
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
  defaultAddressEl.textContent = user.address ? `Dirección: ${user.address}` : "Por favor, configura tu dirección en Perfil.";
}

// ======== Navegación entre secciones ========
function showSection(sectionId) {
  const sections = [worldSelectionSection, expertSection, areasSection, summarySection, paymentSection, trackingSection, historySection, profileSection, carSection];
  sections.forEach(sec => sec && sec.classList.add("hidden"));
  Object.values(navButtons).forEach(btn => btn && btn.classList.remove("active"));

  switch(sectionId) {
    case "worldSelection":
      worldSelectionSection.classList.remove("hidden");
      navButtons.worldSelection.classList.add("active");
      resetApp();
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
    case "expertSection":
      expertSection.classList.remove("hidden");
      break;
    case "areasSection":
      areasSection.classList.remove("hidden");
      break;
    case "autoSection":
      carSection.classList.remove("hidden");
      break;
    case "summarySection":
      summarySection.classList.remove("hidden");
      break;
    case "paymentSection":
      paymentSection.classList.remove("hidden");
      break;
    case "trackingSection":
      trackingSection.classList.remove("hidden");
      break;
    default:
      // si no coincide, intenta mostrar por id
      const el = document.getElementById(sectionId);
      if(el) el.classList.remove("hidden");
  }
}

// ======== Reset app (estado inicial cuando entras a Home) ========
function resetApp() {
  selectedWorld = null;
  selectedService = 'basico';
  selectedExpert = null;
  spaces = 1;
  carCount = 1;
  carType = 'sedan';
  selectedSchedule = "inmediato";
  selectedPayment = null;

  expertSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");
  carSection.classList.add("hidden");
  btnNextFromExperts.disabled = true;

  renderExperts();
  updateSpaces();
  updateCars();
}

// ======== Selección de servicio (muestra expertos primero siempre) ========
function selectWorld(worldKey) {
  const unlock = worlds[worldKey].unlocksAt || 0;
  if(user.limpiezaPurchases < unlock){
    alert(`Debes completar ${unlock} servicios previos para desbloquear ${worlds[worldKey].name}.`);
    return;
  }

  selectedWorld = worldKey;
  selectedService = worldKey;

  // Mostrar selección de experto primero (para limpieza y auto)
  showSection('expertSection');
  renderExperts();
}

// ======== Expertos ========
function renderExperts() {
  if(!expertsContainer) return;
  expertsContainer.innerHTML = "";
  selectedExpert = null;
  btnNextFromExperts.disabled = true;

  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role","button");
    card.innerHTML = `
      <img src="${exp.photo}" alt="Foto de ${exp.name}" />
      <h3>${exp.name}</h3>
      <p class="stars">${"★".repeat(exp.stars)}${"☆".repeat(5-exp.stars)}</p>
      <p class="comment">${exp.comments}</p>
      <p><em>${exp.specialty}</em></p>
    `;
    card.addEventListener("click", ()=> selectExpert(exp.id));
    card.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); selectExpert(exp.id); }});
    expertsContainer.appendChild(card);
  });
}

function selectExpert(id) {
  selectedExpert = experts.find(e => e.id === id);
  // marcar UI
  [...expertsContainer.children].forEach(c => c.classList.remove('selected'));
  const card = [...expertsContainer.children].find(c => c.querySelector("h3")?.textContent === selectedExpert.name);
  if(card) card.classList.add('selected');
  btnNextFromExperts.disabled = false;
}

function goToAreas() {
  if(!selectedExpert){
    alert("Selecciona un experto antes de continuar.");
    return;
  }
  // ocultar expertos
  expertSection.classList.add('hidden');

  if(selectedService === 'auto'){
    // ir a selección de vehículo y cantidad
    carSection.classList.remove('hidden');
    updateCars();
  } else {
    areasSection.classList.remove('hidden');
    updateSpaces();
  }
}

// ======== Contadores: espacios ========
function increaseSpaces(){ if(spaces < maxSpaces) { spaces++; updateSpaces(); } }
function decreaseSpaces(){ if(spaces > 1) { spaces--; updateSpaces(); } }
function updateSpaces(){
  if(spacesInput) spacesInput.value = spaces;
  if(totalSpaces) totalSpaces.textContent = spaces;
  const price = servicePrices[selectedService] || servicePrices.basico;
  if(totalCost) totalCost.textContent = (spaces * price).toFixed(2);
  if(btnDecrease) btnDecrease.disabled = spaces === 1;
  if(btnIncrease) btnIncrease.disabled = spaces === maxSpaces;
}

// ======== Contadores: autos ========
function increaseCars(){ if(carCount < maxCars) { carCount++; updateCars(); } }
function decreaseCars(){ if(carCount > 1) { carCount--; updateCars(); } }
function updateCars(){
  if(carsInput) carsInput.value = carCount;
  if(totalCarsEl) totalCarsEl.textContent = carCount;
  let basePrice = 10;
  if(carType === 'crossover') basePrice = 13;
  if(carType === 'suv') basePrice = 16;
  if(carType === 'camioneta') basePrice = 19;
  if(totalCarCostEl) totalCarCostEl.textContent = (basePrice + (carCount - 1) * 3).toFixed(2);
  if(btnCarDecrease) btnCarDecrease.disabled = carCount === 1;
  if(btnCarIncrease) btnCarIncrease.disabled = carCount === maxCars;
}

document.querySelectorAll('input[name="carType"]').forEach(r => {
  r.addEventListener('change', () => {
    const sel = document.querySelector('input[name="carType"]:checked');
    if(sel) carType = sel.value;
    updateCars();
  });
});

// ======== Tooltips ========
document.querySelectorAll('.infoBtn').forEach(btn=>{
  btn.addEventListener('click', e=>{
    e.stopPropagation(); // evita activar selectWorld
    const id = btn.getAttribute('data-tooltip');
    const tooltip = document.getElementById(id);
    if(!tooltip) return;
    // cerrar otros tooltips
    document.querySelectorAll('.service-info').forEach(si => { if(si !== tooltip) si.classList.add('hidden'); });
    tooltip.classList.toggle('hidden');
  });
});
// cerrar tooltips si se hace click fuera
document.addEventListener('click', () => {
  document.querySelectorAll('.service-info').forEach(si => si.classList.add('hidden'));
});

// ======== Horario (programado / inmediato) ========
document.querySelectorAll('input[name="schedule"]').forEach(r => {
  r.addEventListener('change', e => {
    selectedSchedule = e.target.value;
    if(scheduleDateInput) scheduleDateInput.classList.toggle('hidden', selectedSchedule !== 'programado');
  });
});

// ======== Resumen (desde áreas o autos) ========
function buildSummary() {
  if(!selectedService) {
    alert("Selecciona primero un servicio.");
    return;
  }
  let total = 0;
  let html = `<h3>Resumen de tu servicio</h3>
              <p>Servicio: ${worlds[selectedService].name}</p>
              <p>Experto: ${selectedExpert ? selectedExpert.name : '-'}</p>`;
  if(selectedService === 'auto') {
    html += `<p>Tipo de auto: ${carType}</p>
             <p>Cantidad: ${carCount}</p>`;
    // calcular total
    let basePrice = 10;
    if(carType === 'crossover') basePrice = 13;
    if(carType === 'suv') basePrice = 16;
    if(carType === 'camioneta') basePrice = 19;
    total = basePrice + (carCount - 1) * 3;
  } else {
    html += `<p>Espacios: ${spaces}</p>`;
    const price = servicePrices[selectedService] || servicePrices.basico;
    total = price * spaces;
  }

  html += `<p>Horario: ${selectedSchedule}${selectedSchedule === 'programado' && scheduleDateInput && scheduleDateInput.value ? ` el ${scheduleDateInput.value}` : ''}</p>`;
  html += `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;

  // añadir botones para continuar al pago
  html += `<div class="summary-actions">
            <button id="btnProceedToPayment" class="btn">Ir a pago</button>
           </div>`;

  summarySection.innerHTML = html;
  showSection('summarySection');

  // listener para ir a pago
  const proceedBtn = document.getElementById('btnProceedToPayment');
  if(proceedBtn) proceedBtn.addEventListener('click', () => {
    showSection('paymentSection');
    // guardar el total en dataset para el pago / historial
    summarySection.dataset.total = total.toFixed(2);
  });
}

// vincular botones de resumen
if(btnCalculateTotal) btnCalculateTotal.addEventListener('click', buildSummary);
if(btnNextFromCars) {
  btnNextFromCars.addEventListener('click', () => {
    // cuando se viene de autos, construimos resumen directamente
    buildSummary();
  });
}

// ======== Pago ========
if(paymentForm) {
  paymentForm.addEventListener('change', () => {
    const method = document.querySelector('input[name="pay"]:checked')?.value;
    selectedPayment = method;
    if(cardDetailsDiv) cardDetailsDiv.classList.toggle('hidden', method !== 'tarjeta');
  });
}
if(btnConfirmPayment) {
  btnConfirmPayment.addEventListener('click', () => {
    if(!selectedPayment) {
      alert('Selecciona un método de pago.');
      return;
    }
    // Simular pago ok
    alert('Pago realizado con éxito');
    showSection('trackingSection');
    trackStatus.textContent = 'Asignando experto...';

    // Después de un tiempo asignamos
    setTimeout(() => {
      trackStatus.textContent = 'Experto asignado: ' + (selectedExpert ? selectedExpert.name : 'Xperto');
      // Guardar en historial
      const total = parseFloat(summarySection.dataset.total || (selectedService === 'auto' ? parseFloat(totalCarCostEl?.textContent || 0) : parseFloat(totalCost?.textContent || 0)));
      const serviceRecord = {
        service: selectedService,
        expert: selectedExpert ? selectedExpert.name : null,
        date: new Date().toLocaleString(),
        total: isNaN(total) ? 0 : total
      };
      user.history = user.history || [];
      user.history.push(serviceRecord);
      // incrementar limpieza purchases solo para limpiezas
      if(selectedService !== 'auto') user.limpiezaPurchases = (user.limpiezaPurchases || 0) + 1;
      localStorage.setItem('xpertoUser', JSON.stringify(user));
    }, 1500);
  });
}

// ======== Historial ========
function renderHistory(){
  if(!historyContainer) return;
  historyContainer.innerHTML = '';
  if(!user.history || !user.history.length){
    historyContainer.innerHTML = '<p>No tienes historial aún.</p>';
    return;
  }
  user.history.forEach(h => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h4>${h.service}</h4>
                      <p>Experto: ${h.expert || '-'}</p>
                      <p>Fecha: ${h.date}</p>
                      <p>Total: $${(h.total||0).toFixed(2)}</p>`;
    historyContainer.appendChild(card);
  });
}

// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", ()=>{
  // avisos por si falta algún elemento crítico
  safeGet(expertsContainer, 'expertsContainer');
  safeGet(btnNextFromExperts, 'btnNextFromExperts');
  safeGet(carSection, 'autoSection');

  loadUser();
  showSection("worldSelection");

  // listeners botones contadores
  if(btnDecrease) btnDecrease.addEventListener('click', decreaseSpaces);
  if(btnIncrease) btnIncrease.addEventListener('click', increaseSpaces);
  if(btnCarIncrease) btnCarIncrease.addEventListener('click', increaseCars);
  if(btnCarDecrease) btnCarDecrease.addEventListener('click', decreaseCars);

  // perfil
  if(profileForm) profileForm.addEventListener('submit', e => { e.preventDefault(); saveUser(); });
});
