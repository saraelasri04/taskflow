import { fetchProjectById, createProject, updateProject } from '../api/projectsApi.js';
import { renderProjectList } from './ProjectList.js';

// id = null  → création
// id = "xxx" → modification
export async function renderProjectForm(id) {
  const app = document.getElementById('app');
  const isEdit = id !== null;

  // Si modification, on charge les données existantes
  let project = { title: '', description: '', deadline: '', status: 'actif' };
  if (isEdit) {
    try {
      const response = await fetchProjectById(id);
      project = response.data.data;
    } catch (err) {
      alert('Impossible de charger le projet.');
      return;
    }
  }

  // Formater la date pour l'input type="date"
  const deadlineValue = project.deadline
    ? new Date(project.deadline).toISOString().split('T')[0]
    : '';

  app.innerHTML = `
    <div class="container">
      <h1>${isEdit ? 'Modifier le projet' : 'Nouveau projet'}</h1>

      <div class="form">
        <div class="form-group">
          <label for="title">Titre *</label>
          <input type="text" id="title" value="${project.title}" placeholder="Nom du projet" maxlength="100" />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" placeholder="Description du projet" maxlength="500">${project.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label for="deadline">Date limite (optionnelle)</label>
          <input type="date" id="deadline" value="${deadlineValue}" />
        </div>

        <div class="form-group">
          <label for="status">Statut</label>
          <select id="status">
            <option value="actif"    ${project.status === 'actif'    ? 'selected' : ''}>Actif</option>
            <option value="en pause" ${project.status === 'en pause' ? 'selected' : ''}>En pause</option>
            <option value="archivé"  ${project.status === 'archivé'  ? 'selected' : ''}>Archivé</option>
          </select>
        </div>

        <p id="form-error" class="error" style="display:none"></p>

        <div class="form-actions">
          <button id="btn-cancel">Annuler</button>
          <button id="btn-submit">${isEdit ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </div>
    </div>
  `;

  // Annuler → retour à la liste
  document.getElementById('btn-cancel').addEventListener('click', renderProjectList);

  // Soumettre
  document.getElementById('btn-submit').addEventListener('click', async () => {
    const title       = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const deadline    = document.getElementById('deadline').value || null;
    const status      = document.getElementById('status').value;
    const errorEl     = document.getElementById('form-error');

    // Validation côté client
    if (!title) {
      errorEl.textContent = 'Le titre est obligatoire.';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';

    try {
      if (isEdit) {
        await updateProject(id, { title, description, deadline, status });
      } else {
        await createProject({ title, description, deadline, status });
      }
      renderProjectList(); // retour à la liste après succès
    } catch (err) {
      const msg = err.response?.data?.errors?.join(', ')
               || err.response?.data?.message
               || 'Erreur lors de la sauvegarde.';
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
  });
}