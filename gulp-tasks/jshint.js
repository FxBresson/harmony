let gulp   = require('gulp')
let jshint = require('gulp-jshint')
let map    = require('map-stream')
let Logger =  require('./Logger.js')
let config =  require('./config.js')

let logger = new Logger('JSHINT')

let jshintErrors

let jshintReporter = map(function (file, cb) {

    //if no error callback
    if (file.jshint.success) {
        return cb(null, file)
    }

    //if first reported error
    if (jshintErrors === 0) {
        console.log('\n')
        Logger.separator('yellow')
        logger.error('Error')
        Logger.separator('yellow')
        console.log('\n')
    }
    jshintErrors++
    logger.error(file.path.red)
    file.jshint.results.forEach(function (result) {
        if (!result.error) {
            return
        }

        let err = result.error
        logger.error(`  line ${err.line}, col ${err.character}, code ${err.code}, ${err.reason}`)
    })

    cb(null, file)
})

module.exports = (cb) => {

    jshintErrors = 0

    gulp.src( config.globs.jshint )
        .pipe(
            jshint({
                esversion: 6,
                expr: true,
                devel: true
            })
        )
        .pipe(jshintReporter)

        .on('end', function() {
            if (jshintErrors === 0 ) {
                logger.success('JShint -> OK')
            }
            if (jshintErrors > 0) {
                console.log('\n')
                Logger.separator('yellow')
                logger.error((jshintErrors+' error'+(jshintErrors> 1 ?'s' : '') ).red )
                Logger.separator('yellow')
                console.log('\n')

            }
            cb(jshintErrors > 0 ? 'JSHINT -> Error' : 0)

        })

}