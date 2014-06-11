var credit = {};
credit.callbacks = {};

$(document).ready(function() {
    window.addEventListener('message', function(e) {
        if (e.data.script === 'stripe') {
            var callback = credit.callbacks[e.data.source];
            if (callback !== undefined) {
                callback(e.data);
            }
        }
    });
});

credit.chargeCard = function(card, amount, callback) {
    var source = 'ChargeMessage' + Math.floor((Math.random() * 999) + 100);
    credit.callbacks[source] = callback;
    var message = {
        'source': source,
        'script': 'stripe',
        'number': card.getNumber(),
        'expMonth': card.getExpMonth(),
        'expYear': card.getExpYear(),
        'amount': amount
    };
    sandbox.message(message);
};