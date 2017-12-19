import Cookie from 'js-cookie'

let signin = (socket) => {

	let vueSignin = new Vue({
		delimiters: ['${', '}'],
        el: '#signin',
        data: {
        	current:'login',
        	name:'',
        	email:'',
        	password:'',
        	confirmPassword:'',
        	errorConfirmPassword:false,
        	globalError:false,
        	loading:false
        },
        methods:{
        	toggle: function (toggle) {
        		this.current = toggle
        	},
        	login: function() {
        		this.loading = true
        		let user = {
        			username : this.name,
        			password : this.password
        		}
        		socket.emit('connect_user', user)

        	},
        	newAccount: function() {
        		this.loading = true

        		if (this.password != this.confirmPassword) {
        			this.errorConfirmPassword = true
        			this.loading = false
        		} else {
        			let user = {
        				username : this.name,
        				email: this.email,
        				password : this.password
        			}
        			socket.emit('create_user', user)
        		}
        	}
        }
    })

    socket.on('success_connect', (res)=> {
    	vueSignin.loading = false
    	if (Cookie.get('current_user') == undefined) {
    		Cookie.set('current_user', res.userId, { expires: 7, path: '/' })
    	} else {
    		Cookie.remove('current_user')
    		Cookie.set('current_user', res.userId, { expires: 7, path: '/' })
    	}

    	document.location.href = res.url

    })

    socket.on('error_connect', (error)=> {
    	vueSignin.globalError = error
    	vueSignin.loading = false
    })
}
export default signin