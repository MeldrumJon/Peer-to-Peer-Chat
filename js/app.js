import * as comm from './comm.js';

function send_msg(msg) {
	comm.send(msg);

	let date = new Date();
	let timestr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

	let html = '';
	html += '<div class="self">';
	html += '<time>' + timestr + '</time>';
	html += '<span class="person">' + 'Sent' + '</span>';
	html += '<span class="content">' + msg + '</span>';
	html += '</div>';

	document.getElementById('msgs').innerHTML += html;
}

function receive_msg(msg) {
	let date = new Date();
	let timestr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

	let html = '';
	html += '<div>';
	html += '<time>' + timestr + '</time>';
	html += '<span class="person">' + 'Received' + '</span>';
	html += '<span class="content">' + msg + '</span>';
	html += '</div>';

	document.getElementById('msgs').innerHTML += html;
}

function main() {
	comm.init(receive_msg);

	document.getElementById('send').onclick = function () {
		let el = document.getElementById('msg');
		let txt = el.innerText;
		el.innerHTML = '';
		if (txt.replace(/\s/g, '').length) { // Text has more than whitespace
			send_msg(txt);
		}
	}
	document.getElementById('msg').onkeypress = function (event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault();
			document.getElementById("send").click();
		}
	}
}

window.load = main();