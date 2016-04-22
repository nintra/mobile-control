

var gulp = require('gulp');


module.exports = function() {

    gulp.bSync.init({
        server: {
            baseDir: gulp.config.base
        }
    });

};