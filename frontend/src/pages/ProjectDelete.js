import { deleteProject } from '../api/projectsApi.js';
import { renderProjectList } from './ProjectList.js';

export function renderProjectDelete(id, title) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="container">
      <div class="delete-confirm">
        <h2>Supprimer le projet</h2>
        <p>Es-tu sûr de vouloir supprimer <strong>${title}</strong> ?</p>
        <p class="warning">Cette action supprimera aussi toutes les tâches liées à ce projet.</p>
        <p id="delete-error" class="error" style="display:none"></p>
        <div class="form-actions">
          <button id="btn-cancel">Annuler</button>
          <button id="btn-confirm" class="btn-danger">Supprimer</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-cancel').addEventListener('click', renderProjectList);

  document.getElementById('btn-confirm').addEventListener('click', async () => {
    try {
      await deleteProject(id);
      renderProjectList();
    } catch (err) {
      const errorEl = document.getElementById('delete-error');
      errorEl.textContent = err.response?.data?.message || 'Erreur lors de la suppression.';
      errorEl.style.display = 'block';
    }
  });
}