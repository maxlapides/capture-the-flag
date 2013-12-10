/* global _, Settings, Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, CapColors */

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
		this.requires('Actor, Solid, Color, Grid')
			.color('black')
			.attr({
				z: 3
			});
	}

});

Crafty.c('Obstacle', {

	init: function() {
		this.requires('Edge')
			.setSize(1, 1);
	}

});

Crafty.c('SafeZone', {

	init: function() {
		this.requires('Actor, Color, Grid, Semisolid')
			.color(CapColors.gray50)
			.attr({
				z: 1
			});
	}

});

Crafty.c('HidingZone', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color(CapColors.gray70)
			.attr({
				z: 3
			});
	}

});

Crafty.c('Flag', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color('rgb(100, 70, 100)')
			.attr({
				z: 1
			});
	},

	setColor: function(team) {
		if(team === "white") {
			this.color(CapColors.pink);
		}
		else {
			this.color(CapColors.aqua);
		}

		return this;
	}

});

Crafty.c('Player', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color('rgb(20,75,40)')
			.attr({
				z: 2
			});
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
		this.requires('Player, Multiway, Collision, Keyboard')
			.multiway(Settings.playerSpeed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
			.color('rgb(20,75,40)')
			.postMovement()
			.pcCollisions()
			.disableOnChat();
	},

	postMovement: function() {

		this.bind('Moved', function() {
			// post updated position to server
			socket.emit("move", {x: this.x , y: this.y});
		});

		return this;

	},

	pcCollisions: function() {
		this.onHit('Solid', this.stopMovement);
		this.onHit('Player', this.playerTag);
		this.onHit('Semisolid', this.stopMovementSemi);
		return this;
	},

	stopMovement: function() {

		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}

		// post updated position to server
		socket.emit("move", {x: this.x , y: this.y});

		return this;

	},

	stopMovementSemi: function() {

		if(this.x < Game.map_grid.width * Game.map_grid.tile.width / 2) {

			if(player.team === "white") {

				this._speed = 0;
				if (this._movement) {
					this.x -= this._movement.x;
					this.y -= this._movement.y;
				}
			}
		}
		else {

			if(player.team === "black") {

				this._speed = 0;
				if (this._movement) {
					this.x -= this._movement.x;
					this.y -= this._movement.y;
				}
			}
		}

		// post updated position to server
		socket.emit("move", {x: this.x , y: this.y});

		return this;
	},

	playerTag: function(collisionData) {

		var captureBool = false;

		if(this.x < Game.map_grid.width * Game.map_grid.tile.width / 2) {

			if(player.team === "white") {

				_.each(collisionData, function(curPlayer) {

					if(curPlayer.obj._color === CapColors.black) {

						captureBool = true;
					}
				});
			}
		}
		else {

			if(player.team === "black") {

				_.each(collisionData, function(curPlayer) {

					if(curPlayer.obj._color === CapColors.white) {

						captureBool = true;
					}
				});
			}
		}

		if(captureBool) {

			// send player to jail
			this.color('rgb(20,75,40)');
			console.log("sending to jail");
		}
	},

	/*flagPickUp: function() {



	}*/

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