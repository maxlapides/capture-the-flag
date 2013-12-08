/* global Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true */

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
	}
});

Crafty.c('Stage', {
	init: function() {
		this.requires('2D, Canvas, Color, Grid')
			.color('green')
			.attr({
				w: Game.map_grid.tile.width * Game.map_grid.width,
				h: Game.map_grid.tile.height * Game.map_grid.height
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
		this.requires('Actor, Solid, Color, Grid, Solid')
			.color('black');
	},
});

Crafty.c('Player', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color('rgb(20,75,40)');
	}

});

Crafty.c('PlayerCharacter', {

	init: function() {
		this.requires('Player, Fourway, Collision')
			.fourway(4)
			.color('rgb(20,75,40)')
			.postMovement()
			.stopOnSolids()
			.disableOnChat();
	},

	postMovement: function() {

		this.bind('Moved', function() {
			socket.emit("move", {x: this.x , y: this.y});
		});

		return this;

	},

	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},

	stopMovement: function() {

		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}

		return this;

	},

	disableOnChat: function() {

		var pc = this;

		$('input#chatMsg').focus(function() {
			pc.disableControl();
		});

		$('input#chatMsg').blur(function() {
			pc.enableControl();
		});

		return this;

	}

});