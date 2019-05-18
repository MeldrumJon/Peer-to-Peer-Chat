import * as dom from './dom.js'

let peer = null;
let conn = null;

// Flags
let connected = false;

/* 
	Establishes a connection between two peers.  If a peerID is provided, it
	begins a connection with that Peer.  Otherwise, it calls the wait callback
	function, passing its ID.  The client must send this ID to their peer so 
	that the peer can connect.

	The callbacks object may contain the following functions:
	{
		// Called if an peer ID was not supplied for connection and we are
		// waiting for a connection from another peer:
		wait: function(id) { ... }
		// Called when two peers are connected:
		connected: function() { ... }
		// Called when the two peers are disconnected:
		disconnected: function() { ... }
	}
*/
function init(callbacks, peerID) {
	console.log('Connecting to Peer server.');
	peer = new Peer();
	peer.on('open', function gotID(myID) { // Connected to Peer server, received ID.
		console.log('Established connection to Peer server. My ID: ' + myID);

		if (peerID !== null) { // Connect to the peer.
			console.log('Connecting to peer.');
			conn = peer.connect(peerID);
			conn.on('open', peersConnected);
			conn.on('close', peersDisconnected);
		}
		else { // or Wait for a connection
			console.log('Waiting for connection from peer.')
			if (typeof callbacks.wait === 'function') {
				callbacks.wait(myID);
			}
			peer.on('connection', function madeConnection(_conn) {
				conn = _conn;
				conn.on('open', peersConnected);
				conn.on('close', peersDisconnected);
			});
		}
	});
	window.addEventListener('beforeunload', cleanUp);

	function peersConnected() {
		connected = true;
		peer.disconnect(); // We no longer need the peer server.
		// Listen for data.
		conn.on('data', _received); // Call received when we receive data.
		if (typeof callbacks.received === 'function') {
			received_cb = callbacks.received;
		}
		// Success!
		console.log('Peers successfully connected.');
		if (typeof callbacks.connected === 'function') {
			callbacks.connected();
		}
	}

	function peersDisconnected() {
		connected = false
		console.log("Peers have been disconnected.");
		if (typeof callbacks.disconnected === 'function') {
			callbacks.disconnected();
		}
	}

	/* When window is closed, close the connections */
	function cleanUp(event) {
		peer.destroy();
		console.log('Peer destroyed.');
	}
}

/**
 * @param {*} _data 
 */
function _received(_data) {
	let type = _data.type;
	let data = _data.data;
	// Process received data
	if (type === 'Message') {
		dom.appendMesssage('received', data.name, data.message);
	}
}

/**
 * Used to send data to the peer.
 * @param {*} data 
 */
function send(type, data) {
	if (conn === null) {
		throw "Connection not established!";
	}
	let _data = {
		'type': type,
		'data': data
	};
	conn.send(_data);

	// Process sent data
	if (type === 'Message') {
		dom.appendMesssage('sent', data.name, data.message);
	}
}

export {init, send, connected};