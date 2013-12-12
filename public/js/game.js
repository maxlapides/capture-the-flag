/* global Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, flags */

//@codekit-prepend 'settings.js', colors.js', 'sounds.js', 'Player.js', 'maps.js', 'eventHandlers.js'
//@codekit-append 'components/components.js', 'scenes.js'

var mapDesignMode = false;

Game = {

	map_grid : {
		width:  160,
		height: 40,
		tile: {
			width:  16,
			height: 16
		}
	},

	start: function() {

		var viewportWidth, viewportHeight;

		// set the visible area on the screen
		if(mapDesignMode) {
			viewportWidth = Game.map_grid.tile.width * Game.map_grid.width;
			viewportHeight = Game.map_grid.tile.height * Game.map_grid.height;
		} else {
			viewportWidth = 480;
			viewportHeight = 320;
		}

		Crafty.init(viewportWidth, viewportHeight);
		Crafty.viewport.init(viewportWidth, viewportHeight);

		// add a background color to the whole project
		Crafty.background(CapColors.gray30);

		// set the starting scene
		if(mapDesignMode) {
			Crafty.scene('Game');
		} else {
			Crafty.scene('Start');
		}

		// Initialize socket connection
		socket = io.connect("http://localhost:8000", {port: 8000, transports: ["websocket"]});

		// Initialize remote players array
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