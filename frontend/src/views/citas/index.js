import api from '../../services/api.js';

export async function VistaCitas() {
    const contenedor = document.createElement('div');
    contenedor.className = 'p-6 max-w-5xl mx-auto';

    // Leer el rol actual de la sesión simulada
    const rolActual = localStorage.getItem('user_role');

    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const tutorPreseleccionado = params.get('tutor') || '';

    // Estructura adaptativa según el rol
    if (rolActual === 'ESTUDIANTE') {
        contenedor.innerHTML = `
            <h1 class="text-3xl font-black text-slate-100 uppercase tracking-tight mb-8">Mis Solicitudes de Tutorías</h1>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- PANEL IZQUIERDO: FORMULARIO SÓLO PARA ESTUDIANTES -->
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-none h-fit">
                    <h2 class="text-md font-black text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Agendar Nueva Sesión</h2>
                    <form id="form-cita" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Selecciona Tutor</label>
                            <select id="input-tutor" required class="w-full bg-slate-950 text-slate-100 border border-slate-800 p-2.5 rounded-none text-sm uppercase font-semibold"></select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Tu Nombre Completo</label>
                            <input type="text" id="input-estudiante" required placeholder="EJ. EDGARDO PACHECO" class="w-full bg-slate-950 text-slate-100 border border-slate-800 p-2.5 rounded-none text-sm uppercase placeholder-slate-700 font-medium">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Fecha</label>
                                <input type="date" id="input-fecha" required class="w-full bg-slate-950 text-slate-100 border border-slate-800 p-2.5 rounded-none text-sm font-medium">
                            </div>
                            <div>
                                <label class="block text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">Hora</label>
                                <input type="time" id="input-hora" required class="w-full bg-slate-950 text-slate-100 border border-slate-800 p-2.5 rounded-none text-sm font-medium">
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-slate-100 font-black text-xs uppercase tracking-widest py-3.5 transition-colors rounded-none mt-2">
                            Confirmar Reserva
                        </button>
                    </form>
                </div>

                <!-- PANEL DERECHO: HISTORIAL -->
                <div class="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-none">
                    <h2 class="text-md font-black text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Historial de Clases Solicitadas</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                    <th class="pb-3">Tutor Asignado</th>
                                    <th class="pb-3">Estudiante</th>
                                    <th class="pb-3">Fecha / Hora</th>
                                    <th class="pb-3 text-right">Estado</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-citas" class="divide-y divide-slate-800 text-slate-300"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Cargar lógicas del estudiante (select y envío)
        const selectTutor = contenedor.querySelector('#input-tutor');
        try {
            const resTutores = await api.get('/tutores');
            selectTutor.innerHTML = '<option value="">-- SELECCIONA UN DOCENTE --</option>' + 
                resTutores.data.map(t => `<option value="${t.id}" ${t.id == tutorPreseleccionado ? 'selected' : ''}>${t.nombre.toUpperCase()}</option>`).join('');
        } catch (err) { selectTutor.innerHTML = '<option value="">ERROR AL CARGAR</option>'; }

        contenedor.querySelector('#form-cita').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await api.post('/citas', {
                    tutor_id: contenedor.querySelector('#input-tutor').value,
                    estudiante_nombre: contenedor.querySelector('#input-estudiante').value,
                    fecha: contenedor.querySelector('#input-fecha').value,
                    hora: contenedor.querySelector('#input-hora').value
                });
                e.target.reset();
                cargarCitasEstudiante();
                alert('¡Cita registrada correctamente!');
            } catch (err) { alert('Error al guardar la cita.'); }
        });

    } else {
        // VISTA EXCLUSIVA PARA EL ROL DE TUTOR
        contenedor.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-black text-slate-100 uppercase tracking-tight">Panel de Control Docente</h1>
                <span class="bg-red-950 text-red-400 text-xs px-3 py-1 font-bold border border-red-900 tracking-widest uppercase">Agenda del Tutor</span>
            </div>
            
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-none">
                <h2 class="text-md font-black text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Clases que debes Dictar (Estudiantes Agendados)</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                <th class="pb-3">Estudiante Aspirante</th>
                                <th class="pb-3">Fecha de Sesión</th>
                                <th class="pb-3">Bloque Horario</th>
                                <th class="pb-3 text-right">Acciones Propias</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-citas" class="divide-y divide-slate-800 text-slate-300"></tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Función genérica para pintar las filas según corresponda
    const cargarCitasEstudiante = async () => {
        const tabla = contenedor.querySelector('#tabla-citas');
        try {
            const res = await api.get('/citas');
            if (res.data.length === 0) {
                tabla.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-slate-500 uppercase text-xs">No hay registros</td></tr>`;
                return;
            }

            if (rolActual === 'ESTUDIANTE') {
                tabla.innerHTML = res.data.map(c => `
                    <tr class="hover:bg-slate-950/40">
                        <td class="py-3.5 font-bold text-slate-200 uppercase text-xs">${c.tutor_nombre}</td>
                        <td class="py-3.5 uppercase text-xs">${c.estudiante_nombre}</td>
                        <td class="py-3.5 text-xs font-mono">${c.fecha} @ ${c.hora}</td>
                        <td class="py-3.5 text-right"><span class="bg-amber-950 text-amber-400 text-[10px] px-2 py-0.5 font-bold border border-amber-900">${c.estado}</span></td>
                    </tr>
                `).join('');
            } else {
                // El tutor ve los datos orientados a su flujo operativo y botones de acción rápida
                tabla.innerHTML = res.data.map(c => `
                    <tr class="hover:bg-slate-950/40">
                        <td class="py-3.5 font-bold text-red-400 uppercase text-xs">${c.estudiante_nombre}</td>
                        <td class="py-3.5 text-xs font-mono">${c.fecha}</td>
                        <td class="py-3.5 text-xs font-mono">${c.hora}</td>
                        <td class="py-3.5 text-right">
                            <button onclick="alert('Funcionalidad para pulir por el equipo de desarrollo')" class="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-black px-3 py-1.5 uppercase tracking-wider rounded-none transition-colors">
                                Aceptar clase
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (err) {
            tabla.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-red-500 uppercase text-xs">Error de red</td></tr>`;
        }
    };

    cargarCitasEstudiante();
    return contenedor;
}