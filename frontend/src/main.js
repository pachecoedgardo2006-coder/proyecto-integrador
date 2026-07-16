import { VistaTutores } from './views/tutores/index.js';
import { VistaDetalleTutor } from './views/tutores/detalle.js';
import { VistaCitas } from './views/citas/index.js';

const rutas = {
    '/': VistaTutores,
    '/tutor': VistaDetalleTutor,
    '/citas': VistaCitas,
    '/admins': VistaCitas
};

// Inicializar rol por defecto si no existe
if (!localStorage.getItem('user_role')) {
    localStorage.setItem('user_role', 'ESTUDIANTE');
}

async function router() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = ''; // Limpieza estricta del DOM

    const hashCompleto = window.location.hash || '#/';
    const rutaLimpia = hashCompleto.split('?')[0].replace('#', '');

    const componenteVista = rutas[rutaLimpia] || VistaTutores;
    const vistaNodo = await componenteVista();
    appElement.appendChild(vistaNodo);
}

// Configurar el comportamiento del selector de cuenta/rol
document.getElementById('selector-rol').value = localStorage.getItem('user_role');
document.getElementById('selector-rol').addEventListener('change', (e) => {
    localStorage.setItem('user_role', e.target.value);
    router(); // Re-renderizar la vista actual con el nuevo rol
});

window.addEventListener('hashchange', router);
window.addEventListener('load', router);