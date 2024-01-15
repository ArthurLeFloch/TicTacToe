let username = "";
let opponent = "";

export function setPlayerCount(count) {
	document.getElementById("player-count").textContent = count;
}

export function getUsername() {
	return username;
}

export function setUsername(name) {
	username = name;
	document.getElementById("player1-name").textContent = username;
}

export function setUserVictories(victories) {
	document.getElementById("player1-wins").textContent = victories;
}

export function setOpponent(name, victories) {
	opponent = name;
	document.getElementById("player2-name").textContent = name;
	document.getElementById("player2-wins").textContent = victories;
}

export function cleanUsers() {
	opponent = "";
	document.getElementById("player1-name").textContent = "";
	document.getElementById("player2-name").textContent = "";
	document.getElementById("player1-wins").textContent = 0;
	document.getElementById("player2-wins").textContent = 0;
}

export function setOpponentActive() {
	document.getElementById("player2").classList.remove("active");
	document.getElementById("player1").classList.remove("active");
	document.getElementById("player2").classList.add("active");
}

export function setActive() {
	document.getElementById("player2").classList.remove("active");
	document.getElementById("player1").classList.remove("active");
	document.getElementById("player1").classList.add("active");
}