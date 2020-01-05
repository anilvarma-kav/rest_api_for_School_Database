
# REST API for School Database

## Project Overview
The API will provide a way for users to administer a school database containing information about courses: users can interact with the database by retrieving a list of courses, as well as adding, updating and deleting courses in the database.


### Files: 

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create our app's database and populate it with data.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. 
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run our REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that we can use to test and explore our REST API.

### Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).

## API Documentation

[Click here](https://documenter.getpostman.com/view/9971986/SWLe77oK?version=latest) to see the API Documentation. 

## Technologies Used:
* REST API
* Node.js
* `Express` to create API routes
* `SQlite` Database
* `Sequelize ORM` for data modelling, validation and persistence
* `Postman` for testing the REST API
* `bcrypt js` to hash users password
* `basic-auth` to parse the Authorization header into user credentials
* `nodemon` used to run REST API

## Acknowledgement
* [Team Treehouse](https://teamtreehouse.com/)

