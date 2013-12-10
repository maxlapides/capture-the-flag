/* global Crafty */

var Maps = {

	map1: function() {

		// create an Obstacle at position (12, 12) with a width of 10 tiles and a height of 1 tile
		Crafty.e('Obstacle').at(18, 18).setSize(10, 1);

		// create a Safe Zone at position (30, 10) with a width of 2 tiles and a height of 2 tiles
		Crafty.e('SafeZone').at(30, 10).setSize(2, 2);

	}

};