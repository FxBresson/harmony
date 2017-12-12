let gulp       = require('gulp');
let browserify = require('browserify');
let babelify   = require('babelify');
let watchify   = require('watchify');
let rename     = require('gulp-rename');
let source     = require('vinyl-source-stream');
let Logger     = require('./logger.js');
let config     = require('./config.js');
let async      = require('async');

let logger = new Logger('JS');

let appBundler;
let browserifyAppError;

function logAndReturnError(type) {
    let _error;
    let _string;
    if (type === 'app') {
        _error = browserifyAppError;
        _string = 'App';
    }

    if (!_error) logger.moduleSuccess('Browserify ('+_string+')', 'Successful build');
    else logger.moduleError('Browserify ('+_string+')', 'Build failure');
    return _error;
}

function bundle(type, bundler, src, name, watching, cb) {

    if (watching) logger.moduleWarn('Watchify ('+type+')', 'Awaiting changes');
    bundler.bundle()
    // apparently error handling must be done here
        .on('error', function(err){

            if (type === 'app') browserifyAppError = true;

            console.log(err.message);

            if (!watching)
                this.emit('end');
            else
                cb('Browserify -> Error' );

        })
        .pipe(source( src ))
        .pipe( rename( name ) )
        .pipe(gulp.dest( config.paths.distJs ))

        .on('end', () => {
            if (!watching)
                cb(logAndReturnError(type) ? 'Browserify -> Error'  : 0);
        });


}


function bundleApp(cb, watching) {
    browserifyAppError = false;
    //type, bundler, source, rename watching cb
    bundle('app',   appBundler,   config.paths.js + config.input.js.app,   config.output.js.app,   watching, cb);
}


module.exports = (callback, watching) => {

    let options = watching ? watchify.args : {};

    options.cache        = {};
    options.packageCache = {};
    options.fullPaths    = false;
    options.debug        = true;

    options.entries = config.paths.js + config.input.js.app;

    if (!watching) {
        appBundler = browserify(options);
    }
    else {
        appBundler = watchify( browserify(options) , { poll: true } );
    }

    appBundler.transform( babelify, {presets: ['es2015'], global: true});


    if (!watching) {

        async.parallel(
            [
                (cb) => {

                    bundleApp(
                        (err) => {
                            if (err) return cb(err);
                            cb();
                        }, 0);
                }
            ],
            (err) => {
                callback(err);
            }
        );

    } else {

        
        appBundler
            .on('update', function () {
                logger.moduleSuccess('Browserify (App)', 'Bundled'.green);
                bundleApp(logAndReturnError.bind(this, 'app'), 1);
            });

        bundleApp(logAndReturnError.bind(this, 'app'),1);
    }

};