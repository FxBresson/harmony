let gulp    = require('gulp');
let watch   = require('gulp-watch');
let concat  = require('gulp-concat');
let config  = require('./config.js');
let Logger  = require('./Logger.js');

let logger = new Logger('CONCAT');
function compile(callback) {
    let concatError = 0;
    gulp.src(config.globs.libsConcat)
        .pipe(concat('libs.build.js'))
        .pipe(gulp.dest(config.paths.dist))
        .on('error', () => {
            concatError++;
        })
        .on('end', () => {
            if (!concatError) logger.success('Libraries concatenated successfully');
            if (callback) callback(concatError ? 'Error' : 0);
        });
}

module.exports = (callback, watching) => {
    if (watching) {
        watch(config.paths.js+'libs/**/*.js', () => { compile(callback); })
            .on('change', function(event) {
                logger.moduleLog('Concat','File '.green + event + ' was changed'.green);
            }).on('error', () => {
            concatError++;
        });
        logger.moduleWarn('Watch', 'Awaiting changes')
    } else {
        compile(callback);
    }

};