//Global Vars
var Enum_SlidePosition =  new SlidePosition();
function SlidePosition(){this.Left = "left"; this.Right = "right";}

var Movies = [];
var TicketTypes = ["Adult", "Child", "Senior", "Student"];
var PricingStandard = [10.00, 7.00, 6.00, 8.00];
var Pricing3D = [12.00, 9.00, 8.00, 10.00];
var PricingIMAX = [15.00, 12.00, 11.00, 13.00];
var PricingIMAX3D = [17.00, 14.00, 13.00, 15.00];

var SelectedMovie;
var SelectedShowing;
var SelectedTickets = [];

$(document).ready(Init);

//Process
function Init()
{
    var initialPage = '#page-initial';
    AddListeners();
    FormatPages();
    GetMovieData();
    NavigateTo(initialPage);
}

function AddListeners()
{
    $('#page-initial .purchase-tickets').click(Initial_PurchaseTickets_ClickHandler);
    $('#page-initial .print-tickets').click(Initial_PrintTickets_ClickHandler);
    $('#page-movie').on('afterclose', Movie_AfterCloseHandler);
    $('#page-showing .purchase-tickets').click(Showing_PurchaseTickets_ClickHandler);
    $('#page-showing .add-tickets').click(Showing_AddTickets_ClickHandler);
    $('#page-purchase .purchase-tickets').click(Purchase_PurchaseTickets_ClickHandler);
    $('#page-purchase .credit-card-number').keyup(Purchase_CreditCardNumber_KeyUpHandler);
    $('#page-purchase-results .print-tickets').click(PurchaseResults_PrintTickets_ClickHandler);
    $('#page-purchase-results .try-another-card').click(PurchaseResults_TryAnotherCard_ClickHandler);
    $('#page-purchase-results .finished').click(PurchaseResults_Finished_ClickHandler);
    $('#page-ticket-search .enter-confirmation-code').click(TicketSearch_EnterConfirmationCode_ClickHandler);
    $('#page-ticket-search .enter-credit-card').click(TicketSearch_EnterCreditCard_ClickHandler);
    $('#page-ticket-search .credit-card-number').keyup(TicketSearch_CreditCardNumber_KeyUpHandler);
    $('#page-ticket-search #credit-card-entry .retrieve-tickets').click(TicketSearch_CreditCard_RetrieveTickets_ClickHandler);
    $('#page-ticket-search .confirmation-code').keyup(TicketSearch_ConfirmationCode_KeyUpHandler);
    $('#page-ticket-search #confirmation-code-entry .retrieve-tickets').click(TicketSearch_ConfirmationCode_RetrieveTickets_ClickHandler);
    $('#page-print-tickets .print-tickets').click(PrintTickets_PrintTickets_ClickHandler);
    
    $('.return-main-menu').unbind('click').click(ReturnMainMenu_ClickHandler);
    $('.return-movies').unbind('click').click(ReturnMovies_ClickHandler);
    $('.return-movie').unbind('click').click(ReturnMovie_ClickHandler);
    $('.return-showing').unbind('click').click(ReturnShowing_ClickHandler);
}

function FormatPages()
{
    var slideContainerHeight = $('body').outerHeight() - $('body>header').outerHeight();
    $('#slide-container').height(slideContainerHeight);
}

