# Vizualisation sketches
## Principal feature: The Actor to Actor Star Graph
In this data visualization project, we want a dynamic star graph centered around a specific actor or director, who was searched for using the search bar. 
Upon searching (for exemple Brad Pitt in the picture below), the graph displays a network of interconnected nodes, each representing another actor the searched actor has worked with. Additional controls, such as genre filter buttons and a time cursor, allow users to refine their view of the graph based on movie genres or a specific time period. The interactive and visually appealing design of this star graph offers an intuitive way to explore the extensive career and collaborations of any actor.

    
![image](https://user-images.githubusercontent.com/61150130/234244159-8c7fad11-1dda-4616-92a0-cc52cd813132.png)
The nodes in the central graph represent actors or directors, and when clicked, they display a comprehensive list of movies that the selected individual has been a part of.


## Actors Interactive Informations

![image](https://user-images.githubusercontent.com/61150130/234244230-2b6752bb-3a6f-49dc-9b45-fab073e90ebe.png)

The lines connecting the central graph nodes signify collaborations, and when clicked, they reveal detailed information about the movies they've worked on together, along with their posters.
![image](https://user-images.githubusercontent.com/61150130/234244297-c293c240-cb87-4093-bcfc-81ba3674b629.png)

# Tools and Lecture 
- Creating a graph that links actors and directors:

    Tools: D3.js, D3.forceSimulation (for creating a force-directed graph)
    
    Lectures: D3.js, Graphs
  
- Displaying movie posters and data when a link is clicked:

    Tools: D3.js (for handling click events and updating the visualization), HTML/CSS (for designing the layout)
    
    Lectures: Interaction in D3.js, D3.js

- Filtering by genre:

    Tools: D3.js (for updating the visualization based on the selected genre), HTML/CSS (for designing buttons)
    
    Lectures: Interaction in D3.js, D3.js, Tabular Data

- Time cursor for filtering movies by date:

    Tools: D3.js (for creating a time slider and updating the visualization based on the selected date), HTML/CSS (for designing the time slider)
    
    Lectures: Interaction in D3.js, D3.js, Tabular Data

- Adding a search bar for actors and directors:

    Tools: D3.js (for filtering the graph based on user input), HTML/CSS (for designing the search bar)
    
    Lectures: Interaction in D3.js, D3.js

- Visual design and aesthetics:

    Tools: D3.js (for selecting colors and creating visual encodings), HTML/CSS (for designing the overall layout)
    
    Lectures: Perception Colors, Maps, Text Viz

- Storytelling with your visualization:

    Tools: D3.js (for creating interactive elements that guide users through the story)
    
    Lectures: Storytelling

# Break down of the Project into independent pieces to implement

- Parse and preprocess the data:

     Read in the list of movies, actors, and directors, and preprocess the data to create nodes and links.

- Create a force-directed graph:

     Use D3.js to create a graph with nodes for actors and directors, and links between them based on their collaboration in movies.

- Implement interaction for displaying movie information:

    Add click event listeners to the links and display movie information, including posters, when a link is clicked.

- Add filtering options for genre and date:

    Create buttons for filtering by genre and a time slider for filtering by date, and update the graph based on user selections.

- Implement a search bar for actors and directors:

    Create an HTML input field for searching, add an event listener to handle user input, and filter the graph to show only the connections of the searched actor or        director.

- Apply visual design and aesthetics:

    Choose appropriate colors, fonts, and visual encodings for your visualization, and design the overall layout using HTML/CSS.

- Incorporate storytelling elements:

    Add interactive elements that guide users through the story of the visualization, highlighting important connections and collaborations between actors and              directors.
