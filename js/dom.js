import * as comm from './comm.js'
import fsm from './fsm.js'
import * as G from './globals.js'

/**
 * Sets up events.
 */
function init() {
	/*** Input screen name ***/
	const nameBtn = document.getElementById('savename');
	const nameInput = document.getElementById('myname');
	nameBtn.onclick = function() {
		let name = nameInput.value;
		if (name.replace(/\s/g, '').length) { // Text has more than whitespace
			G.set('myName', name);
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
	const shareURL = document.getElementById('shareurl');
	const copyBtn = document.getElementById('copyurl');
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
	const sendBtn = document.getElementById('send');
	const msgElement = document.getElementById('msg');
	// Send a message
	sendBtn.onclick = function () {
		let msg = msgElement.innerText; // Get message
		msgElement.innerHTML = '';
		if (msg.replace(/\s/g, '').length) { // Text has more than whitespace
			comm.send('Message', {
				'name': G.get('myName'),
				'message': msg
			});
		}
	}
	// Send message on enter
	msgElement.onkeypress = function (event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault();
			sendBtn.click();
		}
	}
}

/**
 * 
 * @param {*} id ID received from Peer server.
 */
function updateShareURL(id) {
	let url = new URL(window.location.href);
	url.searchParams.append('id', id);

	const shareURL = document.getElementById('shareurl');
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

	const msgList = document.getElementById('msgs');
	msgList.innerHTML += html;
}
export {init, updateShareURL, appendMesssage}