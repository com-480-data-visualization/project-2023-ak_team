const actorsPath = './datasets/map_actors.json';
const directorsPath = './datasets/map_directors.json';
const moviesPath = './datasets/map_movies.json';
const infoActorPath = './datasets/all_actors_info.json'
const infoDirectorPath = './datasets/all_directors_info.json'
const moviesInfosPath = './datasets/movie_info_map.json'
const mostPopularActorPath = './datasets/most_famous_actor.json'
const mostPopularDirectorPath = './datasets/most_famous_director.json'
const directorsMoviesPath = './datasets/directors_movies.json'

async function readDirectorsFile(filePath) {
    try {
      const response = await fetch(filePath);
      const directors_map = await response.json();
      return directors_map;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async function readDirectorsMoviesFile(filePath) {
    try {
      const response = await fetch(filePath);
      const directors_movies = await response.json();
      return directors_movies;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async function readGeneratedActorInfoFile(filePath) {
    try {
      const response = await fetch(filePath);
      const generatedActorInfos = await response.json();
      return directors_map;
    } catch (err) {
      console.error('Error:', err);
    }
  }

async function readActorsFile(filePath) {
  try {
    const response = await fetch(filePath);
    const actors_map = await response.json();
    return actors_map;
  } catch (err) {
    console.error('Error:', err);
  }
}
async function readMoviesInfosFile(filePath) {
    try {
      const response = await fetch(filePath);
      const movies_map = await response.json();
      return movies_map;
    } catch (err) {
      console.error('Error:', err);
    }
  }

async function readMoviesFile(filePath) {
    try {
      const response = await fetch(filePath);
      const movies_map = await response.json();
      return movies_map;
    } catch (err) {
      console.error('Error:', err);
    }
}

async function readInfoActor(filePath) {
    try {
      const response = await fetch(filePath);
      const infoActor = await response.json();
      return infoActor;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async function readInfoDirector(filePath) {
    try {
      const response = await fetch(filePath);
      const infoDirector = await response.json();
      return infoDirector;
    } catch (err) {
      console.error('Error:', err);
    }
  }

function processActorNames(actors_map) {
    const actors_names = Object.keys(actors_map);
    return actors_names;
}

let maxNodes = 20; // Initial value
let actors_map, directors_map, directors_movies, movies_map, info_actor, info_director, movies_info_map, actorPopularityMap, directorPopularityMap;

async function setup() {
    const [actors_map, directors_map, directors_movies, movies_map, info_actor, info_director, movies_info_map, actorPopularityMap, directorPopularityMap] = await Promise.all([
        readActorsFile(actorsPath),
        readDirectorsFile(directorsPath),
        readDirectorsMoviesFile(directorsMoviesPath),
        readMoviesFile(moviesPath),
        readInfoActor(infoActorPath),
        readInfoDirector(infoDirectorPath),
        readMoviesInfosFile(moviesInfosPath),
        readMoviesInfosFile(mostPopularActorPath),
        readMoviesInfosFile(mostPopularDirectorPath)
    ]);

    const actors_names = processActorNames(actors_map);

    const actorInput = document.getElementById("actor-input");
    const searchBtn = document.getElementById("search-btn");
    const graphType = document.getElementById("graph-type");

    var graph_type = graphType.value;
    var popularityMap = actorPopularityMap;

    const updateAndDisplay = (actorName) => {
        if (actorName) {

            const actorsInfo = updateGraph(actorName, actors_map, info_actor, info_director, movies_map, movies_info_map, directors_map, popularityMap, directors_movies, graph_type);
            displayActorInfo(actorName, actorsInfo, movies_map, directors_map);
        }
    };

    actorInput.addEventListener("input", function () {
        let timeout = null;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const input = this.value.trim().toLowerCase();
            const matchingActors = actors_names.filter(actor_name => actor_name.toLowerCase().includes(input));
            updateActorSuggestions(matchingActors);
        }, 500);
    });

    graphType.addEventListener("change", function () {
        graph_type = this.value;
        popularityMap = this.value === "actor" ? actorPopularityMap : directorPopularityMap;
        updateAndDisplay(actorInput.value.trim());
    });

    document.getElementById("node-slider").addEventListener("input", function () {
        // Update node count display
        document.getElementById("node-count").textContent = `Node count: ${this.value}`;
    });
    
    document.getElementById("node-slider").addEventListener("change", function () {
        maxNodes = this.value;
        updateAndDisplay(actorInput.value.trim());
    });
    

    searchBtn.addEventListener("click", function () {
        updateAndDisplay(actorInput.value.trim());
    });

    // Set the default value
    actorInput.value = "Heath Ledger";
    // Update and display the graph with default actor
    updateAndDisplay("Heath Ledger");
}

function updateGraphWithInputs() {
    // Retrieve current inputs
    const actorName = document.getElementById("actor-input").value.trim();
    const graphTypeValue = document.getElementById("graph-type").value;

    // Update the graph
    if (actorName) {
        const actorsInfo = updateGraph(actorName, actors_map, info_actor, info_director, movies_map, movies_info_map, directors_map, popularityMap, graphTypeValue);
        displayActorInfo(actorName, actorsInfo, movies_map, directors_map);
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    const slider = document.getElementById("node-slider");
    const nodeCount = document.getElementById("node-count");

    slider.addEventListener("change", function () {
        maxNodes = this.value;
        nodeCount.textContent = `Node count: ${maxNodes}`;
        updateGraphWithInputs();  // Update the graph without re-setting event listeners
    });

    setup();  // Set up event listeners and load data only once
});



function updateGraph(actorName, actors_map, info_actor, info_director, movies_map, movies_info_map, directors_map, actorPopularityMap, directors_movies, graph_type){
    
    if (graph_type == "actor"){
        var actorOrDirectorMap = actors_map
        var infoActorOrDirector = info_actor
    }
    else{
        var actorOrDirectorMap = directors_map
        var infoActorOrDirector = info_director

    }

    const principal_actor_id = actors_map[actorName] 
    const principal_info_actor = infoActorOrDirector[principal_actor_id]

    var related_actor_ids =  principal_info_actor["Played_with_ids"].slice()
    var related_actor_names = related_actor_ids.map(id => getNameById(id, actorOrDirectorMap));

    related_actor_names.unshift(getNameById(principal_actor_id, actors_map))
    const related_actor_size = related_actor_names.length
    
    const actorAdjacencyMatrix = generateAdjacencyMatrix(related_actor_size, graph_type);
    const actorsInfo = generateActorsInfo(related_actor_size, related_actor_names, infoActorOrDirector, actorOrDirectorMap, actors_map, movies_map, movies_info_map, directors_movies, graph_type);
    const actorSharedMoviesMatrix = initializeActorSharedMoviesMatrix(related_actor_size, related_actor_names, infoActorOrDirector, actorOrDirectorMap, movies_map, principal_actor_id);
    
    drawGraph(actorName, related_actor_names, actorAdjacencyMatrix, actorsInfo, actorSharedMoviesMatrix, movies_map, directors_map, actorPopularityMap, graph_type);

    return actorsInfo;
}

function updateActorSuggestions(actors) {
    const dataList = document.getElementById("actors-list");
    dataList.innerHTML = ""; // Clear the existing suggestions
  
    actors.forEach(actor => {
      const option = document.createElement("option");
      option.value = actor;
      dataList.appendChild(option);
    });
  }

function generateAdjacencyMatrix(size, graph_type) {
    if(graph_type == "director"){
        size = size + 1;
    }
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // Don't create connections to self
            if (i == 0 || j == 0) {
                row.push(1);
            } else {
                // Generate a random value of either 0 or 1
                row.push(0);
            }

        }
        matrix.push(row);
    }
    
    for (let i = 0; i < size; i++){
        for (let j = i; j < size; j++){
            matrix[j][i] = matrix[i][j] 
        }
    } 
    return matrix;
}

function initializeActorSharedMoviesMatrix(size, related_actor_names, infoActorOrDirector, actorOrDirectorMap, movies_map, principal_actor_id) {
    const shared_matrix = [];

    for (let i = 1; i < size; i++) {
        const actorName = related_actor_names[i];
        const actorId = getIdByName(actorName, actorOrDirectorMap)
        
        shared_movies = infoActorOrDirector[principal_actor_id][actorId].map(m_id => getNameById(m_id, movies_map))
        shared_matrix.push(shared_movies);
        
    }
    shared_matrix.unshift([])
    return shared_matrix;
}


function getNameById(id, nameIdMapping) {
    for (const [name, idInMapping] of Object.entries(nameIdMapping)) {
      if (idInMapping === id) {
        return name;
      }
    }
    return null; // return null if the ID is not found in the mapping
  }

  function getIdByName(name_input, nameIdMapping) {
    for (const [name, id] of Object.entries(nameIdMapping)) {
      if (name === name_input) {
        return id;
      }
    }
    return null; // return null if the ID is not found in the mapping
  }

  function generateActorsInfo(size, related_actor_names, infoActorOrDirector, actorOrDirectorMap, actors_map, movies_map, movie_info_map, directors_movies, graph_type) {
    const actorsInfo = {};
    var related_actor_names_unique = [...new Set(related_actor_names)];

    for (let i = 0; i <= size; i++) {
        if (i == 0){
            var corresponding_map = actors_map;
        }
        else{
            var corresponding_map = actorOrDirectorMap;
        }
        const actorName = related_actor_names_unique[i];
        const actorId = getIdByName(actorName, corresponding_map);
        
        const available_ids = Object.keys(infoActorOrDirector);


        if (actorId in available_ids){
            if ((graph_type == "actor") || (i == 0)){
                var Own_movies_ids = infoActorOrDirector[actorId]["Own_movies"];
                var Own_movies_title = infoActorOrDirector[actorId]["Own_movies"].map(m_id => getNameById(m_id, movies_map));
            }
            else{
                var Own_movies_ids = directors_movies[actorId];
                var Own_movies_title = directors_movies[actorId].map(m_id => getNameById(m_id, movies_map));
            }
        }
        else{
            // Convert the hardcoded movie titles to movie IDs using movies_map
            var Own_movies_ids = ["Inception", "Interstellar", "To be updated"].map(title => movies_map[title]);
        }

        const listOfMovies = {};
        Own_movies_ids.forEach(movie_id => {
            if (movie_id in movie_info_map) {
                listOfMovies[movie_id] = movie_info_map[movie_id];
            }
        });

        actorsInfo[actorName] = {
            name: actorName,
            id: actorId,
            listOfMovies: listOfMovies,
            movie_title: Own_movies_title
        };
    }
    return actorsInfo;
}





function countMovieGenres(movies) {
    const genreCounts = {};
    for (const movieData of Object.values(movies)) {
        for (const genre of movieData.genres) {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
    }
    return genreCounts;
}

let last_sorted_val;

function displayActorInfo(actorName, actorsInfo, movie_map, directors_map) {
    const actor = actorsInfo[actorName];
    var list_actor_mean_genre = []
    console.log("actor info: ", actorsInfo)
    const keys = Object.keys(actorsInfo);

    for (let index in keys.slice(0, maxNodes)) {
        let actors = keys[index];
        list_actor_mean_genre.push(countMovieGenres(actorsInfo[actors].listOfMovies))
    }
    let genreSum = {}; // Object to store sum of each genre
    let genreCount = {}; // Object to store count of each genre

    for(let actor_genre of list_actor_mean_genre){
        for(let genre in actor_genre){
            if(genre in genreSum){
                genreSum[genre] += actor_genre[genre]; // Add to sum
                genreCount[genre] += 1; // Increment count
            } else {
                genreSum[genre] = actor_genre[genre]; // Initialize sum
                genreCount[genre] = 1; // Initialize count
            }
        }
    }
    let genreMean = {};
    for(let genre in genreSum){
        genreMean[genre] = genreSum[genre] / genreCount[genre]; // Calculate mean
    }

    if (actor) {
        document.getElementById("actor-info").innerHTML = `
            <h2>${actorName}</h2>
            <p>Movies:</p>
            <div style="max-height: 400px; overflow-y: auto;">
                <ul>
                    ${actor.movie_title.sort().map(title => `<li>${title.replace(/^\d+,\s*/g, '')}</li>`).join('')}
                </ul>
            </div>
        `;

        // Count movie genres
        const genreCounts = countMovieGenres(actor.listOfMovies);

        // Filter genreCounts to only include genres that the actor has played in
        const filteredGenreCounts = {};
        for (const [genre, count] of Object.entries(genreCounts)) {
            if (count > 0 && genre != "Drama") {
                filteredGenreCounts[genre] = count;
            }
        }

        const filteredMeanGenreCounts = {};
        for (const [genre, count] of Object.entries(genreMean)) {
            if (count > 0 && genre != "Drama") {
                filteredMeanGenreCounts[genre] = count;
            }
        }
        // Create radar chart
        drawRadarChart(filteredGenreCounts,filteredMeanGenreCounts);

        // Make radar chart section visible
        document.getElementById("radar-chart-section").style.display = "block";

        // Create timeline chart
        drawTimelineChart(actor.listOfMovies);

        // Make timeline chart section visible
        document.getElementById("timeline-chart-section").style.display = "block";


        // Display movie images
        function displaySortedMovies(sortBy) {
            const movieImagesContainer = document.getElementById("movie-chart");
            movieImagesContainer.innerHTML = ""; // Clear existing images


            let sortedMovies;

            switch (sortBy) {
                case 'date':
                    sortedMovies = Object.entries(actor.listOfMovies).sort((a, b) => a[1].date - b[1].date);
                    last_sorted_val = 'date'
                    break;
                case 'imdbRating':
                    sortedMovies = Object.entries(actor.listOfMovies).sort((a, b) => b[1].info.imdbRating - a[1].info.imdbRating);
                    last_sorted_val = 'imdbRating'

                    break;
                case 'Runtime':
                    sortedMovies = Object.entries(actor.listOfMovies).sort((a, b) => {
                        const runtimeA = parseInt(a[1].info.Runtime.split(' ')[0]);
                        const runtimeB = parseInt(b[1].info.Runtime.split(' ')[0]);
                        return runtimeB - runtimeA;
                    });
                    last_sorted_val = 'Runtime'

                    break;
                case 'Box_office':
                    sortedMovies = Object.entries(actor.listOfMovies).sort((a, b) => {
                        const boxOfficeA = parseInt(a[1].info.Box_office.replace(/[^0-9.-]+/g,""));
                        const boxOfficeB = parseInt(b[1].info.Box_office.replace(/[^0-9.-]+/g,""));
                        return boxOfficeB - boxOfficeA;
                    });
                    last_sorted_val = 'Box_office'

                    break;
                default: 
                    sortedMovies = Object.entries(actor.listOfMovies).sort(([title1, movie1], [title2, movie2]) => {
                        let name1 = getNameById(parseInt(title1), movie_map);
                        let name2 = getNameById(parseInt(title2), movie_map);
                        return name1.localeCompare(name2);
                    });
                    last_sorted_val = 'alphabetical'

                    break;
            }

            let firstMovieTitle = null;
            let firstMovie = null;

            for (const [title, movie] of sortedMovies) {
                const imgElement = document.createElement("img");
                imgElement.src = "movie_poster_per_year/"+ movie.date + "/"+  movie.image;
                imgElement.alt = title;
                imgElement.style.width = "150px";
                imgElement.style.height = "230px";
                imgElement.style.margin = "10px";

                // Add click event listener to display movie information
                imgElement.addEventListener("click", function () {
                    displayMovieInfo(title, movie, movie_map, directors_map);
                });

                movieImagesContainer.appendChild(imgElement);

                if (firstMovieTitle === null && firstMovie === null) {
                    firstMovieTitle = title;
                    firstMovie = movie;
                }
            }

            // Make movie images section visible
            document.getElementById("movie-images-container").style.display = "block";

            // Display the first movie's information by default
            if (firstMovieTitle !== null && firstMovie !== null) {
                displayMovieInfo(firstMovieTitle, firstMovie, movie_map, directors_map);
            }
        }

        // Initial display of movies sorted by title
        displaySortedMovies(last_sorted_val);

        // Event listener for the sort-selector
        document.getElementById("sort-selector").addEventListener("change", function() {
            displaySortedMovies(this.value);
        });
    }
}

function displayMovieInfo(title, movie, movie_map, directors_map) {
    const movieInfoElement = document.getElementById("movie-info");

    movieInfoElement.innerHTML = `
        <h3>${getNameById(parseInt(title), movie_map)}</h3>
        <p>Director: ${movie.info.Director.map(d_id => getNameById(parseInt(d_id), directors_map))}</p>
        <p>Writer: ${movie.info.Writer}</p>
        <p>Release Date: ${movie.date}</p>        
        <p>Runtime: ${movie.info.Runtime}</p>
        <p>Box_office: ${movie.info.Box_office}</p>
        <p>Language: ${movie.info.Language}</p>
        <p>Country: ${movie.info.Country}</p>
        <p>Awards: ${movie.info.Awards}</p>
        <p>imdbRating: ${movie.info.imdbRating}</p>        
    `;

    // Make movie information section visible
    movieInfoElement.style.display = "block";
}






function drawRadarChart(genreCounts, MeanGenreCounts) {
    // Prepare data for radar chart


    const labels = Object.keys(genreCounts);
    const data = Object.values(genreCounts);
    const total_data_count = data.reduce((partialSum, a) => partialSum + a, 0)

    const data_normalized = data.map(a => a / total_data_count)

    let meanData = [];

    // For each genre in the genreCounts, find the corresponding mean value
    for (let i = 0; i < labels.length; i++) {
        meanData.push(MeanGenreCounts[labels[i]] || 0);
    }
    const total_meandata_count = meanData.reduce((partialSum, a) => partialSum + a, 0)
    const meandata_normalized = meanData.map(a => a / total_meandata_count)

    var maxValue = Math.max(...data_normalized, ...meandata_normalized)
    // Clear existing chart if any
    const radarChartElement = document.getElementById("radar-chart");
    radarChartElement.innerHTML = "<canvas></canvas>";
    const ctx = radarChartElement.querySelector("canvas").getContext("2d");

    // Create radar chart
    const radarChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Selected Actor's Genre Distribution",
                    data: data_normalized,
                    backgroundColor: "rgba(76, 175, 80, 0.2)", // green color
                    borderColor: "rgba(76, 175, 80, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Average Genre Distribution of other displayed actors",
                    data: meandata_normalized,
                    backgroundColor: "rgba(255, 0, 0, 0.2)", // red color
                    borderColor: "rgba(255, 0, 0, 1)",
                    borderWidth: 1,
                }
            ]
        },
        options: {
            scales: {
                r: {
                    min: 0,                    
                    max: maxValue, // Set the maximum value for the radial scale
                    beginAtZero: true,
                    angleLines: {
                        display: false // Hides the labels around the radar chart
                    },
                    ticks: {
                        display: false, // Hide the integer labels of the indentation lines
                        stepSize: maxValue / 5,
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Genre Distribution'
                }
            }

        }
    });
}

