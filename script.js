// ======== DATOS INICIALES ========
let user = {
  name: "", lastName: "", email: "", phone: "", address: "",
  limpiezaPurchases: 0, // número de limpiezas básicas completadas
  history: []
};

const worlds = {
  basico: { name: "Básico", icon: "https://img.icons8.com/ios-filled/50/000000/broom.png", unlocksAt: 0 },
  profundo: { name: "Profundo", icon: "https://img.icons8.com/ios-filled/50/000000/vacuum.png", unlocksAt: 3 },
  auto: { name: "Auto", icon: "https://img.icons8.com/ios-filled/50/000000/car.png", unlocksAt: 1 } // se habilita después de 1 limpieza profunda (puedes ajustar)
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
let selectedAreas = {}; // { areaId: count }
let selectedSchedule = "inmediato";
let selectedDate = null;
let selectedPayment = null;
let selectedCarType = "sedan";
let carQuantity = 1;
let spacesCount = 1; // si usas contador global para simple casos
const maxCount = 10;

// ======== DOM ========
const DOM = {
  // secciones principales (IDs deben coincidir con tu HTML)
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

  // contenedores y campos
  expertsContainer: document.getElementById("expertsContainer"),
  areasContainer: document.getElementById("areasContainer"), // en tu HTML
  scheduleRadios: document.querySelectorAll('input[name="schedule"]'),
  scheduleDate: document.getElementById("scheduleDate") || document.getElementById("scheduleDateInput"),
  spacesInput: document.getElementById("spacesInput"),
  totalSpaces: document.getElementById("totalSpaces"),
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

// ======== UTIL: mostrar sección ========
function showSection(sectionId){
  // ocultar todas las secciones principales
  const sections = [
    DOM.worldSelection, DOM.expertSection, DOM.areasSection, DOM.carSection,
    DOM.summarySection, DOM.paymentSection, DOM.trackingSection, DOM.promosSection,
    DOM.historySection, DOM.profileSection
  ];
  sections.forEach(s => { if(s) s.classList.add("hidden"); });

  const target = document.getElementById(sectionId);
  if(target) target.classList.remove("hidden");
}

// ======== CARGAR / GUARDAR USUARIO ========
function loadUser(){
  const saved = localStorage.getItem("xpertoUser");
  if(saved){
    try {
      user = JSON.parse(saved);
    } catch(e){}
  }
  // actualizar UI perfil si existe
  if(DOM.profileName) DOM.profileName.value = user.name || "";
  if(DOM.profileLastName) DOM.profileLastName.value = user.lastName || "";
  if(DOM.profileEmail) DOM.profileEmail.value = user.email || "";
  if(DOM.profilePhone) DOM.profilePhone.value = user.phone || "";
  if(DOM.profileAddress) DOM.profileAddress.value = user.address || "";

  updateDefaultAddress();
  updateWorldButtons(); // revisa si Auto debe habilitarse
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
  if(DOM.defaultAddress) DOM.defaultAddress.textContent = user.address ? `Dirección: ${user.address}` : "Por favor, configura tu dirección en Perfil.";
}

// ======== HABILITAR BOTÓN AUTO SEGÚN desbloqueo ========
function updateWorldButtons(){
  const btnAuto = document.getElementById("btnAuto");
  if(!btnAuto) return;
  // auto.unlocksAt indica min limpiezas profundas? lo ajustamos a user.limpiezaPurchases
  // Aquí activamos auto si user.limpiezaPurchases >= worlds.auto.unlocksAt
  btnAuto.disabled = !(user.limpiezaPurchases >= (worlds.auto.unlocksAt || 0));
}

// ======== SELECT WORLD (al pulsar la tarjeta) ========
function selectWorld(key){
  // bloqueo limpieza profunda si no cumple
  if(key === "profundo" && user.limpiezaPurchases < (worlds.profundo.unlocksAt || 0)){
    alert(`Debes completar al menos ${worlds.profundo.unlocksAt} servicios para desbloquear Limpieza Profunda.`);
    return;
  }
  // bloqueo auto si no cumple
  if(key === "auto" && user.limpiezaPurchases < (worlds.auto.unlocksAt || 0)){
    alert(`Debes completar ${worlds.auto.unlocksAt} servicios para desbloquear Lavada de Auto.`);
    return;
  }

  selectedWorld = key;
  selectedExpert = null;
  renderExperts();
  showSection("expertSection");
  // reset botones/valores de secciones siguientes
  if(DOM.paymentSection) DOM.paymentSection.classList.add("hidden");
  if(DOM.summarySection) DOM.summarySection.classList.add("hidden");
  if(DOM.trackingSection) DOM.trackingSection.classList.add("hidden");
}

// ======== RENDER EXPERTS ========
function renderExperts(){
  if(!DOM.expertsContainer) return;
  DOM.expertsContainer.innerHTML = "";
  DOM.btnNextFromExperts.disabled = true;
  experts.forEach(exp => {
    // si servicio basico y experto es especialista en 'profundo' (text match), opcional: saltar
    if(selectedWorld === "basico" && exp.specialty && exp.specialty.toLowerCase().includes("profundo")) {
      // saltar si quieres, ahora no lo hacemos para mostrar todos
    }
    const card = document.createElement("div");
    card.className = "card";
    // incluye foto, nombre, estrellas, specialty, comments
    card.innerHTML = `
      <img src="${exp.photo}" alt="Foto ${exp.name}" onerror="this.src='https://img.icons8.com/ios-filled/50/000000/user.png'"/>
      <h3>${exp.name}</h3>
      <p class="stars">${"★".repeat(exp.stars)}${"☆".repeat(5-exp.stars)}</p>
      <p class="comment">${exp.comments}</p>
      <p><em>${exp.specialty || ""}</em></p>
    `;
    card.tabIndex = 0;
    card.addEventListener("click", () => {
      selectedExpert = exp;
      // marcar seleccionado
      document.querySelectorAll("#expertsContainer .card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      if(DOM.btnNextFromExperts) DOM.btnNextFromExperts.disabled = false;
    });
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
    });
    DOM.expertsContainer.appendChild(card);
  });
}

// ======== BTN: siguiente desde expertos ========
if(DOM.btnNextFromExperts){
  DOM.btnNextFromExperts.addEventListener("click", () => {
    if(!selectedExpert) { alert("Selecciona un experto antes de continuar."); return; }
    // si servicio auto -> ir a carSection, sino -> áreas
    if(selectedWorld === "auto"){
      showSection("carSection");
      updateCarDisplay();
    } else {
      renderAreasInputs();
      showSection("areasSection");
    }
  });
}

// ======== ÁREAS (render con contadores y tooltips individuales) ========
function renderAreasInputs(){
  if(!DOM.areasContainer) return;
  DOM.areasContainer.innerHTML = "";
  selectedAreas = {};
  areas.forEach(area => {
    selectedAreas[area.id] = 0;
    const div = document.createElement("div");
    div.className = "area-input";
    // botón info con clase .infoBtn (dentro del DOM no en el botón principal para no disparar selectWorld)
    div.innerHTML = `
      <label class="area-label">
        ${area.label} ($${area.price})
        <button type="button" class="infoBtn" data-tooltip="info_${area.id}" aria-label="Más info ${area.label}">ℹ️</button>
      </label>
      <div id="info_${area.id}" class="service-info hidden" role="dialog" aria-hidden="true">Detalle de ${area.label}</div>
      <div class="counter">
        <button type="button" class="area-decrease" data-area="${area.id}">-</button>
        <input type="text" id="area_${area.id}" value="0" readonly aria-label="${area.label} cantidad"/>
        <button type="button" class="area-increase" data-area="${area.id}">+</button>
      </div>
    `;
    DOM.areasContainer.appendChild(div);
  });

  // listeners contadores
  DOM.areasContainer.querySelectorAll(".area-increase").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.area;
      if(selectedAreas[id] < maxCount) { selectedAreas[id]++; document.getElementById(`area_${id}`).value = selectedAreas[id]; }
    });
  });
  DOM.areasContainer.querySelectorAll(".area-decrease").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.area;
      if(selectedAreas[id] > 0) { selectedAreas[id]--; document.getElementById(`area_${id}`).value = selectedAreas[id]; }
    });
  });

  setupTooltips(); // configurar tooltips (único abierto a la vez)
}

