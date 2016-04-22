

var gulp      = require('gulp'),
    modernizr = require('gulp-modernizr');


module.exports = function() {

    return gulp.src(gulp.config.styles + '/main.css')
        .pipe(modernizr())
        .pipe(gulp.dest(gulp.config.scripts));

};
