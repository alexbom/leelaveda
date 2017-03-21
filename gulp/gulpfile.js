var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    uglify       = require('gulp-uglifyjs'),
    inlinesource = require('gulp-inline-source'),
    rename       = require('gulp-rename'),
    htmlmin      = require('gulp-htmlmin');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: '../www/'
        },
        notify: false
    });
});

gulp.task('inline', function() {
    return gulp.src('../www/index.max.html')
        .pipe(inlinesource())
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeOptionalTags: true
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('../www/'));
});

var paths = {
    html: ['../www/index.html', '../www/index.max.html'],
    css:  ['../www/_main.css'],
    js:   ['../www/js/main.js']
};

gulp.task('html', ['inline'], function() {
    gulp.src(paths.html).pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', ['inline'], function() {
    gulp.src(paths.css).pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
    gulp.src(paths.js)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('../www/js/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['browser-sync', 'inline'], function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css,  ['css']);
    gulp.watch(paths.js,   ['js']);
});