let async       = require('async')
let cleanCSS    = require('gulp-clean-css')
var rename      = require('gulp-rename')
let js          = require('./js.js')
let jshint      = require('./jshint.js')
let Logger      = require('./Logger.js')
let icons       = require('./icons.js')
let config      =  require('./config.js')

let gulp        = require('gulp')

let logger      = new Logger('RELEASE')

module.exports  = (callback) => {

    async.series(
        [
            // JSHINT before browserify
            (cb) => {
                jshint( err => {
                    if (err) return cb(err)
                    cb()
                })
            },

            // JS (concat, browserify, uglify)
            (cb) => {
                js( err => {
                    if (err) return cb(err)
                    cb()
                })
            },

            // CSS clean
            (cb) => {
                cleanCss( err => {
                    if (err) return cb(err)
                    cb()
                })
            },
        ],
        (error) => {
            if (error) {
                logger.error( error.red)
            } else {
                Logger.separator('green')
                logger.success( 'OK')
                Logger.separator('green')
                console.log('\n')
            }

            callback()
        })
}

function cleanCss( callback ) {
    let cssError = 0

    gulp.src( [config.paths.distCss+'*.css', '!'+config.paths.distCss+'*.min.css'] )
        .pipe( cleanCSS({compatibility: 'ie9'}))
        .pipe( rename({ suffix: ".min" }) )
        .pipe( gulp.dest( config.paths.dist+'css/' ) )
        .on('error', () => {
            cssError++
        })
        .on('end', () => {
            if (!cssError) logger.success('CSS minified successfully')
            if (callback) callback(cssError ? 'Error' : 0)
        })
}