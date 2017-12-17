let loader = (socket) => {
	let currentChan = document.getElementById('selectedChannel').value
	let $loader = document.getElementById('mainLoader')
	if($loader) {
		let $submit = document.getElementsByClassName('send')[0]
		let $input  = document.getElementById('send-message')
		let vueloader = new Vue({
			delimiters: ['${', '}'],
	        el: '#mainLoader',
	        data: {
	        	currentChan: currentChan
	        },
	        methods:{
	        }
	    })
	}
}
export default loader