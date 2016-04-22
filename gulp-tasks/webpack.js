
var path = require('path'),
    util = require('util'),
    fs   = require('fs'),

    gulp    = require('gulp'),
    webpack = require('webpack-stream'),
    named   = require('vinyl-named'),
    notify  = require('gulp-notify'),

    jshintConfig = JSON.parse(fs.readFileSync('.jshintrc', 'utf8'));



function webpackTask(callback, watch) {

    return gulp.src(gulp.config.scripts + '/src/app.js')
        .pipe(named())
        .pipe(webpack({
            cache: true,
            watch: !!watch,
            devtool: 'source-map',
            resolve: {
                root: [
                    path.resolve(gulp.config.scripts + '/src/'),
                    path.resolve(gulp.config.libraries)
                ]
            },
            module: {
                preLoaders: [
                    {
                        test: /\.js$/, // include .js files
                        exclude: /(libraries|node_modules)/, // exclude any and all files in the node_modules folder
                        loader: 'jshint-loader'
                    }
                ],
                loaders: [
                    {
                        test: path.resolve(gulp.config.scripts + '/src/'),
                        exclude: /(libraries|node_modules)/,
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ]
            },
            stats: {
                timings : true,
                children: true,
                version : false
            },

            debug: true,

            // bail: true,

            // more options in the optional jshint object
            jshint: util._extend(jshintConfig, {
                // 'jshint errors are displayed by default as warnings
                // set emitErrors to true to display them as errors
                emitErrors: false,

                // interrupt the compilation
                failOnHint: true
            })
        }))
        .on('error', notify.onError({ message: 'webpack failed' }))
        .pipe(gulp.dest(gulp.config.scripts));

}


gulp.task('webpack:watch', function(callback) {
    return webpackTask(callback, true);
});


module.exports = webpackTask;