'use strict';

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var fileinclude = require('gulp-file-include')
var gulp = require('gulp');
var gulpif = require('gulp-if');
var postcss = require('gulp-postcss');
var purge = require('gulp-css-purge');
var sass = require('gulp-sass');
var size = require('gulp-size')
var sourcemaps = require('gulp-sourcemaps')

// Include HTML
gulp.task('include-html', () => {
    return gulp.src('app/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app'
        }))
        .pipe(gulpif('*.html', size({title: 'html', showFiles: true})))
        .pipe(gulp.dest('.tmp'));
});

// Styles
gulp.task('styles', function() {
    return gulp.src([
        'app/styles/**/*.scss',
        'app/styles/**/**/*.scss',
        'app/styles/**/*.css',
        'app/styles/**/**/*.css',
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed', precision: 10}))
    .pipe(concat('main.css'))
    .pipe(postcss([ autoprefixer('Last 10 versions') ]))
    .pipe(purge({
        trim : true,
        shorten : true,
        verbose : true
    }))
    .pipe(size({title: 'styles'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/styles'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
        'app/styles/webfonts/**/*'
    ], {
        dot: true
    })
    .pipe(size({title: 'fonts'}))
    .pipe(gulp.dest('.tmp/styles/webfonts'));
});

// Optimize images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('.tmp/images'))
    .pipe(size({title: 'images'}))
});

// Browser Sync Reload
gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

// Browser Sync Live
gulp.task('browsersync', function() {
    browserSync.init({
        https: true,
        injectChanges: true,
        server: {
            baseDir: ".tmp"
        },
        port: 3000
    });

    gulp.watch(['app/**/*.html'], gulp.series('include-html', 'reload'));
    gulp.watch(['app/styles/webfonts/**/*'], gulp.series('fonts', 'reload'));
    gulp.watch(['app/styles/**/*.{scss,css}'], gulp.series('styles', 'reload'));
    gulp.watch(['app/images/**/*'], gulp.series('images', 'reload'));
});

// Serve Default
gulp.task('serve', gulp.series('include-html', 'fonts', 'styles', 'images', 'browsersync'));
