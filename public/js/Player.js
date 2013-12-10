/* global _ */

var player,
	remotePlayers;

var Player = function(id, username) {

	this.id = id;
	this.username = username;
	this.team = "";
	this.entity = null;

	this.moveToJail = function() {
		this.entity.moveToJail();
		this.capture();
	};

	this.removeFromBelowGame = function() {
		$('#below-game li#player-' + this.id).remove();
	};

	this.free = function() {
		if(this.team === player.team) {
			this.removeFromBelowGame();
			var freeTeammates = $('#free-teammates ul');
			freeTeammates.append('<li id="player-' + this.id + '">' + this.username + '</li>');
		}
	};

	this.capture = function() {
		if(this.team === player.team) {
			this.removeFromBelowGame();
			var capturedTeammates = $('#captured-teammates ul');
			capturedTeammates.append('<li id="player-' + this.id + '">' + this.username + '</li>');
		}
	};

};

// get a Player by its entity ID
function playerByEntityId(id) {

	var thisPlayer = false;

	_.each(remotePlayers, function(curPlayer) {
		if(curPlayer.entity[0] === id) {
			thisPlayer = curPlayer;
		}
	});

	return thisPlayer;
}

player = new Player();