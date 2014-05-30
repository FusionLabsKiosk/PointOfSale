function Receipt() {
    
    var self = this;
    
    this.products = [];
    this.payment = new Payment();
    
    this.getSubTotal = function() {
        var sub = 0;
        for (var i = 0; i < self.products.length; i++) {
            sub += self.products[i].price;
        }
        return sub;
    };
    
    this.getDiscountTotal = function() {
        var discount = 0;
        for (var i = 0; i < self.products.length; i++) {
            discount += self.products[i].price;
        }
        return discount;
    };
    
    this.getGrandTotal = function() {
        return self.getGrandTotal() - self.getDiscountTotal();
    };
}