function drawTimelineChart(movies) {
    const genreColorMap = {
            'Action': "rgba(230, 25, 75, 1)",
            'Adventure': "rgba(60, 180, 75, 1)",
            'Animation': "rgba(255, 225, 25, 1)",
            'Biography': "rgba(67, 99, 216, 1)",
            'Comedy': "rgba(245, 130, 49, 1)",
            'Crime': "rgba(145, 30, 180, 1)",
            'Documentary': "rgba(66, 212, 244, 1)",
            //'Drama': "rgba(240, 50, 230, 1)",
            'Family': "rgba(128, 128, 128, 1)",
            'Fantasy': "rgba(210, 245, 60, 1)",
            'History': "rgba(250, 190, 190, 1)",
            'Horror': "rgba(0, 128, 128, 1)",
            'Music': "rgba(230, 190, 255, 1)",
            'Musical': "rgba(170, 110, 40, 1)",
            'Mystery': "rgba(255, 250, 200, 1)",
            'News': "rgba(128, 0, 0, 1)",
            'Romance': "rgba(170, 255, 195, 1)",
            'Sci-Fi': "rgba(128, 128, 0, 1)",
            'Short': "rgba(255, 215, 180, 1)",
            'Sport': "rgba(0, 0, 128, 1)",
            'Thriller': "rgba(255, 180, 30, 1)",
            'War': "rgba(102, 102, 102, 1)",
            'Western': "rgba(255, 255, 255, 1)"
    };
    
   
    
    // Calculate genre counts for each movie
    const genreCounts = {};
    const years_list = [];
    const genre_list = []
    
    for (const movie of Object.values(movies)) {
        const year = parseInt(movie.date);
        if (!genreCounts[year]) {
            genreCounts[year] = {};
        }
    
        if (years_list.length === 0) {
            years_list.push(year);
            for (const genre of movie.genres) {
                if(genre != "Drama"){
                    if (!genreCounts[year][genre]) {
                        genreCounts[year][genre] = 0;
                        genre_list.push(genre)
                    }
                    genreCounts[year][genre]++;
                }

            }
        } else {
            const last_year = Math.max(...years_list);
            years_list.push(year);
            genreCounts[year] = Object.assign({}, genreCounts[last_year])
            for (const genre of movie.genres) {
                if(genre != "Drama"){

                    if (!genre_list.includes(genre)) {
                        genreCounts[year][genre] = 0;
                        genre_list.push(genre)

                    } else {
                        genreCounts[year][genre] = genreCounts[last_year][genre];
                    }
                    
                    genreCounts[year][genre]++;
                }
            }
        }
    }
    

    let maxCount = 0;
    for (const yearData of Object.values(genreCounts)) {
        for (const genre in yearData) {
            if (yearData.hasOwnProperty(genre)) {
                maxCount = Math.max(maxCount, yearData[genre]);
            }
        }
    }

    const lineChartDatasets = Object.entries(genreColorMap)
    .filter(([genre]) => {
        return Object.values(movies).some(movie => movie.genres.includes(genre));
    })
    .map(([genre, color], index) => {
        const borderColor = color.replace(/[\d.]+\)$/g, '0.3)'); // Set the opacity to 20%
        const fillColor = color.replace(/[\d.]+\)$/g, '0)');
        return {
            label: genre,
            data: Object.values(movies).map(movie => {
                return {
                    x: parseInt(movie.date),
                    y: genreCounts[parseInt(movie.date)][genre] || 0,
                    genre: genre
                };
            }),
            backgroundColor: fillColor,
            borderColor: borderColor,
            stepped: true, // Set the step property
            fill: false,
            tension: 0, // Set tension to 0 for straight lines
            showLine: true,
            pointRadius: 0, // Hide points on the line chart
            opacity: 0.3 // Set initial opacity to 0.2
        };
    });

    const scatterChartDataset = {
        label: "Movies",
        data: Object.values(movies).map(movie => {
            return {
                x: parseInt(movie.date),
                y: 0,
            };
        }),
        backgroundColor: "#000",
        pointRadius: 7,
        pointHoverRadius: 10
    };

    // Clear existing chart if any
    const timelineChartElement = document.getElementById("timeline-chart");
    timelineChartElement.innerHTML = "<canvas></canvas>";
    const ctx = timelineChartElement.querySelector("canvas").getContext("2d");

    // Create line and scatter chart
    const timelineChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [...lineChartDatasets, scatterChartDataset]
        },
        options: {
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    title: {
                        display: true,
                        text: "Year"
                    }
                },
                y: {
                    type: "linear",
                    min: 0,
                    max: maxCount, // Set the maximum value for the y-axis
                    title: {
                        display: true,
                        text: "Genre Count"
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            console.log(ctx);
                            let label = ctx.dataset.labels[ctx.dataIndex];
                            label += " (" + ctx.parsed.x + ", " + ctx.parsed.y + ")";
                            return label;
                        }
                    }
                },
                legend: {
                    position: "top",
                    onClick: function (e, legendItem) {
                        const index = legendItem.datasetIndex;
                        const chart = this.chart;
                        const dataset = chart.data.datasets[index];
                    
                        // Toggle the opacity of the clicked dataset
                        if (dataset.opacity === undefined) {
                            dataset.opacity = 0.2;
                        } else {
                            dataset.opacity = undefined;
                        }
                    
                        // Change the opacity of the dataset's borderColor
                        dataset.borderColor = dataset.borderColor.replace(/[\d.]+\)$/g, `${dataset.opacity === undefined ? 1 : dataset.opacity})`);
                    
                        // Toggle the fill status and set the fill color with the same opacity as the line
                        if (dataset.opacity === undefined) {
                            dataset.fill = true;
                            dataset.fillColor = dataset.borderColor.replace(/[\d.]+\)$/g, '0.1)');
                        } else {
                            dataset.fill = false;
                            dataset.fillColor = dataset.borderColor.replace(/[\d.]+\)$/g, '0)');
                        }
                    
                        dataset.backgroundColor = dataset.fillColor;
                        chart.update();
                    
                        // Filter movie covers based on the selected genres
                        const selectedGenres = this.chart.data.datasets
                            .filter(dataset => dataset.opacity === undefined)
                            .map(dataset => dataset.label);
                    
                        filterMovieCovers(movies, selectedGenres);
                    }
                    
                },
                
                
                title: {
                    display: true,
                    text: 'Timeline of Movies and Genre Proportions'
                }
                
            }
            
            
        }        
    });
}

