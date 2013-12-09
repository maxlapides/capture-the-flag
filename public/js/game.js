/* global Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true */

//@codekit-prepend 'colors.js', 'Player.js', 'eventHandlers.js'
//@codekit-append 'components.js', 'scenes.js'

Game = {

	map_grid : {
		width:  80,
		height: 25,
		tile: {
			width:  16,
			height: 16
		}
	},

	start: function() {

		Crafty.init(480, 320);
		Crafty.viewport.init(480, 320);
		Crafty.background(CapColors.gray30);
		Crafty.scene('Start');

		// Initialise socket connection
		socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

		// Initialise remote players array
		remotePlayers = {};

		// clear list items from previous game
		$('#waiting-room li').remove();

		// Start listening for events
		setEventHandlers();

	}

};

$(document).ready(function() {
	Game.start();
});