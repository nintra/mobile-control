'use strict';

var Hapi = require('hapi'),
    Path = require('path'),
    Inert = require('inert');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: 44044
});


server.register({
    register: require('hapi-io'),
    options: {
        // port  : 44044,
        // labels: 'real-time'
    }
});


server.register(require('./real-time'), (err) => {
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});


server.register(Inert, function () {

    server.route( {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: { path: Path.normalize(__dirname + '/public') }
            }
        }
    );

    // Start the server
    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});