function GetMovieData()
{
    var movie = new Movie();
    movie.ID = 1;
    movie.Title = 'Captain America : The Winter Soldier';
    movie.Rating = 'PG-13';
    movie.Runtime = '90 min';
    movie.PosterURL = 'images/captainAmerica.jpg';
    movie.Synopsis = '<p>Captain America is Americaing around with Robert Redford when suddenly, Rob is all like "Spying ain\'t too bad, right Cappy cap?"<br />Of course, the Captain is like, "Naw, man. That ish is bunk.", so he tries to bounce with ScarJo.</p><p>Turns out, though, his buddy from WWII is still around, and some kind of evil robot, so The Captain has to introduce some America in to that jank before it\'s too late.</p>';
    movie.Cast.push('Chris Evans');
    movie.Cast.push('Scarlett Johannsen');
    movie.Cast.push('Samuel L. Jackson');
    movie.Cast.push('Robert Redford');
    movie.Cast.push('Jet Powered Heli-Carrier');
    movie.Directors.push('Joe Russo');
    movie.Directors.push('Anthony Russo');
    
    var showing = new Showing();
    showing.ID = 1;
    showing.StartTime = '9:30am';
    showing.TheaterType = 'Standard';
    showing.ScreenNumber = Math.floor(Math.random() * 10) + 1;
    showing.Pricing = new showing.Pricing(PricingStandard[0], PricingStandard[1], PricingStandard[2], PricingStandard[1]);
    movie.Showings.push(showing);
    
    showing = new Showing();
    showing.ID = 2;
    showing.StartTime = '11:15am';
    showing.TheaterType = '3D';
    showing.ScreenNumber = Math.floor(Math.random() * 10) + 1;
    showing.Pricing = new showing.Pricing(Pricing3D[0], Pricing3D[1], Pricing3D[2], Pricing3D[1]);
    movie.Showings.push(showing);
    
    showing = new Showing();
    showing.ID = 3;
    showing.StartTime = '1:45pm';
    showing.TheaterType = 'IMAX3D';
    showing.ScreenNumber = Math.floor(Math.random() * 10) + 1;
    showing.Pricing = new showing.Pricing(PricingIMAX3D[0], PricingIMAX3D[1], PricingIMAX3D[2], PricingIMAX3D[1]);
    movie.Showings.push(showing);
    
    showing = new Showing();
    showing.ID = 4;
    showing.StartTime = '5:30pm';
    showing.TheaterType = 'Standard';
    showing.ScreenNumber = Math.floor(Math.random() * 10) + 1;
    showing.Pricing = new showing.Pricing(PricingStandard[0], PricingStandard[1], PricingStandard[2], PricingStandard[1]);
    movie.Showings.push(showing);
    
    showing = new Showing();
    showing.ID = 5;
    showing.StartTime = '7:45pm';
    showing.TheaterType = 'IMAX';
    showing.ScreenNumber = Math.floor(Math.random() * 10) + 1;
    showing.Pricing = new showing.Pricing(PricingIMAX[0], PricingIMAX[1], PricingIMAX[2], PricingIMAX[1]);
    movie.Showings.push(showing);
    
    Movies.push(movie);
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
function Movies_ViewShowTimes_ClickHandler(e)
{
    var movieID = $(e.target).closest('.movie').attr('data-id');
    SelectedMovie = GetMovieByID(movieID);
    NavigateTo('#page-movie', Enum_SlidePosition.Right, Prerequisite_Movie);
}
function Movie_MovieShowing_ClickHandler(e)
{
    var showingID = $(e.target).closest('.movie-showing').attr('data-id');
    SelectedShowing = GetShowingByID(showingID);
    NavigateTo('#page-showing', Enum_SlidePosition.Right, Prerequisite_Showing);
}
function Movie_AfterCloseHandler(e)
{
    $(this).removeData('movie');
}
function Showing_AddTickets_ClickHandler(e)
{
    AddTicketTypeForm();
}
function Showing_DeleteTickets_ClickHandler(e)
{
    var formID = $(this).closest('.ticket-type-form').attr('data-formID');
    RemoveTicketTypeForm(formID);
}
function Showing_TicketType_ChangeHandler(e)
{
    UpdateTicketPrices();
}
function Showing_TicketQuantity_ChangeHandler(e)
{
    UpdateTicketPrices();
}
function Showing_PurchaseTickets_ClickHandler(e)
{
    SetUserTickets();
    NavigateTo('#page-purchase', Enum_SlidePosition.Right, Prerequisite_Purchase);
}
function Purchase_PurchaseTickets_ClickHandler(e)
{
    NavigateTo('#page-purchase-results', Enum_SlidePosition.Right);
}
function Purchase_CreditCardNumber_KeyUpHandler(e)
{
    var button = $('#page-purchase .purchase-tickets');
    SetButtonStatus(button, ValidateCardNumberFormat, $(e.target).val());
}
function PurchaseResults_PrintTickets_ClickHandler(e)
{
    NavigateTo('#page-print-tickets', Enum_SlidePosition.Right);
}
function PurchaseResults_TryAnotherCard_ClickHandler(e)
{
    NavigateTo('#page-purchase', Enum_SlidePosition.Right);
}
function PurchaseResults_Finished_ClickHandler(e)
{
    NavigateTo('#page-non-print-results', Enum_SlidePosition.Right);
}
function TicketSearch_EnterConfirmationCode_ClickHandler(e)
{
    var page = $('#page-ticket-search')
    OpenSection(page, $('#confirmation-code-entry', page));
}
function TicketSearch_EnterCreditCard_ClickHandler(e)
{
    var page = $('#page-ticket-search')
    OpenSection(page, $('#credit-card-entry', page));
}
function TicketSearch_CreditCardNumber_KeyUpHandler(e)
{
    var button = $('#page-ticket-search #credit-card-entry .retrieve-tickets');
    SetButtonStatus(button, ValidateCardNumberFormat, $(e.target).val());
}
function TicketSearch_CreditCard_RetrieveTickets_ClickHandler(e)
{
    NavigateTo('#page-print-tickets', Enum_SlidePosition.Right);
}
function TicketSearch_ConfirmationCode_KeyUpHandler(e)
{
    var button = $('#page-ticket-search #confirmation-code-entry .retrieve-tickets');
    SetButtonStatus(button, ValidateConfirmationCodeFormat, $(e.target).val());
}
function TicketSearch_ConfirmationCode_RetrieveTickets_ClickHandler(e)
{
    NavigateTo('#page-print-tickets', Enum_SlidePosition.Right);
}
function PrintTickets_PrintTickets_ClickHandler(e)
{
    NavigateTo('#page-print-results', Enum_SlidePosition.Right);
}

function ReturnMainMenu_ClickHandler(e)
{
    NavigateTo('#page-initial', Enum_SlidePosition.Left);
}
function ReturnMovies_ClickHandler(e)
{
    NavigateTo('#page-movies', Enum_SlidePosition.Left, Prerequisite_Movies);
}
function ReturnMovie_ClickHandler(e)
{
    NavigateTo('#page-movie', Enum_SlidePosition.Left);
}
function ReturnShowing_ClickHandler(e)
{
    NavigateTo('#page-showing', Enum_SlidePosition.Left);
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

function SetButtonStatus(button, validationFunction, validationString)
{
    var isValid = validationFunction(validationString);
    if(isValid)
    {
        button.removeAttr('disabled');
    }
    else
    {
        button.attr('disabled', 'disabled');
    }
}
function ValidateCardNumberFormat(validationString)
{
    if(validationString.length == 16)
    {
        if($.isNumeric(validationString))
        {
            return true;
        }
    }
    return false;
}
function ValidateConfirmationCodeFormat(validationString)
{
    if(validationString.length == 9)
    {
        return true;
    }
    return false;
}

function GetMovieByID(id)
{
    var movie = undefined;
    $.each(Movies, function()
    {
        if(this.ID == id)
        {
            movie = this;
        }
    });
    
    return movie;
}
function GetShowingByID(showingID)
{
    var showing = undefined;
    $.each(SelectedMovie.Showings, function()
    {
        if(this.ID == showingID)
        {
            showing = this;
        }
    });
    
    return showing;
}

function AddTicketTypeForm()
{
    var ticketTypeForms = $('#page-showing .movie-showing-tickets .ticket-type-form');
    var ticketTypeFormID = ticketTypeForms.length;
    var ticketTypeFormHTML = ['<div style="display:none;" class="ticket-type-form" data-formID="' + ticketTypeFormID + '">',
                                  '<span class="showing-time">' + SelectedShowing.StartTime + '</span>',
                                  '<span class="showing-type">' + SelectedShowing.TheaterType + '</span>',
                                  '<select class="showing-ticket-type"></select>',
                                  '<span class="showing-price"></span>',
                                  '<span class="showing-multiplyer-symbol">x</span>',
                                  '<input class="showing-ticket-quantity" type="number" step="1" value="1" min="0" />',
                                  '<span class="showing-total-price"></span>',
                              '</div>'];
    var ticketTypeFormString = ticketTypeFormHTML.join('');
    $('#page-showing .movie-showing-tickets').append(ticketTypeFormString);
    
    if(ticketTypeFormID > 0)
    {
        var form = $('#page-showing .ticket-type-form[data-formID="' + ticketTypeFormID + '"]');
        form.append('<button class="delete-tickets">X</button>');
        $('.delete-tickets', form).click(Showing_DeleteTickets_ClickHandler);
    }
    
    $.each(TicketTypes, function()
    {
        var ticketTypeString = '<option value="' + this + '">' + this + '</option>';
        $('#page-showing .showing-ticket-type').append($(ticketTypeString));
    });
    
    $('#page-showing .ticket-type-form[data-formID="' + ticketTypeFormID + '"] .showing-ticket-type').change(Showing_TicketType_ChangeHandler);
    $('#page-showing .ticket-type-form[data-formID="' + ticketTypeFormID + '"] .showing-ticket-quantity').change(Showing_TicketQuantity_ChangeHandler);
    
    UpdateTicketPrices();
    
    $('#page-showing .ticket-type-form[data-formID="' + ticketTypeFormID + '"]').show(200);
}
function RemoveTicketTypeForm(formID)
{
    $('#page-showing .movie-showing-tickets .ticket-type-form[data-formID="' + formID + '"]').hide(200, function(){$(this).remove();});
    UpdateTicketPrices();
}

function UpdateTicketPrices()
{
    var totalPrice = 0;
    $.each($('#page-showing .ticket-type-form'), function()
    {
       var form = $(this);
       var ticketType = $('.showing-ticket-type option:selected', form).val();
       var price;
       if(ticketType == 'Adult')
       {
           price = SelectedShowing.Pricing.Adult;
       }
       if(ticketType == 'Child')
       {
           price = SelectedShowing.Pricing.Child;
       }
       if(ticketType == 'Senior')
       {
           price = SelectedShowing.Pricing.Senior;
       }
       if(ticketType == 'Student')
       {
           price = SelectedShowing.Pricing.Student;
       }

       var priceElement = $('.showing-price', form);
       priceElement.html(FormatCurrency(price));

       var ticketQuantity = $('.showing-ticket-quantity', form).val();

       var formTotal = price*ticketQuantity;

       var formTotalElement = $('.showing-total-price', form);
       formTotalElement.html(FormatCurrency(formTotal));

       totalPrice += formTotal;
    });
    $('#page-showing .tickets-grand-total').html(FormatCurrency(totalPrice));
}

function SetUserTickets()
{
    var ticketTypeForms = $('#page-showing .movie-showing-tickets .ticket-type-form');
    $.each(ticketTypeForms, function()
    {
        var ticketTypeForm = $(this);
        var ticketGroup = new TicketGroup();
        ticketGroup.Movie = SelectedMovie;
        ticketGroup.Showing = SelectedShowing;

        ticketGroup.Quantity = parseInt($('.showing-ticket-quantity', ticketTypeForm).val());
        ticketGroup.TicketType = $('.showing-ticket-type option:selected', ticketTypeForm).val();
        ticketGroup.SelectedPrice = FormatDecimalFromCurrency($('.showing-price', ticketTypeForm).html());
        ticketGroup.Total = FormatDecimalFromCurrency($('.showing-total-price', ticketTypeForm).html());
        
        SelectedTickets.push(ticketGroup);
    });
}

function AddTicketGroup(ticketGroup)
{
    var ticketGroupHTML = ['<div class="ticket-group" data-groupID="' + ticketGroup.ID + '">',
                                  '<span class="movie-title">' + ticketGroup.Movie.Title + '</span>',
                                  '<span class="showing-time">' + ticketGroup.Showing.StartTime + '</span>',
                                  '<span class="showing-type">' + ticketGroup.Showing.TheaterType + '</span>',
                                  '<span class="showing-ticket-type">' + ticketGroup.TicketType + '</span>',
                                  '<span class="showing-price">' + FormatCurrency(ticketGroup.SelectedPrice) + '</span>',
                                  '<span class="showing-multiplyer-symbol">x</span>',
                                  '<span class="showing-ticket-quantity">' + ticketGroup.Quantity + '</span>',
                                  '<span class="showing-total-price">' + FormatCurrency(ticketGroup.Total) + '</span>',
                              '</div>'];
    var ticketGroupString = ticketGroupHTML.join('');
    $('#page-purchase .tickets-data').append(ticketGroupString);
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

