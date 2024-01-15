const game = require('./game');

const users = {};

function create(username) {
	users[username] = {
		wins: 0,
		defeats: 0,
		draws: 0,
	};
}

function _update(username) {
	if (game.playerWon(username)) {
		users[username].wins += 1;
	} else if (game.playerDefeat(username)) {
		users[username].defeats += 1;
	} else if (game.playerDraw(username)) {
		users[username].draws += 1;
	} else {
		console.error("Game is not finished");
	}
}

function update(username) {
	_update(username);
	_update(game.getOpponent(username));
}

function getWins(username) {
	return users[username].wins;
}

module.exports = {
	create,
	update,
	getWins,
}
