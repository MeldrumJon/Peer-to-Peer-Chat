import * as comm from './comm.js'

const machine = {
	initial: "init",
	states: {
		init: {
			INIT: 'get_name'
		},
		get_name: {
			GO_TO_MESSAGING: 'messaging',
			WAITING: 'wait_for_connection',
			SHARE_URL: 'show_url'
		},
		show_url: {
			HOST_CONNECTED: 'messaging'
		},
		wait_for_connection: {
			PEER_CONNECTED: 'messaging'
		},
		disconnected: {},
		messaging: {
			DISCONNECTED: 'disconnected'
		}
	}
};

let state = machine.initial;

export default function fsm(event) {
	let transition = machine.states[state][event];
	if (typeof transition === 'function') {
		state = transition();
	}
	else if (typeof transition === 'string') {
		state = transition;
	}
	const body = document.getElementsByTagName("BODY")[0];
	body.className = state;
}