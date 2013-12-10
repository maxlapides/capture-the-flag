/* global _, Settings, Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, CapColors */


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