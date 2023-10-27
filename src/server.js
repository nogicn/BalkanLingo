//Uvoz modula potrebnih za server
const express = require('express');
const path = require("path");
const https = require('https');
var http = require('http');
const fs = require('fs');

//Certifikati SSL
const options = {
  cert: fs.readFileSync('/'),
  key: fs.readFileSync('/')
};

//Rute
const homeRoutes = require('./routes/home.routes');

//Definiranje aplikacaije i porta
const app = express();
const httpsPort = 443;
const httpPort = 80;

//Postavljanje pogleda (view) za EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware - staticki resursi iz public direktorija
app.use(express.static(path.join(__dirname, 'public')));

//Middleware - dekodiranje parametara
app.use(express.urlencoded({extended: true}));


//Ruta za glavnu stranicu
app.use('/', homeRoutes);

//Za krivi link
// Handling non matching request from the client
app.use((req, res, next) => {
  res.status(404).redirect("/");
})

/*
app.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 3000);
});*/

// Middleware for HTTP to HTTPS redirection
app.use((req, res, next) => {
  if (req.protocol !== 'https') {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
});

// Redirect www.balkan-lingo.org to https://balkan-lingo.org
app.use((req, res, next) => {
  if (req.hostname === 'www.balkan-lingo.org') {
    return res.redirect(301, `https://balkan-lingo.org${req.originalUrl}`);
  }
  next();
});

app.use((req, res, next) => {
  if (req.hostname === 'https://www.balkan-lingo.org') {
    return res.redirect(301, `https://balkan-lingo.org${req.originalUrl}`);
  }
  next();
});


// Create HTTP server for redirection
http.createServer((req, res) => {
  res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(httpPort, () => {
  console.log(`HTTP server for redirection is running on port ${httpPort}`);
});

// Create HTTPS server
https.createServer(options, app).listen(httpsPort, () => {
  console.log(`HTTPS server is running on port ${httpsPort}`);
});
