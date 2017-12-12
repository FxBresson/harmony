var gulp       = require('gulp')
let config     = require('./config.js')

var browserify = require('browserify')
var watchify   = require('watchify')
var babelify   = require('babelify')

var source     = require('vinyl-source-stream')
var buffer     = require('vinyl-buffer')
var merge      = require('utils-merge')

var rename     = require('gulp-rename')
var uglify     = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')


/* nicer browserify errors */
var gutil      = require('gulp-util')
var chalk      = require('chalk')

function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + config.paths.js, ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  this.end()
}
/* */

gulp.task('watchify', function () {
  var args = merge(watchify.args, { debug: true })
  var bundler = watchify(browserify(config.paths.js+'/app.js', args)).transform(babelify, { presets: ["es2015"] })
  bundle_js(bundler)

  bundler.on('update', function () {
    bundle_js(bundler)
  })
})

function bundle_js(bundler) {
  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('app/dist'))
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      // capture sourcemaps from transforms
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/dist'))
}