function filterMovieCovers(movies, selectedGenres) {
    console.log("selected genres :", selectedGenres )
    const movieImagesContainer = document.getElementById("movie-images-container");
    const images = movieImagesContainer.getElementsByTagName("img");

    for (let img of images) {
        const movieTitle = img.src.slice(-13);
        const movie = Object.values(movies).find(movie => movie.image === movieTitle);

        // Check if the movie belongs to any of the selected genres
        const movieInSelectedGenres = movie.genres.some(genre => selectedGenres.includes(genre));

        // If no genres are selected or the movie belongs to a selected genre, display the movie poster
        img.style.display = (selectedGenres.length === 1 || movieInSelectedGenres) ? "inline-block" : "none";
    }
}

function generateRandomAdjacencyMatrix(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Don't create connections to self
        if (i === j) {
          row.push(0);
        } else {
          // Generate a random value of either 0 or 1
          row.push(Math.round(Math.random()));
        }
      }
      matrix.push(row);
    }
    return matrix;
  }
        //drawGraph(actorName, related_actor_names, actorAdjacencyMatrix, actorsInfo, actorSharedMoviesMatrix, movies_map, directors_map, actorPopularityMap, graph_type);

function drawGraph(actorName, actors, adjacencyMatrix, actorsInfo, sharedMoviesMatrix, movie_map, directors_map, actorPopularityMap, graph_type) {
    
    
    const graphData = generateGraphData(actorName, actors, adjacencyMatrix, actorPopularityMap, graph_type );


    if (!graphData) {
        return;
    }

    // Clear existing graph if any
    document.getElementById("graph").innerHTML = "";

    // Set up the SVG container for the graph
    const svg = d3.select("#graph").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "-400 -400 800 800");

    // Create links (lines) between connected nodes (actors)
    const linkGroup = svg.append("g").attr("class", "links");
    const links = linkGroup.selectAll("line")
        .data(graphData.links)
        .enter()
        .append("line")
        .style("stroke", "#999")
        .style("stroke-opacity", 0.6)
        .style("stroke-width", 6);

        links.each(function (d) {
            this.addEventListener("click", function () {
                displaySharedMoviesInfo(d.source.name, d.target.name, sharedMoviesMatrix, actors);
            });
        });
    // Create nodes (circles) for each actor
    actor_color = "#8c90d1"
    director_color = "#73b379"
    principale_actor_color = "#ff0000"

    if (graph_type == "actor"){
        chosen_color = actor_color
    }
    else{

        chosen_color = director_color
    }

    const nodes = svg.selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => d.name === actorName ? 30 : 25) // Increase the radius of the circles
    .attr("fill", (d) => d.name === actorName ? principale_actor_color : chosen_color)
    .attr("fill-opacity", (d) => d.name === actorName ? 0.9 : 0.7) // Make the center more transparent
    .attr("stroke", (d) => d.name === actorName ? principale_actor_color : chosen_color) // Add a black border
    .attr("stroke-width", 3); // Make the border 2 pixels wide


    // Add the click event listener to each node
    nodes.each(function (d) {
        this.addEventListener("click", function () {
            displayActorInfo(d.name, actorsInfo, movie_map, directors_map);
           
            if (d.name != actorName) {
                displaySharedMoviesInfo(actorName, d.name, sharedMoviesMatrix, actors);
            }
        });

        this.addEventListener("dblclick", function () {
            handleNodeDoubleClick(d.name);
        });

    });

    function handleNodeDoubleClick(newActorName) {

        // Update the input field with the new actor's name
        document.getElementById("actor-input").value = newActorName;

        // Trigger the search button click event
        document.getElementById("search-btn").click();
    }

    
    const sharedMoviesScale = d3.scaleLinear().domain([1, 10]).range([200, 50]);

    

    // Add actor names as labels
    const labels = svg.selectAll("text")
        .data(graphData.nodes)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(d => d.name)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#0");  // Changed font color to white to contrast with the dark background


    // Set up the force simulation for the graph layout
    const simulation = d3.forceSimulation(graphData.nodes)
        .force("charge", d3.forceManyBody().strength(-300))
        .force("link", d3.forceLink(graphData.links).distance(d => sharedMoviesScale(d.sharedMovies)))
        .force("center", d3.forceCenter())
        .on("tick", ticked);
  
    function ticked() {
        // Update the position of the nodes and links
        nodes.attr("cx", d => d.x).attr("cy", d => d.y);
        links.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        labels.attr("x", d => d.x).attr("y", d => d.y);
    }
}

