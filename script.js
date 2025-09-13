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
  basico: { name: "Básico", icon: "https://img.icons8.com/ios-filled/50/000000/broom.png", unlocksAt: 0 },
  profundo: { name: "Profundo", icon: "https://img.icons8.com/ios-filled/50/000000/vacuum.png", unlocksAt: 3 },
  auto: { name: "Auto", icon: "https://img.icons8.com/ios-filled/50/000000/car.png" }
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

const carTypes = {
  sedan: 10,
  crossover: 15,
  suv: 20,
  camioneta: 25
};

// ======== Estado ========
let selectedWorld = null;
let selectedExpert = null;
let selectedAreas = {};
let selectedSchedule = "inmediato";
let selectedDate = null;
let selectedPayment = null;
let selectedCarType = "sedan";
let carQuantity = 1;

// ======== DOM ========
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
const autoSection = document.getElementById("autoSection");
const carsInput = document.getElementById("carsInput");
const totalCars = document.getElementById("totalCars");
const totalCarCost = document.getElementById("totalCarCost");
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
  profileSection: document.getElementById("navProfile")
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
  const sections = [worldSelectionSection, expertSection, areasSection, autoSection, summarySection, paymentSection, trackingSection, promosSection, historySection, profileSection];
  sections.forEach(sec => sec.classList.add("hidden"));
  Object.values(navButtons).forEach(btn => btn.classList.remove("active"));

  switch(sectionId) {
    case "worldSelection": worldSelectionSection.classList.remove("hidden"); navButtons.worldSelection.classList.add("active"); resetApp(); break;
    case "promosSection": promosSection.classList.remove("hidden"); navButtons.promosSection.classList.add("active"); break;
    case "historySection": historySection.classList.remove("hidden"); navButtons.historySection.classList.add("active"); renderHistory(); break;
    case "profileSection": profileSection.classList.remove("hidden"); navButtons.profileSection.classList.add("active"); break;
  }
}
function resetApp() {
  selectedWorld = null;
  selectedExpert = null;
  selectedAreas = {};
  selectedSchedule = "inmediato";
  selectedDate = null;
  selectedPayment = null;
  selectedCarType = "sedan";
  carQuantity = 1;
  btnNextFromExperts.disabled = true;
  scheduleDateInput.value = "";
  scheduleDateInput.classList.add("hidden");
  renderExperts();
  renderAreasInputs();
}

