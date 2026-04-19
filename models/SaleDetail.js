class SaleDetail {
    constructor(id, cantidad, precioUnitario, ventaId, productoId) {
        this.id = id;
        this.cantidad = Number(cantidad);
        this.precioUnitario = Number(precioUnitario);
        this.ventaId = ventaId;
        this.productoId = productoId;
        this.subtotal = this.calcularSubtotal();
    }

    calcularSubtotal() {
        return this.cantidad * this.precioUnitario;
    }

    actualizarTotales(nuevaCantidad, nuevoPrecio) {
        this.cantidad = Number(nuevaCantidad);
        this.precioUnitario = Number(nuevoPrecio);
        this.subtotal = this.calcularSubtotal();
    }
}

module.exports = SaleDetail;
