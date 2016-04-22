

function ParallaxLayers() {
    var self = this,
        processInterval = 16;

    if (!window.DeviceOrientationEvent) {
        return false;
    }

    self.motion = { x: 0, y: 0 };
    // self.motionRangeX = 25;
    // self.motionRangeY = 25;
    self.smoothFactor = 0.7;

    window.ondeviceorientation = _.throttle(
        _.bind(self.processMotion, self),
        processInterval);


    self.queue     = [];
    self.listeners = [];
    self.state     = false;

}



ParallaxLayers.prototype.processMotion = function(ev) {
    var self = this,
        orientation = window.orientation;

    if (!self.state) {
        return false;
    }

    if (ev.gamma === null || ev.beta === null) {
        return false;
    }

    var self  = this,
        gamma = ev.gamma / 90,
        beta  = ev.beta / 180,
        tmp = 0, x = 0, y = 0;

    // avoid gimbal lock
    if (beta > 0.45 && beta < 0.55) {
        return false;
    }

    // fix for device upside down
    if (gamma >= 1) {
        gamma = 2- gamma;
    } else if (gamma <= -1) {
        gamma = -2 - gamma;
    }

    // shift values on orientation
    if (orientation && Math.abs(ev.orientation) === 90) {
        tmp   = gamma;
        gamma = beta;
        beta  = tmp * (ev.orientation / 90);
    }

    x = 0 - gamma/* * self.motionRangeX*/;
    y = 0 - beta /* * self.motionRangeY*/;

    // self.smoothFactor = window.smoothFactor || 1;
    if (self.smoothFactor !== 1) {
        self.motion.x = (1 - self.smoothFactor) * self.motion.x + self.smoothFactor * x;
        self.motion.y = (1 - self.smoothFactor) * self.motion.y + self.smoothFactor * y;

    } else {
        self.motion.x = x;
        self.motion.y = y;
    }
};


ParallaxLayers.prototype.addElement = function(element, intensity) {
    var self = this,
        percent = false;

    if (_.isString(intensity)) {
        percent   = intensity.substr(-1) === '%';
        intensity = parseFloat(intensity);
    }

    self.queue.push({
        $element : $(element),
        intensity: intensity,
        percent  : percent
    });

    return self;
};


ParallaxLayers.prototype.removeElement = function(element) {
    this.queue = _.reject(this.queue, function(entry) {
        return entry.$element[0] === element;
    });

    return this;
};


ParallaxLayers.prototype.listen = function(callback) {
    var self = this;
    self.listeners.push(callback);

    return self;
};


ParallaxLayers.prototype.ignore = function(callback) {
    this.listeners = _.reject(this.listeners, function(fn) {
        return fn === callback;
    });

    return this;
};


ParallaxLayers.prototype.start = function() {
    var self = this;

    if (self.state) {
        return false;
    }
    self.state = true;

    var updateLoop = function() {
        window.requestAnimationFrame(function() {
            if (self.state) {
                self.update(updateLoop);
            }
        });
    };

    updateLoop();
};


ParallaxLayers.prototype.stop = function() {
    var self = this;
    self.state = false;
};


ParallaxLayers.prototype.update = function(callback) {
    var self = this;

    if (self.listeners.length) {
        _.each(self.listeners, function(callback) {
            callback(self.motion);
        });
    }

    if (self.queue.length) {
        _.each(self.queue, function(entry) {
            var unit = entry.percent ? '%' : 'px';

            entry.$element
                .css(
                    'transform', 'translateZ(0) translate(' +
                    self.motion.x * entry.intensity + unit + ', ' +
                    self.motion.y * entry.intensity + unit + ')'
                );
        });
    }

    if (callback) {
        callback();
    }
};
