var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var apiResponse = require("@modules/utils/apiResponses");
var apiRouter = require("./routes/api");
var http = require('http');
const jwt = require('express-jwt');

// DB connection
var MONGODB_URL = process.env.MONGOURI;
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log('[✅] DB connection successful');
}).catch(err => {
    console.error("Database connection error:", err.message);
    process.exit(1);
});
var db = mongoose.connection;

var app = express();

var port = process.env.PORT || '80';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('error', (err) => {
    console.log('[❎] Error starting API web server: ' + err);
});
server.on('listening', () => {
    console.log('[✅] API web server listening on port ' + port);
});

app.use(jwt({
    secret: 'secret-key',
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring (req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
//app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if(err.name == "UnauthorizedError"){
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

module.exports = app;