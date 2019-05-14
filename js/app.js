let peer = null;
let conn = null;

// STEP 1
function init() {
    console.log('Opening peer.');
    peer = new Peer();
    peer.on('open', connect);
}

// STEP 2
function connect(myid) {
    console.log('Connecting.')

    let params = new URLSearchParams(window.location.search);
    peerid = params.get('id');
    if (peerid !== null) { // Start connection.
        conn = peer.connect(peerid);
        conn.on('open', connected);
    }
    else { // Receive connection
        let url = new URL(window.location.href);
        url.searchParams.append('id', myid);
        console.log(url);
        peer.on('connection', function(cn) {
            conn = cn;
            conn.on('open', connected);
        })
    }
}

function connected() {
    console.log('Sending is OK!');

    conn.on('data', received);
}

function received(data) {
    console.log(data);
}

function send(data) {
    conn.send(data);
}


function main() {
    console.log('Hello World!');
    init();
}

window.load=main();