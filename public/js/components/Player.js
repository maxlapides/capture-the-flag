/* global _, Settings, Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, CapColors, blackJailPos, whiteJailPos, playerByEntityId, flags */

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
	
	jailed: false,

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
	
		this.jailed = true;

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
		
		// check to see if they were carrying the flag
		// if so, change their color back and return the flag
		if(thisPlayer.team === "white" && thisPlayer.entity._color !== CapColors.white) {
			thisPlayer.entity.color(CapColors.white);
			// send to server a flag return
			socket.emit("flag reset", {team: thisPlayer.team});
		}
		else if(thisPlayer.team === "black" && thisPlayer.entity._color !== CapColors.black) {
			
			thisPlayer.entity.color(CapColors.black);
			// send to server a flag return
			socket.emit("flag reset", {team: thisPlayer.team});
		}

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
		this.onHit('JailWall', this.jailRelease);
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
				
				// if the player is in their own territory but arent their own color,
				// they must have the flag
				// so, we have to reset that flag (which belongs to the other team)
				// and reset the players color (and increase the score)
				if(player.entity._color !== CapColors.white) {
					_.each(flags, function(curr) {
					
						if(curr.team === "black") {
							socket.emit("flag reset", {team: curr.team});
							player.entity.color(CapColors.white);
							socket.emit("increment score", {team: player.team});
						}
					});
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
			
			if(player.entity._color !== CapColors.black) {
				_.each(flags, function(curr) {
				
					if(curr.team === "white") {
						socket.emit("flag reset", {team: curr.team});
						player.entity.color(CapColors.black);
						socket.emit("increment score", {team: player.team});
					}
				});
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
					if(playerByEntityId(curPlayer.obj[0]).team === "black") {
						captureBool = true;
					}
				});
			}

		}
		else {

			if(player.team === "black") {
				_.each(collisionData, function(curPlayer) {
					if(playerByEntityId(curPlayer.obj[0]).team === "white") {
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

			if(curr.obj.type === "flag" && curr.obj.captured === false) {

				player.entity.color(curr.obj._color);
				curr.obj.color(CapColors.gray50);
				curr.obj.captured = true;

				// post flag pick up to server
				socket.emit("flag pick up", {team: curr.obj.team,
												id: player.id,
												color: player.entity._color});

			}

		});

	},
	
	jailRelease: function(data) {
		
		if(player.entity.jailed === false) {
			_.each(data, function(curr){
			
				if(curr.obj.team !== player.team) {
					socket.emit("jail release", {team: player.team});
				}
			});
		}
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