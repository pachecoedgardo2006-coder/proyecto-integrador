import api from '../../services/api.js';

export async function VistaDetalleTutor() {
    const contenedor = document.createElement('div');
    contenedor.className = 'p-6 max-w-4xl mx-auto';

    // Obtener el ID de la URL usando los parámetros del hash
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const tutorId = params.get('id');

    if (!tutorId) {
        contenedor.innerHTML = `<p class="text-red-500 font-bold uppercase">ID de tutor no válido.</p>`;
        return contenedor;
    }

    try {
        const respuesta = await api.get(`/tutores/${tutorId}`);
        const tutor = respuesta.data;

        const lenguajesHTML = tutor.lenguajes.map(l => 
            `<span class="bg-slate-900 text-slate-300 text-xs px-2.5 py-1 font-mono border border-slate-800">${l}</span>`
        ).join(' ');

        const reseñasHTML = tutor.reseñas.length > 0 ? tutor.reseñas.map(r => `
            <div class="bg-slate-950 border border-slate-900 p-4 rounded-none">
                <div class="flex justify-between mb-1">
                    <span class="font-bold text-slate-200 text-sm">${r.estudiante_nombre}</span>
                    <span class="text-amber-500 font-bold text-xs">${'★'.repeat(r.calificacion)}</span>
                </div>
                <p class="text-sm text-slate-400 font-light">${r.comentario || 'Sin comentario escrito.'}</p>
            </div>
        `).join(' ') : `<p class="text-slate-500 text-sm italic">Este tutor aún no tiene comentarios escritos.</p>`;

        contenedor.innerHTML = `
            <div class="mb-6">
                <a href="#/" class="text-xs text-slate-500 hover:text-red-500 uppercase tracking-widest font-bold">← Volver al listado</a>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-none">
                    <h1 class="text-3xl font-black text-slate-100 uppercase tracking-tight mb-1">${tutor.nombre}</h1>
                    <p class="text-xs text-red-500 font-extrabold uppercase tracking-widest mb-4">${tutor.especialidad}</p>
                    <p class="text-slate-300 text-sm leading-relaxed mb-6">${tutor.descripcion}</p>
                    
                    <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Tecnologías Enseñas</h3>
                    <div class="flex flex-wrap gap-1.5">${lenguajesHTML}</div>
                </div>

                <div class="bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between rounded-none">
                    <div>
                        <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Acción Operativa</h3>
                        <p class="text-sm text-slate-400 mb-6">¿Deseas programar una sesión académica con este docente?</p>
                    </div>
                    <a href="#/citas?tutor=${tutor.id}" class="block text-center bg-red-600 hover:bg-red-700 text-slate-100 font-black text-xs uppercase tracking-widest py-3 transition-colors rounded-none">
                        Agendar Cita
                    </a>
                </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 p-6 rounded-none">
                <h2 class="text-lg font-black text-slate-100 uppercase tracking-tight mb-4 border-b border-slate-800 pb-2">Comentarios de Estudiantes</h2>
                <div class="space-y-3">${reseñasHTML}</div>
            </div>
        `;

    } catch (error) {
        contenedor.innerHTML = `<p class="text-red-500 font-bold uppercase">Error al cargar el perfil del tutor.</p>`;
    }

    return contenedor;
}