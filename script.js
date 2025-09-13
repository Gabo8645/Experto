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
  profundo: { name: "Limpieza Profunda", icon: "https://img.icons8.com/ios-filled/50/000000/vacuum.png", description: "Limpieza profunda", unlocksAt: 3 }
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
let selectedExpert = null;
let selectedAreas = {};
let selectedSchedule = "inmediato";
let selectedDate = null;
let selectedPayment = null;
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
const scheduleDateInput = document.getElementById("scheduleDateInput");
const btnCalculateTotal = document.getElementById("btnCalculateTotal");
const summarySection = document.getElementById("summarySection");
const paymentSection = document.getElementById("paymentSection");
const paymentForm = document.getElementById("paymentForm");
const cardDetailsDiv = document.getElementById("cardDetails");
const btnConfirmPayment = document.getElementById("btnConfirmPayment");
const trackingSection = document.getElementById("trackingSection");
const trackStatus = document.getElementById("trackStatus");
const promosSection = document.getElementById("promosSection");
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
  profileSection: document.getElementById("navProfile")
};
const spacesInput = document.getElementById('spacesInput');
const totalSpaces = document.getElementById('totalSpaces');
const totalCost = document.getElementById('totalCost');
const btnDecrease = document.getElementById('btnDecrease');
const btnIncrease = document.getElementById('btnIncrease');

// ======== Funciones de usuario ========
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
  if(user.address) {
    defaultAddressEl.textContent = `Dirección: ${user.address}`;
  } else {
    defaultAddressEl.textContent = "Por favor, configura tu dirección en Perfil.";
  }
}

