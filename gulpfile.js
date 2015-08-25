var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var del = require('del');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var csso = require('gulp-csso');
// var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var minifyCSS = require('gulp-minify-css');
// var nib = require('nib');
// var cssbeautify = require('gulp-cssbeautify');
// var cache = require('gulp-cache');
// var path = require('path');
// var watch = require('gulp-watch');
// var clean = require('gulp-clean');


//Errors log
handleError = function(err) {
    gutil.log(err);
    gutil.beep();
};


//Server
gulp.task('webserver', function() {
    gulp.src('public')
    .pipe(webserver({
        host: 'localhost',
        //host: 'localhost',
        port: 3012,
        livereload: true
    }));
});


//scss
gulp.task('scss', function () {
  gulp.src('develop/assets/scss/*')
    .pipe(sass())
    // .on('error', handleError)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ie 10', 'ie 11', 'ie 12', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concat('styles.css'))
    .pipe(csso())
    .pipe(gulp.dest('public/assets/css'));
    // .pipe(rename('styles.css'))
    // .pipe(minifyCSS({
    //     keepBreaks:false
    // }))
    // .pipe(rename('styles.min.css'))
    // .pipe(gulp.dest('public/assets/css'));
    // gulp.src('develop/assets/scss/*.css').pipe(gulp.dest('public/assets/css'));



});


//Twig
gulp.task('twig-compile', function () {
    'use strict';
    var twig = require('gulp-twig');
    return gulp.src(['develop/pages/**/*.twig', '!./develop/pages/layouts/*.twig'])
      .pipe(twig({
          data: {
              title: 'Gulp and Twig'
          }
      }))
      //.on('error', handleError)
      .pipe(gulp.dest('public'));
});


//Copy scripts
gulp.task('js', function() {
    gulp.src('develop/assets/js/**/*')
        .on('error', handleError)
        // .pipe(concat('all.js'))
        // .pipe(gulp.dest('./dist'))
        // .pipe(rename('all.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('public/assets/js'));
});

//Copy images
gulp.task('images', function() {
    gulp.src('develop/assets/images/**/*')
        .on('error', handleError)
        //.pipe(imagemin())
        .pipe(gulp.dest('public/assets/images'));
});
// gulp.task('clean-img', function(cb) {
//     del(['public/assets/images/**/*'], cb)
// });


//Sprite
gulp.task('sprite', function () {
    var spriteData = gulp.src('develop/assets/images/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath:'/assets/images/sprite.png',
        algorithm:'binary-tree',
        cssName: 'sprite.css',
        cssFormat:'css'
    }));
    spriteData.img.pipe(gulp.dest('develop/assets/images/'));
    spriteData.css.pipe(gulp.dest('develop/assets/less/libs/'));
});

//Copy fonts
// gulp.task('fonts', function() {
//     gulp.src('develop/assets/less/libs/fonts/**/*')
//         .on('error', handleError)
//         .pipe(gulp.dest('public/assets/css/fonts'));
// });



//Clean public files
gulp.task('cp', function(cb) {
  del(['public/**/*.*'], cb);
});

//Clean public files and folders
gulp.task('cpf', function(cb) {
  del(['public/**/*']);
});


//Clean release files
gulp.task('cr', function(cb) {
  del(['release/**/*.*'], cb);
});

//Clean release files and folders
gulp.task('crf', function(cb) {
  del(['release/**/*'], cb);
});

//Copy release
gulp.task('release', function(cb) {
  gulp.src('public/**/*')
      .pipe(gulp.dest('release'));
});



//Watch
gulp.task("watch", function(){
  gulp.watch(['develop/assets/scss/**/*'], ['scss']);
  gulp.watch('develop/**/*.twig', ['twig-compile']);
  gulp.watch('develop/assets/images/**/*', ['images']);
  gulp.watch('develop/assets/images/sprite/*.png', ['sprite']);
  gulp.watch(['develop/assets/js/*', '!develop/assets/js/libs/**/*'], ['js']);
});

gulp.task('b', ['twig-compile', 'scss', 'images', 'js', 'sprite']);

gulp.task('default', ['cp'], function() {
    gulp.start('b', 'watch', 'webserver');
});

gulp.task('r', ['cr'], function() {
    gulp.start('release');
});
