// script.js

// Datos simulados
const user = {
  limpiezaPurchases: 4
};

const experts = [
  {
    id: 1,
    name: "Juan Pérez",
    stars: 4,
    comments: ["Muy puntual", "Excelente limpieza"],
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    specialty: "Limpieza de cocinas y salas"
  },
  {
    id: 2,
    name: "María Gómez",
    stars: 5,
    comments: ["Muy detallista", "Recomendadísima"],
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    specialty: "Limpieza profunda de baños"
  }
];

const areas = ["Habitaciones", "Cocina", "Comedor", "Sala", "Terraza"];

// Elementos del DOM
const btnBasic = document.getElementById("btnBasic");
const btnDeep = document.getElementById("btnDeep");
const stepExpert = document.getElementById("stepExpert");
const expertSelect = document.getElementById("expertSelect");
const btnNextAreas = document.getElementById("btnNextAreas");
const stepAreas = document.getElementById("stepAreas");
const areasContainer = document.getElementById("areasContainer");
const btnCalculate = document.getElementById("btnCalculate");
const stepSummary = document.getElementById("stepSummary");
const summaryDetails = document.getElementById("summaryDetails");

// Desbloquear mundo profundo
if (user.limpiezaPurchases > 3) {
  btnDeep.disabled = false;
  btnDeep.textContent = "✅ Mundo de Limpieza Profunda";
}

btnBasic.addEventListener("click", () => iniciarSeleccion("basic"));
btnDeep.addEventListener("click", () => iniciarSeleccion("deep"));

function iniciarSeleccion(mundo) {
  btnBasic.disabled = true;
  btnDeep.disabled = true;
  stepExpert.classList.remove("hidden");
  mostrarExpertos();
}

function mostrarExpertos() {
  expertSelect.innerHTML = "";
  experts.forEach(exp => {
    const opt = document.createElement("option");
    opt.value = exp.id;
    opt.textContent = `${exp.name} - ${"★".repeat(exp.stars)}${"☆".repeat(5 - exp.stars)}`;
    expertSelect.appendChild(opt);
  });
}

btnNextAreas.addEventListener("click", () => {
  if (!expertSelect.value) {
    alert("Selecciona un experto");
    return;
  }
  stepExpert.classList.add("hidden");
  stepAreas.classList.remove("hidden");
  renderizarAreas();
});

function renderizarAreas() {
  areasContainer.innerHTML = "";
  areas.forEach(area => {
    const id = area.toLowerCase();
    const div = document.createElement("div");
    div.innerHTML = `
      <label>${area}:
        <select id="area-${id}">
          <option value="0">0</option>
          ${[...Array(10)].map((_, i) => `<option value="${i+1}">${i+1}</option>`).join("")}
        </select>
      </label>
    `;
    areasContainer.appendChild(div);
  });
}

btnCalculate.addEventListener("click", () => {
  let total = 0;
  let details = "";
  const precios = {
    "Habitaciones": 10,
    "Cocina": 15,
    "Comedor": 12,
    "Sala": 12,
    "Terraza": 20
  };

  areas.forEach(area => {
    const id = area.toLowerCase();
    const qty = parseInt(document.getElementById(`area-${id}`).value);
    if (qty > 0) {
      const subtotal = qty * precios[area];
      total += subtotal;
      details += `<p>${qty} x ${area} ($${precios[area]}) = $${subtotal.toFixed(2)}</p>`;
    }
  });

  if (total === 0) {
    alert("Selecciona al menos un área");
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

