let listPrivates = (socket) => {
	let $listPrivates = document.getElementById('listPrivates')
	if($listPrivates) {
		let error = null
		socket.on('return_channels', (data)=> {
			if(data === null) {
				data  = []
				error = 'Aucun channel privé'
			}
			let vueListPrivates = new Vue({
				delimiters: ['${', '}'],
		        el: '#listPrivates',
		        data: {
		        	privates: data,
		        	error:error,
		        	showModal: false
		        },
		        components: {
		        	'modal': {
		        	  	template: '#modal-template'
		        	}
		        }
		    })
		})
	}
}
export default listPrivates