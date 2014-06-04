function InitializeLocales() {
    $('.store-name').html(chrome.i18n.getMessage('storeName'));
    $('.start-button.english').html(chrome.i18n.getMessage('startButtonEnglish'));
    $('.start-button.spanish').html(chrome.i18n.getMessage('startButtonSpanish'));
    $('.call-attendent').html(chrome.i18n.getMessage('callAttendent'));
    $('.return-main-menu').html(chrome.i18n.getMessage('returnMainMenu'));
    $('.return-checkout').html(chrome.i18n.getMessage('returnCheckout'));
    
    $('#page-checkout .page-title').html(chrome.i18n.getMessage('pageCheckoutTitle'));
    $('#page-checkout .receipt-container header').html(chrome.i18n.getMessage('pageCheckoutReceiptHeader'));
    $('#page-checkout .receipt-subtotal .title').html(chrome.i18n.getMessage('pageCheckoutSubtotalTitle'));
    $('#page-checkout .receipt-tax .title').html(chrome.i18n.getMessage('pageCheckoutTaxTitle'));
    $('#page-checkout .receipt-total .title').html(chrome.i18n.getMessage('pageCheckoutTotalTitle'));
    
    $('#lookup-item').html(chrome.i18n.getMessage('lookupItem'));
    $('#large-item').html(chrome.i18n.getMessage('largeItem'));
    $('#type-in-sku').html(chrome.i18n.getMessage('typeInSku'));
    $('#pay-now').html(chrome.i18n.getMessage('payNow'));
    
    //TODO: Continue at #page-lookup
}