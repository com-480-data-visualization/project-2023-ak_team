# Vizualisation sketches
## Principal feature: The Actor to Actor Star Graph
In this data visualization project, we want a dynamic star graph centered around a specific actor or director, who was searched for using the search bar. 
Upon searching (for exemple Brad Pitt in the picture below), the graph displays a network of interconnected nodes, each representing another actor the searched actor has worked with. Additional controls, such as genre filter buttons and a time cursor, allow users to refine their view of the graph based on movie genres or a specific time period. The interactive and visually appealing design of this star graph offers an intuitive way to explore the extensive career and collaborations of any actor.

    
![image](https://user-images.githubusercontent.com/61150130/234244159-8c7fad11-1dda-4616-92a0-cc52cd813132.png)
    
The nodes in the graph represent either actors or directors. When a node is clicked, it reveals a comprehensive list of movies that the selected individual has participated in. Additionally, if the selected individual (like in this exemple Tom Cruise) is not the central node, the system also displays a list of movies in which both the selected individual and the central actor have acted together. 

## Actors Interactive Informations

Afterwards, by clicking on an actor's node on the grap , you can access further details about them, including:

- A catalogue of movie posters and relevant information for all the movies he/she has acted in.
- A radar chart showcasing the types of genres that have defined his/her career.
- A density plot that depicts the distribution of genres in the movies he/she has acted in over time
    
![image](https://user-images.githubusercontent.com/61150130/234244230-2b6752bb-3a6f-49dc-9b45-fab073e90ebe.png)
   
The density not only displays all the genres that the actor has been associated with but also serves as a filter button. Using the legend of the plot you can select any of the genres (e.g., "Action") by clicking on it, and the movie poster catalogue will be filtered based on that genre (here you can see that "Rain Man" was removed and a new action movie was depicted). Furthermore, the density plot will highlight the selected genre, allowing you to view the distribution of that genre in the actor's career.
   
![image](https://user-images.githubusercontent.com/61150130/234244297-c293c240-cb87-4093-bcfc-81ba3674b629.png)
     
We also want that when you click on a movie in the catalogue to display interesting informations about the movie like the Language, Runtime, Release Date, Writer, Director, IMDb Rating, Box Office, Rated, and Awards

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

To achieve our goal, we can break down the project into the following independent pieces:

- Data preprocessing and formatting:

    Process and format the data into a structure that is suitable for visualization.
    Extract actors, directors, movies, and genres as separate entities.
    Establish relationships between actors, directors, movies, and genres.

- Implement the search bar:

    Create an input field for users to type in the search query (actor/director name).
    Implement a search functionality that filters actors/directors based on the input.


- Create a central graph visualization:

    Use a suitable library like D3.js, Sigma.js, or Vis.js to create the graph.
    Display the search result (actor/director) as the central node.
    Connect the central node to related actors and directors based on the movies they have worked on together.


- Implement node selection and movie details display:

    Add an event listener for node clicks.
    When a node is clicked, display the movie titles and posters associated with the selected actor.


- Create radar chart and density plot:

    Use a library like Chart.js or D3.js to create the radar chart for movie genres.
    Create a density plot for the selected actor's movie genres over time.
    Update both visualizations when a different node is clicked.


- Implement the genre filter:

    Create a dropdown or checkboxes to allow users to select a specific genre.
    When a genre is selected, filter the movie posters displayed based on the chosen genre.
    Update the density plot to highlight the selected genre.


- Implement the actor/director switch button:

    Create a toggle button to switch between searching for actors and directors.
    Update the search functionality and graph visualization accordingly when the button is toggled.


- Integrate all the components:

    Combine all the above pieces to create a cohesive, interactive data visualization application.
    Ensure smooth user interaction and transition between different components.


- Testing and polishing:

    Test the application to ensure all features work as expected.
    Optimize performance and fix any bugs that arise.
    Make any necessary adjustments to improve the user experience.


 # Extra Ideas
 
Additionally, some more creative and challenging features could be:
  
- Implement an easier search tool when looking for an actor / director that could automatically filled the search bar by filtering the actors / directors matching the current search input.
- Make the graph more interactive by being able to generate the graph of an actor directly by clicking on the node of an actor.
- Visually highlight connections between actors who have worked together in a movie that has either won or been nominated for an Oscar.
Use a gold link to represent a movie that has won an Oscar, and a silver link to indicate a movie that has been nominated for an Oscar.
Use something similar for other presitigious awards like Golden Globes or "La Palme d'Or" of Cannes.
- Allow users to compare the career trajectories of two or more actors, displaying their respective movie catalogues side by side. This could allow users to see popularity of actors known for having been in competition with each other, one can think of sylvester stallone and arnold schwarzenegger who during 1970-1985 competed to see who was the greatest action movie actor. 
- Incorporate a feature that shows the actor's connections to other industries, such as their involvement in theater or television.
- Use natural language processing to extract themes and motifs from movie summaries and reviews.
Visually display these themes and motifs as word clouds.

These features may not be crucial to the overall meaning of the project, but they could enhance the visualization and provide users with a more immersive experience.

# Javascript Skeleton of the Project

To see our javascript code: [Javascript Code](https://github.com/com-480-data-visualization/project-2023-ak_team/blob/master/Milestone2_js)

To start the project, you need to search for actors in the search bar. For now we have only a example of the final product so the actors you can search for are named Actor 1, Actor 2... and are all associated with fake informations and random movies. Once you have found an actor, click on their node to access their information. You can scroll down the page to view the three graphs that have been mentioned for that particular actor. Additionally, by clicking on a movie poster, you can view more information about that movie. Again the informations about the movies are not relevant and does not correspond to the actual movie. Remember to use the search bar to find the desired actors, and click on any nodes or movie posters to explore further information.
