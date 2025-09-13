// ======== Datos iniciales ========
let user = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  limpiezaPurchases: 0,
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
let selectedWorld = null;
let selectedService = 'basico';
let selectedExpert = null;
let spaces = 1;
let maxSpaces = 10;

// Para autos
let carCount = 1;
let carType = 'sedan';
const maxCars = 10;

// Horario
let selectedSchedule = "inmediato";
let selectedDate = null;

// Pago
let selectedPayment = null;

// ======== DOM Elements ========
const defaultAddressEl = document.getElementById("defaultAddress");
const worldSelectionSection = document.getElementById("worldSelection");
const autoSection = document.getElementById("autoSection"); // Nueva sección para autos
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
const btnCalculateTotal = document.getElementById('btnCalculateTotal');
const scheduleDateInput = document.getElementById('scheduleDateInput');

// ======== Funciones usuario ========
function loadUser() {
  const saved = localStorage.getItem("xpertoUser");
  if(saved) {
    user = JSON.parse(saved);
    profileName.value = user.name || "";
    profileLastName.value = user.lastName || "";
    profileEmail.value = user.email || "";
    profilePhone.value = user.phone || "";
    profileAddress.value = user.address || "";
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

// ======== Navegación ========
function showSection(sectionId) {
  const sections = [worldSelectionSection, autoSection, expertSection, areasSection, summarySection, paymentSection, trackingSection, historySection, profileSection];
  sections.forEach(sec => sec.classList.add("hidden"));
  Object.values(navButtons).forEach(btn => btn.classList.remove("active"));

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
  }
}

// ======== Reset app ========
function resetApp() {
  selectedWorld = null;
  selectedExpert = null;
  spaces = 1;
  carCount = 1;
  carType = 'sedan';
  expertSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  autoSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");
  btnNextFromExperts.disabled = true;
  renderExperts();
  updateSpaces();
  updateCars();
}

// ======== Selección de mundo ========
function selectWorld(worldKey) {
  const unlock = worlds[worldKey].unlocksAt || 0;
  if(user.limpiezaPurchases < unlock){
    alert(`Debes completar ${unlock} servicios previos para desbloquear ${worlds[worldKey].name}.`);
    return;
  }

  selectedWorld = worldKey;
  selectedService = worldKey;

  // Lógica separada para autos
  if(worldKey === 'auto'){
    autoSection.classList.remove('hidden');
    worldSelectionSection.classList.add('hidden');
    expertSection.classList.add('hidden');
    areasSection.classList.add('hidden');
  } else {
    autoSection.classList.add('hidden');
    areasSection.classList.remove('hidden');
    expertSection.classList.remove('hidden');
    worldSelectionSection.classList.add('hidden');
  }
}

// ======== Expertos ========
function renderExperts() {
  expertsContainer.innerHTML = "";
  selectedExpert = null;
  btnNextFromExperts.disabled = true;
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.tabIndex = 0;
    card.setAttribute("role","button");
    card.setAttribute("aria-pressed","false");
    card.innerHTML = `<img src="${exp.photo}" alt="Foto de ${exp.name}" />
                      <h3>${exp.name}</h3>
                      <p class="stars">${"★".repeat(exp.stars)}${"☆".repeat(5-exp.stars)}</p>
                      <p class="comment">${exp.comments}</p>
                      <p><em>${exp.specialty}</em></p>`;
    card.addEventListener("click", ()=>selectExpert(exp.id));
    card.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); selectExpert(exp.id); } });
    expertsContainer.appendChild(card);
  });
}

function selectExpert(id){
  selectedExpert = experts.find(e=>e.id===id);
  [...expertsContainer.children].forEach(c=>c.classList.remove("selected"));
  const card = [...expertsContainer.children].find(c=>c.querySelector("h3").textContent===selectedExpert.name);
  if(card) card.classList.add("selected");
  btnNextFromExperts.disabled=false;
}

// ======== Contadores ========
function increaseSpaces(){ if(spaces<maxSpaces){ spaces++; updateSpaces(); } }
function decreaseSpaces(){ if(spaces>1){ spaces--; updateSpaces(); } }
function updateSpaces(){
  spacesInput.value=spaces;
  totalSpaces.textContent=spaces;
  totalCost.textContent=(spaces*servicePrices[selectedService]).toFixed(2);
  btnDecrease.disabled=spaces===1;
  btnIncrease.disabled=spaces===maxSpaces;
}

