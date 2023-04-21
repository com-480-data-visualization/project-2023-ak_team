

const actorsPath = 'test_small_map_actors.json';
const moviesPath = 'test_small_map_movies.json';
const infoDictPath = 'test_big_sample.json'

async function readActorsFile(filePath) {
  try {
    const response = await fetch(filePath);
    const actors_map = await response.json();
    return actors_map;
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

    const actors_names = processActorNames(actors_map);
  
    // Generate the actors list
    //updateActorSuggestions(actors_names);
    
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
            
            // Replace this with your adjacency matrix data
            const adjacencyMatrix = generateAdjacencyMatrix(size);
            //const adjacencyMatrix = generateFixedAdjacencyMatrix(size);
            // Replace this with your list of actor names
            const actorsInfo = generateActorsInfo(size, related_actor_names, info_dict, actors_map, movies_map);
            // Initialize shared movies matrix
            const sharedMoviesMatrix = initializeSharedMoviesMatrix(size, related_actor_names, info_dict, actors_map, movies_map, principal_actor_id);
        

            console.log("Related actors: ", related_actor_names)
            drawGraph(actorName, related_actor_names, adjacencyMatrix, actorsInfo, sharedMoviesMatrix);
        }
    });
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

// Add this function to your JavaScript code
function updateActorSuggestions(actors) {
    const dataList = document.getElementById("actors-list");
    dataList.innerHTML = ""; // Clear the existing suggestions
  
    actors.forEach(actor => {
      const option = document.createElement("option");
      option.value = actor;
      dataList.appendChild(option);
    });
  }

function generateActorsList(size) {
    const actors = [];
    for (let i = 1; i <= size; i++) {
        actors.push("Actor " + i);
    }
    return actors;
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
function generateActorsInfo(size, related_actor_names, info_dict, actors_map, movies_map) {
    const actorsInfo = {};

    for (let i = 0; i <= size; i++) {
        const actorName = related_actor_names[i];
        const actorId = getIdByName(actorName, actors_map)
        
        const available_ids = Object.keys(info_dict)

        if (actorId in available_ids){
            var Own_movies = info_dict[actorId]["Own_movies"].map(m_id => getNameById(m_id, movies_map))
        }
        else{
            var Own_movies = ["Inception", "Interstellar", "To be updated"]
        }

        actorsInfo[actorName] = {
            name : actorName,
            id : actorId,
            listOfMovies: Own_movies
        };
    }
    return actorsInfo;
}

function displayActorInfo(actorName, actorsInfo) {
    const actor = actorsInfo[actorName];
    if (actor) {
        document.getElementById("actor-info").innerHTML = `
            <h2>${actorName}</h2>
            <p>Name: ${actor.name}</p>
            <p>Id: ${actor.id}</p>
            <p>Movies:</p>
            <ul>
                ${actor.listOfMovies.map(movie => `<li>${movie}</li>`).join('')}
            </ul>
        `;
    }
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



function drawGraph(actorName, actors, adjacencyMatrix, actorsInfo, sharedMoviesMatrix) {
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
        .attr("viewBox", "-400 -400 800 800"); // Change the viewBox attribute values here


    // Create links (lines) between connected nodes (actors)
    const linkGroup = svg.append("g").attr("class", "links");
    const links = linkGroup.selectAll("line")
        .data(graphData.links)
        .enter()
        .append("line")
        .style("stroke", "#999")
        .style("stroke-opacity", 0.6)
        .style("stroke-width", 8);

    // Add the click event listener to each link
    links.each(function (d) {
        this.addEventListener("click", function () {
            console.log("Clicked link:", d.source.name, d.target.name);
            displaySharedMoviesInfo(d.source.name, d.target.name, sharedMoviesMatrix, actors);
        });
    });

    // Create nodes (circles) for each actor
    const nodeGroup = svg.append("g").attr("class", "nodes");
    const nodes = nodeGroup.selectAll("circle")
        .data(graphData.nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("fill", (d) => d.name === actorName ? "#ff0000" : "#1f77b4");

    // Add the click event listener to each node
    nodes.each(function (d) {
        this.addEventListener("click", function () {
            console.log("Clicked:", d.name);
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


    const simulation = d3.forceSimulation(graphData.nodes)
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("link", d3.forceLink(graphData.links).distance(300))
        .force("x", d3.forceX(0))
        .force("y", d3.forceY(0))
        .on("tick", () => {
            // Update the positions of the nodes and links during the simulation
            nodes
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
    
            links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
    
            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

}
        


function generateGraphData(actorName, actors, adjacencyMatrix) {
    const actorIndex = actors.indexOf(actorName);

    if (actorIndex === -1) {
        return null;
    }

    const nodes = [];
    const links = [];

    for (let i = 0; i < actors.length; i++) {
        if (adjacencyMatrix[actorIndex][i] === 1 || i === actorIndex) {
            nodes.push({ name: actors[i] });
        }
    }

    for (let i = 0; i < actors.length; i++) {
        if (adjacencyMatrix[actorIndex][i] === 1 && i !== actorIndex) {
            links.push({
                source: nodes.find(node => node.name === actorName),
                target: nodes.find(node => node.name === actors[i]),
            });
        }
    }

    console.log("Nodes: ", nodes)
    console.log("Links: ", links)
    return {
        nodes: nodes,
        links: links,
    };
}

main();


