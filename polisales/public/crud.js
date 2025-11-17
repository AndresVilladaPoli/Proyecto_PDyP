const API_URL = "http://localhost:3000/api/items";

//Cargar Publicaciones
async function loadItems() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tbody = document.querySelector("#itemsTable tbody");
    tbody.innerHTML = "";

    data.forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.price}</td>
        <td>${item.category}</td>
        <td>${item.type}</td>
        <td>${item.owner || "-"}</td>
        <td>
          <button class="btn primary" onclick="editItem(${item.id})">Editar</button>
          <button class="btn secondary" onclick="deleteItem(${item.id})">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando publicaciones:", error);
  }
}


//Editar
async function editItem(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const item = await res.json();

    document.querySelector("#itemId").value = item.id;
    document.querySelector("#title").value = item.title;
    document.querySelector("#description").value = item.description;
    document.querySelector("#price").value = item.price;
    document.querySelector("#owner").value = item.owner;
    document.querySelector("#category").value = item.category;
    document.querySelector("#type").value = item.type;
  } catch (error) {
    console.error("Error al editar:", error);
  }
}

//Eliminar

async function deleteItem(id) {
  if (!confirm("¿Seguro deseas eliminar esta publicación?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadItems();
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}


//Guardar / Actualizar
document.querySelector("#itemForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const itemId = document.querySelector("#itemId").value;

  const itemData = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    price: parseFloat(document.querySelector("#price").value),
    owner: document.querySelector("#owner").value,
    category: document.querySelector("#category").value,
    type: document.querySelector("#type").value
  };

  try {
    let res;

    // Crear
    if (!itemId) {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });

    // Actualizar
    } else {
      res = await fetch(`${API_URL}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
    }

    if (!res.ok) {
      console.error("Error en la petición");
      return;
    }

    document.querySelector("#itemForm").reset();
    document.querySelector("#itemId").value = "";
    loadItems();

  } catch (error) {
    console.error("Error guardando:", error);
  }
});

//Botón Nuevo
document.querySelector("#resetBtn").addEventListener("click", () => {
  document.querySelector("#itemForm").reset();
  document.querySelector("#itemId").value = "";
});

loadItems();