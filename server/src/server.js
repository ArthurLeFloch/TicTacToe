const game = require('./game');
const stats = require('./stats');
const users = require('./users');
const sockets = require('./sockets');

const server = new (require('ws')).Server({ port: 3000 });

function matchmaking(username) {
	const opponent = users.match(username);
	if (opponent) {
		console.log(`Match found: ${username} vs ${opponent}`);
		users.play(username);
		users.play(opponent);
		const first = game.create(username, opponent);
		sockets.match(username, opponent);
		sockets.play(first);
	} else {
		console.warn(`${username} is waiting for a match`);
	}
}

function onEarlyDisconnect(username) {
	console.log(`Player ${username} disconnected early`);
	game.playerLeft(username);
	stats.update(username);

	const opponent = game.getOpponent(username);
	users.disconnect(opponent);

	sockets.opponentLeft(opponent);
	sockets.clear(opponent);

	game.clear(username);
}

function onConnect(socket, username) {
	if (username === "") return false;
	if (!users.exists(username)) {
		console.log(`New player: ${username}`);
		stats.create(username);
		users.create(username);
		users.connect(username);
		sockets.create(username, socket);
		return true;
	} else if (!users.isConnected(username)) {
		console.log(`Player reconnected: ${username}`);
		users.connect(username);
		sockets.create(username, socket);
		return true;
	}
	return false;
}

function onGameEnd(username) {
	console.log(`Game ${username} vs ${game.getOpponent(username)} ended`);
	const opponent = game.getOpponent(username);

	sockets.sendStatus(username);
	sockets.sendStatus(opponent);

	stats.update(username);

	users.disconnect(username);
	users.disconnect(opponent);

	sockets.clear(opponent);
	sockets.clear(username);

	game.clear(username);
}

function onMove(username, tile) {
	if (!game.exists(username)) {
		sockets.gameError(username);
		return;
	}
	if (!game.isMoveValid(username, tile)) {
		sockets.tileError(username);
		return;
	}

	game.setTile(username, tile);
	sockets.update(username, tile);

	if (game.isFinished(username)) {
		onGameEnd(username);
	} else {
		sockets.play(game.getOpponent(username));
	}
}

server.on('connection', (socket) => {
	let username = "";

	socket.on('message', (message) => {
		const data = JSON.parse(message);
		if (data.type === "ask-connection") {
			username = onConnect(socket, data.username) ? data.username : null;
			if (data.username === "") {
				socket.send(JSON.stringify({
					type: "invalid-username",
					message: "Username cannot be empty.",
				}));
				socket.close();
			} else if (username === null) {
				socket.send(JSON.stringify({
					type: "already-connected",
					message: "Player already connected.",
				}));
				socket.close();
			}
		} else if (data.type === "ask-players") {
			if (username === null) return;
			sockets.playerCount(username);
		} else if (data.type === "ask-match") {
			if (username === null) return;
			matchmaking(username);
		} else if (data.type === "ask-tile") {
			if (username === null) return;
			onMove(username, data.tile);
		}
	});

	socket.on('close', (() => {
		if (username === null) return;
		console.log(`Player ${username} disconnected`);
		if (users.isPlaying(username)) {
			onEarlyDisconnect(username);
		}
		users.disconnect(username);
		sockets.clear(username);
	}));
});
