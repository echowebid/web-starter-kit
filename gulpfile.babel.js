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
    return gulp.src(['app/**/*.html', 'app/**/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app'
        }))
        .pipe(gulpif('*.html', size({title: 'html', showFiles: true})))
        .pipe(gulp.dest('.tmp'));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/assets/scripts/**/*')
    .pipe(gulp.dest('.tmp/assets/scripts'))
});

// Styles
gulp.task('styles', function() {
    return gulp.src([
        'app/assets/styles/**/*.scss',
        'app/assets/styles/**/**/*.scss',
        'app/assets/styles/**/*.css',
        'app/assets/styles/**/**/*.css',
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
    .pipe(gulp.dest('.tmp/assets/styles'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
        'app/assets/styles/webfonts/**/*'
    ], {
        dot: true
    })
    .pipe(size({title: 'fonts'}))
    .pipe(gulp.dest('.tmp/assets/styles/webfonts'));
});

// Optimize images
gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*')
    .pipe(gulp.dest('.tmp/assets/images'))
    .pipe(size({title: 'images'}))
});

// Vendor
gulp.task('vendor', function() {
  return gulp.src('app/assets/vendor/**/*')
    .pipe(gulp.dest('.tmp/assets/vendor'))
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

    gulp.watch(['app/**/*.html', 'app/**/**/*.html'], gulp.series('include-html', 'reload'));
    gulp.watch(['app/assets/styles/webfonts/**/*'], gulp.series('fonts', 'reload'));
    gulp.watch(['app/assets/styles/**/*.{scss,css}'], gulp.series('styles', 'reload'));
    gulp.watch(['app/assets/images/**/*'], gulp.series('images', 'reload'));
    gulp.watch(['app/assets/scripts/**/*'], gulp.series('scripts', 'reload'));
    gulp.watch(['app/assets/vendor/**/*'], gulp.series('vendor', 'reload'));
});

// Serve Default
gulp.task('serve', gulp.series('include-html', 'fonts', 'styles', 'scripts', 'images', 'vendor', 'browsersync'));
