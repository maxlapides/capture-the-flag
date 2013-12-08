/* global players, exports:true */

var Player = function(id, username) {
	this.id = id;
	this.username = username;
	this.team = "";
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;