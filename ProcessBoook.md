# Process Book - Data Visualization

## Path, Challenges and Decisions

### Conceptualization

In our quest to explore the interconnected world of cinema, we were drawn towards the concept of displaying connections between actors who shared the screen either once or several times during their careers. The idea evolved into creating a star graph that could potentially illustrate the connections between directors, actors, and the films they've made together.

### Data Collection
Our first challenge emerged when we started looking for the necessary data. One database alone wasn't sufficient; each one we found had strengths and weaknesses. The first one provided a comprehensive list of movies but had very limited information on the actors involved (each movies had only 2-3 main actors so our graph was very limited). We found another database with a lots of information on actors but lacking in detailed movie data.

Our solution was to merge the two databases to construct a more complete picture. The journey took another interesting turn when we stumbled upon a third database, rich in movie posters. Unfortunately, not all our movies were represented in this database, and we were faced with a difficult decision: Should we only keep movies for which we had posters (which meant fewer movies), or keep all movies and accept that some wouldn't have associated posters?

Given the course's focus on interactive visualization, we ultimately decided to limit our selection to only those movies for which we had posters.

### Data Preparation

We faced the task of creating dictionaries for future computations. One of the main challenges was to design an efficient architecture for each dictionary to ensure quick information retrieval. We successfully built three maps: one for actors, one for directors, and one for movies. These maps used the names of actors, directors, and movies as keys, respectively, and their corresponding IDs as values.

In addition, we created the "all_actor_infos" map. In this map, actor IDs were used as keys, and the associated values were nested dictionaries. Each nested dictionary contained the IDs of the movies shared by the actors. This structure allowed us to easily retrieve the list of actors with whom a specific actor had worked.

To further enhance the retrieval process, we included an additional key for each actor called "Played with ids." This key contained the IDs of all the actors the specific actor had collaborated with. The purpose was to quickly obtain the list of actors associated with a particular actor.

### Initial Visualization

We initially created the skeleton of the graph, but we encountered a challenge along the way. Towards the end of this phase, we realized that the graph we had constructed lacked informative value, as it didn't utilize a significant amount of data from our dataset such as genres, awards or box office information. 

