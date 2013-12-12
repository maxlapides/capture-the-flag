/* global require, process */

/**************************************************
	NODE.JS REQUIREMENTS
**************************************************/

var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	_ = require('underscore')._,			// Underscore.js
	http = require('http'),
	Player = require("./Player").Player;	// Player class

/**************************************************
	GAME VARIABLES
**************************************************/

var inactivePlayers,			// Array of connected players
	players,					// Array of active players
	playersCount,				// Number of connected players
	countdown = false,			// Interval ID of countdown timer
	gameInProgress = false,
	score = {},
	numMaps = 5,				// Number of available maps
	capsToWin = 3;


/**************************************************
	HELPER FUNCTIONS
**************************************************/

function clearCountdown() {
	clearInterval(countdown);
}

function startGame() {

	// it should theoretically never hit this case
	// but better safe than sorry.
	if(gameInProgress) { return; }

	gameInProgress = true;

	// notify each of the inactive players that the game is in progress
	_.each(_.keys(inactivePlayers), function(inactivePlayer) {
		io.sockets.socket(inactivePlayer).emit("game in progress");
	});

	// set the initial score to 0-0
	score.white = 0;
	score.black = 0;

	var randMap = Math.floor(Math.random() * numMaps) + 1;
	io.sockets.emit("set map", {map: randMap});

	// set player positions
	_.each(_.values(players), function(thisPlayer) {

		if(thisPlayer.team === "white") {
			thisPlayer.x = 17;
			thisPlayer.y = 20;
		}
		else {
			thisPlayer.x = 142;
			thisPlayer.y = 20;
		}

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
			clearCountdown();
			waitingMsg = "Waiting for " + waitingOnPlayers + " player" + (waitingOnPlayers > 1 ? "s" : "") + " to select a team...";
			io.sockets.emit("waiting msg", {msg: waitingMsg});
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

	if(initiateCountdown && !gameInProgress) {

		util.log("Countdown initiated.");

		var countdownCounter = 15;
		clearCountdown();

		countdown = setInterval(function() {

			// it should theoretically never hit this case
			// but better safe than sorry.
			if(gameInProgress) {
				util.log("Trying to start the game again!?");
				clearCountdown();
				return;
			}

			// stop countdown after 30 seconds
			if(countdownCounter === 0) {
				clearCountdown();
				util.log("Starting the game!");
				io.sockets.emit("start game");
				startGame();
				return;
			}

			// update waiting message every second
			waitingMsg = "Game starting in " + countdownCounter + " second" + (countdownCounter > 1 ? "s" : "") + "...";
			io.sockets.emit("waiting msg", {msg: waitingMsg, time: countdownCounter});

			// count down
			countdownCounter--;

		}, 1000);

	}

	else {
		clearCountdown();
		waitingMsg = "Waiting for more players...";
		io.sockets.emit("waiting msg", {msg: waitingMsg});
	}

}


/**************************************************
	GAME EVENT HANDLERS
**************************************************/

function flagReset(data) {

	// increment this player's flag releases
	var player = players[this.id];
	if(player && player.team === data.team) {
		players[this.id].flagReturns++;
	}

	// notify all other clients that flag reset occurred
	io.sockets.emit("flag reset", {team: data.team, id: this.id});

	// set all players on the reset team to no longer be carrying the flag
	_.each(_.values(players), function(thisPlayer) {
		if(thisPlayer.team === data.team) {
			thisPlayer.carryingFlag = false;
		}
	});

}

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = players[this.id];

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}

	// Reset the flag if the player was carrying the flag
	if(removePlayer.carryingFlag) {
		flagReset({team: removePlayer.team});
	}

	// Remove player from players array
	delete players[this.id];
	playersCount--;

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});

	// Update the waiting room message
	if(!gameInProgress) { updateWaitingMessage(); }

}

// New player has joined
function onNewPlayer(data) {

	// if there is already a game in progress, notify the client
	if(gameInProgress) {
		this.emit("game in progress");
		return;
	}

	// Create a new player
	var newPlayer = new Player(this.id, data.name);
	util.log("New player added: " + newPlayer.username);

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, name: newPlayer.username, team: newPlayer.team});

	// Remove this player from the inactive array
	delete inactivePlayers[newPlayer.id];

	// Add this player to the active array
	players[this.id] = newPlayer;
	playersCount++;

	// Update the waiting room message
	if(!gameInProgress) { updateWaitingMessage(); }

}

