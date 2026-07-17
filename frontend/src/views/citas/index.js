import { citasService } from '../../services/citasService.js';

export async function VistaCitas() {
    const container = document.createElement('div');
    container.className = "space-y-10 animate-fade-in";

    // Layout principal: Dos columnas en pantallas grandes (Izquierda: Formulario, Derecha: Lista)
    container.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Columna Izquierda: Agendar Cita -->
            <div class="w-full lg:w-5/12 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm h-fit">
                <div class="mb-6">
                    <span class="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        Agendar Sesión
                    </span>
                    <h2 class="text-xl font-bold text-slate-800 mt-3">Nueva Mentoría</h2>
                    <p class="text-xs text-slate-500 mt-1">Elige un mentor, selecciona el horario y detalla tu consulta.</p>
                </div>

                <form id="form-book-cita" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mentor</label>
                        <select id="select-mentor" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
                            <option value="" disabled selected>Selecciona un mentor...</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Fecha</label>
                            <input type="date" id="input-date" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Hora de Inicio</label>
                            <input type="time" id="input-start-time" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Hora de Fin</label>
                        <input type="time" id="input-end-time" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">Motivo o Tema de Ayuda</label>
                        <textarea id="input-reason" rows="3" required placeholder="Escribe detalladamente en qué necesitas apoyo..." class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"></textarea>
                    </div>

                    <button type="submit" class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">
                        Agendar Cita
                    </button>
                </form>
            </div>

            <!-- Columna Derecha: Listado de Citas -->
            <div class="w-full lg:w-7/12 space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Mis Tutorías</h2>
                        <p class="text-xs text-slate-500 mt-0.5">Controla tus asesorías agendadas y el estado de cada una.</p>
                    </div>
                </div>

                <!-- Contenedor Reactivo de Lista -->
                <div id="citas-list-container" class="space-y-3">
                    <div class="flex items-center justify-center py-12">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Carga de mentores en el select
    // Carga de mentores en el select
    async function cargarMentores() {
        const selectMentor = container.querySelector('#select-mentor');
        try {
            const mentores = await citasService.getMentores();
            
            // Limpiamos las opciones anteriores excepto la primera por defecto
            selectMentor.innerHTML = '<option value="" disabled selected>Selecciona un mentor...</option>';
            
            mentores.forEach(mentor => {
                const opt = document.createElement('option');
                // 👇 Cambiamos mentor.id por mentor.mentor_id
                opt.value = mentor.mentor_id; 
                opt.textContent = `${mentor.first_name} ${mentor.last_name}`;
                selectMentor.appendChild(opt);
            });
        } catch (error) {
            console.error('Error cargando mentores:', error);
        }
    }

    // Render de la lista de citas
    async function renderCitas() {
        const listContainer = container.querySelector('#citas-list-container');
        try {
            const citas = await citasService.getMyCitas();
            
            if (citas.length === 0) {
                listContainer.innerHTML = `
                    <div class="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-slate-300 mx-auto mb-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 10A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-18 0h18" />
                        </svg>
                        <p class="text-sm font-semibold text-slate-600">Aún no tienes citas agendadas</p>
                        <p class="text-xs text-slate-400 mt-1">Usa el panel de la izquierda para programar tu primera sesión.</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = '';
            citas.forEach(cita => {
                const item = document.createElement('div');
                item.className = "bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all duration-150 relative";

                // Definir colores y badges basados en el estado
                let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                let badgeText = cita.status.toUpperCase();

                if (cita.status === 'pending') {
                    badgeClass = "bg-amber-50 text-amber-600 border-amber-200";
                    badgeText = "Pendiente";
                } else if (cita.status === 'active' || cita.status === 'confirmed') {
                    badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    badgeText = "Confirmada";
                } else if (cita.status === 'cancelled') {
                    badgeClass = "bg-red-50 text-red-600 border-red-200";
                    badgeText = "Cancelada";
                }

                // Formatear Fecha
                const fechaLegible = new Date(cita.date).toLocaleDateString('es-ES', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                });

                item.innerHTML = `
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                        <div>
                            <p class="text-xs font-mono uppercase tracking-widest text-slate-400">Mentor asignado</p>
                            <h3 class="font-bold text-slate-800 text-sm">Prof. ${cita.mentor_first_name} ${cita.mentor_last_name}</h3>
                        </div>
                        <span class="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border ${badgeClass}">
                            ${badgeText}
                        </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 10A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-18 0h18" />
                            </svg>
                            <span class="capitalize">${fechaLegible}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>${cita.start_time.substring(0, 5)} - ${cita.end_time.substring(0, 5)}</span>
                        </div>
                    </div>

                    <p class="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-2.5 mb-2 leading-relaxed">
                        <strong class="text-slate-700 block font-bold mb-1">Motivo:</strong>
                        ${cita.reason}
                    </p>

                    ${cita.status !== 'cancelled' ? `
                        <div class="flex justify-end pt-2">
                            <button data-id="${cita.id}" class="btn-cancel-cita px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-red-500 hover:text-white border border-red-200 hover:border-transparent hover:bg-red-600 rounded-md transition-all duration-150 cursor-pointer">
                                Cancelar Sesión
                            </button>
                        </div>
                    ` : ''}
                `;

                // Event listener para cancelar la cita
                const btnCancel = item.querySelector('.btn-cancel-cita');
                if (btnCancel) {
                    btnCancel.addEventListener('click', async (e) => {
                        const idCita = e.target.getAttribute('data-id');
                        if (confirm('¿Estás seguro de que deseas cancelar esta tutoría?')) {
                            try {
                                e.target.disabled = true;
                                e.target.innerText = 'CANCELANDO...';
                                await citasService.cancelCita(idCita);
                                alert('Cita cancelada correctamente');
                                renderCitas(); // Refrescamos el listado de forma reactiva
                            } catch (err) {
                                console.error(err);
                                alert('No se pudo cancelar la cita. Inténtalo de nuevo.');
                                e.target.disabled = false;
                                e.target.innerText = 'CANCELAR SESIÓN';
                            }
                        }
                    });
                }

                listContainer.appendChild(item);
            });
        } catch (err) {
            listContainer.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-xs">
                    Error al cargar tus citas. Por favor, recarga la página.
                </div>
            `;
            console.error(err);
        }
    }

    // Evento para agendar nueva cita
    const formBook = container.querySelector('#form-book-cita');
    formBook.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = formBook.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = 'AGENDANDO...';

        const citaData = {
            mentorId: container.querySelector('#select-mentor').value,
            date: container.querySelector('#input-date').value,
            startTime: container.querySelector('#input-start-time').value,
            endTime: container.querySelector('#input-end-time').value,
            reason: container.querySelector('#input-reason').value
        };

        try {
            await citasService.bookCita(citaData);
            alert('¡Mentoría agendada con éxito!');
            formBook.reset();
            renderCitas(); // Recargar el listado tras la inserción exitosa
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al agendar la sesión.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'AGENDAR CITA';
        }
    });

    // Cargas iniciales
    cargarMentores();
    renderCitas();

    return container;
}