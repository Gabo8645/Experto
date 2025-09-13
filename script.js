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
let selectedAreas = {};
let spacesCount = 1;
let carsCount = 1;
let currentPayment = null;

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
  areasContainer: document.getElementById("areasContainer"),
  totalCost: document.getElementById("totalCost"),
  carsInputSelect: document.getElementById("carsInputSelect"),
  totalCars: document.getElementById("totalCars"),
  totalCarCost: document.getElementById("totalCarCost"),
  btnNextFromExperts: document.getElementById("btnNextFromExperts"),
  btnCalculateTotal: document.getElementById("btnCalculateTotal"),
  btnNextFromCars: document.getElementById("btnNextFromCars"),
  btnConfirmPayment: document.getElementById("btnConfirmPayment"),
  expertsContainer: document.getElementById("expertsContainer"),
  trackStatus: document.getElementById("trackStatus"),
  btnAuto: document.getElementById("btnAuto"),
  profileForm: document.getElementById("profileForm"),
  paymentForm: document.getElementById("paymentForm"),
  cardDetails: document.getElementById("cardDetails"),
  carTypeSelects: document.querySelectorAll('input[name="carType"]'),
  defaultAddress: document.getElementById("defaultAddress")
};

// ===================== TOOLTIP =====================
document.querySelectorAll(".info-icon").forEach(icon => {
  const infoDiv = icon.parentElement.nextElementSibling;
  if (infoDiv) icon.addEventListener("click", e => {
    e.stopPropagation();
    document.querySelectorAll(".service-info").forEach(el => el !== infoDiv && el.classList.add("hidden"));
    infoDiv.classList.toggle("hidden");
  });
});

// ===================== NAVEGACIÓN =====================
function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  const section = document.getElementById(sectionId);
  if (section) section.classList.remove("hidden");

  document.querySelectorAll(".bottom-nav button").forEach(btn => btn.classList.remove("active"));
  const navBtn = document.querySelector(`#nav${sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace("Section","")}`);
  if(navBtn) navBtn.classList.add("active");
}

// ===================== PERFIL =====================
if(DOM.profileForm){
  DOM.profileForm.addEventListener("submit", e => {
    e.preventDefault();
    user.name = document.getElementById("profileName").value;
    user.lastName = document.getElementById("profileLastName").value;
    user.email = document.getElementById("profileEmail").value;
    user.phone = document.getElementById("profilePhone").value;
    user.address = document.getElementById("profileAddress").value;
    DOM.defaultAddress.textContent = "Dirección: " + user.address;
    alert("Perfil guardado correctamente!");
  });
}

// ===================== SERVICIOS =====================
function selectWorld(service){
  currentService = service;
  selectedExpert = null;
  loadExperts();
  showSection("expertSection");
  checkAutoAvailability();
}

// ===================== EXPERTOS =====================
const experts = [
  {name:"Juan Pérez", rating:4.8, photo:"https://randomuser.me/api/portraits/men/1.jpg"},
  {name:"María López", rating:4.9, photo:"https://randomuser.me/api/portraits/women/2.jpg"},
  {name:"Carlos Ruiz", rating:4.7, photo:"https://randomuser.me/api/portraits/men/3.jpg"},
];

