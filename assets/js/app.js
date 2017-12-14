(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//window.location.origin+':3000'

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUEsSUFBSSxTQUFTLEdBQUcsT0FBTyxRQUFQLENBQWdCLE1BQWhCLEdBQXVCLE9BQTFCLENBQWI7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxZQUFNO0FBQ3hDLFNBQVEsR0FBUixDQUFZLFdBQVo7QUFDQSxRQUFPLElBQVAsQ0FBWSxXQUFaO0FBQ0EsQ0FIRDs7QUFLQSxPQUFPLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFVBQUMsSUFBRCxFQUFTO0FBQzNCLFNBQVEsR0FBUixDQUFZLElBQVo7QUFDQSxDQUZEOztBQUtDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy93aW5kb3cubG9jYXRpb24ub3JpZ2luKyc6MzAwMCdcblxubGV0IHNvY2tldCA9IGlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rJzozMDAwJylcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdGNvbnNvbGUubG9nKCdnZXQgdXNlcnMnKVxuXHRzb2NrZXQuZW1pdCgnZ2V0X3VzZXJzJylcbn0pXG5cbnNvY2tldC5vbigndXNlcnMnLCAoZGF0YSk9PiB7XG5cdGNvbnNvbGUubG9nKGRhdGEpXG59KVxuXG5cblx0Ly8gJCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbigpe1xuXHQvLyBcdGxldCBtc2cgPSB7dXNlcklkOmN1cnJlbnRVc2VySWQsIFwibmFtZVwiOmN1cnJlbnRVc2VyLCBcIm1zZ1wiOiQoJyNtJykudmFsKCl9XG5cdC8vIFx0c29ja2V0LmVtaXQoJ2NoYXQgbWVzc2FnZScsIG1zZyk7XG5cdC8vIFx0JCgnI20nKS52YWwoJycpO1xuXHQvLyBcdHJldHVybiBmYWxzZTtcblx0Ly8gfSk7XG5cdC8vIHNvY2tldC5vbignY2hhdCBtZXNzYWdlJywgZnVuY3Rpb24obXNnKXtcblx0Ly8gXHRjb25zb2xlLmxvZyhtc2cpXG5cdC8vIFx0JCgnI21lc3NhZ2VzJykuYXBwZW5kKCQoJzxsaT4nKS5wcmVwZW5kKCQoJzxzcGFuPicpLnRleHQobXNnLm5hbWUpKS5hcHBlbmQoJCgnPHA+JykudGV4dChtc2cubXNnKSkpO1xuXHQvLyB9KTtcblx0Ly8gc29ja2V0Lm9uKCd1c2VyQ29ubmVjdCcsIGZ1bmN0aW9uKHVzZXIpe1xuXHQvLyBcdGNvbnNvbGUubG9nKFwidXNlckNvbm5lY3RcIiwgdXNlci5wc2V1ZG8pXG5cdC8vIFx0aWYgKGN1cnJlbnRVc2VyID09PSBudWxsICkge1xuXHQvLyBcdFx0Y3VycmVudFVzZXIgPSB1c2VyLnBzZXVkbztcblx0Ly8gXHRcdGN1cnJlbnRVc2VySWQgPSB1c2VyLmlkO1xuXHQvLyBcdFx0Y29uc29sZS5sb2codXNlcilcblx0Ly8gXHRcdCQoJy5wc2V1ZG8nKS5hcHBlbmQoY3VycmVudFVzZXIpO1xuXHQvLyBcdFx0JCgnLnVzZXJfaWQnKS5hcHBlbmQoY3VycmVudFVzZXJJZCk7XG5cdC8vIFx0fVxuXHQvLyB9KTtcbiJdfQ==
