document.getElementById("search-btn").addEventListener("click", function () {
    const actorName = document.getElementById("actor-input").value.trim();
    if (actorName) {
        // Replace this with your adjacency matrix data
        const size = 50;
        const adjacencyMatrix = generateRandomAdjacencyMatrix(size);

        // Replace this with your list of actor names
        const actors = generateActorsList(size);
        const actorsInfo = generateActorsInfo(size);

        drawGraph(actorName, actors, adjacencyMatrix, actorsInfo);
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
        listOfMovies: ["Film 1", "Film 2", "Film 3"]
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

function displayActorInfo(actorName, actorsInfo) {
    const actor = actorsInfo[actorName];
    if (actor) {
        const infoDiv = document.getElementById("actor-info");
        infoDiv.innerHTML = `
            <h2>${actorName}</h2>
            <p>Age: ${actor.age}</p>
            <p>Films:</p>
            <ul>
                ${actor.listOfMovies.map(movie => `<li>${movie}</li>`).join("")}
            </ul>
        `;
    }
}





