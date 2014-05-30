//Global Vars
var Enum_SlidePosition = {LEFT:'left', RIGHT:'right'};

$(document).ready(Init);

//Process
function Init()
{
    var initialPage = '#page-initial';
    AddListeners();
    FormatPages();
    NavigateTo(initialPage);
    document.getElementById('background-video').play();
}

function AddListeners()
{
    $('#page-initial .purchase-tickets').click(Initial_PurchaseTickets_ClickHandler);
    $('#page-initial .print-tickets').click(Initial_PrintTickets_ClickHandler);
    
    $('.return-main-menu').unbind('click').click(ReturnMainMenu_ClickHandler);
}

function FormatPages()
{
    var slideContainerHeight = $('body').outerHeight() - $('body>header').outerHeight();
    $('#slide-container').height(slideContainerHeight);
}

//Event Handlers
function Initial_PurchaseTickets_ClickHandler(e)
{
    NavigateTo('#page-movies', Enum_SlidePosition.Right, Prerequisite_Movies);
}
function Initial_PrintTickets_ClickHandler(e)
{
    NavigateTo('#page-ticket-search', Enum_SlidePosition.Right);
}

function ReturnMainMenu_ClickHandler(e)
{
    NavigateTo('#page-initial', Enum_SlidePosition.Left);
}

function PrerequisiteComplete(e)
{
    var targetPage = $(e.target);
    OpenPage('#' + targetPage.attr('id'), targetPage.data('slidePosition'));
    targetPage.removeData('slidePosition');
}

//Toggles

//Actions
function NavigateTo(pageName, slidePosition, prerequisiteFunction, parameters)
{
    if(prerequisiteFunction == undefined)
    {
        OpenPage(pageName, slidePosition);
    }
    else
    {
        OpenPage('#page-processing', slidePosition);
        $(pageName).on('prerequisiteComplete', PrerequisiteComplete);
        $(pageName).data('slidePosition', slidePosition);
        prerequisiteFunction(parameters);
    }
}

function OpenPage(pageName, slidePosition)
{
    var targetPage = $(pageName, '#pages');
    if(targetPage.length > 0)
    {
        targetPage.trigger('beforeopen');

        var newSlideClass = (slidePosition == Enum_SlidePosition.Left) ? 'slide-left' : 'slide-right';
        var newSlide = $('<div class="slide ' + newSlideClass + '"></div>');

        var currentSlideClass = (slidePosition == Enum_SlidePosition.Left) ? 'slide-right' : 'slide-left';
        var currentSlide = $('.slide-center');

        newSlide.appendTo('#slide-container');
        targetPage.detach().appendTo(newSlide);

        currentSlide.addClass(currentSlideClass);
        currentSlide.removeClass('slide-center');

        //close previous slide after transition
        setTimeout(function()
        {
            ClosePage('#' + $('.page', currentSlide).attr('id'));
        }, 350);

        //stop 'pop in/out'
        setTimeout(function()
        {
            newSlide.addClass('slide-center');
            newSlide.removeClass(newSlideClass);
        }, 10);

        targetPage.trigger('afteropen');
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

function Prerequisite_Movies()
{
    //timeout to allow for page transitions
    setTimeout(function()
    {
        $('#page-movies .movies-carousel').empty();
        $.each(Movies, function()
        {
            if($('.movie[data-id="' + this.ID + '"]', $('#page-movies .movies-carousel')).length == 0)
            {
                var movieHTML = ['<div class="movie" data-id="' + this.ID + '">',
                                      '<img class="movie-poster" src="' + this.PosterURL + '" />',
                                      '<div class="movie-data">',
                                          '<div class="movie-title">' + this.Title + '</div>',
                                          '<div class="movie-rating">' + this.Rating + '</div>',
                                      '</div>',
                                      '<button class="view-show-times">View Show Times</button>',
                                  '</div>'];

                var movieString = movieHTML.join('');
                $('#page-movies .movies-carousel').append(movieString);
            }
        });
        
        //add listeners to view movie show times
        $('#page-movies .view-show-times').unbind('click').click(Movies_ViewShowTimes_ClickHandler);
        
        setTimeout(function(){$('#page-movies').trigger('prerequisiteComplete');}, 750);
        
    }, 350);
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

