'use strict';

var _ = require('lodash');

exports.register = function (server, options, next) {
    var io = server.plugins['hapi-io'].io,
        clients = [],

        getTeamClient = function(ownSocketId, userId) {
            return _.find(clients, function(client) {
                return client.socketId !== ownSocketId && client.userId === userId;
            });
        };



    // handle connections
    //
    // user-connect
    // user-connected
    // user-command
    // sender -> receiver
    io.on('connection', function(socket) {
        var client = { socketId: socket.id };
        clients.push(client);

        console.log('client connected'/*, io.sockets.connected*/);


        socket.on('user-connect', function(data) {
            client.userId = data.userId;
            client.sender = data.sender;

            var teamClient = getTeamClient(socket.id, client.userId);

            if (teamClient && teamClient.sender !== client.sender) {
                io.sockets.connected[teamClient.socketId].emit('user-connected', { userId: client.userId });
                socket.emit('user-connected', { userId: client.userId });
            }
        });


        socket.on('command', function(data) {
            var teamClient = getTeamClient(socket.id, client.userId);
            if (teamClient && teamClient.sender !== client.sender) {
                io.sockets.connected[teamClient.socketId].emit('command', data);
            }
        });


        socket.on('disconnect', function() {
            _.remove(clients, { socketId: socket.id });
            console.log('client disconnected', socket.id);
        });

    });

    next();
};


exports.register.attributes = {
    name: 'real-time',
    version: '0.1.0'
};

