    if (entry.service === "basico" || entry.service === "profundo") {
      content += `<ul>`;
      for (const [id, count] of Object.entries(entry.areas)) {
        if (count > 0) {
          const area = areas.find(a => a.id === id);
          content += `<li>${area.label}: ${count} x $${area.price}</li>`;
        }
      }
      content += `</ul>`;
      content += `<p><strong>Total:</strong> $${entry.total}</p>`;
    } else if (entry.service === "auto") {
      content += `<p><strong>Tipo:</strong> ${entry.autos.type}</p>`;
      content += `<p><strong>Cantidad de autos:</strong> ${entry.autos.count}</p>`;
      content += `<p><strong>Total:</strong> $${entry.total}</p>`;
    }
    div.innerHTML = content;
    DOM.historyContainer.appendChild(div);
  });
}

// ===================== PAGO =====================
if (DOM.paymentForm) {
  DOM.paymentForm.addEventListener("change", e => {
    if (e.target.name === "pay") {
      if (e.target.value === "tarjeta") {
        DOM.cardDetails.classList.remove("hidden");
      } else {
        DOM.cardDetails.classList.add("hidden");
      }
    }
  });
}

function goToPayment() {
  // Validar que haya seleccionado método de pago
  const payMethod = document.querySelector('input[name="pay"]:checked');
  if (!payMethod) { alert("Debes seleccionar un método de pago"); return; }
  if (payMethod.value === "tarjeta") {
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value.trim();
    const cardCVV = document.getElementById("cardCVV").value.trim();
    if (!cardNumber || !cardExpiry || !cardCVV) {
      alert("Debes ingresar los datos de la tarjeta");
      return;
    }
  }
  showSection("paymentSection");
}

// ===================== CONFIRMAR PAGO =====================
if (DOM.btnConfirmPayment) {
  DOM.btnConfirmPayment.addEventListener("click", () => {
    alert("Pago realizado con éxito!");
    startTracking();
  });
}

// ===================== TRACKING =====================
function startTracking() {
  showSection("trackingSection");
  const steps = [
    "🧑‍🔧 Experto asignado",
    "🚗 En camino",
    "🧹 Servicio en progreso",
    "✅ Servicio finalizado",
    "🎉 Gracias por elegir Xperto, porque tu tiempo vale más"
  ];
  let i = 0;
  DOM.trackStatus.textContent = steps[i];
  const interval = setInterval(() => {
    i++;
    if (i >= steps.length) { clearInterval(interval); return; }
    DOM.trackStatus.textContent = steps[i];
  }, 2000);
}

// ===================== DESBLOQUEO AUTO =====================
function checkAutoAvailability() {
  if (DOM.btnAuto) DOM.btnAuto.disabled = user.limpiezaPurchases.profundo < 1;
}

// ===================== INICIALIZACIÓN =====================
updateCars();
updateSpaces();
showSection("worldSelection");
checkAutoAvailability();
renderHistory();
