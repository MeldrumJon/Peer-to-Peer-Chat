import * as comm from './comm.js';
import * as dom from './dom.js';
import * as G from './globals.js';
import fsm from './fsm.js';

function main() {

	fsm('INIT');

	// URL may contain the ID of the peer we want to connect to
	let callbacks = {
		'wait': dom.updateShareURL,
		'connected': () => { fsm('CONNECTED') },
		'disconnected': () => { fsm('DISCONNECTED') }
	};

	let params = new URLSearchParams(window.location.search);
	let peerID = params.get('id');
	G.set('hasPeerID', (peerID !== null) );

	comm.init(callbacks, peerID);

	dom.init();
}

main();