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
        			name : this.name,
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
        				name : this.name,
        				email: this.email,
        				password : this.password
        			}
        			socket.emit('create_user', user)
        		}
        	}
        }
    })

    socket.on('error_connect', (error)=> {
    	vueSignin.globalError = error
    	vueSignin.loading = false
    })
}
export default signin