/* global _, Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, CapColors */

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

Crafty.c('StageBg', {
	init: function() {
		this.requires('2D, Canvas, Color, Grid')
			.color(CapColors.gray20)
			.attr({
				w: (Game.map_grid.tile.width * Game.map_grid.width) / 2,
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
	}

});

Crafty.c('Obstacle', {
	init: function() {
		this.requires('Edge')
			.attr({
				w: Game.map_grid.tile.width * 3,
				h: Game.map_grid.tile.height
			});
	}
});

Crafty.c('Player', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color('rgb(20,75,40)');
	},

	setTeam: function(team) {
		if(team === "white") {
			this.color(CapColors.white);
		} else {
			this.color(CapColors.black);
		}

		return this;

	}

});

Crafty.c('PlayerCharacter', {

	init: function() {
		this.requires('Player, Multiway, Collision')
			.multiway(4, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
			.color('rgb(20,75,40)')
			.postMovement()
			.pcCollisions()
			.disableOnChat();
	},

	postMovement: function() {

		this.bind('Moved', function() {
			socket.emit("move", {x: this.x , y: this.y});
		});

		return this;

	},

	pcCollisions: function() {

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

		// when the user clicks in the chat message box
		// prevent arrow keys from moving the character
		$('input#chatMsg').focus(function() {
			pc.disableControl();
		});

		// when the user unclicks from the chat message box
		// enable the user to move the character
		$('input#chatMsg').blur(function() {
			pc.enableControl();
		});

		return this;

	}

});