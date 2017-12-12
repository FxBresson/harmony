let gulp    = require('gulp')
let uglify  = require('gulp-uglify')
let config  = require('./config.js')
let Logger  = require('./logger.js')
let rename  = require('gulp-rename')

let logger  = new Logger('UGLIFY')

let uglifyError
function _uglify(src, dest, cb) {
    gulp.src(config.paths.distJs+src)
        .pipe(uglify().on('error', function(e) {
            logger.error( src )
            logger.error( e )
        }))
        .pipe(rename(dest))
        .pipe(gulp.dest(config.paths.distJs))
        .on('error', (e) => {
            uglifyError++
        })
        .on('end', () => {
            cb(uglifyError ? 'Error' : 0)
        })
}

module.exports = callback => {
    uglifyError = 0
    _uglify('main.js', 'main.min.js', (err) => {
        if (err) return callback(err)
        logger.log('- main.min.js done.')
        _uglify('libs.build.js', 'libs.build.min.js', (err) => {
            if (err) return callback(err)
            logger.log('- libs.build.min.js done.')
            logger.success('JS is really ugly :/ ')
            callback()
        })
    })
}