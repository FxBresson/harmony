//window.location.origin+':3000'

console.log('kjdkj')
let socket = io(window.location.origin+':3000')

document.addEventListener('click', () => {
	console.log('click')
	socket.emit('test', 'tessst')
})



	// $('form').submit(function(){
	// 	let msg = {userId:currentUserId, "name":currentUser, "msg":$('#m').val()}
	// 	socket.emit('chat message', msg);
	// 	$('#m').val('');
	// 	return false;
	// });
	// socket.on('chat message', function(msg){
	// 	console.log(msg)
	// 	$('#messages').append($('<li>').prepend($('<span>').text(msg.name)).append($('<p>').text(msg.msg)));
	// });
	// socket.on('userConnect', function(user){
	// 	console.log("userConnect", user.pseudo)
	// 	if (currentUser === null ) {
	// 		currentUser = user.pseudo;
	// 		currentUserId = user.id;
	// 		console.log(user)
	// 		$('.pseudo').append(currentUser);
	// 		$('.user_id').append(currentUserId);
	// 	}
	// });
