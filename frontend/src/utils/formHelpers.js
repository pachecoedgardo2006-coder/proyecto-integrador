//  Displays the validation error for a form field.

export function showError(inputEl, errorEl, message) {
    inputEl.setAttribute('aria-invalid', 'true');
    inputEl.classList.add('border-red-500');
    errorEl.textContent = message;
}
 
// Clears the validation error from a form field.

export function clearError(inputEl, errorEl) {
    inputEl.setAttribute('aria-invalid', 'false');
    inputEl.classList.remove('border-red-500');
    errorEl.textContent = '';
}

// Toggles the button between its normal and loading states

export function toggleButtonLoading(buttonEl, isLoading, normalText, loadingText) {
    if (isLoading)  {
        buttonEl.disabled = true;
        buttonEl.textContent = loadingText;
    } else {
        buttonEl.disabled = false;
        buttonEl.textContent = normalText;
    }
 
}

//  Creates a reusable form field with its associated label and error message.

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

// Attaches field validation when the input loses focus.

export function attachBlurValidation(inputEl, errorEl, validateFn) {
    inputEl.addEventListener('blur', () => {
        const result = validateFn(inputEl.value.trim());
        if (result.valid) {
            clearError(inputEl, errorEl);
        } else {
            showError(inputEl, errorEl, result.message);
        }
    });
}