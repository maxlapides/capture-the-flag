/* global Game:true, Crafty, io, Player, player, remotePlayers, _, flags */

var socket;

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");
}

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}

function addToWaitingRoom(player, cssClass) {
	$('#waiting-room li#player-' + player.id).remove();

	var listItem = "";
	listItem += '<li id="player-' + player.id + '"' + (cssClass ? ' class="'+cssClass+'"' : "") + '>';
	listItem += player.username;
	listItem += '</li>';

	$('#waiting-room ul#team-'+player.team).append(listItem);
}

// New player
function onNewPlayer(data) {

	// Initialise the new player
	console.log("New player connected: " + data.id);
	var newPlayer = new Player(data.id, data.name);

	if(data.team) {
		newPlayer.team = data.team;
		addToWaitingRoom(newPlayer);
	}

	// Add new player to the remote players array
	remotePlayers[data.id] = newPlayer;
}

// Remove player
function onRemovePlayer(data) {
	var player = remotePlayers[data.id];

	// Player not found
	if (!player) {
		console.log("Player not found: "+data.id);
		return;
	}

	// remove player from waiting room
	$('#waiting-room li#player-' + player.id).remove();

	// Remove player from array
	delete remotePlayers[data.id];
}

function onIdAssignment(data) {
	console.log("Assigning player to ID " + data.id);
	player.id = data.id;
}

function onTeamAssignment(data) {

	var player = remotePlayers[data.id];

	// Player not found
	if (!player) {
		console.log("Player not found: "+data.id);
		return;
	}

	player.team = data.team;
	console.log(player.username + " assigned to: " + player.team);

	// add player to waiting room
	addToWaitingRoom(player);

}

function onWaitingMessage(data) {
	$('#waiting-room #waiting-msg').text(data);
}

function onStartGame(data) {
	console.log("Starting game!");
	Crafty.scene('Game');
}

function onGameInProgress(data) {
	Crafty.scene('GameInProgress');
}

function addChatMsg(msg, username) {
	var chatBox = $('#chat-msgs');
	chatBox.append("<br />" + username + ": " + msg);
	chatBox.scrollTop(chatBox.get(0).scrollHeight);
}

function onChatMsg(data) {
	addChatMsg(data.msg, data.username);
}

function onMove(data) {
	var player = remotePlayers[data.id];
	player.entity.x = data.x;
	player.entity.y = data.y;
}

function onTag(data) {

	var taggedPlayer;

	// if the tagged player if you
	if(player.id === data.id) {
		taggedPlayer = player;
	}
	// otherwise, the tagged player must be remote
	else {
		taggedPlayer = remotePlayers[data.id];
	}

	// move the tagged player to jail
	taggedPlayer.moveToJail();

}

function flagReset(data) {
	
	// call function flagReset(resetTeam) on both flags, correct one will reset
	_.each(flags, function(x) {
		x.flagReset(data.team);
	});
}

function flagPickUp(data) {

	// call function flagPickUp(pickUpTeam) on both flags
	_.each(flags, function(x) {
		x.flagPickUp(data.team);
	});
	
	console.log(data.color);
	remotePlayers[data.id].entity.color(data.color);
}

function setEventHandlers() {

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);

	// ID assignment
	socket.on("id assignment", onIdAssignment);

	// Team assignment
	socket.on("team assignment", onTeamAssignment);

	// Waiting message update
	socket.on("waiting msg", onWaitingMessage);

	// Game start!
	socket.on("start game", onStartGame);

	// Game in progress
	socket.on("game in progress", onGameInProgress);

	// Chat messages
	socket.on("chat msg", onChatMsg);

	// Player movements
	socket.on("move", onMove);

	// Player tagged
	socket.on("tag", onTag);
	
	// Flag reset
	socket.on("flag reset", flagReset);
	
	// Flag pick up
	socket.on("flag pick up", flagPickUp);

}