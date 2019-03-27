'use strict';

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var gulp = require('gulp');
var sass = require('gulp-sass');
var size = require('gulp-size')
var sourcemaps = require('gulp-sourcemaps')
var postcss = require('gulp-postcss')

// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
    return gulp.src([
        './assets/styles/**/*.scss',
        './assets/styles/**/*.css',
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed', precision: 10}))
    .pipe(concat('main.css'))
    .pipe(postcss([ autoprefixer('Last 10 versions') ]))
    .pipe(size({title: 'styles'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/styles'));
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
            baseDir: "app"
        },
        port: 3000
    });

    gulp.watch(['./app/**/*.html'], gulp.series('reload'));
    gulp.watch(['./assets/**/*.{scss,css}'], gulp.series('styles', 'reload'));
    gulp.watch(['./app/images/**/*'], gulp.series('reload'));
});

// Serve Default
gulp.task('serve', gulp.series('styles', 'browsersync'));