// ======== TOOLTIP (único abierto, cierra al click fuera) ========
function setupTooltips(){
  let openTooltip = null;
  // seleccionar tanto .infoBtn como .info-icon (según tu HTML)
  const infoBtns = document.querySelectorAll(".infoBtn, .info-icon");
  infoBtns.forEach(btn => {
    // evitar que el click en el botón principal (padre) se dispare: se usa stopPropagation en HTML
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const tooltipId = btn.dataset.tooltip;
      if(!tooltipId) return;
      const tip = document.getElementById(tooltipId);
      if(!tip) return;
      // cerrar abierto distinto
      if(openTooltip && openTooltip !== tip) { openTooltip.classList.add("hidden"); openTooltip.setAttribute("aria-hidden","true"); }
      // toggle
      const isHidden = tip.classList.toggle("hidden");
      tip.setAttribute("aria-hidden", isHidden ? "true" : "false");
      openTooltip = tip.classList.contains("hidden") ? null : tip;
    });
  });

  // cerrar al click fuera
  document.addEventListener("click", (e) => {
    if(openTooltip){
      openTooltip.classList.add("hidden");
      openTooltip.setAttribute("aria-hidden","true");
      openTooltip = null;
    }
  }, { once: false }); // no once: persistente
}

// ======== PROGRAMACIÓN (radio schedule) ========
if(DOM.scheduleRadios && DOM.scheduleRadios.length){
  DOM.scheduleRadios.forEach(r => {
    r.addEventListener("change", () => {
      selectedSchedule = document.querySelector('input[name="schedule"]:checked').value;
      const dt = DOM.scheduleDate;
      if(selectedSchedule === "programado"){
        if(dt) { dt.classList.remove("hidden"); dt.required = true; }
      } else {
        if(dt) { dt.classList.add("hidden"); dt.required = false; dt.value = ""; selectedDate = null; }
      }
    });
  });
}
if(DOM.scheduleDate){
  DOM.scheduleDate.addEventListener("change", e => selectedDate = e.target.value);
}

