// script.js

// Usuario simulado con historial para desbloquear mundo profundo
const user = {
  limpiezaPurchases: 4 // Cambia este número para probar desbloqueo
};

// Expertos - ampliado con 10 perfiles
const experts = [
  { id: 1, name: "Juan Pérez", stars: 4, comments: ["Muy puntual", "Excelente limpieza"], photo: "https://randomuser.me/api/portraits/men/32.jpg", specialty: "Cocinas y salas" },
  { id: 2, name: "María Gómez", stars: 5, comments: ["Muy detallista", "Recomendadísima"], photo: "https://randomuser.me/api/portraits/women/45.jpg", specialty: "Baños profundos" },
  { id: 3, name: "Carlos Torres", stars: 3, comments: ["Buen trabajo"], photo: "https://randomuser.me/api/portraits/men/12.jpg", specialty: "Terrazas y exteriores" },
  { id: 4, name: "Lucía Martínez", stars: 5, comments: ["Muy amable", "Super profesional"], photo: "https://randomuser.me/api/portraits/women/68.jpg", specialty: "Habitaciones y oficinas" },
  { id: 5, name: "Pedro Ruiz", stars: 4, comments: ["Eficiente y rápido"], photo: "https://randomuser.me/api/portraits/men/75.jpg", specialty: "Limpieza general" },
  { id: 6, name: "Ana López", stars: 5, comments: ["Perfecta atención"], photo: "https://randomuser.me/api/portraits/women/34.jpg", specialty: "Cocinas y electrodomésticos" },
  { id: 7, name: "José Ramírez", stars: 3, comments: ["Confiable"], photo: "https://randomuser.me/api/portraits/men/56.jpg", specialty: "Sala y comedor" },
  { id: 8, name: "Sofía Hernández", stars: 4, comments: ["Excelente servicio"], photo: "https://randomuser.me/api/portraits/women/29.jpg", specialty: "Terrazas y patios" },
  { id: 9, name: "Miguel Ángel", stars: 4, comments: ["Buen trato"], photo: "https://randomuser.me/api/portraits/men/88.jpg", specialty: "Limpieza profunda" },
  { id: 10, name: "Laura Jiménez", stars: 5, comments: ["Muy profesional"], photo: "https://randomuser.me/api/portraits/women/90.jpg", specialty: "Limpieza general" }
];

// Áreas con precios distintos por unidad
const areas = [
  { id: "habitaciones", label: "Habitaciones", price: 10 },
  { id: "cocina", label: "Cocina", price: 15 },
  { id: "comedor", label: "Comedor", price: 12 },
  { id: "sala", label: "Sala", price: 12 },
  { id: "terraza", label: "Terraza", price: 20 }
];

// Estado
let selectedWorld = null;
let selectedExpert = null;
let selectedAreas = {};
let selectedSchedule = "inmediato";
let selectedDate = null;

// DOM Elements
const btnBasic = document.getElementById("btnBasic");
const btnDeep = document.getElementById("btnDeep");
const unlockInfo = document.getElementById("unlockInfo");
const expertSection = document.getElementById("expertSection");
const expertsContainer = document.getElementById("expertsContainer");
const btnNextExpert = document.getElementById("btnNextExpert");
const areasSection = document.getElementById("areasSection");
const areasContainer = document.getElementById("areasContainer");
const scheduleSelect = document.getElementById("schedule");
const scheduleDateInput = document.getElementById("scheduleDate");
const btnCalculate = document.getElementById("btnCalculate");
const summarySection = document.getElementById("summarySection");
const paymentSection = document.getElementById("paymentSection");
const btnConfirmPayment = document.getElementById("btnConfirmPayment");
const trackingSection = document.getElementById("trackingSection");
const trackStatus = document.getElementById("trackStatus");

// Desbloqueo mundo profundo basado en historial
function updateWorldButtons() {
  if (user.limpiezaPurchases >= 4) {
    btnDeep.disabled = false;
    btnDeep.textContent = "🧼 Limpieza Profunda 🔓";
    unlockInfo.style.display = "none";
  }
}
updateWorldButtons();

// Seleccionar mundo limpieza
function selectWorld(world) {
  selectedWorld = world;
  btnBasic.disabled = true;
  btnDeep.disabled = true;

  expertSection.classList.remove("hidden");
  renderExperts();

  btnNextExpert.disabled = true;

  // Ocultar secciones posteriores
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  selectedExpert = null;
}

// Renderizar expertos
function renderExperts() {
  expertsContainer.innerHTML = "";
  experts.forEach(exp => {
    const card = document.createElement("div");
    card.className = "expert-card";
    card.tabIndex = 0; // para foco teclado
    card.innerHTML = `
      <img src="${exp.photo}" alt="${exp.name}" class="expert-photo" />
      <div class="expert-info">
        <p class="expert-name">${exp.name}</p>
        <p class="stars">${"★".repeat(exp.stars)}${"☆".repeat(5 - exp.stars)}</p>
        <p class="expert-specialty">${exp.specialty}</p>
        <p class="expert-comments">${exp.comments.join(" | ")}</p>
      </div>
      <input type="radio" name="expert" value="${exp.id}" aria-label="Seleccionar experto ${exp.name}" />
    `;
    expertsContainer.appendChild(card);

    card.addEventListener("click", () => selectExpert(exp.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectExpert(exp.id);
      }
    });
  });
}

// Seleccionar experto
function selectExpert(id) {
  selectedExpert = experts.find(e => e.id === id);
  btnNextExpert.disabled = false;

  // Marcar radio y añadir clase selected a card
  const cards = [...expertsContainer.children];
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio.value == id) {
      radio.checked = true;
      card.classList.add("selected");
      card.focus();
    } else {
      card.classList.remove("selected");
      radio.checked = false;
    }
  });
}

