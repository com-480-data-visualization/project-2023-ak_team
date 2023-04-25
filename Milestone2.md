# Vizualisation sketches
## Principal feature: The Actor to Actor Star Graph
In this data visualization project, we want a dynamic star graph centered around a specific actor or director, who was searched for using the search bar. 
Upon searching (for exemple Brad Pitt in the picture below), the graph displays a network of interconnected nodes, each representing another actor the searched actor has worked with. Additional controls, such as genre filter buttons and a time cursor, allow users to refine their view of the graph based on movie genres or a specific time period. The interactive and visually appealing design of this star graph offers an intuitive way to explore the extensive career and collaborations of any actor.

    
![image](https://user-images.githubusercontent.com/61150130/234244159-8c7fad11-1dda-4616-92a0-cc52cd813132.png)
    
The nodes in the graph represent either actors or directors. When a node is clicked, it reveals a comprehensive list of movies that the selected individual has participated in. Additionally, if the selected individual (like in this exemple Tom Cruise) is not the central node, the system also displays a list of movies in which both the selected individual and the central actor have acted together. 

## Actors Interactive Informations

Afterwards, by clicking on the actor's name located at the top right corner (e.g., Tom Cruise), you can access further details about them, including:

- A catalogue of movie posters and relevant information for all the movies he/she has acted in.
- A radar chart showcasing the types of genres that have defined his/her career.
- A density plot that depicts the distribution of genres in the movies he/she has acted in over time
    
![image](https://user-images.githubusercontent.com/61150130/234244230-2b6752bb-3a6f-49dc-9b45-fab073e90ebe.png)
   
The radar chart not only displays all the genres that the actor has been associated with but also serves as a filter button. You can select any of the genres (e.g., "Action") by clicking on it, and the movie poster catalogue will be filtered based on that genre (here you can see that "Rain Man" was removed and a new action movie was depicted). Furthermore, the density plot will highlight the selected genre, allowing you to view the distribution of that genre in the actor's career.
   
![image](https://user-images.githubusercontent.com/61150130/234244297-c293c240-cb87-4093-bcfc-81ba3674b629.png)
     
We also want that when you hover your cursor over a movie in the catalogue, all other images will become blurry, and detailed information about the movie will appear on the right side of the movie poster. The information about the movie, including Language, Runtime, Release Date, Actors, Writer, Director, Genre, IMDb Rating, Box Office, Rated, and Awards, will be displayed one after the other on the right side of the movie poster when you hover your cursor over it.

# Tools and Lecture 
- Creating a graph that links actors and directors:

    Tools: D3.js, D3.forceSimulation (for creating a force-directed graph)
    
    Lectures: D3.js, Graphs
  
- Displaying movie posters and data when a node is clicked:

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
    
 # Extra Ideas
 
Additionally, some more creative and challenging features could be:
  
- Visually highlight connections between actors who have worked together in a movie that has either won or been nominated for an Oscar.
Use a gold link to represent a movie that has won an Oscar, and a silver link to indicate a movie that has been nominated for an Oscar.
Incorporate a feature that allows users to filter the movie catalogue by the decade in which the movie was released, giving a historical perspective on the actor's career.
- Allow users to compare the career trajectories of two or more actors, displaying their respective movie catalogues side by side.
- Incorporate a feature that shows the actor's connections to other industries, such as their involvement in theater or television.
- Use natural language processing to extract themes and motifs from movie summaries and reviews.
Visually display these themes and motifs as word clouds.

These features may not be crucial to the overall meaning of the project, but they could enhance the visualization and provide users with a more immersive experience.
