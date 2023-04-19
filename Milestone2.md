# Vizualisation sketches
## Principal feature: The Actor to Actor Star Graph
In this data visualization project, we want a dynamic star graph centered around a specific actor or director, who was searched for using the search bar. Upon searching, the graph displays a network of interconnected nodes, each representing another actor the searched actor has worked with. Additional controls, such as genre filter buttons and a time cursor, allow users to refine their view of the graph based on movie genres or a specific time period. The interactive and visually appealing design of this star graph offers an intuitive way to explore the extensive career and collaborations of any actor.
![Graph_image](https://user-images.githubusercontent.com/61150130/233065447-b95e6264-96e5-49e5-80c7-fbe8bcfb1502.png)

## Movies Interactive Informations
The nodes in the central graph represent actors or directors, and when clicked, they display a comprehensive list of movies that the selected individual has been a part of, along with the respective movie posters. This feature allows users to easily explore the filmography of each actor or director in the network and discover new movies within their area of interest. The combination of these interactive elements makes the graph an engaging and informative tool for users to dive deep into the world of cinema and its many collaborations.
![image_actor_movie)](https://user-images.githubusercontent.com/61150130/233065672-14bd4e4b-b425-45d0-8711-e556064249e2.png)

The lines connecting the central graph nodes signify collaborations, and when clicked, they reveal detailed information about the movies they've worked on together, along with their posters.
![image_actor_to_actor_movie)](https://user-images.githubusercontent.com/61150130/233065691-c20f466b-2144-43fb-b3ab-9ee297abefe4.png)

# Tools and Lecture 
Creating a graph that links actors and directors:

Tools: D3.js, D3.forceSimulation (for creating a force-directed graph)
Lectures: D3.js, Graphs
Displaying movie posters and data when a link is clicked:

Tools: D3.js (for handling click events and updating the visualization), HTML/CSS (for designing the layout)
Lectures: Interaction in D3.js, D3.js
Filtering by genre:

Tools: D3.js (for updating the visualization based on the selected genre), HTML/CSS (for designing buttons)
Lectures: Interaction in D3.js, D3.js, Tabular Data
Time cursor for filtering movies by date:

Tools: D3.js (for creating a time slider and updating the visualization based on the selected date), HTML/CSS (for designing the time slider)
Lectures: Interaction in D3.js, D3.js, Tabular Data
Adding a search bar for actors and directors:

Tools: D3.js (for filtering the graph based on user input), HTML/CSS (for designing the search bar)
Lectures: Interaction in D3.js, D3.js
Visual design and aesthetics:

Tools: D3.js (for selecting colors and creating visual encodings), HTML/CSS (for designing the overall layout)
Lectures: Perception Colors, Maps, Text Viz
Storytelling with your visualization:

Tools: D3.js (for creating interactive elements that guide users through the story)
Lectures: Storytelling
