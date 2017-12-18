let listPrivates = (socket) => {
	let $listPrivates = document.getElementById('listPrivates')
	if($listPrivates) {
		let error = null
		socket.emit('get_privates', window.current_user)
		socket.on('return_privates', (data)=> {
			console.log(data)
			if(data === null) {
				data  = []
				error = 'Aucun channel privé'
			}
			Vue.component('modal', {
			  template: '#modal-create',
			  props: ['show', 'title'],
			  data: function() {
			    return {
			      internalShow: '',
			      internalTitle:'',
			      internalDesc:''
			    }
			  },
			  watch: {
			    'internalShow': function() {
			      	if (!this.internalShow) {this.$emit('close', this.internalShow)}
			    }
			  },
			  created: function() {
			    this.internalShow  = this.show
			    this.internalTitle = this.title
			    this.internalDesc  = this.description
			  }
			})


			let vueListPrivates = new Vue({
				delimiters: ['${', '}'],
		        el: '#listPrivates',
		        data: {
		        	privates: data,
		        	error: error,
		        	showModal: false,
		        	title: '',
		        	description:''
		        },
		        methods: {
	        		closeModal: function() {
	        			this.showModal = false
	        			this.$children[0].internalShow = false

	        		},
	        		createNewChan: function() {
	        			this.title = this.$children[0].internalTitle
	        			this.description = this.$children[0].internalDesc
	        			this.closeModal()
	        			let privateChan = {
	        				id_type: 2,
	        				position: null,
	        				name: this.title,
	        				description: this.description,
	        				id_user: 1
	        			}
	        			socket.emit('create_channel', privateChan)

	        		}
	        	}
		    })
		})


		socket.on('success_create_channel', ()=> {
			socket.emit('return_privates', window.current_user)
		})
	}
}
export default listPrivates