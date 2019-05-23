//---------------------------------
//-----App namespace object--------
//---------------------------------
app = {};

app.apiKey = `23df60022b298f4d2aa0b8828774fb95`;



app.eraMappings = {
    old: {
        start: `1910`,
        end: `1979`
    },
    eighties: {
        start: `1980`,
        end: `1989`
    },
    nineties: {
        start: `1990`,
        end: `1999`
    },
    modern: {
        start: `2000`,
        end: `2019`
    }
};

//call AJAX to get genres
// $.ajax({
//     url: `https://api.themoviedb.org/3/genre/movie/list`,
//     method: `GET`,
//     dataType: `json`,
//     data: {
//         api_key: app.apiKey,
//         language: `en-US`
//     }
// }).then( function(result){
//     //save genre IDS in an array in namespace
//     app.genreIDs = result;
// } );


//query API for movies that match genre and era, first page only
app.$movieQuery = function (genre, startDate, endDate){

    $.ajax({
        url: `https://api.themoviedb.org/3/discover/movie?${app.eraSearchString}`,
        method: `GET`,
        dataType: `json`,
        data: {
            api_key: app.apiKey,
            language: `en-US`,
            with_genres: genre,
            'release_date.gte': startDate,
            'release_date.lte': endDate
        }
    
    }).then(function(results){
        return results
    })
} 
    



//get user's selection for genre category
$(`#genre`).on(`change`, function(){
    app.genrePicked = $(this).val();
});

//get user's selection for era
$(`#era`).on(`change`, function(){
    app.eraPicked = $(this).val();
    
});




//parse out array of movie data for 5 random movies

//map array of movie cast to picked movies

//parse out lead actor

//display lead actors for user to select

//using selected genre, era and actor select a movie to display to user

//Document ready check
$(function () {
    app.$movieQuery(app.genrePicked, app.eraMappings[app.eraPicked].start, app.eraMappings[app.eraPicked].end);
})