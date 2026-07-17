import api from '../../services/api.js';

export async function VistaTutores() {
    const container = document.createElement('div');
    container.className = 'max-w-7xl mx-auto p-6 space-y-8';

    container.innerHTML = `
        <!-- Hero Header -->
        <div class="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-2xl p-8 text-white shadow-lg">
            <h1 class="text-3xl font-bold">Find your next Mentor</h1>
            <p class="text-blue-100 mt-2 max-w-xl">Learn from industry professionals, master technologies like .NET, Angular, or Cybersecurity, and boost your engineering career.</p>
        </div>

        <!-- Mentors Grid -->
        <div>
            <h2 class="text-xl font-bold text-slate-800 mb-6">Available Mentors</h2>
            <div id="mentors-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Skeleton/Loading state -->
                <p class="text-slate-500 col-span-full">Loading experts...</p>
            </div>
        </div>
    `;

    const grid = container.querySelector('#mentors-grid');

    try {
        const response = await api.get('/tutores');
        const mentors = response.data;

        if (mentors.length === 0) {
            grid.innerHTML = `<p class="text-slate-500 col-span-full text-center py-10">No mentors available at the moment.</p>`;
            return container;
        }

        grid.innerHTML = mentors.map(mentor => `
            <div class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-150">
                <div>
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 text-[#2563EB] font-bold rounded-xl flex items-center justify-center text-lg">
                            ${mentor.first_name[0]}${mentor.last_name[0]}
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-800 text-base">${mentor.first_name} ${mentor.last_name}</h3>
                            <p class="text-xs text-[#64748B]">Rating: ⭐ ${mentor.average_rating || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <p class="text-sm text-slate-600 line-clamp-3 mb-4">${mentor.biography || 'No biography provided.'}</p>
                    
                    <!-- Specialties -->
                    <div class="flex flex-wrap gap-1.5 mb-6">
                        ${mentor.specialties.map(spec => `
                            <span class="text-xs font-medium px-2.5 py-1 bg-slate-100 text-[#0F172A] rounded-md border border-slate-200">
                                ${spec.name}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <a href="#/tutor?id=${mentor.mentor_id}" class="w-full text-center bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 text-white font-semibold text-sm py-2.5 rounded-lg block transition-all">
                    View Schedule & Profile
                </a>
            </div>
        `).join('');

    } catch (error) {
        grid.innerHTML = `<p class="text-red-600 col-span-full">Failed to load mentors. Please try again later.</p>`;
    }

    return container;
}