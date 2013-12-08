/* global require */

/**************************************************
	NODE.JS REQUIREMENTS
**************************************************/

var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	_ = require('underscore')._,
	Player = require("./Player").Player;	// Player class

/**************************************************
	GAME VARIABLES
**************************************************/

var players,					// Array of connected players
	playersCount,				// Number of connected players
	countdown,					// Interval ID of countdown timer
	gameInProgress = false;

/**************************************************
	HELPER FUNCTIONS
**************************************************/

function startGame() {

	gameInProgress = true;

	// set player positions
	_.each(_.values(players), function(thisPlayer) {
		thisPlayer.x = Math.floor(Math.random()*11);
		thisPlayer.y = Math.floor(Math.random()*11);
		io.sockets.emit("init player", {id:thisPlayer.id, x: thisPlayer.x, y: thisPlayer.y});
	});

}

function updateWaitingMessage() {

	// Set the waiting message
	var waitingMsg, i;

	// Check to see if there are players who have not yet chosen a team
	if(playersCount > 1) {

		var waitingOnPlayers = 0;
		_.each(_.values(players), function(thisPlayer) {
			if(!thisPlayer.team) {
				waitingOnPlayers++;
			}
		});

		if(waitingOnPlayers > 0) {
			clearInterval(countdown);
			waitingMsg = "Waiting for " + waitingOnPlayers + " player" + (waitingOnPlayers > 1 ? "s" : "") + " to select a team...";
			io.sockets.emit("waiting msg", waitingMsg);
			return;
		}

	}

	// If all players have chosen a team, check if we should initiate the countdown
	var initiateCountdown = false;

	// Check to see if there is at least one player on each team
	if(playersCount > 1) {
		var whiteCount = 0, blackCount = 0;
		_.each(_.values(players), function(thisPlayer) {
			if(thisPlayer.team === "white") {
				whiteCount++;
			}
			if(thisPlayer.team === "black") {
				blackCount++;
			}
			if(whiteCount > 0 && blackCount > 0) {
				initiateCountdown = true;
			}
		});
	}

	if(initiateCountdown) {

		util.log("Countdown initiated.");

		var countdownCounter = 3;

		countdown = setInterval(function() {

			// stop countdown after 30 seconds
			if(countdownCounter < 1) {
				clearInterval(countdown);
				io.sockets.emit("start game");
				startGame();
				return;
			}

			// update waiting message every second
			waitingMsg = "Game starting in " + countdownCounter + " second" + (countdownCounter > 1 ? "s" : "") + "...";
			io.sockets.emit("waiting msg", waitingMsg);

			// count down
			countdownCounter--;

		}, 1000);

	}

	else {
		clearInterval(countdown);
		waitingMsg = "Waiting for more players...";
		io.sockets.emit("waiting msg", waitingMsg);
	}

}


/**************************************************
	GAME EVENT HANDLERS
**************************************************/

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = players[this.id];

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}

	// Remove player from players array
	delete players[this.id];
	playersCount--;

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});

	// Update the waiting room message
	updateWaitingMessage();
}

// New player has joined
function onNewPlayer(data) {

	// Create a new player
	var newPlayer = new Player(this.id, data.name);
	util.log("New player added: " + newPlayer.username);

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, name: newPlayer.username, team: newPlayer.team});

	// Add new player to the players array
	players[newPlayer.id] = newPlayer;
	playersCount++;

	// Update the waiting room message
	updateWaitingMessage();

}

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = players[this.id];

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}

	// Update player position

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id});
}

function onTeamAssignment(data) {

	var player = players[this.id];

	// Add player to team
	util.log(player.username + " added to " + data.team + " team.");
	player.team = data.team;

	// Add player to appropriate chat room
	this.leave("white");
	this.leave("black");
	this.join(data.team);

	// Broadcast team assignment to all other connected players
	this.broadcast.emit("team assignment", {id: player.id, team: data.team});

	// Update the waiting room message
	updateWaitingMessage();

}

function onChatMsg(data) {
	var player = players[this.id];
	this.broadcast.to(player.team).emit("chat msg", {msg: data, username: player.username});
}

function onMove(data) {
	var player = players[this.id];
	this.broadcast.emit("move", {id: player.id, x: data.x, y: data.y});
}

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);

	// Pass client ID back to client
	client.emit("id assignment", {id: client.id});

	// Send existing players to the new player
	var existingPlayer;
	_.each(_.values(players), function(thisPlayer) {
		client.emit("new player", {id: thisPlayer.id, name: thisPlayer.username, team: thisPlayer.team});
	});

	// if there is already a game in progress, notify the client
	if(gameInProgress) { this.emit("game in progress"); }

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);

	// Listen for team assignment requests
	client.on("team assignment", onTeamAssignment);

	// Listen for new chat messages
	client.on("chat msg", onChatMsg);

	// Listen for player movement
	client.on("move", onMove);

}

function setEventHandlers() {
	// Socket.IO
	io.sockets.on("connection", onSocketConnection);
}


/**************************************************
	GAME INITIALIZATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = {};
	playersCount = 0;

	// Set up Socket.IO to listen on port 8000
	io = io.listen(8000);

	// Configure Socket.IO
	io.configure(function() {
		// Only use WebSockets
		io.set("transports", ["websocket"]);

		// Restrict log output
		io.set("log level", 2);
	});

	// Start listening for events
	setEventHandlers();
}


/**************************************************
	RUN THE GAME
**************************************************/
init();