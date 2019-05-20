import * as comm from './comm.js';
import * as dom from './dom.js';
import * as G from './globals.js';
import fsm from './fsm.js';

/**
 * Gets the peer ID we want to connect to from the URL.
 */
function URL2PeerID() {
	let params = new URLSearchParams(window.location.search);
	let peerID = params.get('peerID');
	return peerID;
}

/**
 * Returns a URL containing a peerID parameter.
 * @param {String} id 
 */
function PeerID2URL(id) {
	let url = new URL(window.location.href);
	url.searchParams.append('peerID', id);
	return url;
}

function main() {
	fsm('INIT');

	let callbacks = {
		'wait': (id) => { 
			dom.updateShareURL(PeerID2URL(id));
		},
		'connected': () => { fsm('CONNECTED'); },
		'disconnected': () => { fsm('DISCONNECTED'); }
	};
	comm.init(callbacks, URL2PeerID());

	dom.init();
}

main();