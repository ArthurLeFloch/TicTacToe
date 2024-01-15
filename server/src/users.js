const users = {};

function create(username) {
	users[username] = {
		isPlaying: false,
		isConnected: false,
	};
}

function exists(username) {
	return users[username] !== undefined;
}

function isPlaying(username) {
	return users[username].isPlaying;
}

function isConnected(username) {
	return users[username].isConnected;
}

function connect(username) {
	users[username].isConnected = true;
}

function play(username) {
	users[username].isPlaying = true;
}

function _getOthers(username) {
	const players = [];
	for (const user in users) {
		if (user !== username && !isPlaying(user) && isConnected(user)) {
			players.push(user);
		}
	}
	return players;
}

function match(username) {
	const players = _getOthers(username);
	if (players.length === 0) {
		return null;
	}
	return players[Math.floor(Math.random() * players.length)];
}

function disconnect(username) {
	users[username].isConnected = false;
	users[username].isPlaying = false;
}

function _clear(username) {
	delete users[username];
}

module.exports = {
	create,
	isPlaying,
	isConnected,
	connect,
	disconnect,
	play,
	match,
	exists,
	_clear,
};