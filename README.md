# ng-stocks

A mean stack app using the google finance/ markit api / passport session. Returns general data, and specific dates of any stock the user chooses. Also graphs the data using angular chart js. 

Server

The routes for my app can be found in server.js. Individual routes contain middleware function to keep the server.js more clean. The middleware functions can be found in routehandlers.js. I combined promises and standard queries for resusability, the queries are interchangable. API calls were combined using async.map to reduce calls from the client. Repeated functions such as getting user information and request wrappers can be found in the utils directory. I used passport authentication to ensure the client was logged in and had authentication middleware as the first function on every route for security.

Frontend

The development files for the client side can be found in app/scripts/src. Most of the javascript logic can be found in dashboard.controller.js. I was able to set up abstraction using angular UI routing. The parent controller holds all the request information from the various APIS. Since the child views of the abstract state inherit from the parent, data is passed  from the parent. This dramatically reduces API calls because the information is in scope on all controllers. The API routes and sample data are stored in constants.js. All the service calls are made from the request wrapper in services/utils/. 

TODO

My next tasks are to add error handling on serverside, Fix UI issues, and to add cleaner authentication on the client side.

This repo contains more than just production files. I wanted viewers to see the non minified, non compressed files. The build file can be found in gulpfile.js.  The gulp task scripts-deploy should correctly illustrate the production structure. The API keys used for this were kept in a .env. If you fork the repo you must provide your own keys.