// ======== Navegación ========
function showSection(sectionId) {
  const sections = [worldSelectionSection, expertSection, areasSection, summarySection, paymentSection, trackingSection, promosSection, historySection, profileSection];
  sections.forEach(sec => sec.classList.add("hidden"));
  Object.values(navButtons).forEach(btn => btn.classList.remove("active"));

  switch(sectionId) {
    case "worldSelection":
      worldSelectionSection.classList.remove("hidden");
      navButtons.worldSelection.classList.add("active");
      resetApp();
      break;
    case "promosSection":
      promosSection.classList.remove("hidden");
      navButtons.promosSection.classList.add("active");
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

// ======== Reset ========
function resetApp() {
  selectedWorld = null;
  selectedExpert = null;
  selectedAreas = {};
  selectedSchedule = "inmediato";
  selectedDate = null;
  selectedPayment = null;
  spaces = 1;

  expertSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  btnNextFromExperts.disabled = true;
  scheduleDateInput.value = "";
  scheduleDateInput.classList.add("hidden");

  renderExperts();
  updateSpaces();
}

// ======== Selección de mundo ========
function selectWorld(worldKey) {
  if(worldKey === "profundo" && user.limpiezaPurchases < worlds.profundo.unlocksAt) {
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios básicos para desbloquear limpieza profunda.`);
    return;
  }
  selectedWorld = worldKey;
  expertSection.classList.remove("hidden");
  worldSelectionSection.classList.add("hidden");
  renderExperts();
  updateSpaces();
}

// ======== Tooltips ========
document.querySelectorAll('.infoBtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = btn.dataset.tooltip;
    document.querySelectorAll('.service-info').forEach(div => {
      if(div.id !== id) div.classList.add('hidden');
    });
    const div = document.getElementById(id);
    if(div) div.classList.toggle('hidden');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.service-info').forEach(div => div.classList.add('hidden'));
});

// ======== Renderizar expertos ========
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
    card.innerHTML = `
      <img src="${exp.photo}" alt="Foto de ${exp.name}" />
      <h3>${exp.name}</h3>
      <p class="stars">${"★".repeat(exp.stars)}${"☆".repeat(5 - exp.stars)}</p>
      <p class="comment">${exp.comments}</p>
      <p><em>${exp.specialty}</em></p>
    `;
    card.addEventListener("click", () => selectExpert(exp.id));
    card.addEventListener("keydown", e => { if(e.key === "Enter"||e.key===" ") { e.preventDefault(); selectExpert(exp.id); } });
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

function goToAreas() {
  if(!selectedExpert) { alert("Selecciona un experto."); return; }
  expertSection.classList.add("hidden");
  areasSection.classList.remove("hidden");
  renderAreas();
}

// ======== Áreas ========
function renderAreas() {
  areasContainer.innerHTML = "";
  selectedAreas = {};
  areas.forEach(area => {
    const label = document.createElement("label");
    label.innerHTML = `${area.label} ($${area.price}) <input type="number" min="0" max="10" value="0" data-area-id="${area.id}" />`;
    areasContainer.appendChild(label);
  });
}

// ======== Manejo programación ========
scheduleRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    selectedSchedule = document.querySelector('input[name="schedule"]:checked').value;
    if(selectedSchedule === "programado") {
      scheduleDateInput.classList.remove("hidden");
      scheduleDateInput.required = true;
    } else {
      scheduleDateInput.classList.add("hidden");
      scheduleDateInput.required = false;
      selectedDate = null;
      scheduleDateInput.value = "";
    }
  });
});
scheduleDateInput.addEventListener("change", e => selectedDate = e.target.value);

// ======== Calcular total y resumen ========
btnCalculateTotal.addEventListener("click", () => {
  selectedAreas = {};
  let total = 0;
  let anyAreaSelected = false;
  areasContainer.querySelectorAll("input[type=number]").forEach(input => {
    const count = parseInt(input.value)||0;
    if(count>0){anyAreaSelected=true; selectedAreas[input.dataset.areaId]=count; total+=areas.find(a=>a.id===input.dataset.areaId).price*count;}
  });
  if(!anyAreaSelected){alert("Selecciona al menos un área."); return;}
  if(selectedSchedule==="programado" && !selectedDate){alert("Selecciona una fecha."); return;}

  let summaryHTML=`<h2>Resumen del Servicio</h2>`;
  summaryHTML+=`<p><strong>Mundo:</strong> ${worlds[selectedWorld].name}</p>`;
  summaryHTML+=`<p><strong>Experto:</strong> ${selectedExpert.name}</p>`;
  summaryHTML+=`<p><strong>Dirección:</strong> ${user.address||"No configurada"}</p>`;
  summaryHTML+=`<p><strong>Áreas seleccionadas:</strong></p><ul>`;
  for(const [areaId,count] of Object.entries(selectedAreas)){
    const area = areas.find(a=>a.id===areaId);
    summaryHTML+=`<li>${area.label}: ${count} x $${area.price} = $${area.price*count}</li>`;
  }
  summaryHTML+=`</ul><p><strong>Total:</strong> $${total}</p>`;
  summaryHTML+=`<p><strong>Programación:</strong> ${selectedSchedule==="inmediato"?"Inmediato":selectedDate}</p>`;
  summarySection.innerHTML = summaryHTML;

  areasSection.classList.add("hidden");
  summarySection.classList.remove("hidden");
  paymentSection.classList.remove("hidden");
  trackingSection.classList.add("hidden");
});

// ======== Payment ========
paymentForm.addEventListener("change", e => {
  if(e.target.name==="pay"){ selectedPayment=e.target.value; cardDetailsDiv.classList.toggle("hidden", selectedPayment!=="tarjeta"); }
});

btnConfirmPayment.addEventListener("click", () => {
  if(!selectedPayment){alert("Selecciona un método de pago."); return;}
  if(selectedPayment==="tarjeta"){
    const cardNumber=document.getElementById("cardNumber").value.trim();
    const cardExpiry=document.getElementById("cardExpiry").value;
    const cardCVV=document.getElementById("cardCVV").value.trim();
    if(cardNumber.length<13){alert("Número de tarjeta inválido"); return;}
    if(!cardExpiry){alert("Fecha inválida"); return;}
    if(cardCVV.length<3){alert("CVV inválido"); return;}
  }
  const totalCost = spaces * servicePrices[selectedWorld];
  const now = new Date();
  const serviceRecord = {
    id: now.getTime(),
    date: now.toLocaleString(),
    world: worlds[selectedWorld].name,
    expert: selectedExpert.name,
    address: user.address,
    areas: {...selectedAreas},
    schedule: selectedSchedule==="inmediato"?"Inmediato":selectedDate,
    total: totalCost,
    paymentMethod: selectedPayment
  };
  user.history.push(serviceRecord);
  if(selectedWorld==="basico") user.limpiezaPurchases++;
  localStorage.setItem("xpertoUser", JSON.stringify(user));

  paymentSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  trackingSection.classList.remove("hidden");
  trackStatus.textContent="Asignando experto...";
  simulateTrackingFlow();
});

// ======== Tracking completo ========
function simulateTrackingFlow(){
  const statuses = [
    "Asignando experto...",
    "Experto en camino 🚗",
    "Experto ha llegado 🏠",
    "Limpieza en progreso 🧹",
    "Limpieza finalizada 🎉",
    "¡Gracias por elegirnos Xperto! Tu tiempo vale más."
  ];
  let index=0;
  function next(){
    if(index<statuses.length){
      trackStatus.textContent=statuses[index];
      index++;
      setTimeout(next, index===statuses.length?2000:3000);
    } else {
      showSection("worldSelection");
      resetApp();
    }
  }
  next();
}

// ======== Historial ========
function renderHistory(){
  historyContainer.innerHTML="";
  if(user.history.length===0){historyContainer.innerHTML="<p>No tienes servicios aún.</p>"; return;}
  user.history.slice().reverse().forEach(item=>{
    const card=document.createElement("div");
    card.classList.add("card");
    let areasDesc="";
    for(const [areaId,count] of Object.entries(item.areas)){
      const area=areas.find(a=>a.id===areaId);
      areasDesc+=`${area.label}: ${count}, `;
    }
    areasDesc=areasDesc.slice(0,-2);
    card.innerHTML=`
      <h3>${item.world} - ${item.expert}</h3>
      <p><strong>Fecha:</strong> ${item.date}</p>
      <p><strong>Dirección:</strong> ${item.address}</p>
      <p><strong>Áreas:</strong> ${areasDesc}</p>
      <p><strong>Programación:</strong> ${item.schedule}</p>
      <p><strong>Total:</strong> $${item.total}</p>
      <p><strong>Pago:</strong> ${item.paymentMethod}</p>
    `;
    historyContainer.appendChild(card);
  });
}

// ======== Contador de espacios ========
function increaseSpaces(){ if(spaces<maxSpaces) spaces++; updateSpaces(); }
function decreaseSpaces(){ if(spaces>1) spaces--; updateSpaces(); }
function updateSpaces(){
  spacesInput.value=spaces;
  totalSpaces.textContent=spaces;
  totalCost.textContent=(spaces*servicePrices[selectedWorld]).toFixed(2);
  btnDecrease.disabled=spaces===1;
  btnIncrease.disabled=spaces===maxSpaces;
}

// ======== Perfil ========
profileForm.addEventListener("submit", e => { e.preventDefault(); saveUser(); });

// ======== Inicialización ========
document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  showSection("worldSelection");
});