function displaySharedMoviesInfo(actor1, actor2, sharedMoviesMatrix, actors) {
    var unique = actors.filter((value, index, array) => array.indexOf(value) === index);

    const index = unique.indexOf(actor2);


    if (index !== -1) {
        const sharedMovies = sharedMoviesMatrix[index];
        document.getElementById("shared-movies-info").style.display = "block";
        document.getElementById("shared-movies-info").innerHTML = `
            <h3>Shared Movies (${actor1} and ${actor2}):</h3>
            <ul>
                ${sharedMovies.map(movie => `<li>${movie}</li>`).join('')}
            </ul>
        `;
    }
}

function generateGraphData(actorName, actors, adjacencyMatrix, actorPopularityMap, graph_type) {
  
    if (graph_type == "director"){
        actors.unshift(actorName);

    }

    const actorIndex = actors.indexOf(actorName);

    if (actorIndex === -1) {

        return null;
    }

    const nodes = [];
    const links = [];

    // Add the searched actor to the sortedActors array first
    const sortedActors = [{
        name: actorName,
        sharedMovies: 0,
        popularityRank: actorPopularityMap[actorName] || Infinity // Default rank as Infinity for actors not in the list
    }];

    // Sort actors based on the number of shared movies with the search actor
    const remainingActors = actors
        .filter(actor => actor !== actorName) // Exclude the searched actor
        .map((actor, index) => ({
            name: actor,
            sharedMovies: adjacencyMatrix[actorIndex][index],
            popularityRank: actorPopularityMap[actor] || Infinity // Default rank as Infinity for actors not in the list
        }))
        .sort((a, b) => {
            if (a.sharedMovies === b.sharedMovies) {
                // If the sharedMovies are equal, sort by popularity rank
                return a.popularityRank - b.popularityRank;
            } else {
                // Otherwise, sort by sharedMovies
                return b.sharedMovies - a.sharedMovies;
            }
        })
        .slice(0, maxNodes - 1); // Subtract 1 to leave room for the searched actor


    sortedActors.push(...remainingActors);

  
    sortedActors.forEach(sortedActor => {
        nodes.push({ name: sortedActor.name });
    });

    sortedActors.forEach(sortedActor => {
        const targetIndex = actors.indexOf(sortedActor.name);
        if (adjacencyMatrix[actorIndex][targetIndex] === 1 && targetIndex !== actorIndex) {
            const sourceNode = nodes.find((nodes) => nodes.name === actorName);
            const targetNode = nodes.find((nodes) => nodes.name === sortedActor.name);
            
            links.push({ source: sourceNode, target: targetNode, sharedMovies: sortedActor.sharedMovies });
        }
    });

    return {
        nodes: nodes,
        links: links,
    };
}


