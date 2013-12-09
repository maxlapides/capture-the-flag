/* global Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true */

//@codekit-prepend 'colors.js', 'Player.js', 'eventHandlers.js', 'maps.js'
//@codekit-append 'components.js', 'scenes.js'

var mapDesignMode = false;

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

		var viewportWidth, viewportHeight;

		if(mapDesignMode) {
			viewportWidth = Game.map_grid.tile.width * Game.map_grid.width;
			viewportHeight = Game.map_grid.tile.height * Game.map_grid.height;
		} else {
			viewportWidth = 480;
			viewportHeight = 320;
		}

		Crafty.init(viewportWidth, viewportHeight);
		Crafty.viewport.init(viewportWidth, viewportHeight);

		Crafty.background(CapColors.gray30);

		if(mapDesignMode) {
			Crafty.scene('Game');
		} else {
			Crafty.scene('Start');
		}

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