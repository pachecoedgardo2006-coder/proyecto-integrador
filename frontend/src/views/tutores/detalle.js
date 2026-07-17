import api from '../../services/api.js';

export async function VistaDetalleTutor() {
    const container = document.createElement('div');
    container.className = 'max-w-4xl mx-auto p-6 space-y-6';

    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const mentorId = params.get('id');

    if (!mentorId) {
        container.innerHTML = `<p class="text-red-500">No mentor specified.</p>`;
        return container;
    }

    container.innerHTML = `<p class="text-slate-500">Loading profile details...</p>`;

    try {
        const response = await api.get(`/tutores/${mentorId}`);
        const mentor = response.data;

        container.innerHTML = `
            <div class="bg-white rounded-2xl border border-slate-200 p-8">
                <div class="flex items-center gap-6 mb-6">
                    <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 text-[#2563EB] font-bold rounded-2xl flex items-center justify-center text-3xl">
                        ${mentor.first_name[0]}${mentor.last_name[0]}
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">${mentor.first_name} ${mentor.last_name}</h1>
                        <p class="text-slate-500 text-sm mt-1">${mentor.email}</p>
                        <div class="flex gap-4 mt-2 text-xs font-semibold text-slate-600">
                            <span>⭐ ${mentor.average_rating} rating</span>
                            <span>💼 ${mentor.experience} years exp.</span>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-100 pt-6">
                    <h2 class="font-bold text-slate-800 mb-2">About me</h2>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6">${mentor.biography || 'No bio yet.'}</p>
                </div>

                <!-- Book Session Form -->
                <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h3 class="font-bold text-slate-800 mb-4">Schedule a Mentorship Session</h3>
                    <form id="booking-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Available Slots</label>
                            <select id="time-slot" class="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-[#2563EB] outline-none" required>
                                <option value="">-- Select an availability slot --</option>
                                ${mentor.availabilities.map(slot => `
                                    <option value="${slot.day_of_week}|${slot.start_time}|${slot.end_time}">
                                        ${slot.day_of_week} | ${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Mentorship Goal / Topic</label>
                            <textarea id="booking-reason" placeholder="What are you working on or want to learn?" class="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm h-24 focus:border-[#2563EB] outline-none" required></textarea>
                        </div>

                        <p id="booking-error" class="text-red-600 text-sm min-h-[1rem]"></p>

                        <button type="submit" class="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-95 text-white font-semibold text-sm py-3 rounded-lg transition-opacity">
                            Confirm Appointment
                        </button>
                    </form>
                </div>
            </div>
        `;

        const form = container.querySelector('#booking-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const slotVal = container.querySelector('#time-slot').value;
            const reason = container.querySelector('#booking-reason').value.trim();
            const bookingError = container.querySelector('#booking-error');

            if (!slotVal) return;

            const [dayOfWeek, startTime, endTime] = slotVal.split('|');
            
            // Calculamos la fecha más cercana para ese día de la semana
            const today = new Date();
            const daysMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
            const targetDay = daysMap[dayOfWeek];
            const currentDay = today.getDay();
            
            let distance = targetDay - currentDay;
            if (distance <= 0) distance += 7; // Próxima semana
            
            const appointmentDate = new Date(today);
            appointmentDate.setDate(today.getDate() + distance);
            const dateString = appointmentDate.toISOString().split('T')[0];

            try {
                await api.post('/citas/book', {
                    mentorId,
                    date: dateString,
                    startTime,
                    endTime,
                    reason
                });
                
                // Redirigir al historial de citas del estudiante
                window.location.hash = '#/citas';
            } catch (err) {
                bookingError.textContent = err.response?.data?.message || 'Could not schedule booking.';
            }
        });

    } catch (err) {
        container.innerHTML = `<p class="text-red-500">Tutor profile failed to load.</p>`;
    }

    return container;
}