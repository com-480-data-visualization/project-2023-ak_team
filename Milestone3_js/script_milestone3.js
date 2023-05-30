const actorsPath = 'map_actors.json';
const directorsPath = 'map_directors.json';
const moviesPath = 'map_movies.json';
const infoActorPath = 'all_actors_info.json'
const infoDirectorPath = 'all_directors_info.json'
const moviesInfosPath = 'movie_info_map.json'
const mostPopularActorPath = 'most_famous_actor.json'
const directorsMoviesPath = 'directors_movies.json'

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

let maxNodes = 12; // Initial value

async function setup() {
    const [actors_map, directors_map, directors_movies, movies_map, info_actor, info_director, movies_info_map, actorPopularityMap] = await Promise.all([
        readActorsFile(actorsPath),
        readDirectorsFile(directorsPath),
        readDirectorsMoviesFile(directorsMoviesPath),
        readMoviesFile(moviesPath),
        readInfoActor(infoActorPath),
        readInfoDirector(infoDirectorPath),
        readMoviesInfosFile(moviesInfosPath),
        readMoviesInfosFile(mostPopularActorPath)
    ]);

    const actors_names = processActorNames(actors_map);

    const actorInput = document.getElementById("actor-input");
    const searchBtn = document.getElementById("search-btn");
    const graphType = document.getElementById("graph-type");

    var graph_type = graphType.value;
    var info_dict = graph_type.value === "actor" ? info_actor : info_director;

    const updateAndDisplay = (actorName) => {
        if (actorName) {
            const actorsInfo = updateGraph(actorName, actors_map, info_dict, movies_map, movies_info_map, directors_map, actorPopularityMap, graph_type);
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
        info_dict = this.value === "actor" ? info_actor : info_director;
        console.log(info_dict)
        updateAndDisplay(actorInput.value.trim());
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

    // Determine info dictionary
    var info_dict = graphTypeValue == "actor" ? info_actor : info_director;

    // Update the graph
    if (actorName) {
        const actorsInfo = updateGraph(actorName, actors_map, info_dict, movies_map, movies_info_map, directors_map, actorPopularityMap, graphTypeValue);
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



function updateGraph(actorName, actors_map, info_dict, movies_map, movies_info_map, directors_map, actorPopularityMap, graph_type){
    const principal_actor_id = actors_map[actorName] 

    const info_actor = info_dict[principal_actor_id]

    var related_actor_ids =  info_actor["Played_with_ids"].slice()

    related_actor_ids.unshift(principal_actor_id)

    var related_actor_names = related_actor_ids.map(id => getNameById(id, actors_map));

    const related_actor_size = related_actor_names.length
    
    const actorAdjacencyMatrix = generateAdjacencyMatrix(related_actor_size);

    const actorsInfo = generateActorsInfo(related_actor_size, related_actor_names, info_dict, actors_map, movies_map, movies_info_map);

    const actorSharedMoviesMatrix = initializeActorSharedMoviesMatrix(related_actor_size, related_actor_names, info_dict, actors_map, movies_map, principal_actor_id);

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

function generateAdjacencyMatrix(size) {
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

function initializeActorSharedMoviesMatrix(size, related_actor_names, info_dict, actors_map, movies_map, principal_actor_id) {
    const shared_matrix = [];


    for (let i = 1; i < size; i++) {
        const actorName = related_actor_names[i];
        const actorId = getIdByName(actorName, actors_map)
        shared_movies = info_dict[principal_actor_id][actorId].map(m_id => getNameById(m_id, movies_map))
        shared_matrix.push(shared_movies);
        
    }
    shared_matrix.unshift([])
    return shared_matrix;
}

function initializeDirectorSharedMoviesMatrix(size, related_director_names, info_dict, directors_map, movies_map, principal_actor_id) {
    const shared_matrix = [];


    for (let i = 1; i < size; i++) {
        const directorName = related_director_names[i];
        const directorId = getIdByName(directorName, directors_map)
        shared_movies = info_dict[principal_actor_id][1][directorId].map(m_id => getNameById(m_id, movies_map))
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

  function generateActorsInfo(size, related_actor_names, info_dict, actors_map, movies_map, movie_info_map) {
    const actorsInfo = {};

    for (let i = 0; i <= size; i++) {
        const actorName = related_actor_names[i];
        const actorId = getIdByName(actorName, actors_map);
        
        const available_ids = Object.keys(info_dict);

        if (actorId in available_ids){
            var Own_movies_ids = info_dict[actorId]["Own_movies"];
            var Own_movies_title = info_dict[actorId]["Own_movies"].map(m_id => getNameById(m_id, movies_map));
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

function generateDirectorsInfo(size, related_director_names, info_dict, directors_map, movies_map, movie_info_map, directors_movies) {
    const directorsInfo = {};

    for (let i = 0; i <= size; i++) {
        const directorName = related_director_names[i];
        const directorId = getIdByName(directorName, directors_map);
        
        const available_ids = Object.keys(info_dict);
        if (directorId in available_ids){
            var Own_movies_ids = directors_movies[directorId];
            var Own_movies_title = directors_movies[directorId].map(m_id => getNameById(m_id, movies_map));
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

        directorsInfo[directorName] = {
            name: directorName,
            id: directorId,
            listOfMovies: listOfMovies,
            movie_title: Own_movies_title
        };
    }
    return directorsInfo;
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
function displayActorInfo(actorName, actorsInfo, movie_map, directors_map) {
    const actor = actorsInfo[actorName];

    var list_actor_mean_genre = []

    const keys = Object.keys(actorsInfo);
    for (let index in keys) {
    let actors = keys[index];
    list_actor_mean_genre.push(countMovieGenres(actorsInfo[actors].listOfMovies))
    // do something with actor
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
                    ${actor.movie_title.map(title => `<li>${title.replace(/^\d+,\s*/g, '')}</li>`).join('')}
                </ul>
            </div>
        `;
    
    

        // Count movie genres
        const genreCounts = countMovieGenres(actor.listOfMovies);

        // Filter genreCounts to only include genres that the actor has played in
        const filteredGenreCounts = {};
        for (const [genre, count] of Object.entries(genreCounts)) {
            if (count > 0) {
                filteredGenreCounts[genre] = count;
            }
        }

        const filteredMeanGenreCounts = {};
        for (const [genre, count] of Object.entries(genreMean)) {
            if (count > 0) {
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
        const movieImagesContainer = document.getElementById("movie-chart");
        movieImagesContainer.innerHTML = ""; // Clear existing images

        for (const [title, movie] of Object.entries(actor.listOfMovies)) {
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
        }

        // Make movie images section visible
        document.getElementById("movie-images-container").style.display = "block";
    }
}

function displayMovieInfo(title, movie, movie_map, directors_map) {
    const movieInfoElement = document.getElementById("movie-info");

    movieInfoElement.innerHTML = `
        <h3>${getNameById(parseInt(title), movie_map)}</h3>
        <p>Director: ${movie.info.Director.map(d_id => getNameById(parseInt(d_id), directors_map))}</p>
        <p>Writer: ${movie.info.Writer}</p>
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
    let meanData = [];

    // For each genre in the genreCounts, find the corresponding mean value
    for (let i = 0; i < labels.length; i++) {
        meanData.push(MeanGenreCounts[labels[i]] || 0);
    }

    // Calculate the maximum value for the radial scale
    const maxValue = Math.max(...data, ...meanData);

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
                    label: "Actor's Genre Distribution",
                    data: data,
                    backgroundColor: "rgba(76, 175, 80, 0.2)", // green color
                    borderColor: "rgba(76, 175, 80, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Mean Genre Distribution of the other actors",
                    data: meanData,
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
                    max: maxValue+1, // Set the maximum value for the radial scale
                    beginAtZero: true,
                    angleLines: {
                        display: false // Hides the labels around the radar chart
                    },
                    ticks: {
                        display: false, // Hide the integer labels of the indentation lines
                        stepSize: 1,
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
            'Drama': "rgba(240, 50, 230, 1)",
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
    
    // Calculate genre proportions for each movie
    const genreProportions = {};
    const years_list = []

    for (const movie of Object.values(movies)) {
        const year = parseInt(movie.date);

        if (!genreProportions[year]) {
            if (years_list.length != 0){
                prev_year = years_list.slice(-1)[0]
                genreProportions[year] = Object.assign({}, genreProportions[prev_year]);
            }
            else{
                genreProportions[year] = {};
                genreProportions[year]["sum"] = 0;
            }
        }
        years_list.push(year)


        for (const genre of movie.genres) {
            if (!genreProportions[year][genre]) {
                genreProportions[year][genre] = 0;
            }
            genreProportions[year]["sum"]++;
            genreProportions[year][genre]++;
        }

    }

    for (const year in genreProportions) {
        if (genreProportions.hasOwnProperty(year)) {
          const yearData = genreProportions[year];
          const sum = yearData.sum;
      
          for (const genre in yearData) {
            if (yearData.hasOwnProperty(genre) && genre !== 'sum') {
              yearData[genre] /= sum;
            }
          }
        }
      }

    let maxProportion = 0;
    for (const yearData of Object.values(genreProportions)) {
        for (const genre in yearData) {
            if (yearData.hasOwnProperty(genre) && genre !== 'sum') {
                maxProportion = Math.max(maxProportion, yearData[genre]);
            }
        }
    }
      

    // Prepare data for line charts (genre distribution) and scatter chart (movie points)
    const lineChartDatasets = Object.entries(genreColorMap)
    .filter(([genre]) => {
        return Object.values(movies).some(movie => movie.genres.includes(genre));
    })
    .map(([genre, color], index) => {
        const borderColor = color.replace(/[\d.]+\)$/g, '0.2)'); // Set the opacity to 20%
        const fillColor = color.replace(/[\d.]+\)$/g, '0)');
        return {
            label: genre,
            data: Object.entries(movies).map(([_, movie]) => {
                return {
                    x: parseInt(movie.date),
                    y: genreProportions[parseInt(movie.date)][genre] || 0,
                    genre: genre
                };
            }),
            backgroundColor: fillColor,
            borderColor: borderColor,
            fill: false,
            tension: 0, // Set tension to 0 for straight lines
            showLine: true,
            pointRadius: 0, // Hide points on the line chart
            opacity: 0.2 // Set initial opacity to 0.2
        };
    });


    const scatterChartDataset = {
        label: "Movies",
        data: Object.values(movies).map(movie => {
            return {
                x: parseInt(movie.date),
                y: 0
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
                    max: maxProportion, // Set the maximum value for the y-axis
                    title: {
                        display: true,
                        text: "Genre Proportion"
                    },
                    ticks: {
                        callback: function (value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            },
            plugins: {
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
                
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset;
                        if (dataset.label === 'Movies') {
                            const movieIndex = tooltipItem.dataIndex;
                            return movies[movieIndex].title;
                        } else {
                            const genre = dataset.label;
                            const proportion = (tooltipItem.parsed.y * 100).toFixed(0);
                            return `${genre}: ${proportion}%`;
                        }
                    },
                    title: function (tooltipItems) {
                        if (tooltipItems[0].dataset.label === 'Movies') {
                            const movieIndex = tooltipItems[0].dataIndex;
                            return movies[movieIndex].title;
                        } else {
                            return "";
                        }
                    }
                }
            }
        }        
    });
}

function filterMovieCovers(movies, selectedGenres) {
    const movieImagesContainer = document.getElementById("movie-images-container");
    const images = movieImagesContainer.getElementsByTagName("img");

    for (let img of images) {
        const movieTitle = img.src.slice(-13);
        const movie = Object.values(movies).find(movie => movie.image === movieTitle);

        // Check if the movie belongs to any of the selected genres
        const movieInSelectedGenres = movie.genres.some(genre => selectedGenres.includes(genre));

        // If no genres are selected or the movie belongs to a selected genre, display the movie poster
        img.style.display = (selectedGenres.length === 0 || movieInSelectedGenres) ? "inline-block" : "none";
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

function drawGraph(actorName, actors, adjacencyMatrix, actorsInfo, sharedMoviesMatrix, movie_map, directors_map, actorPopularityMap, graph_type) {
    const graphData = generateGraphData(actorName, actors, adjacencyMatrix, actorPopularityMap );

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
        .style("stroke-width", 4.5);

        links.each(function (d) {
            this.addEventListener("click", function () {
                displaySharedMoviesInfo(d.source.name, d.target.name, sharedMoviesMatrix, actors);
            });
        });
    // Create nodes (circles) for each actor
    actor_color = "#1f77b4"
    director_color = "green"
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
        .style("font-weight", "bold");

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
    const index = actors.indexOf(actor2);

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

function generateGraphData(actorName, actors, adjacencyMatrix, actorPopularityMap) {
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



