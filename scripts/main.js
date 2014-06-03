//Global Vars
var PAGE_OUT_POSITION = {TOP:'top', BOTTOM:'bottom'};

var CurrentSession;
var SearchIntervalID;

$(document).ready(Init);

//Process
function Init()
{
    var initialPage = '#page-initial';
    data.initialize();
    AddListeners();
    ReturnMainMenu_ClickHandler();
    document.getElementById('background-video').play();
}

function AddListeners()
{
    $('#page-initial .start-button.english').click(Initial_StartEnglish_ClickHandler);
    $('#page-initial .start-button.spanish').click(Initial_StartSpanish_ClickHandler);
    
    $('#page-checkout #lookup-item').click(Checkout_LookupItem_ClickHandler);
    $('#page-checkout #large-item').click(Checkout_LargeItem_ClickHandler);
    $('#page-checkout #type-in-sku').click(Checkout_TypeInSKU_ClickHandler);
    $('#page-checkout #pay-now').click(Checkout_PayNow_ClickHandler);
    
    $('#page-lookup').on('beforeopen', Lookup_BeforeOpenHandler);
    $('#page-lookup').on('beforesearch', Lookup_BeforeSearchHandler);
    $('#page-lookup').on('aftersearch', Lookup_AfterSearchHandler);
    $('#page-lookup #item-search-query').keyup(Lookup_ItemSearchQuery_KeyUpHandler);
    
    $('.return-checkout').click(Lookup_ReturnCheckout_ClickHandler);
    $('.return-main-menu').unbind('click').click(ReturnMainMenu_ClickHandler);
    
    $('#overlay-large-item .cancel').click(LargeItem_Cancel_ClickHandler);
    $('#overlay-type-in-sku .cancel').click(TypeInSKU_Cancel_ClickHandler);
    $('#overlay-type-in-sku .continue').click(TypeInSKU_Continue_ClickHandler);
}

//Event Handlers
function Initial_StartEnglish_ClickHandler(e)
{ 
    OpenPage('#page-checkout', PAGE_OUT_POSITION.BOTTOM);
}
function Initial_StartSpanish_ClickHandler(e)
{
    //TODO: change location profile to spanish.
    OpenPage('#page-checkout', PAGE_OUT_POSITION.BOTTOM);
}
function Checkout_LookupItem_ClickHandler(e)
{
    OpenPage('#page-lookup', PAGE_OUT_POSITION.BOTTOM);
}
function Checkout_LargeItem_ClickHandler(e)
{
    OpenOverlay('overlay-large-item', $('#page-checkout'));
}
function Checkout_TypeInSKU_ClickHandler(e)
{
    OpenOverlay('overlay-type-in-sku', $('#page-checkout'));
}
function Checkout_PayNow_ClickHandler(e)
{
    OpenPage('#page-payment-options', PAGE_OUT_POSITION.BOTTOM);
}
function Lookup_BeforeOpenHandler(e)
{
    ProductSearch();
}
function Lookup_BeforeSearchHandler(e)
{
    if($('#page-lookup .search-results .search-result').length > 0)
    {
        $('#page-lookup .search-results .search-result').addClass('search-result-animation-out');
        setTimeout(function()
        {
            $('#page-lookup .search-results').empty();
            $('#modules .loading-animation').clone().appendTo('#page-lookup .search-results');
        }, 1000);
    }
    else
    {
        $('#page-lookup .search-results').empty();
        $('#modules .loading-animation').clone().appendTo('#page-lookup .search-results');
    }
}
function Lookup_AfterSearchHandler(e)
{
    $('#page-lookup .search-results .loading-animation').remove();
    $('#page-lookup .search-results .search-result').addClass('search-result-animation-in');
    setTimeout(function()
    {
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-in');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-1');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-2');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-3');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-4');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-5');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-6');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-7');
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-8');
    }, 1000);
}
function Lookup_SearchItem_ClickHandler(e)
{
    var sku = $('.title .sku', $(this)).html();
    AddItemToReceipt(sku);
    
    OpenPage('#page-checkout', PAGE_OUT_POSITION.BOTTOM);
    $('#page-lookup #item-search-query').val('');
}
function Lookup_ItemSearchQuery_KeyUpHandler(e)
{
    var i = 0;
    clearInterval(SearchIntervalID);
    SearchIntervalID = setInterval(function(){UpdateProgress_SearchTimer(i);i++;}, 1);
}

function ReturnMainMenu_ClickHandler(e)
{
    CurrentSession = new Session();
    CurrentSession.currency = '$';
    OpenPage('#page-initial', PAGE_OUT_POSITION.BOTTOM);
}
function Lookup_ReturnCheckout_ClickHandler(e)
{
    OpenPage('#page-checkout', PAGE_OUT_POSITION.BOTTOM);
}