// ======== AUTOS: contadores y tipos ========
function increaseCars(){ if(carQuantity < maxCount){ carQuantity++; updateCarDisplay(); } }
function decreaseCars(){ if(carQuantity > 1){ carQuantity--; updateCarDisplay(); } }
function updateCarDisplay(){
  if(DOM.carsInput) DOM.carsInput.value = carQuantity;
  if(DOM.totalCars) DOM.totalCars.textContent = carQuantity;
  // tipo seleccionado
  const type = document.querySelector('input[name="carType"]:checked')?.value || selectedCarType;
  selectedCarType = type;
  const pricePer = carTypes[type] || 10;
  if(DOM.totalCarCost) DOM.totalCarCost.textContent = (carQuantity * pricePer).toFixed(2);
}
document.querySelectorAll('input[name="carType"]').forEach(r => r.addEventListener("change", e => { selectedCarType = e.target.value; updateCarDisplay(); }));

// botones de carros (si existen en DOM)
const btnCarInc = document.getElementById("btnCarIncrease");
const btnCarDec = document.getElementById("btnCarDecrease");
if(btnCarInc) btnCarInc.addEventListener("click", increaseCars);
if(btnCarDec) btnCarDec.addEventListener("click", decreaseCars);

// ======== RESUMEN: botón Ver resumen desde áreas ========
if(DOM.btnCalculateTotal){
  DOM.btnCalculateTotal.addEventListener("click", () => {
    // calcular total y mostrar summary + payment
    let total = 0;
    let html = `<h2>Resumen del Servicio</h2>`;
    html += `<p><strong>Servicio:</strong> ${worlds[selectedWorld]?.name || selectedWorld}</p>`;
    html += `<p><strong>Experto:</strong> ${selectedExpert ? selectedExpert.name : "-"}</p>`;
    html += `<p><strong>Dirección:</strong> ${user.address || "No configurada"}</p>`;

    html += `<h3>Áreas seleccionadas</h3><ul>`;
    for(const [id, count] of Object.entries(selectedAreas)){
      if(count > 0){
        const area = areas.find(a => a.id === id);
        const subtotal = area.price * count;
        total += subtotal;
        html += `<li>${area.label}: ${count} x $${area.price} = $${subtotal}</li>`;
      }
    }
    html += `</ul>`;
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
    html += `<p><strong>Programación:</strong> ${selectedSchedule === "inmediato" ? "Inmediato" : selectedDate}</p>`;

    DOM.summarySection.innerHTML = html;
    showSection("summarySection");
    // mostrar payment también
    if(DOM.paymentSection) DOM.paymentSection.classList.remove("hidden");
  });
}

// ======== BOTÓN: siguiente desde autos (ir a resumen y luego pago) ========
const btnNextFromCars = document.getElementById("btnNextFromCars");
if(btnNextFromCars){
  btnNextFromCars.addEventListener("click", () => {
    // generar resumen para auto
    const pricePer = carTypes[selectedCarType] || 10;
    const total = pricePer * carQuantity;
    let html = `<h2>Resumen del Servicio</h2>`;
    html += `<p><strong>Servicio:</strong> Lavada de Auto</p>`;
    html += `<p><strong>Tipo:</strong> ${selectedCarType}</p>`;
    html += `<p><strong>Cantidad:</strong> ${carQuantity}</p>`;
    html += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
    html += `<p><strong>Programación:</strong> ${selectedSchedule === "inmediato" ? "Inmediato" : selectedDate}</p>`;
    DOM.summarySection.innerHTML = html;
    showSection("summarySection");
    if(DOM.paymentSection) DOM.paymentSection.classList.remove("hidden");
  });
}

