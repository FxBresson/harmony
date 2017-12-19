let headerChat = (socket) => {
	let $headerChat = document.getElementById('section-top')
	if($headerChat) {
		let idChan = 0
		let vueheaderChat = new Vue({
			delimiters: ['${', '}'],
	        el: '#section-top',
	        data: {
	        	title: '',
	        	currentChan:'',
	        	desc:''
	        },
	        methods:{
	        }
	    })


	    socket.on('select_chan', (chan) => {
	    	console.log("kjknk", chan)
	    	vueheaderChat.currentChan = chan.id_channel
	    	vueheaderChat.title = chan.name
	    	vueheaderChat.desc = chan.description
	    	console.log(vueheaderChat, vueheaderChat.title)
	    })

	}
}
export default headerChat