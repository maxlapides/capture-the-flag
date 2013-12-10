/* global _, Settings, Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, CapColors, blackJailPos, whiteJailPos, playerByEntityId */

Crafty.c('Player', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color('rgb(20,75,40)')
			.attr({
				z: 2
			});
	},
	
	type: "player",

	team: "",

	setTeam: function(team) {

		this.team = team;

		if(team === "white") {
			this.color(CapColors.white);
		} else {
			this.color(CapColors.black);
		}

		return this;

	},

	moveToJail: function() {

		if(this.team === "white") {
			this.x = blackJailPos.x * Game.map_grid.tile.width;
			this.y = blackJailPos.y * Game.map_grid.tile.height;
		}
		else {
			this.x = whiteJailPos.x * Game.map_grid.tile.width;
			this.y = whiteJailPos.y * Game.map_grid.tile.height;
		}

	},

	tag: function() {

		// get the tagged player
		var thisPlayer = playerByEntityId(this[0]);

		// move player to jail
		thisPlayer.moveToJail();

		// post tag to server
		socket.emit("tag", {id: thisPlayer.id});

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
		this.onHit('Player', this.detectTag);
		this.onHit('Semisolid', this.stopMovementSemi);
		this.onHit('Flag', this.flagPickUp);
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

	detectTag: function(collisionData) {

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
			_.each(collisionData, function(curPlayer) {
				curPlayer.obj.tag();
			});
		}

	},

	flagPickUp: function(collisionData) {

		_.each(collisionData, function(curr) {
<<<<<<< HEAD
			console.log(curr.obj);
=======
			
			if(curr.obj.type === "flag" && curr.obj.captured === false) {
			
				player.entity.color(curr.obj._color);
				curr.obj.visible(false);
				curr.obj.captured = true;
				
				// this needs to get pushed to the server somehow?
				
			}
>>>>>>> d7275356fe55112b70b2d2e3ad83ca961b010c59
		});

	},
	
	/*jailRelease: function() {
		
	},*/

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