// ======== PAGO: mostrar/ocultar campos tarjeta ========
if(DOM.paymentForm){
  DOM.paymentForm.addEventListener("change", e => {
    if(e.target.name === "pay"){
      selectedPayment = e.target.value;
      if(DOM.cardDetails) DOM.cardDetails.classList.toggle("hidden", selectedPayment !== "tarjeta");
    }
  });
}

// ======== CONFIRMAR PAGO ========
if(DOM.btnConfirmPayment){
  DOM.btnConfirmPayment.addEventListener("click", () => {
    if(!selectedPayment){ alert("Selecciona un método de pago."); return; }
    if(selectedPayment === "tarjeta"){
      const cardNumber = document.getElementById("cardNumber")?.value?.trim() || "";
      const cardExpiry = document.getElementById("cardExpiry")?.value || "";
      const cardCVV = document.getElementById("cardCVV")?.value?.trim() || "";
      if(cardNumber.length < 13 || !cardExpiry || cardCVV.length < 3){
        alert("Datos de tarjeta incompletos.");
        return;
      }
    }

    // construir registro de servicio
    const now = new Date();
    let total = 0;
    let areasRecord = {};
    if(selectedWorld === "auto"){
      const pricePer = carTypes[selectedCarType] || 10;
      total = pricePer * carQuantity;
      areasRecord = { type: selectedCarType, quantity: carQuantity };
    } else {
      for(const [id, cnt] of Object.entries(selectedAreas)){
        if(cnt > 0){
          const area = areas.find(a => a.id === id);
          total += (area.price * cnt);
          areasRecord[id] = cnt;
        }
      }
    }

    const record = {
      id: now.getTime(),
      date: now.toLocaleString(),
      world: worlds[selectedWorld]?.name || selectedWorld,
      expert: selectedExpert ? selectedExpert.name : null,
      address: user.address || null,
      areas: areasRecord,
      schedule: selectedSchedule === "inmediato" ? "Inmediato" : selectedDate,
      total,
      paymentMethod: selectedPayment
    };

    user.history.push(record);
    // incrementar limpiezaPurchases si fue limpieza básica (ajusta lógica si quieres)
    if(selectedWorld === "basico") user.limpiezaPurchases++;
    // guardar
    localStorage.setItem("xpertoUser", JSON.stringify(user));
    updateWorldButtons();

    // mostrar tracking
    showSection("trackingSection");
    DOM.trackStatus.textContent = "Asignando experto...";
    simulateTracking();
  });
}

// ======== TRACKING (simulación de estados) ========
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
      alert("¡Gracias por elegir Xperto! Porque tu tiempo vale más.");
      // después de finalizar volver a home
      showSection("worldSelection");
      // reset de variables
      selectedWorld = null; selectedExpert = null;
      selectedAreas = {};
      selectedPayment = null;
      carQuantity = 1;
      // actualizar botones disponibles
      updateWorldButtons();
    }
  }
  next();
}

// ======== HISTORIAL ========
function renderHistory(){
  if(!DOM.historyContainer) return;
  DOM.historyContainer.innerHTML = "";
  if(!user.history || user.history.length === 0){
    DOM.historyContainer.innerHTML = "<p>No tienes servicios contratados aún.</p>";
    return;
  }
  user.history.slice().reverse().forEach(h => {
    const card = document.createElement("div");
    card.className = "card";
    let areaDesc = "";
    if(h.areas && typeof h.areas === "object"){
      if(h.areas.type) areaDesc = `Tipo: ${h.areas.type}, Cantidad: ${h.areas.quantity}`;
      else areaDesc = Object.entries(h.areas).map(([k,v]) => `${areas.find(a=>a.id===k)?.label || k}: ${v}`).join(", ");
    }
    card.innerHTML = `
      <h4>${h.world}</h4>
      <p><strong>Fecha:</strong> ${h.date}</p>
      <p><strong>Experto:</strong> ${h.expert || "-"}</p>
      <p><strong>Dirección:</strong> ${h.address || "-"}</p>
      <p><strong>Áreas:</strong> ${areaDesc || "-"}</p>
      <p><strong>Programación:</strong> ${h.schedule}</p>
      <p><strong>Total:</strong> $${h.total}</p>
      <p><strong>Pago:</strong> ${h.paymentMethod}</p>
    `;
    DOM.historyContainer.appendChild(card);
  });
}

// ======== PERFIL ========
if(DOM.profileForm){
  DOM.profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveUserFromForm();
  });
}

// ======== INICIALIZACIÓN ========
window.addEventListener("DOMContentLoaded", () => {
  loadUser();
  // set initial displays
  updateCarDisplay();
  // tooltips setup for any static info buttons in worldSelection (those inline in HTML)
  setupTooltips();
  showSection("worldSelection");
});
