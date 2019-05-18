
let values = {};

function get(key) {
	return values[key];
}

function set(key, value) {
	values[key] = value;
}

export {get, set}
