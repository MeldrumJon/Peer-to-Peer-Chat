import * as comm from './comm.js'
import fsm from './fsm.js'

/**
 * Sets up events.
 */
function init() {
	/*** Input screen name ***/
	const nameShow = document.getElementById('name');
	const nameBtn = document.getElementById('name_btn');
	const nameInput = document.getElementById('screen_name');
	nameBtn.onclick = function() {
		let name = nameInput.value;
		if (name.replace(/\s/g, '').length) { // Text has more than whitespace
			sessionStorage.setItem('screenName', name);
			nameShow.innerHTML = name;
			fsm('NAME_SUBMITTED');
		}
		else {
			nameInput.style = 'border-color: #f00';
		}
	}
	nameInput.onkeypress = function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			nameBtn.click();
		}
	}

	/*** Select and copy share URL ***/
	const shareURL = document.getElementById('share_url');
	const copyBtn = document.getElementById('copy_btn');
	// Select Share URL
	shareURL.onclick = function () {
		window.getSelection().selectAllChildren(shareURL);
	}
	// Copy Share URL
	copyBtn.onclick = function () {
		window.getSelection().selectAllChildren(shareURL);
		document.execCommand('copy');
	}

	/*** Send Messages ***/
	const sendBtn = document.getElementById('send_btn');
	const msgInput = document.getElementById('message');
	const messagesContainer = document.getElementById('messages_container');
	// Send a message
	sendBtn.onclick = function () {
		let message = msgInput.innerText; // Get message
		msgInput.innerHTML = '';
		if (message.replace(/\s/g, '').length) { // Text has more than whitespace
			comm.send('Message', {
				'name': sessionStorage.getItem('screenName', name),
				'message': message
			});
		}
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}
	// Send message on enter
	msgInput.onkeypress = function (event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault();
			sendBtn.click();
		}
	}
}

/**
 * Display the URL to connect to this peer.
 * @param {String} url 
 */
function updateShareURL(url) {
	console.log(url);
	const shareURL = document.getElementById('share_url');
	shareURL.innerHTML = url.href;
}

/**
 * Add a message to the message window.
 * @param {String} type Type of message: sent, received, system
 * @param {String} name Name of person who sent the message
 * @param {String} message The message text
 */
function appendMesssage(type, name, message) {
	let timestr = new Date().toLocaleTimeString();

	let html = '';
	html += '<div class="' + type + '">';
	html += '<time>' + timestr + '</time>';
	html += '<span class="person">' + name + '</span>';
	html += '<span class="content">' + message + '</span>';
	html += '</div>';

	const msgList = document.getElementById('messages');
	msgList.innerHTML += html;
}
export {init, updateShareURL, appendMesssage}