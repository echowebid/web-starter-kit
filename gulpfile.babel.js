'use strict';

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var fileinclude = require('gulp-file-include')
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var size = require('gulp-size')
var sourcemaps = require('gulp-sourcemaps')
var postcss = require('gulp-postcss')

// Inclue HTML
gulp.task('include-html', () => {
    return gulp.src('app/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app'
        }))
        .pipe(gulpif('*.html', size({title: 'html', showFiles: true})))
        .pipe(gulp.dest('.tmp'));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
    return gulp.src([
        './app/styles/**/*.scss',
        './app/styles/**/*.css',
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed', precision: 10}))
    .pipe(concat('main.css'))
    .pipe(postcss([ autoprefixer('Last 10 versions') ]))
    .pipe(size({title: 'styles'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/styles'));
});

// Browser Sync Reload
gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

// Browser Sync Live Browsing
gulp.task('browsersync', function() {
    browserSync.init({
        server: {
            baseDir: ".tmp"
        },
        port: 3000
    });

    gulp.watch(['app/**/*.html'], gulp.series('include-html', 'reload'));
    gulp.watch(['app/**/*.{scss,css}'], gulp.series('styles', 'reload'));
    gulp.watch(['app/images/**/*'], gulp.series('reload'));
});

// Serve Default
gulp.task('serve', gulp.series('include-html', 'styles', 'browsersync'));
