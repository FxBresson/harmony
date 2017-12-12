/**
* npm install
*
sudo npm i --save-dev browserify babelify watchify gulp-rename vinyl-source-stream async gulp-watch gulp-concat jshint gulp-jshint map-stream gulp-compass gulp-clean-css gulp-cssbeautify gulp-plumber gulp-iconfont gulp-consolidate lodash colors gulp.spritesmith gulp-svgo gulp-uglify vinyl-buffer utils-merge gulp-sourcemaps babel-cli babel-preset-es2015 gulp-wrap gulp-insert gulp-replace gulp-declare path
*
**/
let gulp = require('gulp')

/**
 * GULP MAIN TASKS :
 *     - $gulp css (compiles scss and beautifies output)
 *     - $gulp js (compiles all js files, templates and uglifies)
 *     - $gulp dev (compiles scss, js and watches for changes)
 */

let tasks = {
    concat:   require('./gulp-tasks/concat.js'),
    css:      require('./gulp-tasks/css.js'),
    dev:      require('./gulp-tasks/dev.js'),
    js:       require('./gulp-tasks/js.js'),
    jshint:   require('./gulp-tasks/jshint.js'),
    babelify: require('./gulp-tasks/babelify.js'),
    release:  require('./gulp-tasks/release.js'),
    watch:    require('./gulp-tasks/watch.js'),
    font:     require('./gulp-tasks/icons.js')
}


gulp.task('babelify', tasks.babelify)
gulp.task('jshint',  tasks.jshint)
gulp.task('concat', tasks.concat)



/**
 * ======== css ========
 * compass
 * cssbeautify
 */
gulp.task('css',  tasks.css)

/**
 * ======== js ========
 * concat
 * babelify
 * uglify
 */
gulp.task('js',  tasks.js)

/**
 * ======== dev ========
 * css
 * concat
 * babelify
 * watch
 */
gulp.task('dev', tasks.dev)


/**
 * ======== font ========
 * iconfont
 * css
 */
gulp.task('font', tasks.font)

/**
 * ======== release ========
 *  jshint
 *  js (concat, babelify, uglify)
 *  icons (sprites, iconfont, css)
 */

gulp.task("release", tasks.release)


gulp.task("watch", tasks.watch)
gulp.task("default", tasks.dev)