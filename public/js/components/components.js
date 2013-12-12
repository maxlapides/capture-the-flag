/* global _, Settings, Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, flags, CapColors */

//@codekit-prepend "Player.js"

Crafty.c('Grid', {

	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		});
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
		if (x === undefined && y === undefined) {
			return {
				x: this.x/Game.map_grid.tile.width,
				y: this.y/Game.map_grid.tile.height
			};
		} else {
			this.attr({
				x: x * Game.map_grid.tile.width,
				y: y * Game.map_grid.tile.height
			});
			return this;
		}
	},

	setSize: function(width, height) {

		this.attr({
			w: Game.map_grid.tile.width * width,
			h: Game.map_grid.tile.height * height
		});

		return this;

	}

});

Crafty.c('StageBg', {
	init: function() {
		this.requires('2D, Canvas, Color, Grid')
			.color(CapColors.gray20)
			.attr({
				w: (Game.map_grid.tile.width * Game.map_grid.width) / 2,
				h: Game.map_grid.tile.height * Game.map_grid.height,
				z: 1
			});
	}
});

Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas');
	}
});

Crafty.c('Edge', {

	init: function() {
		this.requires('Actor, Solid, Color, Grid')
			.color('black')
			.attr({
				z: 4
			});
	}

});

Crafty.c('Obstacle', {

	init: function() {
		this.requires('Edge')
			.setSize(1, 1);
	}

});

Crafty.c('JailWall', {

	init: function() {
		this.requires('Obstacle');
	},

	team: "",

	setTeam: function(theTeam) {
		this.team = theTeam;
	}
});

Crafty.c('SafeZone', {

	init: function() {
		this.requires('Actor, Color, Grid, Semisolid')
			.color(CapColors.gray50)
			.attr({
				z: 2
			});
	}

});

Crafty.c('HidingZone', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color(CapColors.gray70)
			.attr({
				z: 4
			});
	}

});

Crafty.c('Flag', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color('rgb(100, 70, 100)')
			.attr({
				z: 3
			});
	},

	type: "flag",
	team: "",
	id: 0,

	captured: false,

	setColor: function(team) {

		this.team = team;

		if(team === "white") {
			this.color(CapColors.pink);
			this.id = 0;
		}
		else {
			this.color(CapColors.aqua);
			this.id = 1;
		}

		flags[this.id] = this;

		return this;
	},

	flagPickUp: function(pickUpTeam) {

		if(this.team === pickUpTeam) {
			this.color(CapColors.gray50);
			this.captured = true;
		}
	},

	flagReset: function(resetTeam) {

		if(this.team === resetTeam && this.team === "white") {
			this.color(CapColors.pink);
			this.captured = false;
		}
		else if(this.team === resetTeam && this.team === "black") {
			this.color(CapColors.aqua);
			this.captured = false;
		}

	}

});