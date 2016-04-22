

var gulp = require('gulp'),
    webpack = require('./webpack');


module.exports = function() {

    gulp.watch([gulp.config.base + '/*.html']).on('change', gulp.bSync.reload);
    gulp.watch([gulp.config.styles + '/src/**/*.{scss,css}'], ['sass']);
    gulp.watch([gulp.config.scripts + '/main.js']).on('change', gulp.bSync.reload);
    // webpack(null, true);

};
