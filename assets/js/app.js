(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//window.location.origin+':3000'

console.log('kjdkj');
var socket = io(window.location.origin + ':3000');

document.addEventListener('click', function () {
	console.log('get users');
	socket.emit('get_users');
});

socket.on('users', function (data) {
	console.log(data);
});

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUEsUUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sUUFBUCxDQUFnQixNQUFoQixHQUF1QixPQUExQixDQUFiOztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsWUFBTTtBQUN4QyxTQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsUUFBTyxJQUFQLENBQVksV0FBWjtBQUNBLENBSEQ7O0FBS0EsT0FBTyxFQUFQLENBQVUsT0FBVixFQUFtQixVQUFDLElBQUQsRUFBUztBQUMzQixTQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsQ0FGRDs7QUFLQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vd2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnXG5cbmNvbnNvbGUubG9nKCdramRraicpXG5sZXQgc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbisnOjMwMDAnKVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0Y29uc29sZS5sb2coJ2dldCB1c2VycycpXG5cdHNvY2tldC5lbWl0KCdnZXRfdXNlcnMnKVxufSlcblxuc29ja2V0Lm9uKCd1c2VycycsIChkYXRhKT0+IHtcblx0Y29uc29sZS5sb2coZGF0YSlcbn0pXG5cblxuXHQvLyAkKCdmb3JtJykuc3VibWl0KGZ1bmN0aW9uKCl7XG5cdC8vIFx0bGV0IG1zZyA9IHt1c2VySWQ6Y3VycmVudFVzZXJJZCwgXCJuYW1lXCI6Y3VycmVudFVzZXIsIFwibXNnXCI6JCgnI20nKS52YWwoKX1cblx0Ly8gXHRzb2NrZXQuZW1pdCgnY2hhdCBtZXNzYWdlJywgbXNnKTtcblx0Ly8gXHQkKCcjbScpLnZhbCgnJyk7XG5cdC8vIFx0cmV0dXJuIGZhbHNlO1xuXHQvLyB9KTtcblx0Ly8gc29ja2V0Lm9uKCdjaGF0IG1lc3NhZ2UnLCBmdW5jdGlvbihtc2cpe1xuXHQvLyBcdGNvbnNvbGUubG9nKG1zZylcblx0Ly8gXHQkKCcjbWVzc2FnZXMnKS5hcHBlbmQoJCgnPGxpPicpLnByZXBlbmQoJCgnPHNwYW4+JykudGV4dChtc2cubmFtZSkpLmFwcGVuZCgkKCc8cD4nKS50ZXh0KG1zZy5tc2cpKSk7XG5cdC8vIH0pO1xuXHQvLyBzb2NrZXQub24oJ3VzZXJDb25uZWN0JywgZnVuY3Rpb24odXNlcil7XG5cdC8vIFx0Y29uc29sZS5sb2coXCJ1c2VyQ29ubmVjdFwiLCB1c2VyLnBzZXVkbylcblx0Ly8gXHRpZiAoY3VycmVudFVzZXIgPT09IG51bGwgKSB7XG5cdC8vIFx0XHRjdXJyZW50VXNlciA9IHVzZXIucHNldWRvO1xuXHQvLyBcdFx0Y3VycmVudFVzZXJJZCA9IHVzZXIuaWQ7XG5cdC8vIFx0XHRjb25zb2xlLmxvZyh1c2VyKVxuXHQvLyBcdFx0JCgnLnBzZXVkbycpLmFwcGVuZChjdXJyZW50VXNlcik7XG5cdC8vIFx0XHQkKCcudXNlcl9pZCcpLmFwcGVuZChjdXJyZW50VXNlcklkKTtcblx0Ly8gXHR9XG5cdC8vIH0pO1xuIl19
