var player,
	remotePlayers;

var Player = function(id, username) {
	this.id = id;
	this.username = username;
	this.team = "";
	this.entity = null;
};

player = new Player();