// Pasar a sección áreas
function goToAreas() {
  if (!selectedExpert) {
    alert("Selecciona un experto para continuar");
    return;
  }
  expertSection.classList.add("hidden");
  areasSection.classList.remove("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  renderAreas();

  scheduleSelect.value = "inmediato";
  scheduleDateInput.value = "";
  scheduleDateInput.classList.add("hidden");

  selectedAreas = {};
  selectedSchedule = "inmediato";
  selectedDate = null;
}

// Renderizar áreas con selects
function renderAreas() {
  areasContainer.innerHTML = "";
  areas.forEach(area => {
    const div = document.createElement("label");
    div.setAttribute("for", `area-${area.id}`);
    div.innerHTML = `
      ${area.label} ($${area.price} por unidad):
      <select id="area-${area.id}" name="area-${area.id}" aria-label="Cantidad para ${area.label}">
        <option value="0">0</option>
        ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
      </select>
    `;
    areasContainer.appendChild(div);
  });
}

// Escuchar cambio en selección programada
scheduleSelect.addEventListener("change", () => {
  selectedSchedule = scheduleSelect.value;
  if (selectedSchedule === "programado") {
    scheduleDateInput.classList.remove("hidden");
    scheduleDateInput.setAttribute("min", new Date().toISOString().split("T")[0]);
  } else {
    scheduleDateInput.classList.add("hidden");
    scheduleDateInput.value = "";
  }
});

// Calcular total y mostrar resumen
btnCalculate.addEventListener("click", () => {
  // Leer cantidades
  selectedAreas = {};
  let subtotal = 0;
  let hasAreaSelected = false;

  for (const area of areas) {
    const qty = parseInt(document.getElementById(`area-${area.id}`).value);
    if (qty > 0) {
      hasAreaSelected = true;
      selectedAreas[area.id] = qty;
      subtotal += qty * area.price;
    }
  }

  if (!hasAreaSelected) {
    alert("Selecciona al menos un área con cantidad mayor a cero");
    return;
  }

  if (selectedSchedule === "programado") {
    if (!scheduleDateInput.value) {
      alert("Selecciona una fecha válida para el servicio programado");
      return;
    }
    selectedDate = scheduleDateInput.value;
  } else {
    selectedDate = null;
  }

  const commission = subtotal * 0.1;
  const total = subtotal + commission;

  // Mostrar resumen
  areasSection.classList.add("hidden");
  summarySection.innerHTML = `
    <h2>Resumen del pedido</h2>
    <p><strong>Mundo:</strong> ${selectedWorld === "basic" ? "Limpieza Básica" : "Limpieza Profunda"}</p>
    <p><strong>Experto:</strong> ${selectedExpert.name}</p>
    <div>
      <strong>Áreas:</strong>
      <ul>
        ${Object.entries(selectedAreas).map(([areaId, qty]) => {
          const area = areas.find(a => a.id === areaId);
          return `<li>${qty} x ${area.label} ($${area.price} c/u)</li>`;
        }).join("")}
      </ul>
    </div>
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Comisión (10%): $${commission.toFixed(2)}</p>
    <h3>Total a pagar: $${total.toFixed(2)}</h3>
    <p>Agendado: ${selectedSchedule === "programado" ? `para el ${selectedDate}` : "Inmediato"}</p>
  `;
  summarySection.classList.remove("hidden");
  paymentSection.classList.remove("hidden");
  btnConfirmPayment.disabled = false;
});

// Confirmar y pagar
btnConfirmPayment.addEventListener("click", () => {
  const paymentMethod = document.querySelector('input[name="pay"]:checked');
  if (!paymentMethod) {
    alert("Selecciona un método de pago para continuar");
    return;
  }

  paymentSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  trackingSection.classList.remove("hidden");

  // Simulación seguimiento con mensajes y tiempos
  trackStatus.textContent = "🕒 El experto va en camino...";
  setTimeout(() => {
    trackStatus.textContent = "✅ El experto ha llegado";
  }, 3000);
  setTimeout(() => {
    trackStatus.textContent = "🧹 El experto está limpiando...";
  }, 6000);
  setTimeout(() => {
    trackStatus.textContent = "🏁 Limpieza finalizada. ¡Gracias por confiar en Xperto!";
    // Reiniciar app para nuevo pedido después de 4 segundos
    setTimeout(resetApp, 4000);
  }, 9000);
});

// Reiniciar aplicación para nuevo pedido
function resetApp() {
  selectedWorld = null;
  selectedExpert = null;
  selectedAreas = {};
  selectedSchedule = "inmediato";
  selectedDate = null;

  btnBasic.disabled = false;
  btnDeep.disabled = user.limpiezaPurchases >= 4 ? false : true;
  if (!btnDeep.disabled) {
    btnDeep.textContent = "🧼 Limpieza Profunda 🔓";
    unlockInfo.style.display = "none";
  } else {
    btnDeep.textContent = "🧼 Limpieza Profunda 🔒";
    unlockInfo.style.display = "block";
  }

  expertSection.classList.add("hidden");
  areasSection.classList.add("hidden");
  summarySection.classList.add("hidden");
  paymentSection.classList.add("hidden");
  trackingSection.classList.add("hidden");

  // Limpiar seleccion experto
  const radios = document.querySelectorAll('input[name="expert"]');
  radios.forEach(r => r.checked = false);
  btnNextExpert.disabled = true;
}

// Exponer funciones globales para onclick HTML
window.selectWorld = selectWorld;
window.goToAreas = goToAreas;
