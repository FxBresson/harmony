let async       = require('async')
let concat      = require('./concat.js')
let css         = require('./css.js')
let babelify    = require('./babelify.js')
let watch       = require('./watch.js')
let Logger      = require('./Logger.js')

let logger = new Logger('DEV')

module.exports = (callback) => {

    async.series(
        [

            // Concat libs
            (cb) => {
                concat( err => {
                    if (err) return cb(err)
                    cb()
                })
            },

            // babelify
            (cb) => {
                babelify( err => {
                    if (err) return cb(err)
                    cb()
                })
            },

            // Compass
            (cb) => {
                css( err => {
                    if (err) return cb(err)
                    cb()
                })
            }

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

            watch(callback)
        })
}