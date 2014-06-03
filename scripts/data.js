//Data Namespace
var data = {};

data.products = {};
data.productsSku = {};
data.productsUpc = {};
data.productArray = [];


data.initialize = function() {
    $.getJSON('scripts/data.json', data.initializeJson);
};

data.initializeJson = function(json) {
    for (var i = 0; i < json.products.length; i++) {
        var p = new Product();
        p.sku = json.products[i].sku;
        p.name = json.products[i].name;
        p.description = json.products[i].description;
        p.unitPrice =  parseFloat(json.products[i].unitPrice);
        p.weightPrice = parseFloat(json.products[i].weightPrice);
        p.weightUnit = json.products[i].weightUnit;
        p.discount = parseFloat(json.products[i].discount);
        p.upc = parseInt(json.products[i].upc);
        p.plu = parseInt(json.products[i].plu);
        p.imageUrl = json.products[i].imageUrl;
        
        data.products[p.sku] = p;
        data.productsSku[p.sku] = p;
        data.productsUpc[p.upc] = p;
        data.productArray.push(p);
    }
};

data.getRandomProduct = function() {
    var result;
    var count = 0;
    for (var sku in data.products) {
        if (Math.random() < 1/++count) {
           result = sku;
        }
   }
    return data.products[sku];
};