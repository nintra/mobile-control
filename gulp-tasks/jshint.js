
var fs = require('fs'),
    gulp   = require('gulp'),
    notify = require('gulp-notify'),

    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish'),

    jshintConfig = JSON.parse(fs.readFileSync('.jshintrc', 'utf8'));

jshintConfig.lookup = false;



module.exports = function() {

    return gulp.src(gulp.config.scripts + '/src/**/*.js')
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .on('error', notify.onError({ message: 'jshint failed' }));

};