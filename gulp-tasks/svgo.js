let config = require('./config.js')
let gulp   = require('gulp')
let svgo   = require('gulp-svgo')


module.exports = function (cb) {
    gulp.src(config.paths.svg+'**/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest(config.paths.svg))
        .on('end', () => {
            cb()
        })
}