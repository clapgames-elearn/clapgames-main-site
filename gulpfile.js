var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * ClapGames.in - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

var appConfig  = {
    base : './app/',
    dest : './dest/',
    tmp : './tmp/'
};

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src( appConfig.base + 'less/**/*.less' )
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(appConfig.tmp + 'css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src(appConfig.tmp + 'css/**/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(appConfig.dest + 'css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src(appConfig.base + 'js/**/*.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(appConfig.dest + 'js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest(appConfig.dest + 'vendor/bootstrap'))
 
    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest(appConfig.dest + 'vendor/jquery'))

    gulp.src([appConfig.base + 'img/**/*'])
        .pipe(gulp.dest(appConfig.dest + 'img/'))
   
    gulp.src([appConfig.base + '**/*.html'])
        .pipe(gulp.dest(appConfig.dest))
    
    gulp.src([appConfig.base + 'mail/*.*'])
        .pipe(gulp.dest(appConfig.dest + 'mail/'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest(appConfig.dest + 'vendor/font-awesome'))
})

// Run everything
gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: appConfig.dest
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js', 'copy'], function() {
    gulp.watch(appConfig.base + '**/*.*', ['less', 'minify-css', 'minify-js', 'copy', browserSync.reload]);
});
