class SaleDetail {
  constructor(id, cantidad, precioUnitario, ventaId, productoId) {
    this.id = id;
    this.cantidad = Number(cantidad);
    this.precioUnitario = Number(precioUnitario);
    this.ventaId = ventaId;
    this.productoId = productoId;
    this.subtotal = this.calculateSubtotal();
  }

  calculateSubtotal() {
    return this.cantidad * this.precioUnitario;
  }
}

module.exports = SaleDetail;
