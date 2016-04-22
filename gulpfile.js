var gulp       = require('gulp'),
    taskLoader = require('gulp-task-loader');

gulp.bSync = require('browser-sync').create();


gulp.config = {
    base     : 'server/public',
    assets   : 'server/public/assets',
    scripts  : 'server/public/assets/scripts',
    styles   : 'server/public/assets/styles',
    images   : 'server/public/assets/images',
    libraries: 'server/public/assets/libraries'
};


// Load all tasks from folder `gulp-tasks`
taskLoader();



gulp.task('css:build', ['sass', 'cssnano']);

// gulp.task('js:build', ['webpack', 'uglify']);


gulp.task('serve', ['browser-sync', 'watch']);

gulp.task('build', ['css:build'/*, 'js:build'*/]);

gulp.task('default', []);