You can see below what we wanted in Milestone 2 for the central graph visualisation and what we ended up with: (and you can see why only this graph wasn't going to be sufficient at all)

![image](https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/cb9748ad-fd15-426c-be37-2fcc88f0eacc)

But you can see that the two design are quite similar, we dropped the idea of a time cursor because it wasn't very consitent to filter actor to actors link based on time because actors can collaborate multiple time together during their carreer and it was not very interesting as a feature. And as you are going to see below, we put the genre filter button in another place then at the top of the page.

This lack of visual information of the main graph prompted us to rethink our project and explore alternative graphing techniques that could provide more nuanced insights into actors' careers.

After some exploration, we decided to incorporate a radar chart to represent genres and a timeline density map to depict the trajectory of actors' careers. These new graph types offered a fresh perspective and allowed us to showcase a broader range of information, providing more detailed insights into the actors' professional journeys.


### Implementing Interactive Features

We incorporated a search bar that allowed users to search for a specific actor. Additionally, we developed the movie poster visualization. However, we encountered some challenges during its implementation. Initially, we faced issues with the size of the files, as there were thousands of movie posters in JPEG format spanning from 1980 to 2015. Moreover, the images varied in size, making it difficult to achieve a consistent and aesthetically pleasing display. To address these challenges, we devised a solution that assigned a default dimension to all the images, ensuring uniformity and a optimal way to store the movie poster and made it quick to fetch them.

Subsequently, we focused on implementing the two previously mentioned graphs: the radar chart and the timeline density map. Implementing the density timeline graph posed a significant challenge, primarily because we wanted to incorporate a filter system for the movies associated with each actor. Initially, we considered an external scroll button where users could select a genre to filter the movies. However, we found that this button disrupted the overall aesthetics of the graphs. To overcome this, we made the decision to merge the genre legend of the timeline chart with the filter button for the movie posters. This integration proved to be a particularly challenging aspect of the implementation process.

You can see below what we wanted in Milestone 2 with these two new graphs and what we ended up with:


<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/553d3340-bbe4-443a-8d9c-4f6a29356443">


The design are identical, just the graphs arrangements is not the same, it made more sense to put it in this displacement based on size and informations logic.

And here the genre filter that is applied to the movie posters and the density timeline chart:


![image](https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/96b0d416-9024-4d63-93b7-6c4bf244a231)



We also added listeners for interactive features. Clicking a link between two actors would display shared movies, while clicking an actor node would refresh all the information about that actor. Despite the fact that this node click updates a lot of information, every graph and every movie poster, we were pleased with the fast and efficient updating of the visualizations. We also had a new feature that we only mention in milestone 2 that is when you double clik on an actor node, it will generate it's own central graph with the predefine number of nodes linked to him.


### Addressing Overpopulation


At this stage, we were thrilled with the code and visualizations we had created. However, we encountered some significant challenges. The first major issue arose from the high number of connections between certain well-known actors. This led to two consequences. Firstly, it severely impacted the graph's readability. For instance, when searching for actors like "Brad Pitt" or "Nicole Kidman," it became evident that they had worked with hundreds of other actors. As a result, the graph became overcrowded with numerous nodes, making it nearly impossible to understand or extract any meaningful information, read the names of actors, or discern which links to click. 
The second problem stemming from this issue was the computational cost. The sheer volume of actor connections, coupled with the display on the graph, significantly increased the execution time. Some actors took several minutes to process, which became a significant problem.

Here is an example of the kind of graph we had:


<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/e050387e-ec13-4347-ada9-cf32499b9e15" width="500" alt="Image">


To address this challenge, we needed to make a decision regarding the approach we would take. We considered two options: either removing some "less" famous actors from the database to improve efficiency and clarity of the graph, or implementing a filter based on a popularity criteria. Ultimately, we opted for the latter solution.

We returned to the initial database and ranked all the actors based on the number of connections they had. We made the assumption  that actors who had worked with a greater number of other actors were likely more "famous." We created a list based on this ranking, with the top actors appearing at the beginning that seems consistent as you can see by the top 10 actors that we calculated that are all really famous acotrs:


<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/7282d5a2-8106-401a-9645-7b553d487a9e" width="400" alt="400">


Next, we filtered the graph to display only the top-ranked actors who were connected to the searched actor. This resulted in a clearer and more captivating graph. It made logical sense since people are primarily interested in connections with actors they know, and these connections are typically with the more famous individuals. 


<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/520d350c-3968-4dff-932b-9970b880e88f" width="500" alt="Image">


This approach allowed us to present a more focused and engaging visualization, highlighting the connections that users are likely most interested in exploring.

### Fine-tuning Interactivity

To accommodate the variation in the number of connections for different actors, we added a slider feature just on top of the search bar. This feature allows users to adjust the number of nodes displayed in the graph in real-time. By default, the top 20 most connected actors related to the searched actor are displayed. However, this can be expanded up to the top maximum number of nodes by adjusting the slider.


![image](https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/5f417d6b-dcb3-4278-a35f-913e6e6f67da)


We also had another features that was in the "Extra Idea" list of milestone 2 that is to implement an easier search tool when looking for an actor / director that could automatically filled the search bar by filtering the actors / directors matching the current search input.

<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/715385c9-2806-47e9-9028-238ac37dda7f">

To finish we added a default actor that we choose to be Heath Ledger to have a by-default graph when we launch the programm so the user don't arrive on a blank page.
We also display all his infos and movie posters.

### Modification of the Radar Chart

In the end, we discussed with Professor Vuillon, he suggested to us to do a comparaison of genre between the search actor and the linked actors in the radar chart. We found the idea very interesting as it open a new dimension to our project, to compare the carrer of actor that played together. We can then respond to questions like "Did this actor played with other actor that was similar to him ? With the same carreer ?" or "I feel that this actor played in a lot of comedy movie, but is it more than average ?".

## Peer Assessment

#### Part made by Aymeric Bacuet (297168)

  - Creation of the central star graph based on the search actor and actors dictionnaries.
  - Implementation of the display of movie poster for the search or clicked actor.
  - Implementation of listener based on click on nodes to display specific informations.
  - Implementation and creation of the famous ranking dictionnary.
  - Feature of filtering the graph based on this ranking.
  - Implementation of the node-slider to vary the number of nodes displayed.
  - Default Actor when programm is launch.

#### Part made Kenji Tetard (301569)

  - Creation of most of the dictionnaries and information structure.
  - Creation of the search bar and the filtering feature of the search bar.
  - Implementation of listener based on click on links to display specific informations.
  - Implementation of the double-click listener on actor node to create their own central graph.
  - Implementation of the radar chart of genre for clicked actor.
  - Implementation of the timeline genre chart and filter based on genre clicked for the movie poster.
  - Implementation of the display of movie infos when clicking on a movie poster.


#### Part made together

  - Search of the multiple dataset.
  - Data Processsing.
  - Dataframe merging and decision making.
  - Brainstorming about new ideas to better vizualise movies informations.
  - Optimization of the code.
 
