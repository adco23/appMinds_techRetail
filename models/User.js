class Usuario {
    constructor(id, nombre, apellido, email, password, rol, comercioId, estado) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.comercioId = comercioId;
        this.estado = estado || 'activo';
    }

    crear() {
        console.log(`Usuario ${this.nombre} listo para ser guardado.`);
    }

    actualizar(datos) {
        Object.assign(this, datos);
    }

    validarCredenciales(email, password) {
        return this.email === email && this.password === password;
    }

    desactiva() {
        this.estado = 'inactivo';
    }

    activa() {
        this.estado = 'activo';
    }
}

module.exports = Usuario;
