//---------------------------------
//-----App namespace object--------
//---------------------------------
app = {};

app.apiKey = `23df60022b298f4d2aa0b8828774fb95`;



app.eraMappings = {
    old: `primary_release_date.lte=1980`,
    eighties: `primary_release_date.lte=1989&primary_release_date.gte=1980`,
    nineties: `primary_release_date.lte=1999&primary_release_date.gte=1990`,
    modern: `primary_release_date.gte=1999`
};

//call AJAX to get genres
$.ajax({
    url: `https://api.themoviedb.org/3/genre/movie/list`,
    method: `GET`,
    dataType: `json`,
    data: {
        api_key: app.apiKey,
        language: `en-US`
    }
}).then( function(result){
    //save genre IDS in an array in namespace
    app.genreIDs = result;
} );


//query API for movies that match genre and era, first page only
$.ajax({
    url: `https://api.themoviedb.org/3/discover/movie?${app.eraSearchString}`,
    method: `GET`,
    dataType: `json`,
    data: {
        api_key: app.apiKey,
        language: `en-US`,
        with_genres: app.genreIDs
    }
}).then(function (result) {
    //save genre IDS in an array in namespace
    console.log(result);
});


//get user's selection for genre category
$(`#genre`).on(`change`, function(){
    app.genrePicked = $(this).val();
});

//get user's selection for era
$(`#era`).on(`change`, function(){
    app.eraPicked = $(this).val();
    app.eraSearchString = app.eraMappings[app.eraPicked];
});




//parse out array of movie data for 5 random movies

//map array of movie cast to picked movies

//parse out lead actor

//display lead actors for user to select

//using selected genre, era and actor select a movie to display to user

//Document ready check
$(function () {
    
})