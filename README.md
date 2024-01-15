# TicTacToe
Tic Tac Toe game using native websockets.

I used the VSCode extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

To adapt it to your needs, you need to change the websocket address in `client/client.js` (search for `socket = new WebSocket`).

You can also change the port in the first lines of `server/src/server.js` to fit your needs.

## How to run
1. Clone the repository
2. Run `cd server && npm install`
3. (Optional) Run `npm test` to run the tests
4. Run `cd src && node server.js`
5. Using VSCode extension Live Server, click on `Go Live` in the bottom right corner, and open `localhost:5500/client` in your browser.

## How to play
There's a _matchmaking_ system, which will pair you with another player. If there's no one waiting for a match, you'll be put in a queue until someone else joins. You can run multiple clients in different tabs or devices to test it.

Currently, a websocket is created when logging in with a username, and closed when logging out during matchmaking, or when leaving a match.

The objective was to create a simple game using websockets, thus there are no databases, and no persistence if the server is restarted. Additionally, there's no authentication, so you can use any username you want, except one that's already in use.

