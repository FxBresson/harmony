let async           = require('async')
let gulp            = require('gulp')
let iconfont        = require('gulp-iconfont')
let consolidate     = require('gulp-consolidate')
let config          = require('./config.js')
let svgmin          = require('./svgo.js')
let Logger          = require('./logger.js')

let logger = new Logger('ICONFONT')

/**
 * This is needed for mapping glyphs and codepoints.
 */
function mapGlyphs (glyph) {
    return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase() }
}

module.exports = (callback) => {
    svgmin(function() {

        let iconfontError = 0
        let iconStream = gulp.src([config.paths.svg+'**/*.svg'])
            .pipe(iconfont({
                fontName: 'main-iconfont',
                prependUnicode: false,
                normalize: true,
                fontHeight: 1001
            }))

        async.parallel([
            function handleGlyphs(cb) {
                iconStream.on('glyphs', function(glyphs, options) {
                    gulp.src([config.paths.templates+'_icons.scss'])
                        .pipe(consolidate('lodash', {
                            glyphs:    glyphs.map(mapGlyphs),
                            fontName:  'main-iconfont',
                            fontPath:  config.paths.cssRelativeFonts,
                            className: 'icon'
                        }))
                        .pipe( gulp.dest( config.paths.scss ) )
                        .on('finish', cb)
                })
            },

            function handleFonts(cb) {
                iconStream
                    .pipe(gulp.dest(config.paths.fonts+'icons/'))
                    .on('error', () => {
                        iconfontError = 1
                    })
                    .on('finish', () => {
                        if (!iconfontError) logger.success('Font build successful')
                        cb(iconfontError ? 'Error' : 0)
                    })
            }

        ], callback)

    })
}