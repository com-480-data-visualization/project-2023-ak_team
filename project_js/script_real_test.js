const actorsPath = 'test_small_map_actors.json';
const moviesPath = 'test_small_map_movies.json';
const infoDictPath = 'test_big_sample.json'
const moviesInfosPath = 'movie_info_map.json'

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

async function readInfoDict(filePath) {
    try {
      const response = await fetch(filePath);
      const infoDict = await response.json();
      return infoDict;
    } catch (err) {
      console.error('Error:', err);
    }
  }

function processActorNames(actors_map) {
    const actors_names = Object.keys(actors_map);
    console.log(actors_names);
    return actors_names;
}

async function main() {
    const actors_map = await readActorsFile(actorsPath);
    const movies_map = await readMoviesFile(moviesPath);
    const info_dict = await readInfoDict(infoDictPath);
    const movies_info_map = await readMoviesInfosFile(moviesInfosPath)

    const actors_names = processActorNames(actors_map);
  


    // Add an event listener for the input field
    document.getElementById("actor-input").addEventListener("input", function () {
        const input = this.value.trim().toLowerCase();
    
        // Filter the actors based on the input value
        const matchingActors = actors_names.filter(actors_names => actors_names.toLowerCase().includes(input));
        updateActorSuggestions(matchingActors);
    });

    document.getElementById("search-btn").addEventListener("click", function () {
        const actorName = document.getElementById("actor-input").value.trim(); //value entered in the search bar eg Brad Pitt
        if (actorName) {

            console.log("Actor searched: ", actorName)

            const principal_actor_id = actors_map[actorName] // id of the actor searched --> int 
            console.log("Actor id: ", principal_actor_id)

            const info_actor = info_dict[principal_actor_id] // {played_with_actor1:[film id 1, film id 2, ..], ..., own_movies:[...]}
            console.log("Actor info: ", info_actor)

            var related_actor_ids =  info_actor["Played_with_ids"].slice()// get the ids of the actors he plays with
            related_actor_ids.unshift(principal_actor_id) // we also want the id of the principal actor
            var related_actor_names = related_actor_ids.map(id => getNameById(id, actors_map)); // the actors names

            const size = related_actor_names.length
            
            const adjacencyMatrix = generateAdjacencyMatrix(size);
            const actorsInfo = generateActorsInfo(size, related_actor_names, info_dict, actors_map, movies_map,movies_info_map);
            const sharedMoviesMatrix = initializeSharedMoviesMatrix(size, related_actor_names, info_dict, actors_map, movies_map, principal_actor_id);
        
            drawGraph(actorName, related_actor_names, adjacencyMatrix, actorsInfo, sharedMoviesMatrix);
            
        }
    });
    const timelineChartElement = document.getElementById("timeline-chart");

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

function initializeSharedMoviesMatrix(size, related_actor_names, info_dict, actors_map, movies_map, principal_actor_id) {
    const shared_matrix = [];


    for (let i = 1; i < size; i++) {
        const actorName = related_actor_names[i];
        const actorId = getIdByName(actorName, actors_map)
        //shared_movies = info_dict[principal_actor_id][i].map(m_id => getNameById(m_id, movies_map))
        shared_movies = info_dict[principal_actor_id][actorId].map(m_id => getNameById(m_id, movies_map))
        shared_matrix.push(shared_movies);
        
    }
    shared_matrix.unshift([])
    console.log("Shared matrix:", shared_matrix)
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
        console.log("listOfMovies",listOfMovies)
        actorsInfo[actorName] = {
            name: actorName,
            id: actorId,
            listOfMovies: listOfMovies
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

function displayActorInfo(actorName, actorsInfo) {
    const actor = actorsInfo[actorName];
    console.log("ssss",Object.entries(actor.listOfMovies))
    if (actor) {
        document.getElementById("actor-info").innerHTML = `
            <h2>${actorName}</h2>
            <p>Age: ${actor.age}</p>
            <p>Movies:</p>
            <ul>
                ${Object.entries(actor.listOfMovies).map(([title, _]) => `<li>${title}</li>`).join('')}
            </ul>
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

        // Create radar chart
        drawRadarChart(filteredGenreCounts);

        // Make radar chart section visible
        document.getElementById("radar-chart-section").style.display = "block";

        // Create timeline chart
        drawTimelineChart(actor.listOfMovies);

        // Make timeline chart section visible
        document.getElementById("timeline-chart-section").style.display = "block";

        // Display movie images
        const movieImagesContainer = document.getElementById("movie-chart");
        movieImagesContainer.innerHTML = ""; // Clear existing images

        for (const movie of Object.values(actor.listOfMovies)) {
            const imgElement = document.createElement("img");
            imgElement.src = "movie_images/" + movie.image;
            imgElement.alt = movie.title;
            imgElement.style.width = "150px";
            imgElement.style.height = "230px";
            imgElement.style.margin = "10px";

            movieImagesContainer.appendChild(imgElement);
        }

        // Make movie images section visible
        document.getElementById("movie-images-container").style.display = "block";
    }
}





function drawRadarChart(genreCounts) {
    // Prepare data for radar chart
    const labels = Object.keys(genreCounts);
    const data = Object.values(genreCounts);

    // Calculate the maximum value for the radial scale
    const maxValue = Math.max(...data);

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
                    label: "Genre Distribution",
                    data: data,
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    borderColor: "rgba(76, 175, 80, 1)",
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
        img.style.display = movieInSelectedGenres ? "inline-block" : "none";
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

function drawGraph(actorName, actors, adjacencyMatrix, actorsInfo) {
    const graphData = generateGraphData(actorName, actors, adjacencyMatrix);

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
    const links = svg.selectAll("line")
        .data(graphData.links)
        .enter()
        .append("line")
        .style("stroke", "#999")
        .style("stroke-opacity", 0.6)
        .style("stroke-width", 2);

    // Create nodes (circles) for each actor
    // Create nodes (circles) for each actor
    const nodes = svg.selectAll("circle")
    .data(graphData.nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .attr("fill", (d, i) => i === 0 ? "#ff0000" : "#1f77b4");

    // Add the click event listener to each node
    nodes.each(function (d) {
        this.addEventListener("click", function (event) {
            event.stopPropagation();
            displayActorInfo(d.name, actorsInfo);
        });
    });

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
        .force("link", d3.forceLink(graphData.links).distance(100))
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


function generateGraphData(actorName, actors, adjacencyMatrix) {
    const actorIndex = actors.indexOf(actorName);
    if (actorIndex === -1) {
        alert("Actor not found");
        return null;
    }

    const nodes = [{ name: actorName }];
    const links = [];

    for (let i = 0; i < adjacencyMatrix[actorIndex].length; i++) {
        if (adjacencyMatrix[actorIndex][i] === 1) {
            nodes.push({ name: actors[i] });
            links.push({ source: 0, target: nodes.length - 1 });
        }
    }

    return { nodes, links };
}


main();

