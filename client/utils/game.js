let userSymbol = "";

export function setTile(tile, symbol) {
	tile.classList.remove("cross");
	tile.classList.remove("circle");
	tile.classList.add(symbol);
}

export function setSymbol(symbol) {
	userSymbol = symbol;
	document.getElementById("player1-symbol").classList.remove("circle");
	document.getElementById("player1-symbol").classList.remove("cross");
	document.getElementById("player2-symbol").classList.remove("circle");
	document.getElementById("player2-symbol").classList.remove("cross");
	if (symbol === "cross") {
		document.getElementById("player1-symbol").classList.add("cross");
		document.getElementById("player2-symbol").classList.add("circle");
	} else {
		document.getElementById("player1-symbol").classList.add("circle");
		document.getElementById("player2-symbol").classList.add("cross");
	}
}

export function cleanGame() {
	document.querySelectorAll(".tile").forEach((tile) => {
		tile.classList.remove("cross");
		tile.classList.remove("circle");
	});
	document.getElementById("player1-symbol").classList.remove("cross");
	document.getElementById("player1-symbol").classList.remove("circle");
	document.getElementById("player2-symbol").classList.remove("cross");
	document.getElementById("player2-symbol").classList.remove("circle");
}
