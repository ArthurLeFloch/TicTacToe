const game = require("../src/game");

const P1 = "player1";
const P2 = "player2";

const O = "circle";
const X = "cross";

function play(player, tile){
	expect(game.isFinished(player)).toBe(false);
	expect(game.getNextPlayer(player)).toBe(player);
	expect(game.isMoveValid(player, tile)).toBe(true);
	game.setTile(player, tile);
	expect(game._getTile(player, tile)).toBe(player === P1 ? 1 : 2);
}

test("Lifecycle", () => {
	expect(game.exists(P1)).toBe(false);
	expect(game.exists(P2)).toBe(false);

	game.create(P1, P2);
	expect(game.exists(P1)).toBe(true);
	expect(game.exists(P2)).toBe(true);

	game.clear(P1);
	expect(game.exists(P1)).toBe(false);
	expect(game.exists(P2)).toBe(false);

	game.create(P1, P2);
	expect(game.exists(P1)).toBe(true);
	expect(game.exists(P2)).toBe(true);

	game.clear(P2);
	expect(game.exists(P1)).toBe(false);
	expect(game.exists(P2)).toBe(false);
});

test("Initialization", () => {
	game.create(P1, P2);

	expect(game.getSymbol(P1)).toBe(X);
	expect(game.getSymbol(P2)).toBe(O);

	expect(game.getOpponent(P1)).toBe(P2);
	expect(game.getOpponent(P2)).toBe(P1);

	for (let i = 1; i <= 9; i++) {
		expect(game._getTile(P1, i)).toBe(0);
		expect(game._getTile(P2, i)).toBe(0);
	}

	game.clear(P1);
});

test("Validation", () => {
	game.create(P1, P2);

	for (let i = 1; i <= 9; i++) {
		// P1 should be playing
		expect(game.isMoveValid(P1, i)).toBe(true);
	}

	for (let i = 1; i <= 9; i++) {
		// P2 should not be playing
		expect(game.isMoveValid(P2, i)).toBe(false);
	}

	expect(game.isMoveValid(P1, 0)).toBe(false);
	expect(game.isMoveValid(P2, 0)).toBe(false);

	expect(game.isMoveValid(P1, 10)).toBe(false);
	expect(game.isMoveValid(P2, 10)).toBe(false);

	game.clear(P1);
});

test("First move", () => {
	game.create(P1, P2);

	expect(game.getNextPlayer(P1)).toBe(P1);
	expect(game.isMoveValid(P1, 1)).toBe(true);
	game.setTile(P1, 1);
	expect(game._getTile(P1, 1)).toBe(1);
	expect(game.getNextPlayer(P1)).toBe(P2);

	game.clear(P1);
});


// x x x
// o o -
// - - -
test("Victory", () => {
	game.create(P1, P2);

	play(P1, 1);
	play(P2, 4);
	play(P1, 2);
	play(P2, 5);
	play(P1, 3);

	expect(game.isFinished(P1)).toBe(true);
	expect(game.playerWon(P1)).toBe(true);
	expect(game.playerDefeat(P1)).toBe(false);
	expect(game.playerDraw(P1)).toBe(false);

	expect(game.isFinished(P2)).toBe(true);
	expect(game.playerWon(P2)).toBe(false);
	expect(game.playerDefeat(P2)).toBe(true);
	expect(game.playerDraw(P2)).toBe(false);

	game.clear(P1);
});

// x x o
// o x x
// x o o
test("Draw", () => {
	game.create(P1, P2);
	
	play(P1, 1);
	play(P2, 3);
	play(P1, 2);
	play(P2, 4);
	play(P1, 5);
	play(P2, 8);
	play(P1, 6);
	play(P2, 9);
	play(P1, 7);
	
	expect(game.isFinished(P1)).toBe(true);
	expect(game.playerWon(P1)).toBe(false);
	expect(game.playerDefeat(P1)).toBe(false);
	expect(game.playerDraw(P1)).toBe(true);

	expect(game.isFinished(P2)).toBe(true);
	expect(game.playerWon(P2)).toBe(false);
	expect(game.playerDefeat(P2)).toBe(false);
	expect(game.playerDraw(P2)).toBe(true);

	game.clear(P1);
});

// x - x
// - o -
// o - x
test("Player gave up", () => {
	game.create(P1, P2);

	play(P1, 1);
	play(P2, 5);
	play(P1, 3);
	play(P2, 7);
	play(P1, 9);

	game.playerLeft(P2);
	expect(game.isFinished(P1)).toBe(true);
	expect(game.playerWon(P1)).toBe(true);
	expect(game.playerDefeat(P1)).toBe(false);
	expect(game.playerDraw(P1)).toBe(false);

	expect(game.isFinished(P2)).toBe(true);
	expect(game.playerWon(P2)).toBe(false);
	expect(game.playerDefeat(P2)).toBe(true);
	expect(game.playerDraw(P2)).toBe(false);

	game.clear(P1);
});