// Simulamos datos del usuario y expertos
const user = {
  limpiezaPurchases: 4 // Cambia este número si quieres probar el desbloqueo
};

const experts = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "María Gómez" },
  { id: 3, name: "Carlos Torres" }
];

const areas = [
  { id: "room", label: "Habitaciones", price: 10 },
  { id: "kitchen", label: "Cocina", price: 15 },
  { id: "dining", label: "Comedor", price: 12 },
  { id: "living", label: "Sala", price: 12 },
  { id: "terrace", label: "Terraza", price: 20 }
];

// Elementos del DOM
const btnBasic = document.getElementById("btnBasic");
const btnDeep = document.getElementById("btnDeep");
const stepExpert = document.getElementById("stepExpert");
const stepAreas = document.getElementById("stepAreas");
const stepSummary = document.getElementById("stepSummary");
const expertSelect = document.getElementById("expertSelect");
const btnNextAreas = document.getElementById("btnNextAreas");
const areasContainer = document.getElementById("areasContainer");
const btnCalculate = document.getElementById("btnCalculate");
const summaryDetails = document.getElementById("summaryDetails");

// Desbloquear mundo profundo si aplica
if (user.limpiezaPurchases > 3) {
  btnDeep.disabled = false;
  btnDeep.textContent = "✅ Mundo de Limpieza Profunda";
}

// Paso 1: Seleccionar Mundo
btnBasic.addEventListener("click", () => {
  btnBasic.disabled = true;
  btnDeep.disabled = true;
  mostrarSeleccionExpertos();
});

btnDeep.addEventListener("click", () => {
  btnBasic.disabled = true;
  btnDeep.disabled = true;
  mostrarSeleccionExpertos();
});

// Mostrar paso de selección de experto
function mostrarSeleccionExpertos() {
  stepExpert.classList.remove("hidden");
  // Llenar select de expertos
  experts.forEach(exp => {
    const opt = document.createElement("option");
    opt.value = exp.id;
    opt.textContent = exp.name;
    expertSelect.appendChild(opt);
  });
}

// Paso 2: Seleccionar Áreas
btnNextAreas.addEventListener("click", () => {
  stepExpert.classList.add("hidden");
  stepAreas.classList.remove("hidden");
  // Crear inputs de cantidad por área
  areasContainer.innerHTML = "";
  areas.forEach(area => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        ${area.label} ($${area.price} por unidad):
        <input type="number" id="area-${area.id}" min="0" value="0">
      </label>
    `;
    areasContainer.appendChild(div);
  });
});

// Paso 3: Calcular y mostrar resumen
btnCalculate.addEventListener("click", () => {
  let total = 0;
  let details = "";
  areas.forEach(area => {
    const qty = parseInt(document.getElementById(`area-${area.id}`).value);
    if (qty > 0) {
      const subtotal = qty * area.price;
      total += subtotal;
      details += `<p>${qty} x ${area.label} ($${area.price}) = $${subtotal.toFixed(2)}</p>`;
    }
  });

  if (total === 0) {
    alert("Por favor, selecciona al menos un área.");
    return;
  }

  const commission = total * 0.1;
  const grandTotal = total + commission;

  summaryDetails.innerHTML = `
    ${details}
    <hr>
    <p>Subtotal: $${total.toFixed(2)}</p>
    <p>Comisión (10%): $${commission.toFixed(2)}</p>
    <h3>Total a pagar: $${grandTotal.toFixed(2)}</h3>
  `;

  stepAreas.classList.add("hidden");
  stepSummary.classList.remove("hidden");
});
