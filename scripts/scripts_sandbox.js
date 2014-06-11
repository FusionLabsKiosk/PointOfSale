/* Stripe Sandbox */
var striper = {};
striper.API_KEY = 'pk_test_Mh1oKuE9T1kalP8Stm9bzFee';
striper.initCalled = false;

striper.messageHandler = function(e) {
    if (typeof Stripe === 'undefined') {
        if (!striper.initCalled) {
            initializeScript('https://js.stripe.com/v2/');
            striper.initCalled;
        }
        setTimeout(function() {
            striper.messageHandler(e);
        }, 100);
    }
    else {
        Stripe.setPublishableKey(striper.API_KEY);
        striper.chargeCard(e);
    }
};

striper.chargeCard = function(event) {
    var eventResponse = {};
    eventResponse.script = 'stripe';
    eventResponse.source = event.data.source;
    
    var number = event.data.number;
    var expMonth = event.data.expMonth.toString();
    var expYear = event.data.expYear.toString();
    var amount = event.data.amount;
    
    if (Stripe.validateCardNumber(number) && Stripe.validateExpiry(expMonth, expYear)) {        
        Stripe.card.createToken({
            number: number,
            exp_month: expMonth,
            exp_year: expYear
        }, function(status, response) {
            console.log(JSON.stringify(response));
            if (response.error) {
                eventResponse.success = false;
                eventResponse.message = response.error;
            }
            else {
                var token = response.id;
                //This is where you would send the token and the amount to your 
                //own server which would charge the Stripe single-use token
                /*$.ajax('https://mystripeserver.com/', {
                    data: {
                        token: token,
                        amount: amount
                    }
                }).success(function(data) {
                    //Charge was successful
                }).fail(function(jqXHR) {
                    //Charge failed
                });*/
                //For testing purposes, assume the transaction was successful
                eventResponse.success = true;
                eventResponse.message = 'Charge successful';
                event.source.postMessage(eventResponse, event.origin);
            }
        });
    }
    else {
        eventResponse.success = false;
        eventResponse.message = 'Invalid card';
        event.source.postMessage(eventResponse, event.origin);
    }
};

/* Sandbox Script Initialization */
function initializeScript(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
}

window.onload = function() {
    window.addEventListener('message', messageHandler);
};

function messageHandler(e) {
    if (e.data.loadCheck) {
        e.source.postMessage({
            'loaded': true
        }, e.origin);
    }
    else if (e.data.script === 'stripe') {
        striper.messageHandler(e);
    }
}

/* Used to remove functions when passing an object with window.postMessage */
function deepCopySafeMessage(object) {
    return JSON.parse(JSON.stringify(object));
}