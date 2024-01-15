const users = require('../src/users');

const P1 = "player1";
const P2 = "player2";
const P3 = "player3";
const P4 = "player4";
const P5 = "player5";

test("Lifecycle", () => {
	expect(users.exists(P1)).toBe(false);

	users.create(P1);

	expect(users.exists(P1)).toBe(true);
	expect(users.isConnected(P1)).toBe(false);
	expect(users.isPlaying(P1)).toBe(false);

	users.connect(P1);
	expect(users.isConnected(P1)).toBe(true);

	users.play(P1);
	expect(users.isPlaying(P1)).toBe(true);

	users.disconnect(P1);
	expect(users.isConnected(P1)).toBe(false);

	users._clear(P1);
});

test("Matchmaking", () => {
	users.create(P1);
	users.create(P2);
	users.create(P3);
	users.create(P4);
	users.create(P5);

	users.connect(P1);
	expect(users.match(P1)).toBe(null);

	users.connect(P2);
	expect(users.match(P1)).toBe(P2);
	users.play(P1);
	users.play(P2);

	users.connect(P3);
	expect(users.match(P3)).toBe(null);
	users.connect(P4);
	expect(users.match(P3)).toBe(P4);
	users.play(P3);
	users.play(P4);

	users.connect(P5);
	expect(users.match(P5)).toBe(null);

	users.disconnect(P1);
	users.disconnect(P2);
	users.disconnect(P3);
	users.disconnect(P4);
	users.disconnect(P5);

	expect(users.match(P1)).toBe(null);

	users._clear(P1);
	users._clear(P2);
	users._clear(P3);
	users._clear(P4);
	users._clear(P5);
});