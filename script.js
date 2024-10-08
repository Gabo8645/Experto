const experts = [
  {
    name: "Experto 1",
    image: "https://images.pexels.com/photos/4500234/pexels-photo-4500234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Especialista en limpieza profunda de hogares.",
    rating: "4.8",
    price: "$50"
  },
  {
    name: "Experto 2",
    image: "https://images.pexels.com/photos/4051810/pexels-photo-4051810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Experto en limpieza de oficinas y espacios comerciales.",
    rating: "4.5",
    price: "$60"
  },
  {
    name: "Experto 3",
    image: "https://images.pexels.com/photos/5032261/pexels-photo-5032261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Especialista en limpieza de alfombras y tapicería.",
    rating: "4.7",
    price: "$40"
  }
];

function loadExperts() {
  const expertsList = document.getElementById("experts-list");
  experts.forEach((expert, index) => {
    const expertCard = document.createElement("div");
    expertCard.className = "expert-card";
    expertCard.innerHTML = `
      <img src="${expert.image}" alt="${expert.name}" />
      <h3>${expert.name}</h3>
      <p>${expert.description}</p>
      <p>Calificación: ${expert.rating}</p>
      <button class="button" onclick="showExpertDetails(${index})">Ver Detalles</button>
    `;
    expertsList.appendChild(expertCard);
  });
}

function showExpertDetails(index) {
  const expert = experts[index];
  document.getElementById("expert-name").innerText = expert.name;
  document.getElementById("expert-image").src = expert.image;
  document.getElementById("expert-description").innerText = expert.description;
  document.getElementById("expert-rating").innerText = expert.rating;
  document.getElementById("expert-price").innerText = expert.price;
  document.getElementById("expert-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("expert-modal").style.display = "none";
}

function openPaymentForm() {
  document.getElementById("payment-modal").style.display = "block";
}

function closePaymentForm() {
  document.getElementById("payment-modal").style.display = "none";
}

document.getElementById("payment-form").addEventListener("submit", function(event) {
  event.preventDefault();
  alert("Pago procesado con éxito. ¡Gracias por confiar en nosotros!");
  closePaymentForm();
});

// Cargar expertos al iniciar
loadExperts();
