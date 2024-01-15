let gameID = -1;
const games = {};
const gameIDs = {};

const DRAW = "draw";
const WON = "won";

function create(player1, player2) {
	games[++gameID] = {
		player1: player1,
		player2: player2,
		board: new Array(9).fill(0),
		status: null,
		winner: null,
	};
	gameIDs[player1] = gameID;
	gameIDs[player2] = gameID;
	return player1;
}

function _getID(username) {
	return gameIDs[username];
}

function clear(username) {
	const opponent = getOpponent(username);
	games[_getID(username)] = null;
	gameIDs[username] = null;
	gameIDs[opponent] = null;
}

function exists(username) {
	return games[_getID(username)] !== null && games[_getID(username)] !== undefined;
}

function getOpponent(username) {
	const ID = _getID(username);
	if (games[ID].player1 === username) {
		return games[ID].player2;
	}
	return games[ID].player1;
}

function _getSymbol(username) {
	if (games[_getID(username)].player1 === username) {
		return 1;
	}
	return 2;
}

function getSymbol(username) {
	if (games[_getID(username)].player1 === username) {
		return "cross";
	}
	return "circle";
}

function _getTile(username, tile) {
	return games[_getID(username)].board[tile - 1];
}

function _isFull(username) {
	return games[_getID(username)].board.every(tile => tile !== 0);
}

function setTile(username, tile) {
	games[_getID(username)].board[tile - 1] = _getSymbol(username);
	_checkVictory(username);
}

function getNextPlayer(username) {
	const opponent = getOpponent(username);
	const game = games[_getID(username)];
	const board = game.board;
	const player1 = board.filter(tile => tile === 1).length;
	const player2 = board.filter(tile => tile === 2).length;
	if (player1 > player2) {
		return game.player1 === username ? opponent : username;
	}
	return game.player1 === username ? username : opponent;
}

function _checkVictory(username) {
	const ID = _getID(username);
	const board = games[ID].board;
	const player1 = games[ID].player1;
	const player2 = games[ID].player2;

	const lines = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8],
		[0, 3, 6], [1, 4, 7], [2, 5, 8],
		[0, 4, 8], [2, 4, 6]
	];

	for (const line of lines) {
		const [a, b, c] = line;
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			games[ID].winner = (board[a] === 1) ? player1 : player2;
			games[ID].status = WON;
			return;
		}
	}

	if (_isFull(username)) {
		games[ID].status = DRAW;
	}
}

function isFinished(username) {
	return games[_getID(username)].status !== null;
}

function isMoveValid(username, tile) {
	if (getNextPlayer(username) !== username) return false;
	if (tile < 1 || tile > 9) return false;
	if (_getTile(username, tile)) return false;
	return true;
}

function playerLeft(username) {
	games[_getID(username)].status = WON;
	games[_getID(username)].winner = getOpponent(username);
}

function playerWon(username) {
	return games[_getID(username)].winner === username;
}

function playerDraw(username) {
	return games[_getID(username)].status === DRAW;
}

function playerDefeat(username) {
	const ID = _getID(username);
	return games[ID].status === WON && games[ID].winner !== username;
}

module.exports = {
	create,
	clear,
	exists,
	getOpponent,
	getSymbol,
	setTile,
	isFinished,
	isMoveValid,
	playerLeft,
	getNextPlayer,
	playerWon,
	playerDraw,
	playerDefeat,
	_getTile,
}