import { setTile, setSymbol, cleanGame } from "./utils/game.js";
import { toLobby, toLogin, toGame } from "./utils/redirect.js";
import { setUsername, getUsername, setOpponent, setPlayerCount, cleanUsers, setUserVictories, setActive, setOpponentActive } from "./utils/users.js";

let socket = null;

function clean() {
    cleanGame();
    cleanUsers();
}

toLogin();

let refreshInterval = null;

function gotoLogin(socket) {
    socket?.close();
    toLogin();
    clean();
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

function startRefreshing() {
    socket.send(JSON.stringify({
        type: "ask-players",
    }));
    refreshInterval = setInterval(() => {
        socket.send(JSON.stringify({
            type: "ask-players",
        }));
    }, 1000);
}

function stopRefreshing() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

document.getElementById("logout-button").addEventListener("click", () => {
    gotoLogin(socket);
    stopRefreshing();
});

document.getElementById("exit-button").addEventListener("click", () => {
    gotoLogin(socket);
    stopRefreshing();
});

document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => {
        socket.send(JSON.stringify({
            type: "ask-tile",
            tile: tile.id.split("-")[1],
        }));
    });
});

document.getElementById("login-button").addEventListener("click", () => {
    setUsername(document.getElementById("username").value);
    toLobby();

    socket = new WebSocket(`ws://${window.location.hostname}:3000/server`);

    socket.addEventListener('open', (event) => {
        console.log('Connection established');
        socket.send(JSON.stringify({
            type: "ask-connection",
            username: getUsername(),
        }));
        startRefreshing();
        socket.send(JSON.stringify({
            type: "ask-match",
        }));
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "matchmaking") {
            setUserVictories(message.victories);
            setOpponent(message.opponent, message.opponentVictories);
            setSymbol(message.symbol);
            stopRefreshing();
            toGame();
        } else if (message.type === "players") {
            setPlayerCount(message.count);
        } else if (message.type === "already-connected") {
            alert(message.message);
            gotoLogin(socket);
        } else if (message.type === "invalid-username") {
            alert(message.message);
            gotoLogin(socket);
        } else if (message.type === "opponent-disconnected") {
            alert(message.message);
            gotoLogin(socket);
        } else if (message.type === "tile") {
            setTile(document.getElementById(`tile-${message.tile}`), message.symbol);
        } else if (message.type === "play") {
            setActive();
        } else if (message.type === "wait") {
            setOpponentActive();
        } else if (message.type === "victory") {
            alert("You won!");
            gotoLogin(socket);
        } else if (message.type === "defeat") {
            alert("You lost!");
            gotoLogin(socket);
        } else if (message.type === "draw") {
            alert("Draw!");
            gotoLogin(socket);
        } else if (message.type === "game-error") {
            alert(message.message);
        } else if (message.type === "tile-error") {
            alert(message.message);
        }
    });

    socket.addEventListener('close', (event) => {
        console.log('Connection closed');
    });

    socket.addEventListener('error', (event) => {
        alert("Could not connect to server");
        socket.close();
        toLogin();
    });
});