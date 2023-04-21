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
  
  // Generate the actors list
  const size = 10;
  const actors = generateActorsList(size);
  updateActorSuggestions(actors);
  
  // Add an event listener for the input field
  document.getElementById("actor-input").addEventListener("input", function () {
    const input = this.value.trim().toLowerCase();
  
    // Filter the actors based on the input value
    const matchingActors = actors.filter(actor => actor.toLowerCase().includes(input));
    updateActorSuggestions(matchingActors);
  });
  
  document.getElementById("search-btn").addEventListener("click", function () {
    const actorName = document.getElementById("actor-input").value.trim();
    if (actorName) {
      // Replace this with your adjacency matrix data
      const adjacencyMatrix = generateRandomAdjacencyMatrix(size);
      console.table(adjacencyMatrix)
      //const adjacencyMatrix = generateFixedAdjacencyMatrix(size);
      // Replace this with your list of actor names
      const actorsInfo = generateActorsInfo(size);
  
      // Initialize shared movies matrix
      const sharedMoviesMatrix = initializeSharedMoviesMatrix(size);
  
      drawGraph(actorName, actors, adjacencyMatrix, actorsInfo, sharedMoviesMatrix);
    }
  });
  

function generateActorsList(size) {
    const actors = [];
    for (let i = 1; i <= size; i++) {
        actors.push("Actor " + i);
    }
    return actors;
}

function generateActorsInfo(size) {
    const actorsInfo = {};
    for (let i = 1; i <= size; i++) {
        const actorName = "Actor " + i;
        actorsInfo[actorName] = {
            age: 30,
            listOfMovies: ["Inception", "Interstellar", "Shrek"]
        };
    }
    return actorsInfo;
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
    
    for (let i = 0; i < size; i++){
        for (let j = i; j < size; j++){
            matrix[j][i] = matrix[i][j] 
        }
    } 
    return matrix;
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
        .attr("fill", (d, i) => i === 0 ? "#ff0000" : "#1f77b4");

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
        

function displayActorInfo(actorName, actorsInfo) {
    const actor = actorsInfo[actorName];
    if (actor) {
        document.getElementById("actor-info").innerHTML = `
            <h2>${actorName}</h2>
            <p>Age: ${actor.age}</p>
            <p>Movies:</p>
            <ul>
                ${actor.listOfMovies.map(movie => `<li>${movie}</li>`).join('')}
            </ul>
        `;
    }
}

function initializeSharedMoviesMatrix(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            if (i === j) {
                row.push([]);
            } else {
                row.push(["Shared Movie 1", "Shared Movie 2"]);
            }
        }
        matrix.push(row);
    }
    return matrix;
}


function displaySharedMoviesInfo(actor1, actor2, sharedMoviesMatrix, actors) {
    const index1 = actors.indexOf(actor1);
    const index2 = actors.indexOf(actor2);

    if (index1 !== -1 && index2 !== -1) {
        const sharedMovies = sharedMoviesMatrix[index1][index2];
        document.getElementById("shared-movies-info").style.display = "block";
        document.getElementById("shared-movies-info").innerHTML = `
            <h3>Shared Movies (${actor1} and ${actor2}):</h3>
            <ul>
                ${sharedMovies.map(movie => `<li>${movie}</li>`).join('')}
            </ul>
        `;
    }
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

            if (i !== actorIndex) {
                links.push({
                    source: nodes.find(node => node.name === actorName),
                    target: nodes.find(node => node.name === actors[i]),
                });
            }
        }
    }

    return {
        nodes: nodes,
        links: links,
    };
}



