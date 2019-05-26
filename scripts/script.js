//---------------------------------
//-----App namespace object--------
//---------------------------------
app = {};

//api key for the movie database
app.apiKey = `23df60022b298f4d2aa0b8828774fb95`;

//saves the selector for page scroll for both chrome and firefox
app.page = $("html, body");

//object to map era with start and end years - used to create API query
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
        //get three random movies from our results
        app.threeMovies = app.randomMovies(results, 3);
        //get the IDs of the three movies we picked
        const threeMovieIDs = app.getMovieId(app.threeMovies);
        //for each movie ID find the lead actor 
        threeMovieIDs.forEach( function (movieID){
            //make an API call with $actorQuery method, this is chained because we need information from this movie query for the actor query
            app.$actorQuery(movieID);
        })
    })
    .fail((error) => {
        //Show an error alert if API call fails
        swal({
            title: `There's something wrong with the data retreival on this website! Please hold tight!`,
            icon: `error`,
            button: `Exit`,
            className: `swal`,
        });
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
        //get the first index of array of cast members that's returned - this is the lead role
        app.leadRole = actorResults.cast[0].name;
        //add the name of the actor to the select options. Also add their database ID so we can reference them back
        $(`#star`).append(`<option value="${movie_id}">${app.leadRole}</option>`);

    })
    .fail( (actorError) => {
        //Show an alert if API call fails
        swal({
            title: `There's something wrong with the data retreival on this website! Please hold tight!`,
            icon: `error`,
            button: `Exit`,
            className: `swal`,
        });
    } )
}

//start button initilizer 
//Displays the first option section to the user
app.startClick = function () {
    $(`.start`).on(`click`, function (){
        //remove a class that hides the hidden sections
        $(`.firstSection`).removeClass(`notLoaded`);
        $(`main`).removeClass(`notLoaded`);
        //auto smooth scroll to the revealed section
        app.page.animate({ scrollTop: $(`#firstSection`).offset().top }, 2000, function () {
            // remove the listeners added for scroll above 
            app.page.off(`scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove`);
        });
    })
}

//make event handler for genre section submit button clicks 
app.genreClick = function () {
    $(`.firstQuestion`).on(`click`, function(event) {
    event.preventDefault();
    //get the genre code from the selected option
    app.genreSelected = $(`#genre`).val();
    //Alert if user doesn't select an option
    if (app.genreSelected === `-1`) {
        swal({
            title: `Please select a protagonist!`,
            icon: `error`,
            button: `Try again!`,
            className: `swal`,
        })
    } else {
    //add the text in the selection to the mad lib text - make all undercase
    app.genreSelectedName = $(`#genre option:selected`).text().toLowerCase();
    $(`.taskName`).text(app.genreSelectedName);
    //reveal the era selection section
    $(`.secondSection`).removeClass(`notLoaded`);
    //smooth scroll to era section
    app.page.animate({ scrollTop: $(`#secondSection`).offset().top }, 2000, function () {
        // remove the listeners added for scroll above 
        app.page.off(`scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove`);
    });
}
});
};

//event handler for submit button in era section clicks
app.eraClick = function () {
    $(`.secondQuestion`).on(`click`, function (event) {
    event.preventDefault();
    //get the name of the selected era
    app.eraSelected = $(`#era`).val();
    //if user does not make a selection, display an alert
    if (app.eraSelected === `-1`) {
        swal({
            title: `Please select an era!`,
            icon: `error`,
            button: `Try again!`,
            className: `swal`,
        })
    } else {
        //otherwise, make an API call to find movies in the selected genre and era
        //get era start and end years from era mappings object
    app.$movieQuery(app.genreSelected, app.eraMappings[app.eraSelected].start, app.eraMappings[app.eraSelected].end);
        //get name of era from selection dropdown, make lowercase to put in mad libs
    app.eraSelectedName = $(`#era option:selected`).text().toLowerCase();
    $(`.eraName`).text(app.eraSelectedName);
    //reveal the actor selection section
    $(`.thirdSection`).removeClass(`notLoaded`);
    //smooth scroll to actor selection section
    app.page.animate({ scrollTop: $(`#thirdSection`).offset().top }, 2000, function () {
        // remove the listeners added for scroll above 
        app.page.off(`scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove`);
        });
    }
});
};

