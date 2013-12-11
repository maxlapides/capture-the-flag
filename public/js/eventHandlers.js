/* global Game:true, Crafty, io, Player, player, remotePlayers, CapColors, _, Maps */

var socket;
var flags = [];

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");
}

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}

function addToWaitingRoom(newPlayer) {

	$('#waiting-room li#player-' + newPlayer.id).remove();

	var cssClass = (newPlayer.id === player.id) ? "self" : "";

	var listItem = "";
	listItem += '<li id="player-' + newPlayer.id + '"' + (cssClass ? ' class="'+cssClass+'"' : "") + '>';
	listItem += newPlayer.username;
	listItem += '</li>';

	$('#waiting-room ul#team-'+newPlayer.team).append(listItem);
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

	if(player.entity) {
		// destroy the player entity
		player.entity.destroy();
		// remove player from the list of free/captured teammates
		player.removeFromBelowGame();
	}
	else {
		// remove player from waiting room
		$('#waiting-room li#player-' + player.id).remove();
	}

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

function onSetMap(data) {
	var map = "map" + data.map;
	Maps[map]();
}

function onInitPlayer(data) {

	var initPlayer;

	// player character (that's you!)
	if(data.id === player.id) {
		player.entity = Crafty.e('PlayerCharacter').at(data.x, data.y).setTeam(player.team);
		initPlayer = player;
		Crafty.viewport.follow(player.entity, 20, 20);
	}

	// the other players
	else {
		initPlayer = remotePlayers[data.id];
		initPlayer.entity = Crafty.e('Player').at(data.x, data.y).setTeam(initPlayer.team);
	}

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
	taggedPlayer.entity.jailed = true;

	if(taggedPlayer.team === "white" && taggedPlayer.entity._color !== CapColors.white) {

		taggedPlayer.entity.color(CapColors.white);
	}
	else if(taggedPlayer.team === "black" && taggedPlayer.entity._color !== CapColors.black) {

		taggedPlayer.entity.color(CapColors.black);
	}

	if($('#free-teammates li').length === 0) {

		var jailFullCounter = 10;

		var jailFull = setInterval(function() {

			if(jailFullCounter === 0) {
				clearInterval(jailFull);
				socket.emit("jail release", {team: taggedPlayer.team, auto: true});
				return;
			}

			jailFullCounter--;

		}, 1000);
	}

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

	remotePlayers[data.id].entity.color(data.color);
}

function jailRelease(data) {

	// search through all players and release any "jailed" players on your team
	_.each(remotePlayers, function(curr) {

		if(curr.team === data.team && curr.entity.jailed === true) {
			curr.entity.jailed = false;
			curr.free();
			if(curr.team === "white") {
				curr.entity.x = (Math.random()*5 + 15) * Game.map_grid.tile.width;
				curr.entity.y = (Math.random()*15 + 15) * Game.map_grid.tile.height;
			}
			else {
				curr.entity.x = (Math.random()*5 + 139) * Game.map_grid.tile.width;
				curr.entity.y = (Math.random()*15 + 15) * Game.map_grid.tile.height;
			}
		}
	});

	// also check yo self before you wreck yo self
	if(player.team === data.team && player.entity.jailed === true) {
	
		player.entity.jailed = false;
		player.free();
		if(!data.auto) {
			socket.emit("inc jail release", {id: data.id});
		}
		if(player.team === "white") {
				player.entity.x = (Math.random()*5 + 15) * Game.map_grid.tile.width;
				player.entity.y = (Math.random()*15 + 15) * Game.map_grid.tile.height;
			}
			else {
				player.entity.x = (Math.random()*5 + 139) * Game.map_grid.tile.width;
				player.entity.y = (Math.random()*15 + 15) * Game.map_grid.tile.height;
			}
	}
	
	Crafty.audio.play("jailDoor");
	Crafty.audio.play("buzz");
}

function incScore(data) {

	// change score
	$('#score-white span').text(data.score.white);
	$('#score-black span').text(data.score.black);

	// update player color
	var thisPlayer = remotePlayers[data.id];
	if(thisPlayer) {
		thisPlayer.entity.color(CapColors[thisPlayer.team]);
	}
	
	Crafty.audio.play("cheer");

}

function sortPlayers(player1, player2) {

	if(player1.username < player2.username) {
		return -1;
	}

	if(player1.username > player2.username) {
		return 1;
	}

	return 0;

}

function gameOver(data) {

	// get the final score
	var score = data.score;
	var playerStats = data.players;

	// get the winning team
	var winningTeam;
	if(score.white > score.black) {
		winningTeam = "white";
	} else {
		winningTeam = "black";
	}

	// switch back to the waiting room
	Crafty.scene('WaitingRoom');

	// show the score card below the waiting room
	$('#scorecard').html("").show();
	
	// play winning and losing sounds
	if(player.team === winningTeam) {
		Crafty.audio.play("win");
	}
	else {
		Crafty.audio.play("lose");
	}

	// separate players into teams
	var blackStats = [], whiteStats = [];
	_.each(_.values(playerStats), function(stats) {
		if(stats.team === "black") {
			blackStats.push(stats);
		}
		else {
			whiteStats.push(stats);
		}
	});

	// sort players
	blackStats = blackStats.sort(sortPlayers);
	whiteStats = whiteStats.sort(sortPlayers);

	var allStats;
	if(player.team === "black") {
		allStats = blackStats.concat(whiteStats);
	}
	else {
		allStats = whiteStats.concat(blackStats);
	}

	// generate the score card

	var scoreCard = "";

	scoreCard += '<h2>' + ((player.team === winningTeam) ? "Victory!" : "Defeat.") + '</h2>';
	scoreCard += '<h3><span>Black: ' + score.black + '</span><span>White: ' + score.white + '</span></h3>';

	scoreCard += "<table>";

	// header row
	scoreCard += "<tr>";
	scoreCard += "<th>Username</th>";
	scoreCard += "<th>Team</th>";
	scoreCard += "<th>Tags</th>";
	scoreCard += "<th>Times Tagged</th>";
	scoreCard += "<th>Flag Captures</th>";
	scoreCard += "<th>Flag Returns</th>";
	scoreCard += "<th>Jail Releases</th>";
	scoreCard += "</tr>";

	_.each(allStats, function(stats) {
		scoreCard += "<tr>";
		scoreCard += "<td>" + stats.username + "</td>";
		scoreCard += "<td>" + stats.team + "</td>";
		scoreCard += "<td>" + stats.tags + "</td>";
		scoreCard += "<td>" + stats.timesTagged + "</td>";
		scoreCard += "<td>" + stats.flagCaps + "</td>";
		scoreCard += "<td>" + stats.flagReturns + "</td>";
		scoreCard += "<td>" + stats.jailReleases + "</td>";
		scoreCard += "</tr>";
	});

	scoreCard += "</table>";

	$('#scorecard').html(scoreCard);

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

	// Set map
	socket.on("set map", onSetMap);

	// Initialize player
	socket.on("init player", onInitPlayer);

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

	// Jail release
	socket.on("jail release", jailRelease);

	// Increment score
	socket.on("increment score", incScore);

	// Game over
	socket.on("game over", gameOver);

}