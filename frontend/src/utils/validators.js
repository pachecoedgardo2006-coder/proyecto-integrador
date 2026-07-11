// Validar Email

export function validarEmail(valor) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valor) return {
        valido: false, mensaje: 'El correo es obligatorio. '
    };

    if (!patron.test(valor)) return {
        valido: false, mensaje: 'Ingrese un correo vàlido. '

    };

    return { valido: true, mensaje: ''};

}

// Validar Nombre:

export function validarNombre(valor){
    const nombre = valor.trim();
    if(!nombre) return {
        valido: false, mensaje: 'Ingrese su nombre completo. '
    };

    if (nombre.length() < 3 ) return {
        valido: false, mensaje: 'Nombre minimo de 3 letras. '
    };

    return {valido: true, mensaje: ''};
}

// Validar Password:

export function validarPassword(valor) {
    const simbolo =  /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(valor);
    if (!valor) return {
        valido: false, mensaje: 'La contraseña es obligatoria. '
    };

    if (valor.length < 8) return {
        valido: false, mensaje: 'Dede tener al menos 8 caracteres. '
    };

    if (!simbolo) return {
        valido: false, mensaje: 'Dede incluir al menos un símbolo (!@#$...). '
    };

    return {valido: true, mensaje: ''};
}

// Confirmacion de Password:

export function validarConfirmacion(Password, Confirmacion) {

}