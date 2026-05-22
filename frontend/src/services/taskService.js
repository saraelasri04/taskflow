import API from "../api/api.js";

// charger membres
export async function chargerMembres(projetId, selectElement) {
  const res = await API.get(`/projects/${projetId}`);

  selectElement.innerHTML = '<option value="">— Non assigné —</option>';

  res.data.members.forEach(m => {
    selectElement.innerHTML += `
      <option value="${m._id}">
        ${m.nom} (${m.email})
      </option>`;
  });
}

// assign task
export async function assignTask(taskId, userId) {
  await API.patch(`/tasks/${taskId}/assign`, {
    userId
  });

  alert("Tâche assignée !");
}
export async function assignTask(taskId, userId) {
  await API.patch(`/tasks/${taskId}/assign`, {
    userId
  });

  alert("Tâche assignée !");
}