function loadExperts(){
  DOM.expertsContainer.innerHTML = "";
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${exp.photo}" alt="${exp.name}" class="expert-photo"/>
      <h3>${exp.name}</h3>
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

if(DOM.btnNextFromExperts){
  DOM.btnNextFromExperts.addEventListener("click",()=>{
    if(!selectedExpert) return;
    if(currentService === "auto"){
      showSection("carSection");
    } else {
      renderAreas();
      showSection("areasSection");
    }
  });
}

// ===================== ÁREAS =====================
const areas = [
  {id:"habitacion", label:"Habitación", price:10},
  {id:"bano", label:"Baño", price:8},
  {id:"cocina", label:"Cocina", price:12},
  {id:"sala", label:"Sala", price:9},
  {id:"comedor", label:"Comedor", price:7},
  {id:"terraza", label:"Terraza", price:11}
];

function renderAreas(){
  DOM.areasContainer.innerHTML="";
  areas.forEach(area=>{
    selectedAreas[area.id]=0;
    const div=document.createElement("div");
    div.className="area-item";
    div.innerHTML=`
      <span>${area.label} ($${area.price})</span>
      <button onclick="changeAreaCount('${area.id}', -1)">-</button>
      <span id="count-${area.id}">0</span>
      <button onclick="changeAreaCount('${area.id}', 1)">+</button>`;
    DOM.areasContainer.appendChild(div);
  });
}

function changeAreaCount(areaId, delta){
  selectedAreas[areaId]=Math.max(0, Math.min(10, selectedAreas[areaId]+delta));
  document.getElementById(`count-${areaId}`).textContent=selectedAreas[areaId];
  updateTotalCost();
}

function updateTotalCost(){
  let total=0;
  for(const id in selectedAreas){
    const area = areas.find(a=>a.id===id);
    if(area) total+=area.price*selectedAreas[id];
  }
  DOM.totalCost.textContent=total.toFixed(2);
}

// ===================== BOTÓN RESUMEN =====================
if(DOM.btnCalculateTotal){
  DOM.btnCalculateTotal.addEventListener("click", ()=>{
    const totalSelected = Object.values(selectedAreas).reduce((a,b)=>a+b,0);
    if(totalSelected===0){ alert("Debes seleccionar al menos un área"); return; }
    generateSummary(currentService);
    if(currentService==="basico") user.limpiezaPurchases.basico++;
    if(currentService==="profundo"){ user.limpiezaPurchases.profundo++; checkAutoAvailability(); }
  });
}

// ===================== AUTOS =====================
function updateCarsFromSelect(){
  carsCount = parseInt(DOM.carsInputSelect.value);
  updateCarCost();
}

function updateCarCost(){
  let type = document.querySelector('input[name="carType"]:checked')?.value || "sedan";
  let cost=10;
  if(type==="crossover") cost=15;
  if(type==="suv") cost=20;
  if(type==="camioneta") cost=18;
  DOM.totalCars.textContent=carsCount;
  DOM.totalCarCost.textContent=(cost*carsCount).toFixed(2);
}

if(DOM.btnNextFromCars){
  DOM.btnNextFromCars.addEventListener("click",()=>{
    generateSummary("auto");
    user.limpiezaPurchases.auto++;
    checkAutoAvailability();
  });
}

function checkAutoAvailability(){
  if(DOM.btnAuto) DOM.btnAuto.disabled = user.limpiezaPurchases.profundo<1;
}

// ===================== RESUMEN =====================
function generateSummary(service){
  let html=`<h2>Resumen del servicio</h2>`;
  html+=`<p><strong>Dirección:</strong> ${user.address || "-"}</p>`;
  html+=`<p><strong>Experto:</strong> ${selectedExpert?.name || "-"}</p>`;
  if(service==="basico"||service==="profundo"){
    let total=0;
    for(const id in selectedAreas){
      if(selectedAreas[id]>0){
        const area = areas.find(a=>a.id===id);
        total+=area.price*selectedAreas[id];
        html+=`<p>${area.label}: ${selectedAreas[id]} x $${area.price}</p>`;
      }
    }
    html+=`<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
    addToHistory(service,total);
  } else if(service==="auto"){
    let type = document.querySelector('input[name="carType"]:checked')?.value || "sedan";
    let cost=parseFloat(DOM.totalCarCost.textContent);
    html+=`<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html+=`<p><strong>Tipo:</strong> ${type}</p>`;
    html+=`<p><strong>Autos:</strong> ${carsCount}</p>`;
    html+=`<p><strong>Total:</strong> $${cost.toFixed(2)}</p>`;
    addToHistory(service,cost);
  }
  html+=`<button class="btn" onclick="goToPayment()">Ir a pago</button>`;
  DOM.summarySection.innerHTML=html;
  showSection("summarySection");
}

// ===================== HISTORIAL =====================
function addToHistory(service,total){
  const now = new Date().toLocaleString();
  const item=document.createElement("div");
  item.className="card";
  item.innerHTML=`
    <p><strong>Servicio:</strong> ${service}</p>
    <p><strong>Experto:</strong> ${selectedExpert?.name||"-"}</p>
    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    <p><strong>Dirección:</strong> ${user.address||"-"}</p>
    <p><strong>Fecha:</strong> ${now}</p>`;
  DOM.historyContainer.appendChild(item);
}

// ===================== PAGO =====================
function goToPayment(){ showSection("paymentSection"); }

if(DOM.paymentForm){
  DOM.paymentForm.addEventListener("change",()=>{
    const method = document.querySelector('input[name="pay"]:checked')?.value;
    currentPayment = method;
    DOM.cardDetails.classList.toggle("hidden", method!=="tarjeta");
  });
}

if(DOM.btnConfirmPayment){
  DOM.btnConfirmPayment.addEventListener("click",()=>{
    if(!currentPayment){ alert("Debes seleccionar un método de pago"); return; }
    if(currentPayment==="tarjeta"){
      const num=document.getElementById("cardNumber").value;
      const exp=document.getElementById("cardExpiry").value;
      const cvv=document.getElementById("cardCVV").value;
      if(!num||!exp||!cvv){ alert("Debes ingresar todos los datos de la tarjeta"); return; }
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
  DOM.trackStatus.textContent=steps[i];
  const interval=setInterval(()=>{
    i++;
    if(i>=steps.length){ clearInterval(interval); return; }
    DOM.trackStatus.textContent=steps[i];
  },2000);
}

// ===================== INICIALIZACIÓN =====================
updateCarCost();
showSection("worldSelection");
checkAutoAvailability();
