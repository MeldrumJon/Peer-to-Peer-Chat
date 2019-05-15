let peer = null;
let conn = null;

// STEP 1
/**
 * Connects with a peer.  
 * 
 * If an ID is given, connects to that ID.  Otherwise calls wait_for_conn and 
 * supplies an ID to give to a peer.
 * 
 * Once the peer is connected, calls connected.
 * 
 * Received data is parsed by the "received" function passed by the parameter.
 * Sent data is sent with the "send" function in this file.
 */
function init(received) {
	console.log('Opening peer.');
	peer = new Peer();
	peer.on('open', function(myID) { // Has ID
		console.log('My ID: ' + myID);

		// URL may contain the ID of the peer we want to connect to
		let params = new URLSearchParams(window.location.search);
		let peerID = params.get('id');

		if (peerID !== null) { // URL has ID.  Start connection.
			console.log('Starting connection.');
			conn = peer.connect(peerID);
			conn.on('open', connected);
		}
		else { // Wait for a connection
			console.log('Waiting for connection.')
			wait_for_conn(myID);
			peer.on('connection', function(_conn) {
				conn = _conn;
				conn.on('open', connected);
			})
		}
	});

	function wait_for_conn(myID) {
		let url = new URL(window.location.href);
		url.searchParams.append('id', myID);
		console.log('Have peer navigate to: ' + url.href);
	}

	function connected() {
		conn.on('data', received); // Call received when we receive data.
		console.log('Successfully connected.');
	}
}

function send(msg) {
	if (conn === null) {
		console.error('Connection has not been established!');
		return;
	}
	conn.send(msg);
}

export {init, send};