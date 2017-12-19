let listPrivates = (socket) => {
	let $listPrivates = document.getElementById('listPrivates')
	if($listPrivates) {
		let error = null
		console.log(current_user)
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
	        	privates: [],
	        	error: null,
	        	showModal: false,
	        	title: '',
	        	description:'',
	        	selected: null
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
        				id_user: current_user
        			}
        			this.title = ''
        			this.description = ''
        			this.$children[0].internalTitle = ''
        			this.$children[0].internalDesc = ''
        			socket.emit('create_channel', privateChan)

        		},
        		selectChan: function(id) {
        			socket.emit('select_chan', id)
        			socket.emit('get_channel_messages', id)
        		}
        	}
	    })
		socket.emit('get_privates', current_user)
		socket.on('return_privates', (data)=> {
			if(data === null) {
				data  = []
				error = 'Aucun channel privé'
			}
			vueListPrivates.privates = data
			vueListPrivates.error = error

		})

		socket.on('select_chan', (chan) => {
	    	vueListPrivates.selected = chan.id_channel
	    })


		socket.on('success_create_channel', ()=> {
			socket.emit('get_privates', current_user)
		})
	}
}
export default listPrivates