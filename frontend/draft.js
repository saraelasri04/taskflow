// 1. Récupérer l'ID du projet depuis l'URL
//    exemple URL : form-tache.html?projetId=663abc
const urlParams = new URLSearchParams(window.location.search);
const projetId = urlParams.get('projetId') || 'test'; 
// ← 'test' pour tester sans URL

// 2. La clé unique dans localStorage pour ce projet
const CLE_DRAFT = `draft_task_${projetId}`;
console.log('Clé utilisée :', CLE_DRAFT);
// 3. Sélectionner tous les champs du formulaire
const champs = document.querySelectorAll(
  '#form-tache input, #form-tache textarea, #form-tache select'
);

// 4. Sur chaque champ, écouter l'événement "input"
champs.forEach(champ => {
  champ.addEventListener('input', () => {
    sauvegarderBrouillon();
  });
});

// 5. La fonction qui sauvegarde dans localStorage
function sauvegarderBrouillon() {
  const draft = {
    titre:       document.getElementById('titre').value,
    description: document.getElementById('description').value,
    priorite:    document.getElementById('priorite').value,
    statut:      document.getElementById('statut').value,
  };

  localStorage.setItem(CLE_DRAFT, JSON.stringify(draft));
  console.log('💾 Brouillon sauvegardé :', draft);
}
// ============================================
// Étape 3 — Restaurer le brouillon
// ============================================

// كيتحمل الصفحة — كنشوفو واش كاين brouillon
window.addEventListener('DOMContentLoaded', () => {

  // 1. كنشوفو واش كاين حاجة محفوظة
  const draftSauvegarde = localStorage.getItem(CLE_DRAFT);

  if (draftSauvegarde) {
    // 2. كنسولو المستخدم
    const confirmer = confirm('📝 كاين brouillon محفوظ — واش بغيتي ترجعو؟');

    if (confirmer) {
      // 3. إلا قال نعم — كنرجعو البيانات للفورم
      restaurerBrouillon(JSON.parse(draftSauvegarde));
    } else {
      // 4. إلا قال لا — كنمسحو
      localStorage.removeItem(CLE_DRAFT);
      console.log('🗑️ Brouillon supprimé');
    }
  }
});

// الفونكسيون ديال الرجوع
function restaurerBrouillon(draft) {
  document.getElementById('titre').value       = draft.titre       || '';
  document.getElementById('description').value = draft.description || '';
  document.getElementById('priorite').value    = draft.priorite    || '';
  document.getElementById('statut').value      = draft.statut      || '';

  console.log('✅ Brouillon restauré :', draft);
}
// ============================================
// Étape 4 — Supprimer après soumission
// ============================================

document.getElementById('btn-soumettre').addEventListener('click', async () => {

  // 1. جمع البيانات من الفورم
  const data = {
    titre:       document.getElementById('titre').value,
    description: document.getElementById('description').value,
    priorite:    document.getElementById('priorite').value,
    statut:      document.getElementById('statut').value,
  };

  // 2. تحقق أن Titre مو خاوي
  if (!data.titre) {
    alert('⚠️ الرجاء كتابة عنوان للتاسك');
    return;
  }

  try {
    // 3. إرسال البيانات للسيرفر عبر Axios
    await axios.post(
      `http://localhost:5000/api/tasks`,
      { ...data, projet: projetId },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );

    // 4. ✅ نجح الإرسال — نمسح البرويون
    localStorage.removeItem(CLE_DRAFT);
    console.log('🗑️ Brouillon supprimé après soumission');

    alert('✅ Tâche créée avec succès !');

    // 5. تفريغ الفورم
    document.getElementById('form-tache').reset();

  } catch (err) {
    // 6. ❌ فشل الإرسال — نحافظو على البرويون
    console.error('Erreur :', err);
    alert('❌ Erreur — votre brouillon est conservé');
  }
});