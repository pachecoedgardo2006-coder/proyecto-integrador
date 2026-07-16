import { login } from '../../services/authService.js';
import { validateEmail, validatePassword } from '../../utils/validators.js';
import { formField, showError, clearError, toggleButtonLoading } from '../../utils/formHelpers.js';

// Renders the login page and handles user authentication.


export async function loginView() {
    const container = document.createElement('div');
    container.className = 'min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]';

    container.innerHTML = `
        <div class="w-full max-w-md">
            <div class="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/60 p-8">
                <div class="mb-8 text-center">
                    <h1 class="text-2xl font-bold text-[#0F172A]">Welcome back!</h1>
                    <p class="text-sm text-[#64748B] mt-1">Sign in to continue your learning journey.</p>
                </div>

                <form id="login-form" novalidate class="space-y-5">
                    ${formField({ id: 'login-email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' })}
                    ${formField({ id: 'login-password', label: 'Password', type: 'password', placeholder: '••••••••', autocomplete: 'current-password' })}

                    <p id="login-form-error" class="text-red-600 text-sm text-center min-h-[1.25rem]" role="alert"></p>

                    <button type="submit" id="login-submit-btn" class="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-lg transition-opacity duration-150">
                        Sign In
                    </button>
                </form>

                <p class="text-center text-sm text-[#64748B] mt-6">
                    Don't have an account?
                    <a href="#/register" class="text-[#2563EB] font-medium hover:opacity-80 transition-opacity">Create Account</a>
                </p>
            </div>
        </div>
    `;

    const form = container.querySelector('#login-form');
    const emailInput = container.querySelector('#login-email');
    const passwordInput = container.querySelector('#login-password');
    const emailError = container.querySelector('#login-email-error');
    const passwordError = container.querySelector('#login-password-error');
    const formError = container.querySelector('#login-form-error');
    const submitBtn = container.querySelector('#login-submit-btn');

    emailInput.addEventListener('blur', () => {
        const result = validateEmail(emailInput.value.trim());
        if (result.valid) {
            clearError(emailInput, emailError);
        } else {
            showError(emailInput, emailError, result.message);
        }
    });

    passwordInput.addEventListener('blur', () => {
        const result = validatePassword(passwordInput.value.trim());
        if (result.valid) {
            clearError(passwordInput, passwordError);
        } else {
            showError(passwordInput, passwordError, result.message);
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const emailResult = validateEmail(emailInput.value.trim());
        const passwordResult = validatePassword(passwordInput.value.trim());

        if (emailResult.valid) {
            clearError(emailInput, emailError);
        } else {
            showError(emailInput, emailError, emailResult.message);
        }

        if (passwordResult.valid) {
            clearError(passwordInput, passwordError);
        } else {
            showError(passwordInput, passwordError, passwordResult.message);
        }

        if (!emailResult.valid || !passwordResult.valid) return;

        toggleButtonLoading(submitBtn, true, 'Sign In', 'Signing in...');

        try {
            await login({ email: emailInput.value.trim(), password: passwordInput.value });
            window.location.hash = '#/';
        } catch (error) {
            formError.textContent = 'Incorrect email or password.';
        } finally {
            toggleButtonLoading(submitBtn, false, 'Sign In');
        }
    });

    return container;
}