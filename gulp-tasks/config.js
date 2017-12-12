let config= {

    paths: {
        js: './dev/js/',
        scss: './dev/scss/',
        css: './dev/css/',
        distCss: './assets/css/',
        distJs: './assets/js/',
        dist: './assets/',
        fonts: './assets/fonts/',
        cssRelativeFonts: '../fonts/icons/',
        svg: './dev/svg/',
        templates: './dev/templates/',
        templatesSplit: ['assets', 'templates']
    },

    input: {
        js: {
            app: 'main.js'
        },
        scss: {
            app: 'main.scss'
        }
    },

    output: {
        js: {
            app: 'app.js',
        },
        css: {
            app: 'style.css'
        }
    }

}

config.globs = {
    libsConcat: [
        config.paths.js+'libs/**/*.js',
        '!'+config.paths.js+'libs/0-jquery-3.1.1.min.js',
    ],
    jshint: [
        config.paths.js+'*.js',
    ]
}



module.exports = config