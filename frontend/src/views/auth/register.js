import { register } from '../../services/authService.js';
import { validateEmail, validatePassword, validateName, validateConfirmation, validateCedula } from '../../utils/validators.js';
import { formField, showError, clearError, toggleButtonLoading, attachBlurValidation } from '../../utils/formHelpers.js';

export async function registerView() {
    const container = document.createElement('div');
    container.className = 'min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]';

    container.innerHTML = `
       <div class="w-full max-w-4xl bg-white rounded-2xl shadow-lg shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row">
            <div class="w-full md:w-2/5 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white p-8 flex flex-col justify-center">
                <h1 class="text-2xl font-bold mb-3">ConnecThor</h1>
                <p class="text-blue-50 text-sm leading-relaxed">Accelerate your software development career through targeted mentorship and structured skill-building.</p>
            </div>

            <div class="w-full md:w-3/5 p-8">
                <div class="mb-6">
                    <h2 class="text-xl font-bold text-[#0F172A]">Create your account</h2>
                    <p class="text-sm text-[#64748B] mt-1">Start your journey in the software development ecosystem today.</p>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-slate-700 mb-2">Select your role</label>
                    <div class="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select your role">
                        <button type="button" id="role-learner" data-role="aprendiz" class="role-option text-left border-2 border-[#2563EB] bg-blue-50 rounded-xl p-3" aria-pressed="true">
                            <span class="block text-sm font-semibold text-[#0F172A]">Student</span>
                            <span class="block text-xs text-[#64748B] mt-0.5">I want to learn</span>
                        </button>
                        <button type="button" id="role-mentor" data-role="mentor" class="role-option text-left border-2 border-slate-200 bg-white rounded-xl p-3" aria-pressed="false">
                            <span class="block text-sm font-semibold text-[#0F172A]">Mentor</span>
                            <span class="block text-xs text-[#64748B] mt-0.5">I want to teach</span>
                        </button>
                    </div>
                </div>

                <form id="register-form" novalidate class="space-y-4">
                    ${formField({ id: 'register-id-number', label: 'ID Number', type: 'text', placeholder: '1234567890', autocomplete: 'off' })}

                    <div class="grid grid-cols-2 gap-3">
                        ${formField({ id: 'register-first-name', label: 'First Name', type: 'text', placeholder: 'John', autocomplete: 'given-name' })}
                        ${formField({ id: 'register-last-name', label: 'Last Name', type: 'text', placeholder: 'Doe', autocomplete: 'family-name' })}
                    </div>

                    ${formField({ id: 'register-email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' })}
                    ${formField({ id: 'register-password', label: 'Password', type: 'password', placeholder: 'Minimum 8 characters', autocomplete: 'new-password' })}
                    ${formField({ id: 'register-confirm-password', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password', autocomplete: 'new-password' })}

                    <p id="register-form-error" class="text-red-600 text-sm text-center min-h-[1.25rem]" role="alert"></p>

                    <button type="submit" id="register-submit-btn" class="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-lg transition-opacity duration-150">
                        Create Account
                    </button>
                </form>

                <p class="text-center text-sm text-[#64748B] mt-4">
                    Already have an account?
                    <a href="#/login" class="text-[#2563EB] font-medium hover:opacity-80 transition-opacity">Sign in</a>
                </p>
            </div>
        </div>
    `;

    let selectedRole = 'aprendiz';
    const roleButtons = container.querySelectorAll('.role-option');

    roleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            selectedRole = button.dataset.role;

            roleButtons.forEach((btn) => {
                const isActive = btn === button;

                btn.setAttribute('aria-pressed', String(isActive));
                btn.classList.toggle('border-[#2563EB]', isActive);
                btn.classList.toggle('bg-blue-50', isActive);
                btn.classList.toggle('border-slate-200', !isActive);
                btn.classList.toggle('bg-white', !isActive);
            });
        });
    });

    const form = container.querySelector('#register-form');
    const idNumberInput = container.querySelector('#register-id-number');
    const firstNameInput = container.querySelector('#register-first-name');
    const lastNameInput = container.querySelector('#register-last-name');
    const emailInput = container.querySelector('#register-email');
    const passwordInput = container.querySelector('#register-password');
    const confirmPasswordInput = container.querySelector('#register-confirm-password');

    const idNumberError = container.querySelector('#register-id-number-error');
    const firstNameError = container.querySelector('#register-first-name-error');
    const lastNameError = container.querySelector('#register-last-name-error');
    const emailError = container.querySelector('#register-email-error');
    const passwordError = container.querySelector('#register-password-error');
    const confirmPasswordError = container.querySelector('#register-confirm-password-error');

    const formError = container.querySelector('#register-form-error');
    const submitBtn = container.querySelector('#register-submit-btn');

    attachBlurValidation(idNumberInput, idNumberError, validateCedula);
    attachBlurValidation(firstNameInput, firstNameError, validateName);
    attachBlurValidation(lastNameInput, lastNameError, validateName);
    attachBlurValidation(emailInput, emailError, validateEmail);
    attachBlurValidation(passwordInput, passwordError, validatePassword);
    attachBlurValidation(confirmPasswordInput, confirmPasswordError, () =>
        validateConfirmation(passwordInput.value, confirmPasswordInput.value)
    );

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const idNumberResult = validateCedula(idNumberInput.value.trim());
        const firstNameResult = validateName(firstNameInput.value.trim());
        const lastNameResult = validateName(lastNameInput.value.trim());
        const emailResult = validateEmail(emailInput.value.trim());
        const passwordResult = validatePassword(passwordInput.value.trim());
        const confirmResult = validateConfirmation(passwordInput.value, confirmPasswordInput.value);

        idNumberResult.valid ? clearError(idNumberInput, idNumberError) : showError(idNumberInput, idNumberError, idNumberResult.message);
        firstNameResult.valid ? clearError(firstNameInput, firstNameError) : showError(firstNameInput, firstNameError, firstNameResult.message);
        lastNameResult.valid ? clearError(lastNameInput, lastNameError) : showError(lastNameInput, lastNameError, lastNameResult.message);
        emailResult.valid ? clearError(emailInput, emailError) : showError(emailInput, emailError, emailResult.message);
        passwordResult.valid ? clearError(passwordInput, passwordError) : showError(passwordInput, passwordError, passwordResult.message);
        confirmResult.valid ? clearError(confirmPasswordInput, confirmPasswordError) : showError(confirmPasswordInput, confirmPasswordError, confirmResult.message);

        const allValid = idNumberResult.valid && firstNameResult.valid && lastNameResult.valid && emailResult.valid && passwordResult.valid && confirmResult.valid;
        if (!allValid) return;

        toggleButtonLoading(submitBtn, true, 'Create Account', 'Creating account...');

        try {
            await register({
                idNumber: idNumberInput.value.trim(),
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                role: selectedRole
            });
            window.location.hash = '#/';
        } catch (error) {
            formError.textContent = 'Could not create account. Please try again.';
        } finally {
            toggleButtonLoading(submitBtn, false, 'Create Account');
        }
    });

    return container;
}