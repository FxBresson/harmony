(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//window.location.origin+':3000'

console.log('kjdkj');
var socket = io(window.location.origin + ':3000');

document.addEventListener('click', function () {
	console.log('click');
	socket.emit('test', 'tessst');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUEsUUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sUUFBUCxDQUFnQixNQUFoQixHQUF1QixPQUExQixDQUFiOztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsWUFBTTtBQUN4QyxTQUFRLEdBQVIsQ0FBWSxPQUFaO0FBQ0EsUUFBTyxJQUFQLENBQVksTUFBWixFQUFvQixRQUFwQjtBQUNBLENBSEQ7O0FBT0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvL3dpbmRvdy5sb2NhdGlvbi5vcmlnaW4rJzozMDAwJ1xuXG5jb25zb2xlLmxvZygna2pka2onKVxubGV0IHNvY2tldCA9IGlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rJzozMDAwJylcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdGNvbnNvbGUubG9nKCdjbGljaycpXG5cdHNvY2tldC5lbWl0KCd0ZXN0JywgJ3Rlc3NzdCcpXG59KVxuXG5cblxuXHQvLyAkKCdmb3JtJykuc3VibWl0KGZ1bmN0aW9uKCl7XG5cdC8vIFx0bGV0IG1zZyA9IHt1c2VySWQ6Y3VycmVudFVzZXJJZCwgXCJuYW1lXCI6Y3VycmVudFVzZXIsIFwibXNnXCI6JCgnI20nKS52YWwoKX1cblx0Ly8gXHRzb2NrZXQuZW1pdCgnY2hhdCBtZXNzYWdlJywgbXNnKTtcblx0Ly8gXHQkKCcjbScpLnZhbCgnJyk7XG5cdC8vIFx0cmV0dXJuIGZhbHNlO1xuXHQvLyB9KTtcblx0Ly8gc29ja2V0Lm9uKCdjaGF0IG1lc3NhZ2UnLCBmdW5jdGlvbihtc2cpe1xuXHQvLyBcdGNvbnNvbGUubG9nKG1zZylcblx0Ly8gXHQkKCcjbWVzc2FnZXMnKS5hcHBlbmQoJCgnPGxpPicpLnByZXBlbmQoJCgnPHNwYW4+JykudGV4dChtc2cubmFtZSkpLmFwcGVuZCgkKCc8cD4nKS50ZXh0KG1zZy5tc2cpKSk7XG5cdC8vIH0pO1xuXHQvLyBzb2NrZXQub24oJ3VzZXJDb25uZWN0JywgZnVuY3Rpb24odXNlcil7XG5cdC8vIFx0Y29uc29sZS5sb2coXCJ1c2VyQ29ubmVjdFwiLCB1c2VyLnBzZXVkbylcblx0Ly8gXHRpZiAoY3VycmVudFVzZXIgPT09IG51bGwgKSB7XG5cdC8vIFx0XHRjdXJyZW50VXNlciA9IHVzZXIucHNldWRvO1xuXHQvLyBcdFx0Y3VycmVudFVzZXJJZCA9IHVzZXIuaWQ7XG5cdC8vIFx0XHRjb25zb2xlLmxvZyh1c2VyKVxuXHQvLyBcdFx0JCgnLnBzZXVkbycpLmFwcGVuZChjdXJyZW50VXNlcik7XG5cdC8vIFx0XHQkKCcudXNlcl9pZCcpLmFwcGVuZChjdXJyZW50VXNlcklkKTtcblx0Ly8gXHR9XG5cdC8vIH0pO1xuIl19
