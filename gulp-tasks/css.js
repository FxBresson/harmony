let gulp        = require('gulp')
let watch       = require('gulp-watch')
let compass     = require('gulp-compass')
let cssbeautify = require('gulp-cssbeautify')
let plumber     = require('gulp-plumber')
let Logger      =  require('./logger.js')
let config      =  require('./config.js')

let logger = new Logger('CSS')

let cssErrors
function onError(error) {
    cssErrors++
    logger.moduleError('Compass', 'Error')
    logger.moduleLog('Compass', 'Watching again')
}

function compile(cb) {
    cssErrors = 0
    gulp.src([
            config.paths.scss + config.input.scss.app
        ])
        .pipe(plumber(onError))
        .pipe(compass({
            config_file: './config.rb',
            css: config.paths.distCss,
            sass: config.paths.scss
        }))
        .pipe(cssbeautify())
        .pipe(gulp.dest(config.paths.distCss))
        .on('error', () => { cssErrors++ })
        .on('end', () => {
            if (!cssErrors) logger.success('Successful compilation')
            else logger.error('Compilation failed')
            if (cb) cb()
        })
}

module.exports = (cb, watching) => {

    if (watching) {
        watch(config.paths.scss+'**/*.scss', () => { compile(cb) })
            .on('change', function(event) {
                logger.moduleLog('Compass','File '.green + event + ' was changed'.green)
            }).on('error', onError)
        logger.moduleWarn('Watch', 'Awaiting changes')
    } else {
        compile(cb)
    }

}