//section-profile

let profile = (socket) => {
	let $profile = document.getElementById('section-profile')
	if($profile) {
		let vueprofile = new Vue({
			delimiters: ['${', '}'],
	        el: '#section-profile',
	        data: {
	        	user: {},

	        },
	        methods:{

	        }
	    })
	    socket.emit('get_current_user', current_user)

	    socket.on('success_get_current_user', (user) => {
	    	console.log('pp', user)
	    	vueprofile.user = user
	    })
	}
}
export default profile