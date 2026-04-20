class Sale {
  constructor(id, clientId, storeId, paymentMethod, totalAmount = null, detailsId) {
    this.id = id;
    this.clientId = clientId;
    this.storeId = storeId;
    this.paymentMethod = paymentMethod;
    this.totalAmount = totalAmount;
    this.detailsId = detailsId;
    this.date = new Date();
    this.status = 0; // 0 = pending, 1 = completed, 2 = cancelled
    this.paymentId = null;
    this.logisticsId = null;
  }

  cancel() {
    this.status = 2;
  }

  complete(paymentId, logisticsId) {
    this.status = 1;
    this.paymentId = paymentId;
    this.logisticsId = logisticsId;
  }

  calculateTotalAmount(details) {
    // Aquí podrías implementar la lógica para calcular el total basado en los detalles de la venta
  }
}