//event handler for submit button in actor section clicks
app.starClick = function () {
    $(`.thirdQuestion`).on(`click`, function (event) {
    event.preventDefault();
    //get actor ID from user selected option
    app.movieSelectedID = $(`#star`).val();
    //if user doesn't make a selection, display alert
    if (app.movieSelectedID === `-1`) {
        swal({
            title: `Please select a star!`,
            icon: `error`,
            button: `Try again!`,
            className: `swal`,
        })
    } else {
        //get the star's name from selected option and add to mad libs
    app.starSelectedName = $(`#star option:selected`).text();
    //reveal results section
    $(`.results`).removeClass(`notLoaded`);
        //smooth scroll to results section
    app.page.animate({ scrollTop: $(`#results`).offset().top }, 2000, function () {
        // remove the listeners added for scroll above 
        app.page.off(`scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove`);
        });
    }
    
    //iterate over the three movies we picked
    app.threeMovies.forEach( function(movie) {
        //if current movie we're iterating over is the one the user selected
        if (parseInt(app.movieSelectedID) === movie.id) {
            //add completed mad lib and info for this movie to the web page
            $(`.fullScript`).html(`<p>In a world, where there is only one ${app.genreSelectedName} up to the task, this ${app.genreSelectedName}, living in ${app.eraSelectedName}, must save the day! In order to save the day the ${app.genreSelectedName} has to team up with ${app.starSelectedName}.</p>`);
            $(`.poster`).html(`<img src ='https://image.tmdb.org/t/p/w342/${movie.poster_path}' alt = 'Poster image for ${movie.original_title}.'></img>`);
            $(`h2.movieName`).html(movie.original_title);
            $(`p.description`).html(movie.overview);
        }
    })   
});
};

//function to select 3 random movies from app.movieResults
//takes an array of movie objects that are returned from the API
//does not pick 2 of the same movie
app.randomMovies = function(movies, numMovies){
    //a set to hold movie IDs that we have picked - easy to check if we've picked a movie already
    let movieSeen = new Set();
    //empty array to hold the movies we picked
    const selectedMovies = [];
    //iterate over the passed in array of movie objects
    for (let i = 0; i < numMovies; i++){
        //get a random array index
        let rand = Math.floor(Math.random() * movies.results.length);
        //if we've already picked that movie ID, pick another random index
        while (movieSeen.has(rand)) {
            rand = Math.floor(Math.random() * movies.results.length);
        } 
        //add the movie ID we just picked to the set of ones we've picked
        movieSeen.add(rand);
        //add the movie object to our result array
        selectedMovies.push(movies.results[rand]);
    };
    //return picked movie objects
    return selectedMovies;
}

//write a function to get the movie id's from the three random movies 
//takes an array of movie objects that are returned by the API
app.getMovieId = function(movies){
    //array to hold the IDs of the movies 
    const selectedMovieIDs = [];
    //iterate over the passed in movies array
    for (let i = 0; i < movies.length; i++) {
        //extract the ID of the current movie we're at
        selectedMovieIDs.push(movies[i].id);
    }
    //return the IDs
    return selectedMovieIDs;
}

//event handler for reset button 
app.resetButton = function (){
    $(`.reset`).on(`click`, function (){
        //reload and resets the page
        location.reload();
    })
}

//initilization function
//calls all the event handlers
app.init = function () {
    app.startClick();
    app.genreClick();
    app.eraClick();
    app.starClick();
    app.resetButton();
    //resets the select to default option in firefox
    $(`select`).prop(`-1`);
} 

//Document ready check
$(function () {
    app.init();
})