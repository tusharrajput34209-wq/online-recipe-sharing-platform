# OnlineRecipeSharingPlatform
online-recipe-sharing-platform
Online Recipe Sharing Platform built with Java Spring Boot, MySQL, and HTML, CSS, and JavaScript

Online Recipe Sharing Platform 🍳
A web application where people can explore recipes, discover new dishes, and share their cooking ideas.

About the Project
We started working on this project to build a website around something people use in everyday life: food. Recipes are available everywhere online, but we wanted to bring the basic idea of finding and sharing recipes into one place.

The Online Recipe Sharing Platform is a college project developed to put our programming and web development knowledge into practice. Along with building the website, we are learning how the frontend, backend, and database work together in a complete application.

The project uses HTML, CSS, and JavaScript for the frontend, with Java and Spring Boot planned for the backend and MySQL for storing application data.

What We Want to Build
The main idea is to make it easy for users to explore recipes and keep their cooking ideas organized.

Some of the features we are working towards include:

Recipe browsing: Explore different dishes and their details.
Recipe information: View ingredients, cooking instructions, and preparation time.
Recipe sharing: Give users a way to share their own recipes.
Favourites: Let users save recipes they want to try later.
Ratings and reviews: Allow users to share their opinions about recipes.
User accounts: Provide a foundation for personal profiles and account management.
These features represent the planned functionality. Their availability depends on what has been implemented and tested so far.

Technologies Used
Technology	Why we use it
HTML	To create the structure of the website
CSS	To handle the design and layout
JavaScript	To add interactions to the frontend
Java 25	For backend development
Spring Boot	To build the backend application and REST APIs
Spring Data JPA	To work with database records through Java
MySQL	To store users, recipes, and related information
Maven	To manage Java dependencies and build the application
Postman	To test backend APIs
Git and GitHub	To manage code and track project changes
How the Application Is Designed
The idea is to keep the frontend, backend, and database separate so that each part has its own responsibility.

The frontend displays the website and handles user interactions.
The frontend sends requests to the backend when data is needed.
The Java backend processes requests and handles application logic.
MySQL stores the information that needs to be saved.
The backend returns the response, and the frontend displays the result.
The frontend and backend are intended to communicate through REST APIs using JSON.

Database Design
MySQL is planned to store the main information required by the application.

The proposed database includes four main tables:

Users: Stores account details and profile information.
Recipes: Stores recipe titles, ingredients, instructions, categories, and cooking information.
Favourites: Keeps track of the recipes saved by users.
Ratings: Stores ratings and reviews submitted for recipes.
These tables are designed to be connected through IDs so that recipes, users, favourites, and ratings can be related properly.

Passwords should be stored as secure hashes rather than plain text.

Project Structure
The repository currently contains the following files:

online-recipe-sharing-platform/
│
├── README.md
│
└── OnlineRecipePlatform/
    ├── README.md
    │
    └── frontend/
        ├── index.html
        ├── style.css
        ├── script.js
        └── backend.js

A quick look at the files
index.html contains the main webpage structure.
style.css handles the appearance of the website.
script.js contains the frontend JavaScript.
backend.js is currently located inside the frontend folder; its exact role depends on the code it contains.
The Java backend, Maven configuration, and database setup files should also be included when they are ready, so the complete project can be set up from the repository.

Running the Current Frontend
You can try the frontend using these steps:

Download or clone this repository.
Open the OnlineRecipePlatform/frontend folder in Visual Studio Code.
Open index.html in a browser, or use the Live Server extension.
Some functionality may require the backend and database to be configured first.

Clone the Repository
git clone https://github.com/tusharrajput34209-wq/online-recipe-sharing-platform.git

After cloning, open the downloaded project folder in your code editor.

What We Are Learning
Working on this project gives us a chance to use concepts from our coursework in a practical application.

We are focusing on Java programming, database management, frontend development, REST API integration, and understanding how different parts of a web application communicate with each other.

We also want to improve the way we organize code, test our work, fix errors, and collaborate using GitHub.

Future Improvements
There are several things we would like to improve as development continues:

Better recipe search and category filters.
User registration and login.
Recipe creation and editing.
Saving favourite recipes.
Ratings and reviews.
A responsive layout for mobile devices.
Testing and deployment so the application can be accessed online.
Team Work
This is a collaborative project in which we are dividing the work between frontend and backend development.

The frontend work focuses on the website's layout, styling, and user interactions. The backend work focuses on Java, Spring Boot, API development, and database integration.

We are working towards connecting both parts into one functional application.

Thanks for checking out our project! 🍽️

We hope to keep improving it as we learn more and add new features.

