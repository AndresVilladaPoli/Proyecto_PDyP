const API_URL = "http://localhost:3000/api/items";


async function loadPublications() {
  try {
    const res = await fetch(API_URL);
    const items = await res.json();

    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "card item-card";

      div.innerHTML = `
        <h3>${item.title}</h3>
        <p class="small">${item.category} – ${item.type}</p>

        <p>${item.description || "Sin descripción"}</p>

        <p><strong>Precio:</strong> $${item.price}</p>
        <p><strong>Propietario:</strong> ${item.owner || "N/A"}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error cargando publicaciones:", err);
  }
}

loadPublications();