
var gulp   = require('gulp'),

    sourcemaps = require('gulp-sourcemaps'),
    cssnano    = require('gulp-cssnano'),
    rename     = require('gulp-rename');



module.exports = function() {

    return gulp.src(gulp.config.styles + '/main.css')
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(gulp.config.styles));

};
