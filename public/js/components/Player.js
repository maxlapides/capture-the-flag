/* global _, Settings, Game:true, Crafty, io, socket:true, Player, player, remotePlayers:true, CapColors, blackJailPos, whiteJailPos, playerByEntityId, flags, addChatMsg */

Crafty.c('Player', {

	init: function() {
		this.requires('Actor, Color, Grid')
			.color('rgb(20,75,40)')
			.attr({
				z: 3
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

	tag: function(flagReturned) {

		// you can't tag someone who's already in jail
		if(this.jailed) { return; }

		// get the tagged player
		var thisPlayer = playerByEntityId(this[0]);

		// check to see if they were carrying the flag
		// if so, change their color back and return the flag
		if(thisPlayer.team === "white" && thisPlayer.entity._color !== CapColors.white) {
			thisPlayer.entity.color(CapColors.white);
			// send to server a flag return
			socket.emit("flag reset", {team: "black"});
		}
		else if(thisPlayer.team === "black" && thisPlayer.entity._color !== CapColors.black) {

			thisPlayer.entity.color(CapColors.black);
			// send to server a flag return
			socket.emit("flag reset", {team: "white"});
		}

		// move player to jail
		thisPlayer.moveToJail();

		Crafty.audio.play("tag");

		// post tag to server
		socket.emit("tag", {id: thisPlayer.id, flagReturned: flagReturned});

		// set the tagged player's color back to its original color
		// (when player carrying flag is tagged, its color should be reset)
		if(thisPlayer.team === "white" && thisPlayer.entity._color !== CapColors.white) {
			thisPlayer.entity.color(CapColors.white);
		}
		else if(thisPlayer.team === "black" && thisPlayer.entity._color !== CapColors.black) {
			thisPlayer.entity.color(CapColors.black);
		}

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
			this.x -= this._movement.x * 1.5;
			this.y -= this._movement.y * 1.5;
		}

		// post updated position to server
		socket.emit("move", {x: this.x , y: this.y});

		return this;

	},

	stopMovementSemi: function() {

		if(this.x < Game.map_grid.width * Game.map_grid.tile.width / 2) {

			if(player.team === "white") {

				this.stopMovement();

				// if the player is in their own territory but arent their own color,
				// they must have the flag
				// so, we have to reset that flag (which belongs to the other team)
				// and reset the players color (and increase the score)
				if(player.entity._color !== CapColors.white) {
					_.each(flags, function(curr) {

						if(curr.team === "black") {
							socket.emit("flag reset", {team: curr.team});
							player.entity.color(CapColors.white);
							socket.emit("increment score", {team: player.team, id: player.id});
						}
					});
				}

			}

		}
		else {

			if(player.team === "black") {

				this.stopMovement();

				if(player.entity._color !== CapColors.black) {
					_.each(flags, function(curr) {

						if(curr.team === "white") {
							socket.emit("flag reset", {team: curr.team});
							player.entity.color(CapColors.black);
							socket.emit("increment score", {team: player.team, id: player.id});
						}
					});
				}
			}
		}

		// post updated position to server
		socket.emit("move", {x: this.x , y: this.y});

		return this;
	},

	justTaggedSomeone: false,

	detectTag: function(collisionData) {

		// prevent duplicate tagging notifications (?)
		if(player.justTaggedSomeone) { return; }
		player.justTaggedSomeone = true;
		setTimeout(function() {
			player.justTaggedSomeone = false;
		}, 200);

		var captureBool = false;
		var flagReturned = false;

		// white side
		if(this.x < Game.map_grid.width * Game.map_grid.tile.width / 2) {

			// white guy tags black guy
			if(player.team === "white" && player.entity._color === CapColors.white) {
				_.each(collisionData, function(curPlayer) {

					if(playerByEntityId(curPlayer.obj[0]).team === "black") {
						captureBool = true;

						if(curPlayer.obj._color !== CapColors.black) {
							flagReturned = true;
						}

					}

				});
			}

			// white guy has black flag, black guy tags him
			else if(player.team === "black" && player.entity._color === CapColors.black) {
				_.each(collisionData, function(curPlayer) {
					if(playerByEntityId(curPlayer.obj[0]).team === "white" &&
						curPlayer.obj._color !== CapColors.white) {
							captureBool = true;
							flagReturned = true;
					}
				});
			}

		}

		// black side
		else {

			// black guy tags a white guy
			if(player.team === "black" && player.entity._color === CapColors.black) {
				_.each(collisionData, function(curPlayer) {
					if(playerByEntityId(curPlayer.obj[0]).team === "white") {
						captureBool = true;

						if(curPlayer.obj._color !== CapColors.white) {
							flagReturned = true;
						}

					}
				});
			}

			// black guy has white flag, white guy tags him
			else if(player.team === "white" && player.entity._color === CapColors.white) {
				_.each(collisionData, function(curPlayer) {
					if(playerByEntityId(curPlayer.obj[0]).team === "black" &&
						curPlayer.obj._color !== CapColors.black) {
							captureBool = true;
							flagReturned = true;
					}
				});
			}

		}

		if(captureBool) {

			_.each(collisionData, function(curPlayer) {

				// tag the player
				curPlayer.obj.tag(flagReturned);

				// post notification to chat feed
				addChatMsg(playerByEntityId(curPlayer.obj[0]).username + " tagged by " + player.username);

			});

		}

	},

	flagPickUp: function(collisionData) {

		_.each(collisionData, function(curr) {

			if(curr.obj.type === "flag" && curr.obj.captured === false) {

				player.entity.color(curr.obj._color);
				curr.obj.color(CapColors.gray50);
				curr.obj.captured = true;

				Crafty.audio.play("flagGet");

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
					socket.emit("jail release", {team: player.team, auto: false});
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