import * as comm from './comm.js';
import * as dom from './dom.js';
import fsm from './fsm.js';

/**
 * Gets the peer ID from the window's URL parameters.
 */
function _URL2PeerID() {
	let params = new URLSearchParams(window.location.search);
	let peerID = params.get('peerID');
	return peerID;
}

/**
 * Returns a URL containing a peerID parameter.
 * @param {String} id 
 */
function _PeerID2URL(id) {
	let url = new URL(window.location.href);
	url.searchParams.append('peerID', id);
	return url;
}

function main() {
	fsm('INIT');

	let callbacks = {
		wait: (id) => { 
			dom.updateShareURL(_PeerID2URL(id));
		},
		mst_connected: () => { fsm('HOST_CONNECTED'); },
		slv_connected: () => { fsm('PEER_CONNECTED'); },
		disconnected: () => { fsm('DISCONNECTED'); }
	};
	comm.init(callbacks, _URL2PeerID());

	comm.addReceiveHandler('Message', (data) => {
		dom.appendMesssage('received', data.name, data.message);
	});
	comm.addReceiveHandler('SystemMsg', (data) => {
		dom.appendMesssage('system', '*', data);
	});

	comm.addSendHandler('Message', (data) => {
		dom.appendMesssage('sent', data.name, data.message);
	});
	comm.addSendHandler('SystemMsg', (data) => {
		dom.appendMesssage('system', '*', data);
	});

	dom.init();

	// If we are connected to a peer, warn before closing the page.
	window.addEventListener("beforeunload", function (e) {
        if (!comm.isConnected) {
            return undefined;
        }
        var confirmationMessage = 'If you leave the page, you will be disconnected.';
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
}

main();