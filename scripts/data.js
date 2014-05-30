//Data Namespace
var data = {};

data.products = {};


data.initialize = function() {
    $.getJSON('scripts/data.json', data.initializeJson);
};

data.initializeJson = function(json) {
    for (var i = 0; i < json.products.length; i++) {
        var p = new Product();
        p.sku = json.products[i].sku;
        p.name = json.products[i].name;
        p.price = json.products[i].price;
        p.discount = json.products[i].discount;
        p.upc = json.products[i].upc;
        p.plu = json.products[i].plu;
        p.weight = json.products[i].weight;
        
        data.products[p.sku] = p;
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