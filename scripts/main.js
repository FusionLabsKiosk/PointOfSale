//Global Vars
var PAGE_OUT_POSITION = {TOP:'top', BOTTOM:'bottom'};

var CurrentSession;

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
    $('#page-lookup').on('beforeopen', Lookup_BeforeOpenHandler);
    $('#page-lookup').on('beforesearch', Lookup_BeforeSearchHandler);
    $('#page-lookup').on('aftersearch', Lookup_AfterSearchHandler);
    
    $('#page-lookup .return-checkout').click(Lookup_ReturnCheckout_ClickHandler);
    
    $('.return-main-menu').unbind('click').click(ReturnMainMenu_ClickHandler);
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
function Lookup_BeforeOpenHandler(e)
{
    ProductSearch();
}
function Lookup_BeforeSearchHandler(e)
{
    $('#page-lookup .search-results').empty();
    $('#modules .loading-animation').clone().appendTo('#page-lookup .search-results');
}
function Lookup_AfterSearchHandler(e)
{
    $('#page-lookup .search-results .loading-animation').remove();
    $('#page-lookup .search-results .search-result').addClass('search-result-animation-in');
    setTimeout(function()
    {
        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-in');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-1');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-2');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-3');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-4');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-5');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-6');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-7');
//        $('#page-lookup .search-results .search-result').removeClass('search-result-animation-8');
    }, 1000);
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

function PrerequisiteComplete(e)
{
    var targetPage = $(e.target);
    OpenPage('#' + targetPage.attr('id'), targetPage.data('slidePosition'));
    targetPage.removeData('slidePosition');
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
                
                $('#page-lookup .search-results').append(productElement);
            }
            $('#page-lookup').trigger('aftersearch');
        }, 3000);
        return;
        
    }
    else
    {
        $('#page-lookup').trigger('aftersearch');
    }
    
    
}

//function NavigateTo(pageName, slidePosition, prerequisiteFunction, parameters)
//{
//    if(prerequisiteFunction == undefined)
//    {
//        OpenPage(pageName, slidePosition);
//    }
//    else
//    {
//        OpenPage('#page-processing', slidePosition);
//        $(pageName).on('prerequisiteComplete', PrerequisiteComplete);
//        $(pageName).data('slidePosition', slidePosition);
//        prerequisiteFunction(parameters);
//    }
//}

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
function ClosePage(pageName)
{
    var targetPage = $(pageName, '#slide-container');
    if(targetPage.length > 0)
    {
        targetPage.trigger('beforeclose');
        var parentSlide = targetPage.closest('.slide');
        targetPage.detach().appendTo('#pages');
        $('input[type="text"]', targetPage).val('');
        $('input[type="number"]', targetPage).val('1');
        parentSlide.remove();
        targetPage.trigger('afterclose');
    }
}

function OpenSection(page, section)
{
    CloseSections(page, section);;
    section.slideDown();
    section.addClass('open');
    
}
function CloseSections(page, section)
{
    $('section.open', page).slideUp().removeClass('open');
}

function FormatCurrency(value)
{
    return '$' + parseFloat(value, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}
function FormatDecimalFromCurrency(value)
{
    return parseFloat(value.substr(1));
}

function Prerequisite_Checkout()
{
    $('#page-movies').trigger('prerequisiteComplete');
    //timeout to allow for page transitions
//    setTimeout(function()
//    {
//        $('#page-movies .movies-carousel').empty();
//        $.each(Movies, function()
//        {
//            if($('.movie[data-id="' + this.ID + '"]', $('#page-movies .movies-carousel')).length == 0)
//            {
//                var movieHTML = ['<div class="movie" data-id="' + this.ID + '">',
//                                      '<img class="movie-poster" src="' + this.PosterURL + '" />',
//                                      '<div class="movie-data">',
//                                          '<div class="movie-title">' + this.Title + '</div>',
//                                          '<div class="movie-rating">' + this.Rating + '</div>',
//                                      '</div>',
//                                      '<button class="view-show-times">View Show Times</button>',
//                                  '</div>'];
//
//                var movieString = movieHTML.join('');
//                $('#page-movies .movies-carousel').append(movieString);
//            }
//        });
//        
//        //add listeners to view movie show times
//        $('#page-movies .view-show-times').unbind('click').click(Movies_ViewShowTimes_ClickHandler);
//        
//        setTimeout(function(){$('#page-movies').trigger('prerequisiteComplete');}, 750);
//        
//    }, 350);
}
function Prerequisite_Movie()
{
    //timeout to allow for page transitions
    setTimeout(function()
    {        
        $('#page-movie').data('movie', SelectedMovie);
        
        $('#page-movie .movie-poster').attr('src', SelectedMovie.PosterURL);
        $('#page-movie .movie-data .movie-title').html(SelectedMovie.Title);
        $('#page-movie .movie-data .movie-synopsis').html(SelectedMovie.Synopsis);
        $('#page-movie .movie-data .movie-rating').html(SelectedMovie.Rating);
        $('#page-movie .movie-data .movie-runtime').html(SelectedMovie.Runtime);
        
        $.each(SelectedMovie.Cast, function()
        {
            var castMemberElement = '<div class="castMember">' + this + '</div>';
            $('#page-movie .movie-data .movie-cast').append(castMemberElement);
        });
        
        $.each(SelectedMovie.Directors, function()
        {
            var directorElement = '<div class="director">' + this + '</div>';
            $('#page-movie .movie-data .movie-directors').append(directorElement);
        });
        
        $('#page-movie .movie-showings').empty();
        $.each(SelectedMovie.Showings, function()
        {
            if($('.movie-showing[data-id="' + this.ID + '"]', $('#page-movie .movie-showings')).length == 0)
            {
                var showingHTML = ['<li class="movie-showing" data-id="' + this.ID + '">',
                                          '<span class="showing-time">' + this.StartTime + '</span>',
                                          '<span class="showing-type">' + this.TheaterType + '</span>',
                                      '</li>'];

                var showingString = showingHTML.join('');
                $('#page-movie .movie-showings').append(showingString);
            }
        });
        
        //add listeners to view movie show times
        $('#page-movie .movie-showing').unbind('click').click(Movie_MovieShowing_ClickHandler);
        
        setTimeout(function(){$('#page-movie').trigger('prerequisiteComplete');}, 600);
        
    }, 350);
}
function Prerequisite_Showing()
{
    //timeout to allow for page transitions
    setTimeout(function()
    {        
        $('#page-showing .movie-data').empty();
        var movieDataHTML = ['<img class="movie-poster" src="' + SelectedMovie.PosterURL + '" />',
                            '<div class="movie-title">' + SelectedMovie.Title + '</div>',
                            '<div class="movie-showing-tickets"></div>'];
        
        var movieDataString = movieDataHTML.join('');
        $('#page-showing .movie-data').append(movieDataString);
        
        AddTicketTypeForm();
        
        setTimeout(function(){$('#page-showing').trigger('prerequisiteComplete');}, 600);
        
    }, 350);
}
function Prerequisite_Purchase()
{
    //timeout to allow for page transitions
    setTimeout(function()
    {
        $('#page-purchase .tickets-data').empty();
        
        var transactionTotal = 0;
        $.each(SelectedTickets, function()
        {
            AddTicketGroup(this);
            transactionTotal += this.Total;
        });
        
        $('#page-purchase .transaction-data .total-value').html(FormatCurrency(transactionTotal));
        
        setTimeout(function(){$('#page-purchase').trigger('prerequisiteComplete');}, 600);
        
    }, 350);
}

