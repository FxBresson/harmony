let async      = require('async')
let concat     = require('./concat.js')
let js         = require('./babelify.js')
let Logger     = require('./logger.js')
let uglify     = require('./uglify.js')

let logger = new Logger('JS')

module.exports = callback => {

    async.series(
        [

            // Concat libs
            (cb) => {
                concat( err => {
                    if (err) return cb(err)
                    cb()
                })
            },

            // Browserify
            (cb) => {
                js( err => {
                    if (err) return cb(err)
                    cb()
                })
            },

            // Uglify
            (cb) => {
                uglify( err => {
                    if (err) return cb(err)
                    cb()
                })
            }
        ],
        (error) => {
            if (error) {
                logger.error( error.red)
            }
            callback(error)
        })
}