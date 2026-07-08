import api from '../../services/api.js';

export async function VistaTutores() {
    const contenedor = document.createElement('div');
    contenedor.className = 'p-6 max-w-6xl mx-auto';

    contenedor.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 class="text-3xl font-black tracking-tight text-slate-100 uppercase">Tutores Disponibles</h1>
                <p class="text-slate-400 text-sm">Encuentra asesoría personalizada en programación.</p>
            </div>
            <div>
                <select id="filtro-lenguaje" class="bg-slate-900 text-slate-100 border border-slate-800 p-2 rounded-none uppercase text-xs font-bold tracking-wider">
                    <option value="">Todos los lenguajes</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="SQL">SQL</option>
                </select>
            </div>
        </div>
        <div id="lista-tutores" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <p class="text-slate-400">Cargando tutores...</p>
        </div>
    `;

    // Función para renderizar las tarjetas de tutores
    const renderTutores = (tutores) => {
        const grid = contenedor.querySelector('#lista-tutores');
        grid.innerHTML = '';

        if (tutores.length === 0) {
            grid.innerHTML = `<p class="text-slate-500 col-span-3 text-center py-8">No se encontraron tutores con ese criterio.</p>`;
            return;
        }

        tutores.forEach(tutor => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between rounded-none hover:border-red-600 transition-colors';
            
            const lenguajesHTML = tutor.lenguajes.map(l => 
                `<span class="bg-slate-950 text-slate-400 text-xs px-2 py-1 font-mono border border-slate-800">${l}</span>`
            ).join(' ');

            tarjeta.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <h2 class="text-xl font-bold text-slate-100 uppercase tracking-tight">${tutor.nombre}</h2>
                        <span class="text-amber-500 font-bold text-sm">★ ${tutor.calificacion}</span>
                    </div>
                    <p class="text-xs text-red-500 font-semibold uppercase mb-2 tracking-wider">${tutor.especialidad}</p>
                    <p class="text-sm text-slate-400 mb-4 line-clamp-3">${tutor.descripcion}</p>
                    <div class="flex flex-wrap gap-1.5 mb-6">${lenguajesHTML}</div>
                </div>
                <a href="#/tutor?id=${tutor.id}" class="block text-center bg-slate-950 hover:bg-red-600 text-slate-100 font-black text-xs uppercase tracking-widest py-3 border border-slate-800 hover:border-red-600 transition-all rounded-none">
                    Ver Perfil Completo
                </a>
            `;
            grid.appendChild(tarjeta);
        });
    };

    // Carga inicial y lógica del filtro
    try {
        const respuesta = await api.get('/tutores');
        let todosLosTutores = respuesta.data;
        
        renderTutores(todosLosTutores);

        contenedor.querySelector('#filtro-lenguaje').addEventListener('change', (e) => {
            const lenguajeSeleccionado = e.target.value;
            if (!lenguajeSeleccionado) {
                renderTutores(todosLosTutores);
            } else {
                const filtrados = todosLosTutores.filter(t => t.lenguajes.includes(lenguajeSeleccionado));
                renderTutores(filtrados);
            }
        });

    } catch (error) {
        contenedor.querySelector('#lista-tutores').innerHTML = `<p class="text-red-500">Error al cargar la información.</p>`;
    }

    return contenedor;
}