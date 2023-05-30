# Process Book - Data Visualization

## Conceptualization

In our quest to explore the interconnected world of cinema, we were drawn towards the concept of displaying connections between actors who shared the screen either once or several times during their careers. The idea evolved into creating a star graph that could potentially illustrate the connections between directors, actors, and the films they've made together.

## Data Collection
Our first challenge emerged when we started looking for the necessary data. One database alone wasn't sufficient; each one we found had strengths and weaknesses. The first one provided a comprehensive list of movies but had very limited information on the actors involved. We found another database with a wealth of information on actors but lacking in detailed movie data.

Our solution was to merge the two databases to construct a more complete picture. The journey took another interesting turn when we stumbled upon a third database, rich in movie posters. Unfortunately, not all our movies were represented in this database, and we were faced with a difficult decision: Should we only keep movies for which we had posters (which meant fewer movies), or keep all movies and accept that some wouldn't have associated posters?

Given the course's focus on interactive visualization, we ultimately decided to limit our selection to only those movies for which we had posters.

## Data Preparation

With our data in hand, the task then was to create dictionaries for quick information retrieval. We constructed an actor/director/movie map, with each entity's name as the key and their corresponding IDs as values. In addition, we created a secondary dictionary: all_movies_sample. This dictionary mapped actor IDs to the movies they had appeared in and the actors they had shared the screen with. Designing an optimal architecture for these dictionaries proved challenging but necessary.

## Initial Visualization

The next step was to create the skeleton of our graph. However, upon completion, we realized the graph did not incorporate several important data points such as genres, awards, and box office information. This spurred us to rethink our strategy and consider other types of visualizations that could provide more nuanced insights into an actor's career. Our exploration led us to radar charts for genre representation and timeline density maps for illustrating the progression of an actor's career.

## Implementing Interactive Features

After creating a search bar to find specific actors, we moved to the implementation of movie poster visualization. Initial results were less promising due to the enormous file sizes of poster images and inconsistencies in their dimensions. We overcame these hurdles by defining a standard dimension for all images.

Implementing the radar chart and timeline density map presented its own set of challenges, especially the density timeline graph. Initially, we struggled with where to place a filter system for the movies. After several iterations, we settled on integrating the genre legend of the timeline chart as a filter button for the movie poster.

We also added listeners for interactive features. Clicking a link between two actors would display shared movies, while clicking an actor node would refresh all the information about that actor. Despite the lengthy process, we were pleased with the fast, efficient updating of the visualizations.


## Addressing Overpopulation

As we tested our visualization with popular actors like "Brad Pitt" and "Nicole Kidman", we noticed a glaring issue: the graph was overwhelmingly dense. Not only did it compromise the graph's readability, but it also significantly increased computational cost.
![image](https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/e050387e-ec13-4347-ada9-cf32499b9e15)

We decided to filter the graph based on a popularity criterion. Backtracking to our initial database, we ranked actors based on the number of connections they had. Our assumption was that an actor who had worked with many others was likely more "famous". The resulting list was fairly consistent with our expectations.
![image](https://github.com/com-480-data-visualization/project-2023-ak_team/assets/61150130/7282d5a2-8106-401a-9645-7b553d487a9e)

## Fine-tuning Interactivity

To accommodate the variation in the number of connections for different actors, we added a slider feature. This feature allows users to adjust the number of nodes displayed in the graph in real-time. By default, the top 10 most connected actors related to the searched actor are displayed. However, this can be expanded up to the top 25 by adjusting the slider.



