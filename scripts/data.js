//Data Namespace
var data = {};

data.products = {};
data.productsSku = {};
data.productsUpc = {};
data.productArray = [];


data.initialize = function() {
    spreadsheet.getAllData(function(products) {
        if (products.length > 1) {
            var properties = products[0];
            
            for (var i = 1; i < products.length; i++) {
                var p = new Product();
                for (var j = 0; j < properties.length; j++) {
                    p[properties[j]] = products[i][j];
                }
                data.products[p.sku] = p;
                data.productsSku[p.sku] = p;
                data.productsUpc[p.upc] = p;
                data.productArray.push(p);
            }
        }
    });
};