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
  auto: { name: "Lavada de Auto", icon: "https://img.icons8.com/ios-filled/50/000000/car.png", description: "Lavado interior y exterior de auto", unlocksAt: 3 }
};

const experts = [
  { id: 1, name: "Juan Pérez", stars: 4, comments: "Limpia cocina y salas", photo: "https://randomuser.me/api/portraits/men/32.jpg", specialty: "Cocinas y salas" },
  { id: 2, name: "María Gómez", stars: 5, comments: "Especialista en baños", photo: "https://randomuser.me/api/portraits/women/45.jpg", specialty: "Baños profundos" },
  { id: 3, name: "Carlos Torres", stars: 3, comments: "Terrazas y exteriores impecables", photo: "https://randomuser.me/api/portraits/men/12.jpg", specialty: "Terrazas y exteriores" },
  { id: 4, name: "Lucía Martínez", stars: 5, comments: "Habitaciones y oficinas", photo: "https://randomuser.me/api/portraits/women/68.jpg", specialty: "Habitaciones y oficinas" },
  { id: 5, name: "Pedro Ruiz", stars: 4, comments: "Limpieza general rápida y eficiente", photo: "https://randomuser.me/api/portraits/men/75.jpg", specialty: "Limpieza general" }
];

const areas = [
  { id: "habitaciones", label: "Habitaciones", price: 10 },
  { id: "cocina", label: "Cocina", price: 15 },
  { id: "comedor", label: "Comedor", price: 12 },
  { id: "sala", label: "Sala", price: 12 },
  { id: "terraza", label: "Terraza", price: 20 }
];

const servicePrices = { basico: 30, profundo: 50 };

// ======== Estado de la app ========
let selectedWorld = null;
let selectedService = 'basico';
let selectedExpert = null;
let selectedAreas = {};
let selectedSchedule = "inmediato";
let selectedDate = null;
let selectedPayment = null;

// Para autos
let carCount = 1;
let carType = 'sedan';
const maxCars = 10;

// Para espacios
let spaces = 1;
const maxSpaces = 10;

// ======== DOM Elements ========
const defaultAddressEl = document.getElementById("defaultAddress");
const worldSelectionSection = document.getElementById("worldSelection");
const expertSection = document.getElementById("expertSection");
const expertsContainer = document.getElementById("expertsContainer");
const btnNextFromExperts = document.getElementById("btnNextFromExperts");

const areasSection = document.getElementById("areasSection");
const areasContainer = document.getElementById("areasContainer");
const scheduleRadios = document.querySelectorAll('input[name="schedule"]');
const scheduleDateInput = document.getElementById("scheduleDate");
const btnCalculateTotal = document.getElementById("btnCalculateTotal");

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
  const sections = [worldSelectionSection, expertSection, areasSection, summarySection, paymentSection, trackingSection, historySection, profileSection];
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
  selectedAreas = {};
  selectedSchedule = "inmediato";
  selectedDate = null;
  selectedPayment = null;
  expertSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");
  btnNextFromExperts.disabled = true;
  scheduleDateInput.value = "";
  scheduleDateInput.classList.add("hidden");
  renderExperts();
}

// ======== Selección de mundo unificada ========
function selectWorld(worldKey) {
  if(worldKey === "profundo" && user.limpiezaPurchases < worlds.profundo.unlocksAt) {
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios básicos para desbloquear limpieza profunda.`);
    return;
  }

  selectedWorld = worldKey;
  selectedService = worldKey;

  expertSection.classList.remove("hidden");
  worldSelectionSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  renderExperts();

  // Mostrar sección correspondiente
  if(worldKey === "auto") {
    document.getElementById('carSection').classList.remove('hidden');
    carCount = 1; carType='sedan'; updateCars();
  } else {
    document.getElementById('carSection').classList.add('hidden');
    spaces = 1; updateSpaces();
  }
}

// ======== Expertos ========
function renderExperts() {
  expertsContainer.innerHTML = "";
  selectedExpert = null;
  btnNextFromExperts.disabled = true;
  experts.forEach(exp => {
    if(selectedWorld === "basico" && exp.specialty.toLowerCase().includes("profundo")) return;
    const card = document.createElement("div");
    card.classList.add("card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `<img src="${exp.photo}" alt="Foto de ${exp.name}" />
                      <h3>${exp.name}</h3>
                      <p class="stars">${"★".repeat(exp.stars)}${"☆".repeat(5 - exp.stars)}</p>
                      <p class="comment">${exp.comments}</p>
                      <p><em>${exp.specialty}</em></p>`;
    card.addEventListener("click", () => selectExpert(exp.id));
    card.addEventListener("keydown", (e) => { if(e.key==="Enter"||e.key===" ") { e.preventDefault(); selectExpert(exp.id); } });
    expertsContainer.appendChild(card);
  });
}

function selectExpert(id) {
  selectedExpert = experts.find(e => e.id === id);
  [...expertsContainer.children].forEach(card => card.classList.remove("selected"));
  const selectedCard = [...expertsContainer.children].find(card => card.querySelector("h3").textContent === selectedExpert.name);
  if(selectedCard) selectedCard.classList.add("selected");
  btnNextFromExperts.disabled = false;
}

// ======== Contador de espacios ========
const spacesInput = document.getElementById('spacesInput');
const totalSpaces = document.getElementById('totalSpaces');
const totalCost = document.getElementById('totalCost');
const btnDecrease = document.getElementById('btnDecrease');
const btnIncrease = document.getElementById('btnIncrease');

function increaseSpaces() { if(spaces<maxSpaces){ spaces++; updateSpaces(); } }
function decreaseSpaces() { if(spaces>1){ spaces--; updateSpaces(); } }

function updateSpaces() {
  spacesInput.value = spaces;
  totalSpaces.textContent = spaces;
  totalCost.textContent = (spaces*servicePrices[selectedService]).toFixed(2);
  btnDecrease.disabled = spaces===1;
  btnIncrease.disabled = spaces===maxSpaces;
}

// ======== Contador autos ========
const carsInput = document.getElementById('carsInput');
const totalCarsEl = document.getElementById('totalCars');
const totalCarCostEl = document.getElementById('totalCarCost');
const btnCarIncrease = document.getElementById('btnCarIncrease');
const btnCarDecrease = document.getElementById('btnCarDecrease');

function increaseCars(){ if(carCount<maxCars){ carCount++; updateCars(); } }
function decreaseCars(){ if(carCount>1){ carCount--; updateCars(); } }

function updateCars(){
  carsInput.value=carCount;
  totalCarsEl.textContent=carCount;
  let basePrice=10; 
  if(carType==='crossover') basePrice=13;
  if(carType==='suv') basePrice=16;
  if(carType==='camioneta') basePrice=19;
  const total=basePrice+(carCount-1)*3;
  totalCarCostEl.textContent=total.toFixed(2);
  btnCarDecrease.disabled=carCount===1;
  btnCarIncrease.disabled=carCount===maxCars;
}

document.querySelectorAll('input[name="carType"]').forEach(radio=>radio.addEventListener('change',()=>{ carType=document.querySelector('input[name="carType"]:checked').value; updateCars(); }));

// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", ()=>{
  loadUser();
  showSection("worldSelection");
});
profileForm.addEventListener("submit", e=>{ e.preventDefault(); saveUser(); });
