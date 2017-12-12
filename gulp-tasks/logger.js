let colors = require('colors')

class Logger {

    constructor(module) {
        this.module = module
    }

    log(...messages) {
        let _msg = this.formatMessages('log', null, messages)
        console.log(_msg)
    }

    moduleLog(submodule, ...messages) {
        let _msg = this.formatMessages('log', submodule, messages)
        console.log(_msg)
    }


    success(...messages) {
        let _msg = this.formatMessages('success', null, messages)
        console.log(_msg)
    }

    moduleSuccess(submodule, ...messages) {
        let _msg = this.formatMessages('success', submodule, messages)
        console.log(_msg)
    }

    warn(...messages) {
        let _msg = this.formatMessages('warn', null, messages)
        console.warn(_msg)
    }

    moduleWarn(submodule, ...messages) {
        let _msg = this.formatMessages('warn', submodule, messages)
        console.warn(_msg)
    }

    error(...messages) {
        let _msg = this.formatMessages('error', null, messages)
        console.error(_msg)
    }

    moduleError(submodule, ...messages) {
        let _msg = this.formatMessages('error', submodule, messages)
        console.error(_msg)
    }

    static separator(color) {
        let _sep = '===================================='
        if (color && colors[color])
            _sep = colors[color](_sep)

        console.log(_sep)
    }

    formatMessages(type, submodule, messages) {

        let _time = '['+new Date().toLocaleTimeString()+'] '
        let _msg = _time.cyan +this.module+' ->'
        let color
        if (submodule) _msg+= ' '+submodule+' ->'

        switch(type) {
            case 'warn':
                color = 'yellow'
                break
            case 'error':
                color = 'red'
                break
            case 'success':
                color = 'green'
                break
        }
        if (color) _msg = colors[color](_msg)

        for (let i = 0, j =messages.length; i<j; ++i) {
            _msg+= ' '+ messages[i]
        }

        return _msg

    }
}

module.exports = Logger