//---------------------------------
//-----App namespace object--------
//---------------------------------
app = {};

app.apiKey = `23df60022b298f4d2aa0b8828774fb95`;



app.eraMappings = {
    old: {
        start: 1910,
        end: 1979
    },
    eighties: {
        start: 1980,
        end: 1989
    },
    nineties: {
        start: 1990,
        end: 1999
    },
    modern: {
        start: 2000,
        end: 2019
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

app.bothQueries = function(moviePromise, actorPromise) {
    $.when(moviePromise, actorPromise)
    .then( (movieResult, actorResult) => {
        console.log(movieResult, actorResult);
    })
    .fail( (movieError, actorError) =>{
        alert(movieError, actorError);
    } );
}


//query API for movies that match genre and era, first page only
app.$movieQuery = function(genre, startDate, endDate) {

    return $.ajax({
        url: `https://api.themoviedb.org/3/discover/movie`,
        method: `GET`,
        dataType: `json`,
        data: {
            api_key: app.apiKey,
            language: `en-US`,
            with_genres: genre,
            'primary_release_date.gte': startDate,
            'primary_release_date.lte': endDate
        }
    })
    .then ( (results) => {
        const threeMovies = app.randomMovies(results);
        const threeMovieIDs = app.getMovieId(threeMovies);

        app.$actorQuery(threeMovieIDs[0]);
        app.$actorQuery(threeMovieIDs[1]);
        app.$actorQuery(threeMovieIDs[2]);
    
    })
    .fail((error) => {
        alert(error);
    });
} 
    
//AJAX call for actors
app.$actorQuery = function(movie_id) {
    return $.ajax({
        url: `https://api.themoviedb.org/3/movie/${movie_id}/credits?`,
        method: `GET`,
        dataType: `json`,
        data: {
            api_key: app.apiKey
        }
    }).then((actorResults) => {
        console.log(actorResults);
        app.leadRole = actorResults.cast[0].name;
        $(`#star`).append(`<option>${app.leadRole}</option>`);
    })
    .fail( (actorError) => {
        alert(actorError);
    } )
}


//get user's selection for genre category
$(`#genre`).on(`change`, function(){
    app.genrePicked = $(this).val();
});

//get user's selection for era
$(`#era`).on(`change`, function(){
    app.eraPicked = $(this).val();
    
});

//make event handler for submit buttons for genre and era

$(`.firstQuestion`).on(`click`, function(event) {
    event.preventDefault();
    app.genreSelected = $(`#genre`).val();
})

$(`.secondQuestion`).on(`click`, function (event) {
    event.preventDefault();
    app.eraSelected = $(`#era`).val();
    //making the AJAX call with the genre the user selected, the era the user selected and connecting the era to the AJAX keys for start and end date of the era
    app.$movieQuery(app.genreSelected, app.eraMappings[app.eraSelected].start, app.eraMappings[app.eraSelected].end);
    
    // const movieProm = app.$movieQuery(app.genreSelected, app.eraMappings[app.eraSelected].start, app.eraMappings[app.eraSelected].end);
    // const actorProm = app.$actorQuery(app.selectedMovieIDs);

    // app.bothQueries(movieProm, actorProm);

    // app.randomMovies();
    // console.log(app.movieResults);
    
})

$(`.thirdQuestion`).on(`click`, function (event) {
    event.preventDefault();
    
})

//write a function to select 3 random movies from app.movieResults
app.randomMovies = function(movies){
    let selectedMovies = [];
    for (let i = 0; i < 3; i++){
        const rand = Math.floor(Math.random() * 20);
        selectedMovies.push(movies.results[rand]);
    }
    console.log(selectedMovies);
    return selectedMovies;

}

//write a function to get the movie id's from the three random movies 
app.getMovieId = function(movies){
    const selectedMovieIDs = [];
    for (let i = 0; i < movies.length; i++) {
        selectedMovieIDs.push(movies[i].id);
    }
    console.log(selectedMovieIDs);
    return selectedMovieIDs;
}



//parse out array of movie data for 5 random movies

//map array of movie cast to picked movies

//parse out lead actor

//display lead actors for user to select

//using selected genre, era and actor select a movie to display to user

//Document ready check
$(function () {
})