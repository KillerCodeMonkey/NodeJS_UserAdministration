// Include required ressources.
var express 	= require('express'),
    path 		= require('path'),
    http 		= require('http'),
    user 		= require('./db/user'),
    MemoryStore = require('connect').session.MemoryStore;

var app = express();

// Configure express app.
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    // app.use(express.logger('dev'));   'default', 'short', 'tiny', 'dev' 
    app.use(express.bodyParser()), /* get request params as object */
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser());
	app.use(express.session({ secret: 'BusenWuasdSchoenAnZuSehen', store: new MemoryStore({ reapInterval:  60000 * 10 })}));
});

// REST-API
// authentication check
app.get('/checkAuth', function (req, res) {
    res.send({isLoggedIn: req.session.user ? 1 : 0});
});
// register
app.post('/register', user.register);
// login
app.post('/login', user.login);
// logout
app.get('/logout', loginCheck, function (req, res) {
	delete req.session.user;
	res.redirect('#login');
});
// user
app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.put('/users/:id', loginCheck, user.updateUser);
app.delete('/users/:id', loginCheck, user.deleteUser);

//Finally create server.
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


// Helper functions.
function loginCheck(req, res, next) {
	if(req.session.user) {
		next();
	} else {
		res.redirect('#login');
	}
}