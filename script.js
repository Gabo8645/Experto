// script.js para la app Xperto mejorada

let selectedWorld = "";
let selectedExpert = null;
let selectedAreas = {};
let historialServicios = [];

const experts = [
  { nombre: "Ana", rating: 4.8, foto: "https://via.placeholder.com/100" },
  { nombre: "Carlos", rating: 4.7, foto: "https://via.placeholder.com/100" },
  { nombre: "Luis", rating: 4.6, foto: "https://via.placeholder.com/100" },
  { nombre: "Lucía", rating: 4.9, foto: "https://via.placeholder.com/100" },
  { nombre: "Pedro", rating: 4.5, foto: "https://via.placeholder.com/100" },
  { nombre: "María", rating: 5.0, foto: "https://via.placeholder.com/100" },
  { nombre: "Daniel", rating: 4.4, foto: "https://via.placeholder.com/100" },
  { nombre: "Fernanda", rating: 4.8, foto: "https://via.placeholder.com/100" },
  { nombre: "Miguel", rating: 4.7, foto: "https://via.placeholder.com/100" },
  { nombre: "Andrea", rating: 4.6, foto: "https://via.placeholder.com/100" },
];

function selectTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");
  document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.remove("active"));
  document.querySelector(`.bottom-nav button[data-tab='${tab}']`).classList.add("active");
}

function selectWorld(world) {
  selectedWorld = world;
  document.getElementById("worldSelection").classList.add("hidden");
  document.getElementById("expertSection").classList.remove("hidden");
  renderExperts();
}

function renderExperts() {
  const container = document.getElementById("expertsContainer");
  container.innerHTML = "";
  experts.forEach((exp) => {
    const div = document.createElement("div");
    div.className = "card expert";
    div.innerHTML = `
      <img src="${exp.foto}" alt="${exp.nombre}" />
      <h4>${exp.nombre}</h4>
      <p>⭐ ${exp.rating}</p>
    `;
    div.onclick = () => {
      selectedExpert = exp;
      document.querySelectorAll(".expert").forEach(e => e.classList.remove("selected"));
      div.classList.add("selected");
    };
    container.appendChild(div);
  });
}

function goToAreas() {
  if (!selectedExpert) {
    alert("Selecciona un experto");
    return;
  }
  document.getElementById("expertSection").classList.add("hidden");
  document.getElementById("areasSection").classList.remove("hidden");
  renderAreas();
}

function renderAreas() {
  const container = document.getElementById("areasContainer");
  container.innerHTML = "";
  const areas = ["Sala", "Cocina", "Baño", "Dormitorio"];
  areas.forEach(area => {
    const label = document.createElement("label");
    label.innerHTML = `${area}: <input type='number' min='0' value='0' id='area-${area}' />`;
    container.appendChild(label);
  });
  document.getElementById("schedule").addEventListener("change", e => {
    document.getElementById("scheduleDate").classList.toggle("hidden", e.target.value !== "programado");
  });
}

function calculateTotal() {
  const areas = ["Sala", "Cocina", "Baño", "Dormitorio"];
  let total = 0;
  selectedAreas = {};
  areas.forEach(area => {
    const val = parseInt(document.getElementById(`area-${area}`).value);
    if (val > 0) {
      selectedAreas[area] = val;
      total += val * 5; // $5 por área
    }
  });
  if (total === 0) {
    alert("Selecciona al menos un área");
    return;
  }

  document.getElementById("areasSection").classList.add("hidden");
  const summary = document.getElementById("summarySection");
  summary.classList.remove("hidden");
  summary.innerHTML = `
    <h2>Resumen</h2>
    <p>Experto: ${selectedExpert.nombre}</p>
    <p>Áreas: ${Object.entries(selectedAreas).map(([k, v]) => `${k}: ${v}`).join(", ")}</p>
    <p>Total: $${total}</p>
    <button class='btn' onclick='goToPayment()'>Ir a Pago</button>
  `;
}

function goToPayment() {
  document.getElementById("summarySection").classList.add("hidden");
  document.getElementById("paymentSection").classList.remove("hidden");
}

function confirmService() {
  const metodo = document.querySelector("input[name='pay']:checked");
  if (!metodo) {
    alert("Selecciona un método de pago");
    return;
  }
  document.getElementById("paymentSection").classList.add("hidden");
  document.getElementById("trackingSection").classList.remove("hidden");
  document.getElementById("trackStatus").innerText = `🧽 El experto ${selectedExpert.nombre} ha sido asignado. Pronto llegará a tu domicilio.`;

  historialServicios.push({
    experto: selectedExpert.nombre,
    areas: selectedAreas,
    fecha: new Date().toLocaleString(),
    metodo: metodo.value
  });
  updateHistorial();
}

function updateHistorial() {
  const hist = document.getElementById("historialContainer");
  hist.innerHTML = "";
  historialServicios.forEach((s, index) => {
    const div = document.createElement("div");
    div.className = "card historial";
    div.innerHTML = `
      <h4>Servicio #${index + 1}</h4>
      <p>Experto: ${s.experto}</p>
      <p>Áreas: ${Object.entries(s.areas).map(([k, v]) => `${k}: ${v}`).join(", ")}</p>
      <p>Método: ${s.metodo}</p>
      <p>Fecha: ${s.fecha}</p>
    `;
    hist.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  selectTab("homeTab");
});
