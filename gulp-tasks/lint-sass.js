
var gulp       = require('gulp'),
    postcss    = require('gulp-postcss'),
    reporter   = require('postcss-reporter'),
    scssSyntax = require('postcss-scss'),
    stylelint  = require('stylelint');



module.exports = function() {

    // Stylelint config rules
    var stylelintConfig = {
        'rules': {
            'block-no-empty': true,
            'color-no-invalid-hex': true,
            // 'declaration-colon-space-after': 'always',
            'declaration-colon-space-before': 'never',
            'function-comma-space-after': 'always-single-line',
            'function-url-quotes': 'double',
            'media-feature-colon-space-after': 'always',
            'media-feature-colon-space-before': 'never',
            'media-feature-name-no-vendor-prefix': true,
            'max-empty-lines': 5,
            'number-leading-zero': 'never',
            'number-no-trailing-zeros': true,
            'property-no-vendor-prefix': true,
            'rule-no-duplicate-properties': true,
            'declaration-block-no-single-line': true,
            'rule-trailing-semicolon': 'always',
            'selector-list-comma-space-before': 'never',
            'selector-list-comma-newline-after': 'always',
            // 'selector-no-id': true,
            'string-quotes': 'single',
            'value-no-vendor-prefix': true
        }
    };

    var processors = [
        stylelint(stylelintConfig),
        reporter({
            clearMessages: true,
            throwError: true
        })
    ];

    return gulp.src([
            gulp.config.styles + '/src/**/*.scss',
            '!' + gulp.config.styles + '/src/_config/**/*.scss',
            '!' + gulp.config.styles + '/src/libraries/**/*.scss'
        ])
        .pipe(postcss(processors, { syntax: scssSyntax }));
        // .on('error', function(error) {
        //     console.log(error);
        // });
};