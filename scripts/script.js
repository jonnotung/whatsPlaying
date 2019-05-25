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



//query API for movies that match genre and era, first page only
//First AJAX call we make
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
        app.threeMovies = app.randomMovies(results);
        const threeMovieIDs = app.getMovieId(app.threeMovies);
        //for each movie ID find the lead actor 
        threeMovieIDs.forEach( function (movieID){
            app.$actorQuery(movieID);
        })
    })
    .fail((error) => {
        alert(error);
    });
} 
    
//AJAX call for actors - get movie cast using movie id
//second AJAX call we make inside $movieQuery
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
        $(`#star`).append(`<option value="${movie_id}">${app.leadRole}</option>`);

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
    app.genreSelectedName = $(`#genre option:selected`).text().toLowerCase();
    $(`.taskName`).text(app.genreSelectedName);
    console.log(app.genreSelectedName);
})

$(`.secondQuestion`).on(`click`, function (event) {
    event.preventDefault();
    app.eraSelected = $(`#era`).val();
    //making the AJAX call with the genre the user selected, the era the user selected and connecting the era to the AJAX keys for start and end date of the era
    app.$movieQuery(app.genreSelected, app.eraMappings[app.eraSelected].start, app.eraMappings[app.eraSelected].end);
    app.eraSelectedName = $(`#era option:selected`).text().toLowerCase();
    console.log(app.eraSelectedName);
    $(`.eraName`).text(app.eraSelectedName);

})


$(`.thirdQuestion`).on(`click`, function (event) {
    event.preventDefault();
    app.movieSelectedID = $(`#star`).val();
    console.log(app.movieSelectedID);
    app.starSelectedName = $(`#star option:selected`).text();
    console.log(app.starSelectedName);
    
    app.threeMovies.forEach( function(movie) {
        
        console.log(movie.id);
        console.log(typeof app.movieSelectedID);

        if (parseInt(app.movieSelectedID) === movie.id) {
            $(`.fullScript`).html(`<p>In a world, where there is only one ${app.genreSelectedName} up to the task, this ${app.genreSelectedName}, living in ${app.eraSelectedName}, must save the day! In order to save the day the ${app.genreSelectedName} has to team up with ${app.starSelectedName}.</p>`);
            $(`.poster`).html(`<img src ='https://image.tmdb.org/t/p/w342/${movie.poster_path}'></img>`);
            $(`h2.movieName`).html(movie.original_title);
            $(`p.description`).html(movie.overview);
        }
    })
        

    
})



//write a function to select 3 random movies from app.movieResults
app.randomMovies = function(movies){
    let movieSeen = new Set();
    const selectedMovies = [];
    for (let i = 0; i < 3; i++){
        let rand = Math.floor(Math.random() * movies.results.length);
        while (movieSeen.has(rand)) {
            rand = Math.floor(Math.random() * movies.results.length);
        } 
        movieSeen.add(rand);
        selectedMovies.push(movies.results[rand]);
        console.log(movieSeen);
    };
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

//event handler for reset button 
app.resetButton = function (){
    $(`.reset`).on(`click`, function (){
        location.reload();
    })
}

//initilization function
app.init = function () {
    app.resetButton();
    $(`select`).prop(`-1`);
} 

//Document ready check
$(function () {
    app.init();
})