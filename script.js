// ======== Datos iniciales ========
let user = {
  name: '', lastName: '', email: '', phone: '', address: '',
  limpiezaPurchases: 0, history: []
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

const carTypes = { sedan: 10, crossover: 15, suv: 20, camioneta: 25 };

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
const DOM = {
  defaultAddressEl: document.getElementById("defaultAddress"),
  worldSelectionSection: document.getElementById("worldSelection"),
  expertSection: document.getElementById("expertSection"),
  expertsContainer: document.getElementById("expertsContainer"),
  btnNextFromExperts: document.getElementById("btnNextFromExperts"),
  areasSection: document.getElementById("areasSection"),
  areasContainer: document.getElementById("areasContainer"),
  scheduleRadios: document.querySelectorAll('input[name="schedule"]'),
  scheduleDateInput: document.getElementById("scheduleDateInput"),
  btnCalculateTotal: document.getElementById("btnCalculateTotal"),
  autoSection: document.getElementById("autoSection"),
  carsInput: document.getElementById("carsInput"),
  totalCars: document.getElementById("totalCars"),
  totalCarCost: document.getElementById("totalCarCost"),
  summarySection: document.getElementById("summarySection"),
  paymentSection: document.getElementById("paymentSection"),
  paymentForm: document.getElementById("paymentForm"),
  cardDetailsDiv: document.getElementById("cardDetails"),
  btnConfirmPayment: document.getElementById("btnConfirmPayment"),
  trackingSection: document.getElementById("trackingSection"),
  trackStatus: document.getElementById("trackStatus"),
  historySection: document.getElementById("historySection"),
  historyContainer: document.getElementById("historyContainer"),
  profileSection: document.getElementById("profileSection"),
  profileForm: document.getElementById("profileForm"),
  profileName: document.getElementById("profileName"),
  profileLastName: document.getElementById("profileLastName"),
  profileEmail: document.getElementById("profileEmail"),
  profilePhone: document.getElementById("profilePhone"),
  profileAddress: document.getElementById("profileAddress"),
  navButtons: {
    worldSelection: document.getElementById("navHome"),
    promosSection: document.getElementById("navPromos"),
    historySection: document.getElementById("navHistory"),
    profileSection: document.getElementById("navProfile")
  }
};

// ======== Usuario ========
function loadUser(){
  const saved = localStorage.getItem("xpertoUser");
  if(saved){
    user = JSON.parse(saved);
    DOM.profileName.value = user.name || "";
    DOM.profileLastName.value = user.lastName || "";
    DOM.profileEmail.value = user.email || "";
    DOM.profilePhone.value = user.phone || "";
    DOM.profileAddress.value = user.address || "";
  }
  updateDefaultAddress();
  updateWorldButtons(); // <-- activa Auto si corresponde
}

function saveUser(){
  user.name = DOM.profileName.value.trim();
  user.lastName = DOM.profileLastName.value.trim();
  user.email = DOM.profileEmail.value.trim();
  user.phone = DOM.profilePhone.value.trim();
  user.address = DOM.profileAddress.value.trim();
  localStorage.setItem("xpertoUser", JSON.stringify(user));
  updateDefaultAddress();
  alert("Perfil guardado correctamente.");
  showSection("worldSelection");
}

function updateDefaultAddress(){
  DOM.defaultAddressEl.textContent = user.address ? `Dirección: ${user.address}` : "Por favor, configura tu dirección en Perfil.";
}

// ======== Habilitar Auto automáticamente ========
function updateWorldButtons() {
  const autoBtn = document.getElementById("btnAuto");
  if(autoBtn) autoBtn.disabled = user.limpiezaPurchases >= worlds.profundo.unlocksAt ? false : true;
}

// ======== Navegación ========
function showSection(sectionId){
  const sections = [DOM.worldSelectionSection, DOM.expertSection, DOM.areasSection, DOM.autoSection, DOM.summarySection, DOM.paymentSection, DOM.trackingSection, DOM.historySection, DOM.profileSection];
  sections.forEach(s => s.classList.add("hidden"));
  Object.values(DOM.navButtons).forEach(b => b.classList.remove("active"));

  switch(sectionId){
    case "worldSelection": DOM.worldSelectionSection.classList.remove("hidden"); DOM.navButtons.worldSelection.classList.add("active"); resetApp(); break;
    case "promosSection": DOM.promosSection.classList.remove("hidden"); DOM.navButtons.promosSection.classList.add("active"); break;
    case "historySection": DOM.historySection.classList.remove("hidden"); DOM.navButtons.historySection.classList.add("active"); renderHistory(); break;
    case "profileSection": DOM.profileSection.classList.remove("hidden"); DOM.navButtons.profileSection.classList.add("active"); break;
  }
}

function resetApp(){
  selectedWorld=null; selectedExpert=null; selectedAreas={};
  selectedSchedule="inmediato"; selectedDate=null; selectedPayment=null;
  selectedCarType="sedan"; carQuantity=1;
  DOM.btnNextFromExperts.disabled = true;
  DOM.scheduleDateInput.value=""; DOM.scheduleDateInput.classList.add("hidden");
  renderExperts(); renderAreasInputs();
}

// ======== Selección mundo ========
function selectWorld(worldKey){
  if(worldKey==="profundo" && user.limpiezaPurchases<worlds.profundo.unlocksAt){
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios básicos para desbloquear limpieza profunda.`);
    return;
  }
  selectedWorld=worldKey;
  DOM.worldSelectionSection.classList.add("hidden");
  selectedWorld==="auto" ? DOM.autoSection.classList.remove("hidden") : DOM.expertSection.classList.remove("hidden");
  renderExperts();
}

// ======== Renderizar expertos ========
function renderExperts(){
  DOM.expertsContainer.innerHTML="";
  selectedExpert=null; DOM.btnNextFromExperts.disabled=true;
  experts.forEach(exp=>{
    if(selectedWorld==="basico" && exp.specialty.toLowerCase().includes("profundo")) return;
    const card=document.createElement("div");
    card.classList.add("card"); card.tabIndex=0;
    card.innerHTML=`<img src="${exp.photo}" alt="${exp.name}"/>
                    <h3>${exp.name}</h3>
                    <p>${"★".repeat(exp.stars)}${"☆".repeat(5-exp.stars)}</p>
                    <p>${exp.comments}</p>
                    <p><em>${exp.specialty}</em></p>`;
    card.addEventListener("click",()=>selectExpert(exp.id));
    card.addEventListener("keydown", e=>{ if(["Enter"," "].includes(e.key)){ e.preventDefault(); selectExpert(exp.id); }});
    DOM.expertsContainer.appendChild(card);
  });
}

function selectExpert(id){
  selectedExpert = experts.find(e=>e.id===id);
  [...DOM.expertsContainer.children].forEach(c=>c.classList.remove("selected"));
  const selCard = [...DOM.expertsContainer.children].find(c=>c.querySelector("h3").textContent===selectedExpert.name);
  if(selCard) selCard.classList.add("selected");
  DOM.btnNextFromExperts.disabled=false;
}

// ======== Siguiente desde expertos ========
DOM.btnNextFromExperts.addEventListener("click", ()=>{
  DOM.expertSection.classList.add("hidden");
  selectedWorld==="auto" ? DOM.autoSection.classList.remove("hidden") : DOM.areasSection.classList.remove("hidden");
  renderAreasInputs();
});

// ======== Áreas con contadores y tooltips únicos ========
function renderAreasInputs(){
  DOM.areasContainer.innerHTML=""; selectedAreas={};
  areas.forEach(area=>{
    const div=document.createElement("div"); div.classList.add("area-input");
    div.innerHTML=`
      <label>${area.label} ($${area.price}) <button type="button" class="infoBtn" data-tooltip="info_${area.id}">ℹ️</button></label>
      <div id="info_${area.id}" class="tooltip hidden">Detalle de ${area.label}</div>
      <div class="counter">
        <button type="button" onclick="decreaseArea('${area.id}')">-</button>
        <input type="text" id="area_${area.id}" value="0" readonly />
        <button type="button" onclick="increaseArea('${area.id}')">+</button>
      </div>`;
    DOM.areasContainer.appendChild(div);
    selectedAreas[area.id]=0;
  });

  setupTooltips();
}

function setupTooltips() {
  let openTooltip = null;
  document.querySelectorAll(".infoBtn").forEach(btn=>{
    btn.addEventListener("click", e=>{
      e.stopPropagation();
      const tooltip = document.getElementById(btn.dataset.tooltip);
      if(openTooltip && openTooltip !== tooltip) openTooltip.classList.add("hidden");
      tooltip.classList.toggle("hidden");
      openTooltip = tooltip.classList.contains("hidden") ? null : tooltip;
    });
  });

  document.addEventListener("click", ()=>{
    if(openTooltip){ openTooltip.classList.add("hidden"); openTooltip=null; }
  });
}

// ======== Contadores de áreas ========
function increaseArea(id){ if(selectedAreas[id]<10){ selectedAreas[id]++; document.getElementById(`area_${id}`).value=selectedAreas[id]; } }
function decreaseArea(id){ if(selectedAreas[id]>0){ selectedAreas[id]--; document.getElementById(`area_${id}`).value=selectedAreas[id]; } }

// ======== Programación ========
DOM.scheduleRadios.forEach(radio=>{
  radio.addEventListener("change", ()=>{
    selectedSchedule=document.querySelector('input[name="schedule"]:checked').value;
    if(selectedSchedule==="programado"){ DOM.scheduleDateInput.classList.remove("hidden"); DOM.scheduleDateInput.required=true; }
    else{ DOM.scheduleDateInput.classList.add("hidden"); DOM.scheduleDateInput.required=false; selectedDate=null; DOM.scheduleDateInput.value=""; }
  });
});
DOM.scheduleDateInput.addEventListener("change", e=>selectedDate=e.target.value);

// ======== Autos ========
function increaseCars(){ if(carQuantity<10){ carQuantity++; updateCarDisplay(); } }
function decreaseCars(){ if(carQuantity>1){ carQuantity--; updateCarDisplay(); } }
function updateCarDisplay(){ DOM.carsInput.value=carQuantity; DOM.totalCars.textContent=carQuantity; DOM.totalCarCost.textContent=(carQuantity*carTypes[selectedCarType]).toFixed(2); }
document.querySelectorAll('input[name="carType"]').forEach(radio=>radio.addEventListener("change", e=>{ selectedCarType=e.target.value; updateCarDisplay(); }));

// ======== Resumen y pago ========
DOM.btnCalculateTotal.addEventListener("click", ()=>{
  let total=0, summaryHTML=`<h2>Resumen del Servicio</h2>`;
  summaryHTML+=`<p><strong>Mundo:</strong> ${worlds[selectedWorld].name}</p>`;
  summaryHTML+=`<p><strong>Experto:</strong> ${selectedExpert.name}</p>`;
  summaryHTML+=`<p><strong>Dirección:</strong> ${user.address||"No configurada"}</p>`;

  if(selectedWorld==="auto"){
    total = carQuantity * carTypes[selectedCarType];
    summaryHTML+=`<p><strong>Tipo de auto:</strong> ${selectedCarType}</p>`;
    summaryHTML+=`<p><strong>Cantidad:</strong> ${carQuantity}</p>`;
  } else {
    summaryHTML+=`<p><strong>Áreas:</strong></p><ul>`;
    for(const [id,count] of Object.entries(selectedAreas)){
      if(count>0){ const area=areas.find(a=>a.id===id); summaryHTML+=`<li>${area.label}: ${count} x $${area.price} = $${area.price*count}</li>`; total+=area.price*count; }
    }
    summaryHTML+=`</ul>`;
  }
  summaryHTML+=`<p><strong>Total:</strong> $${total}</p>`;
  summaryHTML+=`<p><strong>Programación:</strong> ${selectedSchedule==="inmediato"?"Inmediato":selectedDate}</p>`;

  DOM.summarySection.innerHTML=summaryHTML;
  DOM.summarySection.classList.remove("hidden");
  DOM.paymentSection.classList.remove("hidden");
  DOM.areasSection.classList.add("hidden");
  DOM.autoSection.classList.add("hidden");
});

DOM.paymentForm.addEventListener("change", e=>{
  if(e.target.name==="pay"){ selectedPayment=e.target.value; DOM.cardDetailsDiv.classList.toggle("hidden", selectedPayment!=="tarjeta"); }
});

DOM.btnConfirmPayment.addEventListener("click", ()=>{
  if(!selectedPayment){ alert("Selecciona un método de pago."); return; }
  if(selectedPayment==="tarjeta"){
    const cardNumber=document.getElementById("cardNumber").value.trim();
    const cardExpiry=document.getElementById("cardExpiry").value;
    const cardCVV=document.getElementById("cardCVV").value.trim();
    if(cardNumber.length<13 || !cardExpiry || cardCVV.length<3){ alert("Datos de tarjeta incompletos."); return; }
  }

  const now=new Date();
  const total = selectedWorld==="auto"?carQuantity*carTypes[selectedCarType]:Object.entries(selectedAreas).reduce((acc,[id,c])=>acc+areas.find(a=>a.id===id).price*c,0);

  const serviceRecord = {
    id: now.getTime(),
    date: now.toLocaleString(),
    world: worlds[selectedWorld].name,
    expert: selectedExpert.name,
    address: user.address,
    areas: selectedWorld==="auto"?{type:selectedCarType, quantity:carQuantity}:{...selectedAreas},
    schedule: selectedSchedule==="inmediato"?"Inmediato":selectedDate,
    total,
    paymentMethod: selectedPayment
  };
  user.history.push(serviceRecord);
  if(selectedWorld==="basico") user.limpiezaPurchases++;
  localStorage.setItem("xpertoUser", JSON.stringify(user));
  updateWorldButtons(); // <-- revisa si Auto se activa

  DOM.summarySection.classList.add("hidden");
  DOM.paymentSection.classList.add("hidden");
  DOM.trackingSection.classList.remove("hidden");
  DOM.trackStatus.textContent="Asignando experto...";
  simulateTracking();
});

// ======== Tracking ========
function simulateTracking(){
  const statuses=["Asignando experto...","Experto en camino 🚗","Experto ha llegado 🏠","Servicio en progreso 🧹","Servicio finalizado 🎉"];
  let i=0;
  (function next(){
    if(i<statuses.length){ DOM.trackStatus.textContent=statuses[i]; i++; setTimeout(next,3000); }
    else{ alert("¡Gracias por elegir Xperto! Porque tu tiempo vale más."); showSection("worldSelection"); resetApp(); }
  })();
}

// ======== Historial ========
function renderHistory(){
  DOM.historyContainer.innerHTML="";
  if(user.history.length===0){ DOM.historyContainer.innerHTML="<p>No tienes servicios contratados aún.</p>"; return;}
  user.history.slice().reverse().forEach(item=>{
    const card=document.createElement("div"); card.classList.add("card");
    let areasDesc="";
    if(item.world==="Auto") areasDesc=`Tipo: ${item.areas.type}, Cantidad: ${item.areas.quantity}`;
    else for(const [id,count] of Object.entries(item.areas)) { if(count>0){ areasDesc+=`${areas.find(a=>a.id===id).label}: ${count}, `; } }
    card.innerHTML=`<p><strong>Fecha:</strong> ${item.date}</p>
                    <p><strong>Servicio:</strong> ${item.world}</p>
                    <p><strong>Experto:</strong> ${item.expert}</p>
                    <p><strong>Dirección:</strong> ${item.address}</p>
                    <p><strong>Áreas:</strong>
