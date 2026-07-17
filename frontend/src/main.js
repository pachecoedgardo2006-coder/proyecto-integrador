import { VistaTutores } from './views/tutores/index.js';
import { VistaDetalleTutor } from './views/tutores/detalle.js';
import { VistaCitas } from './views/citas/index.js';
import { loginView } from './views/auth/login.js';
import { registerView } from './views/auth/register.js';
import { getCurrentUser } from './services/authService.js'; // Asegúrate de importar también logout si existe ahí

const rutas = {
    '/': VistaTutores,
    '/tutor': VistaDetalleTutor,
    '/citas': VistaCitas,
    '/login': loginView,
    '/register': registerView
};

async function router() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = ''; // Limpieza estricta del DOM

    const hashCompleto = window.location.hash || '#/';
    const rutaLimpia = hashCompleto.split('?')[0].replace('#', '');

    const publicRoutes = ['/login', '/register'];

    // Asegurarse de que los elementos existan en tu index.html
    const navElement = document.querySelector('nav');
    const footerElement = document.querySelector('footer');

    if (navElement && footerElement) {
        if (publicRoutes.includes(rutaLimpia)) {
            navElement.classList.add('hidden');
            footerElement.classList.add('hidden');
        } else {
            navElement.classList.remove('hidden');
            footerElement.classList.remove('hidden');
        }
    }

    if (!getCurrentUser() && !publicRoutes.includes(rutaLimpia)) {
        window.location.hash = '#/login';
        return;
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        // Removemos cualquier listener previo para evitar duplicados al navegar
        logoutBtn.onclick = null; 
        
        logoutBtn.onclick = () => {
            // 1. Limpiar los datos de sesión del almacenamiento local
            localStorage.removeItem('user'); // O token, según como guardes la sesión
            localStorage.removeItem('token'); 
            
            // Si en tu authService tienes una función logout(), puedes llamarla aquí:
            // logout(); 

            // 2. Redireccionar al login de inmediato
            window.location.hash = '#/login';
        };
    }
    // ==========================================

    const componenteVista = rutas[rutaLimpia] || VistaTutores;
    const vistaNodo = await componenteVista();
    appElement.appendChild(vistaNodo);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);