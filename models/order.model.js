class Order {
  constructor(id, clientId, storeId, paymentMethod, detailsId, totalAmount = null) {
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

  dateOnlyFormat() {
    const date = new Date(this.date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    this.date = `${day}/${month}/${year}`;
  }

  currencyFormat() {
    this.totalAmount = '$' + (this.totalAmount ? this.totalAmount : '0.00');
  }
}

module.exports = Order;
