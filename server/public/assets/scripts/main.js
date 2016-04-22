'use strict';

function generateId(length, chars) {
    chars = chars || '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    var id    = '',
        radix = chars.length,
        i = 0, rand, str = '';

    // default uuid length to 7
    if (length === undefined) {
        length = 7;
    }

    for (i = 0; i < length; i++) {
        rand = Math.random() * radix;
        str  = chars[Math.floor(rand)];

        id += String(str).charAt(0);
    }

    return id;
}


$(function() {

    var _ = window._,
        socket = window.io('http://logi.codes:44044'),
        userId = false,
        color  = '#000',
        connected = false,
        role   = window.matchMedia('(max-width: 640px)').matches ? 'sender' : 'receiver',

        $canvas = $('.test .overlay-canvas'),
        canvas  = $canvas[0],
        ctx     = canvas.getContext('2d'),
        $button = $('.test button'),

        setState = function(state) {
            $('form .state').val(state);
        },

        connect = function() {
            socket.emit('user-connect', {
                userId: userId,
                sender: role === 'sender'
            });

            setState('waiting');
        },

        draw = function(x, y) {
            var radius = 15;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI / 180 * 360);
            ctx.fill();
        };



    // simple parallax anim
    var parallaxLayers = new window.ParallaxLayers();
    parallaxLayers.addElement($('.test .clouds img'), 40);
    parallaxLayers.start();



    // replace ondeviceorientation callback with own function
    var parallaxLayersListener = window.ondeviceorientation,
        captureMotion = _.throttle(function(ev) {
            if (connected && role === 'sender') {
                socket.emit('command', {
                    command: {
                        type: 'deviceorientation',
                        data: _.pick(ev, ['orientation', 'alpha', 'beta', 'gamma'])
                    }
                });
            }
        }, 100);

    window.ondeviceorientation = function(ev) {
        parallaxLayersListener.apply(this, arguments);
        captureMotion.apply(this, arguments);
    };



    // setup & controls
    $('form [name=role]')
        .val(role);

    $('form')
        .on('click', '.generate-id', function(ev) {
            ev.preventDefault();

            userId = generateId(4).toLowerCase();
            $('.user-id').val(userId);
            connect();
        })
        .on('submit', function(ev) {
            ev.preventDefault();

            userId = $('.user-id').val();
            connect();
        });


    // react when connection is established
    socket.on('user-connected', function(data) {
        connected = true;
        setState('connected');
    });


    socket.on('command', function(data) {
        var command = data.command;

        if (command.type === 'color') {
            color = command.color;
            $button.css('background-color', command.color);

        } else if (command.type === 'deviceorientation') {
            parallaxLayers.processMotion(command.data);

        } else if (command.type === 'draw') {
            draw(command.data.x, command.data.y);

        } else if (command.type === 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

    });


    if (role === 'sender') {
        $('body .test')
            .on('click', 'button.color', function(ev) {
                ev.preventDefault();
                color = '#' + generateId(6, '3456789abcd');

                $button.css('background-color', color);
                socket.emit('command', { command: { type: 'color', color: color } });
            })
            .on('click', 'button.clear', function(ev) {
                ev.preventDefault();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                socket.emit('command', { command: { type: 'clear' } });
            });


        // ctx.globalCompositeOperation = 'multiply';
        $canvas.on('touchstart touchmove', function(ev) {
            var touch = ev.originalEvent.touches[0];
            ev.preventDefault();

            var offset = $canvas.offset(),
                x = _.round(touch.clientX / ($canvas.width() / canvas.width), 2) - offset.left,
                y = _.round(touch.clientY / ($canvas.height() / canvas.height), 2) - offset.top;

            draw(x, y);

            socket.emit('command', { command: { type: 'draw', data: { x: x, y: y } } });
        });
    }


});