function LargeItem_Cancel_ClickHandler(e)
{
    CloseOverlay($('#overlay-large-item'), $('#page-checkout'));
}
function TypeInSKU_Cancel_ClickHandler(e)
{
    CloseOverlay($('#overlay-type-in-sku'), $('#page-checkout')); 
}
function TypeInSKU_Continue_ClickHandler(e)
{
    //TODO: Add functionality to add item by SKU
    CloseOverlay($('#overlay-type-in-sku'), $('#page-checkout')); 
}

//Actions
function ProductSearch(query)
{
    $('#page-lookup').trigger('beforesearch');
    if(query == undefined)
    {
        //mock delay for loading animation
        setTimeout(function()
        {
            for(var i=0; i<data.productArray.length; i++)
            {
                var product = data.productArray[i];
                var productElement = $(product.getSearchResult());
                
                if(i < 8)
                {
                    productElement.addClass('search-result-animation-' + (i+1).toString());
                }
                
                productElement.click(Lookup_SearchItem_ClickHandler);
                $('#page-lookup .search-results').append(productElement);
            }
            $('#page-lookup').trigger('aftersearch');
        }, 2000);
    }
    else
    {
        setTimeout(function()
        {
            for(var i=0; i<data.productArray.length; i++)
            {
                var product = data.productArray[i];

                var searchTerm = query.toLowerCase();
                var matchTerm = product.name.toLowerCase();
                if(matchTerm.indexOf(searchTerm) > -1)
                {
                    var productElement = $(product.getSearchResult());

                    if(i < 8)
                    {
                        productElement.addClass('search-result-animation-' + (i+1).toString());
                    }

                    productElement.click(Lookup_SearchItem_ClickHandler);
                    $('#page-lookup .search-results').append(productElement);
                }
            }
            $('#page-lookup').trigger('aftersearch');
        }, 2000);
    }
    
    
}

function AddItemToReceipt(sku)
{
    CurrentSession.receipt.addItem(sku);
    $('#page-checkout .receipt-container .receipt-totals .receipt-subtotal .amount').html(FormatCurrency(CurrentSession.receipt.getSubTotal()));
    $('#page-checkout .receipt-container .receipt-totals .receipt-tax .amount').html(FormatCurrency(CurrentSession.receipt.getTaxes()));
    $('#page-checkout .receipt-container .receipt-totals .receipt-total .amount').html(FormatCurrency(CurrentSession.receipt.getGrandTotal()));
}

function UpdateProgress_SearchTimer(interval)
{
    if(interval < 200)
    {
        $('#page-lookup #search-timer-progress').val(interval);
    }
    else
    {
        clearInterval(SearchIntervalID);
        $('#page-lookup #search-timer-progress').val(0);
        var searchQuery = $('#page-lookup #item-search-query').val();
        ProductSearch(searchQuery);
    }
}

function OpenPage(pageName, pageOutPosition)
{
    var targetPage = $(pageName);
    if(targetPage.length > 0)
    {
        var animationSpeed = 700;
        
        var currentPage = $('.page-current');
        targetPage.trigger('beforeopen');
        
        //close current page
        $('.page-current').addClass('page-animate-out');
        //after animation, remove erroneous classes
        setTimeout(function()
        {
            currentPage.removeClass('page-current');
            currentPage.removeClass('page-animate-out');
            targetPage.trigger('afterclose');
        }, animationSpeed);
        
        //open new page
        targetPage.addClass('page-current');
        targetPage.addClass('page-animate-in');
        //after animation, remove erroneous classes
        setTimeout(function()
        {
            targetPage.removeClass('page-animate-in');
            targetPage.trigger('afteropen');
        }, animationSpeed);
    }
}

function OpenOverlay(overlayID, page)
{
    $('.overlay', page).css('display', 'block');
    $('#overlays #' + overlayID).detach().appendTo($('.overlay .foreground .foreground-container', page));
    $('.overlay .foreground .foreground-container', page).addClass('overlay-foreground-animation-in');
    $('.overlay .background', page).addClass('overlay-background-animation-in');
    
    setTimeout(function()
    {        
        $('.overlay .foreground .foreground-container', page).removeClass('overlay-foreground-animation-in');
        $('.overlay .background', page).removeClass('overlay-background-animation-in');
    }, 700);
}
function CloseOverlay(overlayElement, page)
{
    $('.overlay .foreground .foreground-container', page).addClass('overlay-foreground-animation-out');
    $('.overlay .background', page).addClass('overlay-background-animation-out');
    setTimeout(function()
    {
        $('.overlay', page).css('display', 'none');
        overlayElement.detach().appendTo('#overlays');
        
        $('.overlay .foreground .foreground-container', page).removeClass('overlay-foreground-animation-out');
        $('.overlay .background', page).removeClass('overlay-background-animation-out');
    }, 700);   
}

/*helper-functions*/
function FormatCurrency(value, hideCurrencyType)
{
    var formattedCurrency = '';
    if(hideCurrencyType === true)
    {
        formattedCurrency =  parseFloat(value, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
    }
    else
    {
        formattedCurrency = CurrentSession.currency + parseFloat(value, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
    }
    return formattedCurrency;
}
function FormatDecimalFromCurrency(value)
{
    return parseFloat(value.substr(1));
}