// ======== Selección mundo ========
function selectWorld(worldKey) {
  if(worldKey === "profundo" && user.limpiezaPurchases < worlds.profundo.unlocksAt) {
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios básicos para desbloquear limpieza profunda.`);
    return;
  }
  selectedWorld = worldKey;
  expertSection.classList.remove("hidden");
  worldSelectionSection.classList.add("hidden");
  renderExperts();
}

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
    card.innerHTML = `<img src="${exp.photo}" alt="${exp.name}"/><h3>${exp.name}</h3><p>${"★".repeat(exp.stars)}${"☆".repeat(5-exp.stars)}</p><p>${exp.comments}</p><p><em>${exp.specialty}</em></p>`;
    card.addEventListener("click", ()=>{ selectExpert(exp.id); });
    card.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); selectExpert(exp.id); }});
    expertsContainer.appendChild(card);
  });
}
function selectExpert(id) {
  selectedExpert = experts.find(e=>e.id===id);
  [...expertsContainer.children].forEach(card=>card.classList.remove("selected"));
  const selCard = [...expertsContainer.children].find(c=>c.querySelector("h3").textContent===selectedExpert.name);
  if(selCard) selCard.classList.add("selected");
  btnNextFromExperts.disabled = false;
}

// ======== Siguiente desde expertos ========
btnNextFromExperts.addEventListener("click", ()=>{
  expertSection.classList.add("hidden");
  if(selectedWorld === "auto") {
    autoSection.classList.remove("hidden");
    updateCarDisplay();
  } else {
    areasSection.classList.remove("hidden");
    renderAreasInputs();
  }
});

// ======== Áreas con contador ========
function renderAreasInputs() {
  areasContainer.innerHTML = "";
  selectedAreas = {};
  areas.forEach(area=>{
    const div = document.createElement("div");
    div.classList.add("area-input");
    div.innerHTML = `
      <label>${area.label} ($${area.price})</label>
      <div class="counter">
        <button type="button" onclick="decreaseArea('${area.id}')">-</button>
        <input type="text" id="area_${area.id}" value="0" readonly />
        <button type="button" onclick="increaseArea('${area.id}')">+</button>
      </div>
    `;
    areasContainer.appendChild(div);
    selectedAreas[area.id] = 0;
  });
}
function increaseArea(id) {
  if(selectedAreas[id]<10) {
    selectedAreas[id]++;
    document.getElementById(`area_${id}`).value = selectedAreas[id];
  }
}
function decreaseArea(id) {
  if(selectedAreas[id]>0) {
    selectedAreas[id]--;
    document.getElementById(`area_${id}`).value = selectedAreas[id];
  }
}

// ======== Programación ========
scheduleRadios.forEach(radio=>{
  radio.addEventListener("change", ()=>{
    selectedSchedule = document.querySelector('input[name="schedule"]:checked').value;
    if(selectedSchedule==="programado"){ scheduleDateInput.classList.remove("hidden"); scheduleDateInput.required=true; }
    else{ scheduleDateInput.classList.add("hidden"); scheduleDateInput.required=false; selectedDate=null; scheduleDateInput.value=""; }
  });
});
scheduleDateInput.addEventListener("change", e=>{ selectedDate=e.target.value; });

// ======== Auto sección ========
function increaseCars(){ if(carQuantity<10){ carQuantity++; updateCarDisplay(); } }
function decreaseCars(){ if(carQuantity>1){ carQuantity--; updateCarDisplay(); } }
function updateCarDisplay(){ carsInput.value=carQuantity; totalCars.textContent=carQuantity; totalCarCost.textContent=(carQuantity*carTypes[selectedCarType]).toFixed(2); }
document.querySelectorAll('input[name="carType"]').forEach(radio=>{
  radio.addEventListener("change", e=>{ selectedCarType=e.target.value; updateCarDisplay(); });
});

// ======== Resumen ========
btnCalculateTotal.addEventListener("click", ()=>{
  let total=0;
  let summaryHTML=`<h2>Resumen del Servicio</h2>`;
  summaryHTML+=`<p><strong>Mundo:</strong> ${worlds[selectedWorld].name}</p>`;
  summaryHTML+=`<p><strong>Experto:</strong> ${selectedExpert.name}</p>`;
  summaryHTML+=`<p><strong>Dirección:</strong> ${user.address||"No configurada"}</p>`;

  if(selectedWorld==="auto"){
    total = carQuantity * carTypes[selectedCarType];
    summaryHTML+=`<p><strong>Tipo de auto:</strong> ${selectedCarType}</p>`;
    summaryHTML+=`<p><strong>Cantidad:</strong> ${carQuantity}</p>`;
  } else {
    for(const [areaId,count] of Object.entries(selectedAreas)){
      const area = areas.find(a=>a.id===areaId);
      total += area.price*count;
    }
    summaryHTML+=`<p><strong>Áreas:</strong></p><ul>`;
    for(const [areaId,count] of Object.entries(selectedAreas)){
      if(count>0){ const area=areas.find(a=>a.id===areaId); summaryHTML+=`<li>${area.label}: ${count} x $${area.price} = $${area.price*count}</li>`;}
    }
    summaryHTML+=`</ul>`;
  }
  summaryHTML+=`<p><strong>Total:</strong> $${total}</p>`;
  summaryHTML+=`<p><strong>Programación:</strong> ${selectedSchedule==="inmediato"?"Inmediato":selectedDate}</p>`;
  summarySection.innerHTML=summaryHTML;
  summarySection.classList.remove("hidden");
  paymentSection.classList.remove("hidden");
  areasSection.classList.add("hidden");
  autoSection.classList.add("hidden");
});

// ======== Pago ========
paymentForm.addEventListener("change", e=>{
  if(e.target.name==="pay"){ selectedPayment=e.target.value; cardDetailsDiv.classList.toggle("hidden", selectedPayment!=="tarjeta"); }
});
btnConfirmPayment.addEventListener("click", ()=>{
  if(!selectedPayment){ alert("Selecciona un método de pago."); return; }
  if(selectedPayment==="tarjeta"){
    const cardNumber=document.getElementById("cardNumber").value.trim();
    const cardExpiry=document.getElementById("cardExpiry").value;
    const cardCVV=document.getElementById("cardCVV").value.trim();
    if(cardNumber.length<13 || !cardExpiry || cardCVV.length<3){ alert("Datos de tarjeta incompletos."); return; }
  }
  const now = new Date();
  const serviceRecord = {
    id: now.getTime(),
    date: now.toLocaleString(),
    world: worlds[selectedWorld].name,
    expert: selectedExpert.name,
    address: user.address,
    areas: selectedWorld==="auto"?{type:selectedCarType, quantity:carQuantity}:{...selectedAreas},
    schedule: selectedSchedule==="inmediato"?"Inmediato":selectedDate,
    total: selectedWorld==="auto"?carQuantity*carTypes[selectedCarType]:Object.entries(selectedAreas).reduce((acc,[id,c])=>{ const area=areas.find(a=>a.id===id); return acc+area.price*c;},0),
    paymentMethod: selectedPayment
  };
  user.history.push(serviceRecord);
  if(selectedWorld==="basico") user.limpiezaPurchases++;
  localStorage.setItem("xpertoUser", JSON.stringify(user));

  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.remove("hidden");
  trackStatus.textContent="Asignando experto...";
  simulateTracking();
});

// ======== Tracking ========
function simulateTracking(){
  const statuses=["Asignando experto...","Experto en camino 🚗","Experto ha llegado 🏠","Servicio en progreso 🧹","Servicio finalizado 🎉"];
  let i=0;
  function next(){ if(i<statuses.length){ trackStatus.textContent=statuses[i]; i++; setTimeout(next,3000); } 
    else { alert("¡Gracias por elegir Xperto! Porque tu tiempo vale más."); showSection("worldSelection"); resetApp(); } }
  next();
}

// ======== Historial ========
function renderHistory(){
  historyContainer.innerHTML="";
  if(user.history.length===0){ historyContainer.innerHTML="<p>No tienes servicios contratados aún.</p>"; return;}
  user.history.slice().reverse().forEach(item=>{
    const card=document.createElement("div"); card.classList.add("card");
    let areasDesc="";
    if(item.world==="Auto") areasDesc=`Tipo: ${item.areas.type}, Cantidad: ${item.areas.quantity}`;
    else for(const [id,count] of Object.entries(item.areas)) { if(count>0){ const area=areas.find(a=>a.id===id); areasDesc+=`${area.label}: ${count}, `;} }
    card.innerHTML=`<p><strong>Fecha:</strong> ${item.date}</p>
                    <p><strong>Servicio:</strong> ${item.world}</p>
                    <p><strong>Experto:</strong> ${item.expert}</p>
                    <p><strong>Dirección:</strong> ${item.address}</p>
                    <p><strong>Áreas:</strong> ${areasDesc}</p>
                    <p><strong>Programación:</strong> ${item.schedule}</p>
                    <p><strong>Total:</strong> $${item.total}</p>
                    <p><strong>Pago:</strong> ${item.paymentMethod}</p>`;
    historyContainer.appendChild(card);
  });
}

// ======== Perfil ========
profileForm.addEventListener("submit", e=>{ e.preventDefault(); saveUser(); });

// ======== Inicialización ========
window.addEventListener("DOMContentLoaded", ()=>{
  loadUser();
  showSection("worldSelection");
});
