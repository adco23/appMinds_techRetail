// models/transaction.js
class Transaction {
    constructor(id, receiptId, grossAmount, feeAmount, netAmount, date, status, paymentMethod, gatewayRef, saleId) {
        this.id = id;
        this.receiptId = receiptId; // comprobanteId
        this.grossAmount = grossAmount; // montoBruto
        this.feeAmount = feeAmount; // montoComision (0.02%)
        this.netAmount = netAmount; // montoNeto
        this.date = date;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.gatewayRef = gatewayRef; // referenciaPasarela
        this.saleId = saleId; // ventaId
    }
}
module.exports = Transaction;
