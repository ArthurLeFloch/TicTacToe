export function toLobby() {
	login.style.visibility = "collapse";
	lobby.style.visibility = "visible";
	game.style.visibility = "collapse";
}

export function toLogin() {
	login.style.visibility = "visible";
	lobby.style.visibility = "collapse";
	game.style.visibility = "collapse";
}

export function toGame() {
	login.style.visibility = "collapse";
	lobby.style.visibility = "collapse";
	game.style.visibility = "visible";
}