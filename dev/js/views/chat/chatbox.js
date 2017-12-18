let chatbox = (socket) => {
	let $chatbox = document.getElementById('section-input')
	if($chatbox) {
		let $submit = document.getElementsByClassName('send')[0]
		let $input  = document.getElementById('send-message')
		let vuechatbox = new Vue({
			delimiters: ['${', '}'],
	        el: '#section-input',
	        data: {
	        	message: '',
	        	currentChan: document.getElementById('selectedChannel').value
	        },
	        methods:{
	        	send: function() {
	        		$input = document.getElementById('submit')
			    	// Check if the current message is empty or not
			    	if (this.message && this.message != '') {
			    		this.currentChan = document.getElementById('selectedChannel').value
			    		// Creating a nex message
		    		  	// reinitialise the input and blur it
		        		let message = {
		        			content: this.message,
		        			id_user: 1,
		        			id_channel: this.currentChan,
		        		}

		        		socket.emit('send_message', message)
		        		this.message = ''
		        	}
	        	}
	        }
	    })

	    socket.on('success_send_message', () => {
	    	socket.emit('get_channel_messages', document.getElementById('selectedChannel').value)
	    })
	}
}
export default chatbox