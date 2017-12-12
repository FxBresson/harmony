let babelify = require('./babelify.js')
let css      = require('./css.js')
let concat   = require('./concat.js')

module.exports = (cb) => {

    babelify( 0, 'watch')
    css( 0, 'watch')
    concat(0, 'watch')
    cb()
}