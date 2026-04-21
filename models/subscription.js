class Subscription{
    constructor(id, detail, amount, startDate, deliveryAdress, expDate, status, storeId){
         this.id=id;
         this.detail=detail;
         this.amount=amount;
         this.startDate=startDate;
         this.deliveryAddress=deliveryAdress;
         this.expDate=expDate;
         this.status=status;
         this.storeId=storeId;

    }
}
module.exports=Subscription;
