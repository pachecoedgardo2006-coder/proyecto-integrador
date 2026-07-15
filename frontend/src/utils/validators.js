// Validar Email

export function validateEmail(value) {
    const pattern  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return {
        valid: false, message: 'Email is required. '
    };

    if (!pattern.test(value)) return {
        valid: false, message: 'Enter a valid email. '

    };

    return { valid: true, message: ''};

}

// Validar Nombre:

export function validateName(value){
    const name = value.trim();
    if(!name) return {
        valid: false, message: 'Enter your full name.. '
    };

    if (name.length < 3 ) return {
        valid: false, message: 'Name must be at least 3 characters. '
    };

    return {valid: true, message: ''};
}

// Validar Password:

export function validatePassword(value) {
    const symbol =  /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(value);
    if (!value) return {
        valid: false, message: 'Password is required. '
    };

    if (value.length < 8) return {
        valid: false, message: 'Must be at least 8 characters. '
    };

    if (!symbol) return {
        valid: false, message: 'Must include at least one symbol (!@#$...). '
    };

    return {valid: true, message: ''};
}

// Confirmacion de Password:

export function validateConfirmation(password, confirmation) {
    if (!confirmation) return {
        valid: false, message: 'Confirm your password.'
    };

    if (password !== confirmation)  return {
        valido: false, message: 'Passwords do not match. '
    };

    return {valid: true, message: ''};
}

// Validar cedula

export function validateCedula(value) {
    const cedula = value.trim();
    if (!cedula) return {
        valid: false, message: 'ID number is required'
    };

    if (!/^\d+$/.test(cedula)) return {
        valid: false, message: 'ID number must contain only numbers. '
    };

    return { valid: true, message: ''};
}