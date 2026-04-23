class Subscription{
    constructor(id, detail, amount, startDate, expDate, status, storeId){
         this.id=id;
         this.detail=detail;
         this.amount=amount;
         this.startDate=startDate;
         this.expDate=expDate;
         this.status=status;
         this.storeId=storeId;
    }
}
module.exports=Subscription;
