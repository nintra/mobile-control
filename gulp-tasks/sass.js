
var gulp    = require('gulp'),
    notify  = require('gulp-notify'),
    // plumber = require('gulp-plumber'),

    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer');



module.exports = function() {

  return gulp.src(gulp.config.styles + '/src/index.scss')
    .pipe(sourcemaps.init())
    // .pipe(plumber({ errorHandler: notify.onError({ message: 'sass failed' }) }))
    .pipe(sass())
    .on('error', notify.onError({ message: 'sass failed' }))
    .on('error', function (error) {
        console.warn(error.message);
    })
    .pipe(rename('main.css'))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    // .pipe(plumber.stop())
    .pipe(gulp.dest(gulp.config.styles))
    .pipe(gulp.bSync.stream({ match: '**/*.css' }));

};
