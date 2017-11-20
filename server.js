/*
Express is used to create a server
Templating engine let us render HTML but in a dynamic way
A partial is a partial pieace of the website that might be reuse many fold
handlebarshelper are going to be way to register functions to run to dynamically create output
Git is going to let us keep track of the changes to the project over time. It is also useful for backing up our work
Git can be use to save our project, to back uo project into Github server, to deploy project live to the web
*/
/*

*/

const express = require ('express');
const hbs =  require('hbs'); // used to configure express for rendering dynamic page
const fs = require('fs');

const port = process.env.PORT || 3000;
/*
process.env is an object that store our environment varible as key value pair
port variable is set to process.env.PORT so that heroku attribute the value on internet or if that not exist we use 3000
*/

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
/*
registerPartials take the path of directory of the partials
*/
app.set('view engine','hbs');// starting

// app.use is used to configure a Middleware
app.use((req, res, next) =>{
  var now = new Date().toString();// human readable time stamp
  var log = `${now} : ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) =>{
    if(err){
      console.log('Unable to app to server.log.');
    }
  });
  next();
});
// app.use((req, res, next)=>{
//   res.render('maintenance.hbs');
// });
/*
Not calling next() in a Middleware let us stop executing everthing below it
so we Middleware above can be used in case of maintenance
*/
app.use(express.static(__dirname + '/public'));
/* next exist so we can tell to express that the Middleware function is done.
And if we are doing something asynchronous we Middleware is not going to move on only when we call next()*/
/*
express.static takes the absolute path of the doc you want to serve, luckily we have __dirname which store the path of the root directory(node-web-service)
Middleware let us configure how our express app works.
*/
hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt',(text)=>{
  return text.toUpperCase();
})
/*
handlebarshelper are going to be way to register functions to run to dynamically create output
It takes two arguments: 1st: name of the helper and 2nd is the function to run
*/


app.get('/', (req, res) =>{
  res.render('home.hbs',{
    pageTitle: 'Home page',
    welcomeMessage: 'Welcome to my website'
  });
});
// app.get('/'/*root url*/,(req, res)=>{
//   //res.send('<h1>Hello express!</h1>');/*this is response send into the body if someone make a request*/
//   res.send({
//     name:'Daouda',
//     likes:[
//       'football',
//       'prayer'
//     ]
//   });/*when we send object express notice that and convert it into json*/
// });
/*handle for http get request.
 1st argument is the url.
 2nd is the fnction to run.
 the funtion tell to express what to send back to the person who made the request
 The function has 2 argument request(req) and response(res)
 -request store a lot of information about the request comming in like the header, the body, the method that was made, the path
 -response has a lot of method available so we can response to an http request, we can customize which kind of data to send back, set the http status code, etc... */
app.get('/about', (req, res) =>{
  res.render('about.hbs',{
    pageTitle: 'About Page',
    //currentYear: new Date().getFullYear()// this is a java script object which return current year
  });/*render is going to help us rendering any of the template set up in the views file.
  It may take two argument first one is the page to render locate in the views file and
  2nd is the object of argument to pass in the file*/
});

app.get('/projects', (req, res) =>{
  res.render('projects.hbs',{
    pageTitle: 'Portfolio page',
    welcomeMessage: 'Welcome to projects page'
  });
});

app.get('/bad', (req, res) =>{
  res.send({
    errorMessage: 'Unable to handle request'
  })
});// /bad: which going to simulate when a request failed -send back json with errorMessage property
/*Express let us create a lot  of pages aside with the root page like about, contactus and so one pages*/


/*
for heroku to work we will use environment variable because of the port which will change when deploying the app.
then we will create a start attribute in the script object of package.json. A script is a command capable of being executed in the terminal.
This script is added and set to node server.js and name start so that when heroku will to launch the app they will start the good file because, heroku doesn't know the name of our file.
*/
app.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});/* app.listen is going to bind the app to a port on the machine*/
