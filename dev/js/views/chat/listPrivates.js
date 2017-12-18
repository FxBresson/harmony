let listPrivates = (socket) => {
	let $listPrivates = document.getElementById('listPrivates')
	if($listPrivates) {
		let error = null
		socket.on('return_channels', (data)=> {
			if(data === null) {
				data  = []
				error = 'Aucun channel privé'
			}
			Vue.component('modal', {
			  template: '#modal-template',
			  //The child has a prop named 'value'. v-model will automatically bind to this prop
			  props: ['show'],
			  data: function() {
			    return {
			      internalValue: ''
			    }
			  },
			  watch: {
			    'internalValue': function() {
			      // When the internal value changes, we $emit an event. Because this event is
			      // named 'input', v-model will automatically update the parent value
			      if (!this.internalValue) {this.$emit('close', this.internalValue);}

			    }
			  },
			  created: function() {
			    // We initially sync the internalValue with the value passed in by the parent
			    this.internalValue = this.show;
			  }
			})


			let vueListPrivates = new Vue({
				delimiters: ['${', '}'],
		        el: '#listPrivates',
		        data: {
		        	privates: data,
		        	error:error,
		        	showModal: false
		        },
		        methods: {
	        		closeModal: function() {
	        			vueListPrivates.showModal = false
	        		}
	        	}
		    })
		})
	}
}
export default listPrivates