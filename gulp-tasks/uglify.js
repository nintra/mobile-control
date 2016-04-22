
var gulp   = require('gulp'),
    notify = require('gulp-notify'),

    uglify = require('gulp-uglify');



module.exports = function() {

  return gulp.src(gulp.config.scripts + '/src/**/*.js')
    .pipe(uglify({
        // preserveComments: true
    }))
    .on('error', notify.onError({ message: 'jshint failed' }))
    .pipe(gulp.dest(gulp.config.scripts));

};