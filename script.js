// Lista de expertos
const experts = [
  {
    name: "María López",
    image: "https://via.placeholder.com/200x200.png?text=María",
    description: "Experta en limpieza básica y profunda con más de 5 años de experiencia.",
    rating: "4.8",
    price: "$15/hora",
    level: "Mundo 1"
  },
  {
    name: "Carlos Méndez",
    image: "https://via.placeholder.com/200x200.png?text=Carlos",
    description: "Especialista en limpieza de vehículos y electrodomésticos.",
    rating: "4.9",
    price: "$20/hora",
    level: "Mundo 2"
  },
  {
    name: "Ana Torres",
    image: "https://via.placeholder.com/200x200.png?text=Ana",
    description: "Chef a domicilio para cocina diaria o eventos especiales.",
    rating: "4.7",
    price: "$25/hora",
    level: "Mundo 3"
  },
  {
    name: "David Gómez",
    image: "https://via.placeholder.com/200x200.png?text=David",
    description: "Dog-sitter con experiencia en paseos y cuidado de mascotas.",
    rating: "4.6",
    price: "$18/hora",
    level: "Mundo 4"
  },
  {
    name: "Laura Rivera",
    image: "https://via.placeholder.com/200x200.png?text=Laura",
    description: "Enfermera con certificación y atención domiciliaria a adultos mayores.",
    rating: "4.9",
    price: "$30/hora",
    level: "Mundo 5"
  }
];

// Selección de elementos del DOM
const expertsList = document.getElementById('experts-list');
const expertModal = document.getElementById('expert-modal');
const expertName = document.getElementById('expert-name');
const expertImage = document.getElementById('expert-image');
const expertDescription = document.getElementById('expert-description');
const expertRating = document.getElementById('expert-rating');
const expertPrice = document.getElementById('expert-price');

const paymentModal = document.getElementById('payment-modal');

// Función para crear las tarjetas de expertos
function loadExperts() {
  experts.forEach((expert, index) => {
    const card = document.createElement('div');
    card.className = 'expert-card';
    card.innerHTML = `
      <img src="${expert.image}" alt="${expert.name}">
      <h3>${expert.name}</h3>
      <p><strong>${expert.level}</strong></p>
      <button onclick="showExpertDetails(${index})" class="button">Ver Detalles</button>
    `;
    expertsList.appendChild(card);
  });
}

// Mostrar detalles del experto en el modal
function showExpertDetails(index) {
  const expert = experts[index];
  expertName.textContent = expert.name;
  expertImage.src = expert.image;
  expertDescription.textContent = expert.description;
  expertRating.textContent = expert.rating;
  expertPrice.textContent = expert.price;
  expertModal.style.display = "block";
}

// Cerrar el modal de experto
function closeModal() {
  expertModal.style.display = "none";
}

// Abrir el formulario de pago
function openPaymentForm() {
  expertModal.style.display = "none";
  paymentModal.style.display = "block";
}

// Cerrar el formulario de pago
function closePaymentForm() {
  paymentModal.style.display = "none";
}

// Cargar expertos al iniciar
window.onload = loadExperts;
