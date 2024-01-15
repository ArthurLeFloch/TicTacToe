const stats = require('./stats');
const game = require('./game');

const sockets = {};

function create(username, socket) {
	sockets[username] = socket;
}

function clear(username) {
	delete sockets[username];
}

function match(player1, player2) {
	sockets[player1].send(JSON.stringify({
		type: "matchmaking",
		victories: stats.getWins(player1),
		opponent: player2,
		opponentVictories: stats.getWins(player2),
		symbol: game.getSymbol(player1),
	}));
	sockets[player2].send(JSON.stringify({
		type: "matchmaking",
		victories: stats.getWins(player2),
		opponent: player1,
		opponentVictories: stats.getWins(player1),
		symbol: game.getSymbol(player2),
	}));
}

function play(username) {
	sockets[username].send(JSON.stringify({
		type: "play",
	}));
	sockets[game.getOpponent(username)].send(JSON.stringify({
		type: "wait",
	}));
}

function update(username, tile) {
	const data = JSON.stringify({
		type: "tile",
		next: game.getNextPlayer(username),
		tile: tile,
		symbol: game.getSymbol(username),
	});
	sockets[username].send(data);
	sockets[game.getOpponent(username)].send(data);
}

function playerCount(username) {
	sockets[username].send(JSON.stringify({
		type: "players",
		count: Object.keys(sockets).length,
	}));
}

function sendStatus(username) {
	let status = "";
	if (game.playerWon(username)) {
		status = "victory";
	} else if (game.playerDefeat(username)) {
		status = "defeat";
	} else if (game.playerDraw(username)) {
		status = "draw";
	} else {
		console.error("Game is not finished");
		return;
	}
	sockets[username].send(JSON.stringify({
		type: status,
	}));
}

function _sendError(username, type, message) {
	sockets[username].send(JSON.stringify({
		type, message,
	}));
}

function opponentLeft(username) {
	_sendError(username, "opponent-disconnected", "Your opponent disconnected.");
}

function alreadyConnected(username) {
	_sendError(username, "player-already-connected", "Player already connected.");
}

function tileError(username) {
	_sendError(username, "tile-error", "Invalid tile.");
}

function gameError(username) {
	_sendError(username, "game-error", "Invalid game.");
}


module.exports = {
	create,
	match,
	play,
	update,
	clear,
	playerCount,
	opponentLeft,
	alreadyConnected,
	tileError,
	gameError,
	sendStatus,
};