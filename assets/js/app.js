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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXZcXGpzXFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQSxRQUFRLEdBQVIsQ0FBWSxPQUFaO0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxRQUFQLENBQWdCLE1BQWhCLEdBQXVCLE9BQTFCLENBQWI7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxZQUFNO0FBQ3hDLFNBQVEsR0FBUixDQUFZLFdBQVo7QUFDQSxRQUFPLElBQVAsQ0FBWSxXQUFaO0FBQ0EsQ0FIRDs7QUFLQSxPQUFPLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFVBQUMsSUFBRCxFQUFTO0FBQzNCLFNBQVEsR0FBUixDQUFZLElBQVo7QUFDQSxDQUZEOztBQUtDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy93aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCdcclxuXHJcbmNvbnNvbGUubG9nKCdramRraicpXHJcbmxldCBzb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCcpXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRjb25zb2xlLmxvZygnZ2V0IHVzZXJzJylcclxuXHRzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJylcclxufSlcclxuXHJcbnNvY2tldC5vbigndXNlcnMnLCAoZGF0YSk9PiB7XHJcblx0Y29uc29sZS5sb2coZGF0YSlcclxufSlcclxuXHJcblxyXG5cdC8vICQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oKXtcclxuXHQvLyBcdGxldCBtc2cgPSB7dXNlcklkOmN1cnJlbnRVc2VySWQsIFwibmFtZVwiOmN1cnJlbnRVc2VyLCBcIm1zZ1wiOiQoJyNtJykudmFsKCl9XHJcblx0Ly8gXHRzb2NrZXQuZW1pdCgnY2hhdCBtZXNzYWdlJywgbXNnKTtcclxuXHQvLyBcdCQoJyNtJykudmFsKCcnKTtcclxuXHQvLyBcdHJldHVybiBmYWxzZTtcclxuXHQvLyB9KTtcclxuXHQvLyBzb2NrZXQub24oJ2NoYXQgbWVzc2FnZScsIGZ1bmN0aW9uKG1zZyl7XHJcblx0Ly8gXHRjb25zb2xlLmxvZyhtc2cpXHJcblx0Ly8gXHQkKCcjbWVzc2FnZXMnKS5hcHBlbmQoJCgnPGxpPicpLnByZXBlbmQoJCgnPHNwYW4+JykudGV4dChtc2cubmFtZSkpLmFwcGVuZCgkKCc8cD4nKS50ZXh0KG1zZy5tc2cpKSk7XHJcblx0Ly8gfSk7XHJcblx0Ly8gc29ja2V0Lm9uKCd1c2VyQ29ubmVjdCcsIGZ1bmN0aW9uKHVzZXIpe1xyXG5cdC8vIFx0Y29uc29sZS5sb2coXCJ1c2VyQ29ubmVjdFwiLCB1c2VyLnBzZXVkbylcclxuXHQvLyBcdGlmIChjdXJyZW50VXNlciA9PT0gbnVsbCApIHtcclxuXHQvLyBcdFx0Y3VycmVudFVzZXIgPSB1c2VyLnBzZXVkbztcclxuXHQvLyBcdFx0Y3VycmVudFVzZXJJZCA9IHVzZXIuaWQ7XHJcblx0Ly8gXHRcdGNvbnNvbGUubG9nKHVzZXIpXHJcblx0Ly8gXHRcdCQoJy5wc2V1ZG8nKS5hcHBlbmQoY3VycmVudFVzZXIpO1xyXG5cdC8vIFx0XHQkKCcudXNlcl9pZCcpLmFwcGVuZChjdXJyZW50VXNlcklkKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9KTtcclxuIl19
