import { renderDashboard } from './pages/Dashboard.js';

// Point d'entrée — vérifie que l'utilisateur est connecté
const token = localStorage.getItem('token');

if (!token) {
  document.getElementById('app').innerHTML = `
    <div style="text-align:center; margin-top:80px;">
      <p>Vous devez être connecté.</p>
      <a href="/login.html">Se connecter</a>
    </div>
  `;
} else {
  renderDashboard(); // page d'accueil après connexion