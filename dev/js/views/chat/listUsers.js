let listUsers = (socket) => {
	let $listUsers = document.getElementById('listUsers')
	if($listUsers) {
		let error = null
    let vueListUsers = new Vue({
				delimiters: ['${', '}'],
		        el: '#listUsers',
		        data: {
		        	users: [],
		        	error: null
		        },
          methods: {
              sendInvite: function(id_user) {
                 socket.emit('send_invite', {current_user: current_user, user_to_invite: id_user}); 
              },
              acceptInvite: function(id_user) {
                 socket.emit('accept_invite', {current_user: current_user, user_initiator: id_user}); 
              },
              refuseInvite: function(id_user) {
                 socket.emit('refuse_invite', {current_user: current_user, user_initiator: id_user}); 
              }
          }
    })
		socket.on('return_users', (data)=> {
			if(data === null) {
				data  = []
				error = 'Aucun user trouvé...'
			}
      vueListUsers.users = data
			vueListUsers.error = error
        console.log(data);
			
		})
    
    socket.on('success_friend_interraction', () => {
		  socket.emit('get_users', current_user)
    })
    
		socket.emit('get_users', current_user)
	}
}
export default listUsers