# Process Book - Data Visualization

## Path, Challenges and Decisions

### Conceptualization

In our quest to explore the interconnected world of cinema, we were drawn towards the concept of displaying connections between actors who shared the screen either once or several times during their careers. The idea evolved into creating a star graph that could potentially illustrate the connections between directors, actors, and the films they've made together.

### Data Collection
Our first challenge emerged when we started looking for the necessary data. One database alone wasn't sufficient; each one we found had strengths and weaknesses. The first one provided a comprehensive list of movies but had very limited information on the actors involved. We found another database with a wealth of information on actors but lacking in detailed movie data.

Our solution was to merge the two databases to construct a more complete picture. The journey took another interesting turn when we stumbled upon a third database, rich in movie posters. Unfortunately, not all our movies were represented in this database, and we were faced with a difficult decision: Should we only keep movies for which we had posters (which meant fewer movies), or keep all movies and accept that some wouldn't have associated posters?

Given the course's focus on interactive visualization, we ultimately decided to limit our selection to only those movies for which we had posters.

### Data Preparation

With our data in hand, the task then was to create dictionaries for quick information retrieval. We constructed an actor/director/movie map, with each entity's name as the key and their corresponding IDs as values. In addition, we created a secondary dictionary: all_movies_sample. This dictionary mapped actor IDs to the movies they had appeared in and the actors they had shared the screen with. Designing an optimal architecture for these dictionaries proved challenging but necessary.

### Initial Visualization

The next step was to create the skeleton of our graph. However, upon completion, we realized the graph did not incorporate several important data points such as genres, awards, and box office information. This spurred us to rethink our strategy and consider other types of visualizations that could provide more nuanced insights into an actor's career. Our exploration led us to radar charts for genre representation and timeline density maps for illustrating the progression of an actor's career.

You can see below what we wanted in Milestone 2 for the central graph visualisation and what we ended up with:


![image](https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/cb9748ad-fd15-426c-be37-2fcc88f0eacc)

As you can see the two design are quite similar, we dropped the idea of a time cursor because it wasn't very consitent to filter actor to actors link based on time because actors can collaborate multiple time together during their carreer and it was not very interesting as a feature. And as you are going to see below, we put the genre filter button in another place then at the top of the page.

### Implementing Interactive Features

After creating a search bar to find specific actors, we moved to the implementation of movie poster visualization. Initial results were less promising due to the enormous file sizes of poster images and inconsistencies in their dimensions. We overcame these hurdles by defining a standard dimension for all images.

Implementing the radar chart and timeline density map presented its own set of challenges, especially the density timeline graph. Initially, we struggled with where to place a filter system for the movies. After several iterations, we settled on integrating the genre legend of the timeline chart as a filter button for the movie poster.

You can see below what we wanted in Milestone 2 with these two new graphs and what we ended up with:


<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/553d3340-bbe4-443a-8d9c-4f6a29356443">

The design are identical, just the graphs arrangements are not the same, it made more sense to put it in this displacement based on size and informations logic.

We also added listeners for interactive features. Clicking a link between two actors would display shared movies, while clicking an actor node would refresh all the information about that actor. Despite the lengthy process, we were pleased with the fast, efficient updating of the visualizations.


### Addressing Overpopulation

We were really happy with the code and visualization we had created so far. However, we faced some major problems. The first big issue was the excessive number of connections between well-known actors. This had two consequences. Firstly, it made the graph very hard to read. For example, when searching for actors like "Brad Pitt" or "Nicole Kidman," it became obvious that they had worked with numerous actors, resulting in a graph with an overwhelming number of nodes. As a result, it was impossible to understand anything from the graph, read the actor names, or even know which links to click. (like you can see in the graph below)

<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/e050387e-ec13-4347-ada9-cf32499b9e15" width="500" alt="Image">

We decided to filter the graph based on a popularity criterion. Backtracking to our initial database, we ranked actors based on the number of connections they had. Our assumption was that an actor who had worked with many others was likely more "famous". The resulting list was fairly consistent with our expectations.

<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/7282d5a2-8106-401a-9645-7b553d487a9e" width="400" alt="400">


And we then filter the graph with only the top famous rank that was connected to the search actor. So we have a clearer and far more interesting graph and it’s logical because people are mainly interested in connections and actors they know and these are in general the famous ones that we filtered. 

<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/e885aca3-0ad5-4d0e-bd0e-1257fcf0b364" width="500" alt="Image">


### Fine-tuning Interactivity

To accommodate the variation in the number of connections for different actors, we added a slider feature just on top of the search bar. This feature allows users to adjust the number of nodes displayed in the graph in real-time. By default, the top 10 most connected actors related to the searched actor are displayed. However, this can be expanded up to the top 25 by adjusting the slider.

![image](https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/5f417d6b-dcb3-4278-a35f-913e6e6f67da)


We also had another features that was in the "Extra Idea" list of milestone 2 that is to implement an easier search tool when looking for an actor / director that could automatically filled the search bar by filtering the actors / directors matching the current search input.

<img src="https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/715385c9-2806-47e9-9028-238ac37dda7f">

To finish we had a default actor that we choose to be Heath Ledger to have a graph when we launch the programm and not just a blank page.
We also display all his infos and movie posters.

## Peer assessment

#### Part made by Aymeric Bacuet (297168)

  - Creation of the central star graph based on the search actor and actors dictionnaries.
  - Implementation of the display of movie poster for the search or clicked actor.
  - Implementation and creation of the famous ranking dictionnary.
  - Feature of filtering the graph based on this ranking.
  - Implementation of the node-slider to vary the number of nodes displayed.
  - Default Actor when programm is launch.

#### Part made Kenji Tetard (301569)

  - Creation of most of the dictionnaries and information structure.
  - Creation of the search bar and the filtering feature of the search bar.
  - Implementation of listener based on click on link and nodes to display specific informations.
  - Implementation of the radar chart of genre for clicked actor.
  - Implementation of the timeline genre chart and filter based on genre clicked for the movie poster.
  - Implementation of the display of movie infos when clicking on a movie poster.


#### Part made together

  - Search of the multiple dataset.
  - Data Processsing.
  - Dataframe merging and decision making.
  - Brainstorming about new ideas to better vizualise movies informations.
  - Optimization of the code.
 
