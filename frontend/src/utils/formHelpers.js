// Muestra mensaje de error y cambia el estilo del campo.

export function showError(inputEl, errorEl, message) {
    inputEl.setAttribute('aria-invalid', 'true');
    inputEl.classList.add('border-red-500');
    errorEl.textContent = message;
}
 
// Limpia el mensaje del error y restaura el estado del campo.

export function clearError(inputEl, errorEl) {
    inputEl.setAttribute('aria-invalid', 'false');
    inputEl.classList.remove('border-red-500');
    errorEl.textContent = '';
}

// Cambia el botón entre el estado de normal y el estado de carga.

export function toggleButtonLoading(buttonEl, isLoading, normalText, loadingText) {
    if (isLoading)  {
        buttonEl.disabled = true;
        buttonEl.textContent = loadingText;
    } else {
        buttonEl.disabled = false;
        buttonEl.textContent = normalText;
    }
 
}

//  Campo de formulario reutilizable.

export function formField({ id, label, type = 'text', placeholder = '', autocomplete = 'off' }) {
    return `
        <div>
         <label for="${id}" class="block text-sm font-medium text-slate-700 mb-1.5">${label}</label>
        <input
        type="${type}"
        id="${id}"
        name="${id}"
        placeholder="${placeholder}"
        autocomplete="${autocomplete}"
        class="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-150"
        aria-describedby="${id}-error"
        aria-invalid="false">
        <p id="${id}-error" class="text-red-600 text-xs mt-1"></p>
        </div>
    `;
}