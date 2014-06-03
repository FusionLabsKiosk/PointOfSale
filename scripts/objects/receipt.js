function Receipt() {
    
    var self = this;
    
    this.recieptItems = [];
    this.payment = new Payment();
    
    this.addItem = function(sku)
    {
        var product = data.products[sku];
        var receiptItem = new RecieptItem(product);
        this.recieptItems.push(receiptItem);
        var receipt = $('#page-checkout .receipt-container .receipt');
        var receiptItemHTML = receiptItem.getReceiptItem();
        receipt.append(receiptItemHTML);
    }
    
    this.getSubTotal = function() {
        var sub = 0;
        for (var i = 0; i < self.recieptItems.length; i++) {
            sub += self.recieptItems[i].getTotalPrice();
        }
        return sub;
    };
    
    this.getTaxes = function()
    {
        var sub = self.getSubTotal();
        return sub * .0825;
    }
    
    this.getDiscountTotal = function() {
        var discount = 0;
        for (var i = 0; i < self.recieptItems.length; i++) {
            discount += self.recieptItems[i].getTotalPrice();
        }
        return discount;
    };
    
    this.getGrandTotal = function() {
        return self.getSubTotal() + self.getTaxes();
    };
}