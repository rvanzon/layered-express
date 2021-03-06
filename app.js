/**
 * Module dependencies.
 */
// require.paths.unshift(__dirname + "/node_libraries")

var express = require('express'),
    app = module.exports = express.createServer(),
    Db = require('mongodb').Db,
    ObjectId = require('mongodb').ObjectId,
    Server = require('mongodb').Server,
    GenericPool = require('generic-pool'),
    notFoundHandler = require("./lib/middleware/NotFoundHandler"),
    Layers = require("layers").Express,
    NotFound = require("./lib/error/NotFound");
    
app.pool = GenericPool.Pool({
    max: 10,
    create: function(callback) {
        var db = new Db('layeredexpress', new Server("127.0.0.1", 27017, {}));
        db.open(function(err, p_client) {
            callback(db);                
        });
    },
    log: false,
    idleTimeOutMillis: 500,
    destroy: function(client) {
        client.close();
    }
});

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/templates');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(notFoundHandler);
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
    app.use(express.errorHandler()); 
});

/**
 * Setup Layers.
 * 
 * The Layers module automatically loads the controllers, services and views from
 * their respective directories 
 */
var wiring = require('./lib/layers/wiring');
new Layers(app, __dirname + '/lib/layers', wiring);

// Bootstrap Content
require("./lib/bootstrap")(app);

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
