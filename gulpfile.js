const gulp = require('gulp'),
stylus = require('gulp-stylus'),
rename = require('gulp-rename'),
browserify = require('browserify'),
babelify = require('babelify'),
source = require('vinyl-source-stream'),
buffer = require('vinyl-buffer'),

stylusPath = './stylus/',
jsPath = './js/',
buildPath = './build/';

gulp.task('es6', function() {

  browserify(jsPath + 'main.js')
    .transform('babelify', { presets: ['es2015'] })
    .bundle()
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(gulp.dest(buildPath));
});

gulp.task('stylus', function() {
  gulp.src(stylusPath + 'main.styl')
    .pipe(stylus({
      'compress': true,
      'include css': true
    }))
    .pipe(rename('build.css'))
    .pipe(gulp.dest(buildPath));
});

gulp.task('default', ['stylus', 'es6'], function() {
  gulp.watch(stylusPath + '**/*.styl', ['stylus']);
  gulp.watch(stylusPath + '**/*.css', ['stylus']);
  gulp.watch(jsPath + '**/*.js', ['es6']);
});