function onTeamAssignment(data) {

	var player = players[this.id];
	if(!player) { return; }

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
	if(player && data) {
		this.broadcast.to(player.team).emit("chat msg", {msg: data, username: player.username});
	}
}

function onMove(data) {
	var player = players[this.id];
	if(player) {
		this.broadcast.emit("move", {id: player.id, x: data.x, y: data.y});
	}
}

function onTag(data) {

	// get relevant players
	var tagger = players[this.id];
	var taggedPlayer = players[data.id];

	// increment tag counts
	tagger.tags++;
	taggedPlayer.timesTagged++;

	// notify all other clients that the tag occurred
	this.broadcast.emit("tag", {id: taggedPlayer.id, taggerId: tagger.id, flagReturned: data.flagReturned});

	if(data.flagReturned) {
		io.sockets.emit("flag returned", {team: tagger.team, username: tagger.username});
	}

	util.log(tagger.username + " tagged " + taggedPlayer.username);

}

function flagPickUp(data) {
	players[data.id].carryingFlag = true;
	this.broadcast.emit("flag pick up", {team: data.team, id: data.id, color: data.color});
}

function jailRelease(data) {
	io.sockets.emit("jail release", {team: data.team, id: this.id, auto: data.auto});
}

function startJailCountdown(data) {

	var jailFullCounter = 10;

	var jailFull = setInterval(function() {

		io.sockets.emit("jail release countdown", {team: data.team, time: jailFullCounter});

		if(jailFullCounter === 0) {
			clearInterval(jailFull);
			io.sockets.emit("jail release", {team: data.team, id: this.id, auto: data.auto});
			return;
		}

		jailFullCounter--;

	}, 1000);

}

function incScore(data) {

	var player = players[data.id];

	// increment this player's flag captures
	if(player) { player.flagCaps++;	}

	// increment the appropriate team's score
	var scoringTeam = data.team;
	score[scoringTeam]++;

	// if the game is over
	if(score[scoringTeam] > (capsToWin-1)) {

		// tell players the game has ended
		io.sockets.emit("game over", {score: score, players: players});

		// set game over
		gameInProgress = false;

		// reset all player variables
		_.each(_.values(players), function(player) {
			player.team = "";
			player.carryingFlag = false;
			player.tags = 0;
			player.timesTagged = 0;
			player.flagCaps = 0;
			player.flagReturns = 0;
			player.jailReleases = 0;
		});

		// reset the score
		score = {};

		// update the waiting message
		updateWaitingMessage();

	}
	else {
		io.sockets.emit("increment score", {score: score, id: data.id, team: scoringTeam});
	}

}

function incJailRelease(data) {
	players[data.id].jailReleases++;
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
	if(gameInProgress) { client.emit("game in progress"); }

	// otherwise, add this player to the inactive players array
	else {
		inactivePlayers[client.id] = true;
	}

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for team assignment requests
	client.on("team assignment", onTeamAssignment);

	// Listen for new chat messages
	client.on("chat msg", onChatMsg);

	// Listen for player movement
	client.on("move", onMove);

	// Listen for tags
	client.on("tag", onTag);

	// Listen for flag reset
	client.on("flag reset", flagReset);

	// Listen for flag pick up
	client.on("flag pick up", flagPickUp);

	// Listen for jail release
	client.on("jail release", jailRelease);

	// Listen for jail release countdown
	client.on("start jail countdown", startJailCountdown);

	// Listen for increment score
	client.on("increment score", incScore);

	// Listen for inc jail release
	client.on("inc jail release", incJailRelease);

}

function setEventHandlers() {
	io.sockets.on("connection", onSocketConnection);
}


/**************************************************
	GAME INITIALIZATION
**************************************************/

function reset() {
	inactivePlayers = {};
	players = {};
	playersCount = 0;
}

function init() {

	reset();

	// Set up Socket.IO to listen on port 8000
	var port = (process.env.PORT || 8000);

	// Nodejitsu
	//var port = (process.env.PORT || 80);

	io = io.listen(port);

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