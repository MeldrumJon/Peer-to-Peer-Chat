import * as G from './globals.js'
import * as comm from './comm.js'

const machine = {
	initial: "init",
	states: {
		init: {
			on: {
				INIT: 'get_name'
			}
		},
		get_name: {
			on: {
				NAME_SUBMITTED: () => {
					if (comm.connected === true) {
						return 'messaging'
					}
					else if (G.get('hasPeerID')) {
						return 'wait_for_connection';
					}
					else {
						return 'show_url';
					}
				},
			}
		},
		show_url: {
			on: {
				CONNECTED: 'messaging'
			}
		},
		wait_for_connection: {
			on: {
				CONNECTED: 'messaging'
			}
		},
		disconnected: {},
		messaging: {
			on: {
				DISCONNECTED: 'disconnected'
			}
		}
	}
};

let state = machine.initial;

export default function fsm(event) {
	let transition = machine.states[state].on[event];
	if (typeof transition === 'function') {
		state = transition();
	}
	else if (typeof transition === 'string') {
		state = transition;
	}
	const body = document.getElementsByTagName("BODY")[0];
	body.className = state;
}