function increaseCars(){ if(carCount<maxCars){ carCount++; updateCars(); } }
function decreaseCars(){ if(carCount>1){ carCount--; updateCars(); } }
function updateCars(){
  carsInput.value=carCount;
  totalCarsEl.textContent=carCount;
  let basePrice=10;
  if(carType==='crossover') basePrice=13;
  if(carType==='suv') basePrice=16;
  if(carType==='camioneta') basePrice=19;
  totalCarCostEl.textContent=(basePrice+(carCount-1)*3).toFixed(2);
  btnCarDecrease.disabled=carCount===1;
  btnCarIncrease.disabled=carCount===maxCars;
}
document.querySelectorAll('input[name="carType"]').forEach(r=>{
  r.addEventListener('change',()=>{
    carType=document.querySelector('input[name="carType"]:checked').value;
    updateCars();
  });
});

// ======== Tooltips info ========
document.querySelectorAll('.infoBtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const tooltipId = btn.dataset.tooltip;
    document.getElementById(tooltipId).classList.toggle('hidden');
  });
});

// ======== Horario ========
document.querySelectorAll('input[name="schedule"]').forEach(r=>{
  r.addEventListener('change', ()=>{
    selectedSchedule=r.value;
    scheduleDateInput.classList.toggle('hidden', selectedSchedule!=='programado');
  });
});

// ======== Resumen ========
btnCalculateTotal.addEventListener('click', ()=>{
  let summaryHTML=`<h3>Resumen de tu servicio</h3>
                   <p>Servicio: ${worlds[selectedService].name}</p>
                   <p>Experto: ${selectedExpert ? selectedExpert.name : '-'}</p>`;
  if(selectedService==='auto'){
    summaryHTML+=`<p>Tipo de auto: ${carType}</p>
                  <p>Cantidad: ${carCount}</p>
                  <p>Total: $${totalCarCostEl.textContent}</p>`;
  } else {
    summaryHTML+=`<p>Espacios: ${spaces}</p>
                  <p>Total: $${totalCost.textContent}</p>`;
  }
  summaryHTML+=`<p>Horario: ${selectedSchedule}${selectedSchedule==='programado'?` el ${scheduleDateInput.value}`:''}</p>`;
  summarySection.innerHTML=summaryHTML;
  summarySection.classList.remove('hidden');
  areasSection.classList.add('hidden');
});

// ======== Pago ========
paymentForm.addEventListener('change', ()=>{
  const method=document.querySelector('input[name="pay"]:checked')?.value;
  selectedPayment=method;
  cardDetailsDiv.classList.toggle('hidden', method!=='tarjeta');
});

btnConfirmPayment.addEventListener('click', ()=>{
  if(!selectedPayment){
    alert('Selecciona un método de pago.');
    return;
  }
  alert('Pago realizado con éxito');
  trackStatus.textContent='Asignando experto...';
  trackingSection.classList.remove('hidden');
  paymentSection.classList.add('hidden');

  setTimeout(()=>{
    trackStatus.textContent='Experto asignado: '+(selectedExpert?selectedExpert.name:'Xperto');
    const serviceRecord={
      service:selectedService,
      expert:selectedExpert ? selectedExpert.name : null,
      date: new Date().toLocaleString(),
      total:selectedService==='auto'?parseFloat(totalCarCostEl.textContent):parseFloat(totalCost.textContent)
    };
    user.history.push(serviceRecord);
    if(selectedService!=='auto') user.limpiezaPurchases++;
    localStorage.setItem('xpertoUser',JSON.stringify(user));
  },2000);
});

// ======== Historial ========
function renderHistory(){
  historyContainer.innerHTML='';
  if(!user.history.length){ historyContainer.innerHTML='<p>No tienes historial aún.</p>'; return; }
  user.history.forEach(h=>{
    const card=document.createElement('div');
    card.classList.add('card');
    card.innerHTML=`<h4>${h.service}</h4><p>Experto: ${h.expert || '-'}</p><p>Fecha: ${h.date}</p><p>Total: $${h.total.toFixed(2)}</p>`;
    historyContainer.appendChild(card);
  });
}

// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", ()=>{
  loadUser();
  showSection("worldSelection");
});
profileForm.addEventListener("submit", e=>{ e.preventDefault(); saveUser(); });
btnDecrease.addEventListener('click', decreaseSpaces);
btnIncrease.addEventListener('click', increaseSpaces);
btnCarIncrease.addEventListener('click', increaseCars);
btnCarDecrease.addEventListener('click', decreaseCars);
