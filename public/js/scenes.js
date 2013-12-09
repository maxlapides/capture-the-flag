/* global Game:true, Crafty, io, socket:true, Player, player:true, remotePlayers:true, addChatMsg, _, addToWaitingRoom, CapColors, mapDesignMode, Maps */

Crafty.scene('Start', function() {

	// show start scene
	$('.custom-scene').hide();
	$('#start').show();

	// when the username form is submitted
	$('#username-form').submit(function(e) {

		// prevents the form from doing its default thing
		// (which might be reloading the page)
		e.preventDefault();

		// grab the username and sanitize it a little
		// (because you know some cs dork is gonna try
		// to mess up our game by entering some weird shit)
		var username = encodeURI($('input#username').val().trim());

		// if the username is empty, stop here
		if(!username) { return; }

		// send the username to the server
		socket.emit("new player", {name: username});

		// save the username locally
		player.username = username;

		// switch to the Waiting Room scene
		Crafty.scene('WaitingRoom');

	});

});

Crafty.scene('WaitingRoom', function() {

	// show waiting room
	$('.custom-scene').hide();
	$('#waiting-room').show();

	// when user selects a team
	$('#waiting-room input[type=submit]').click(function(e) {

		e.preventDefault();

		// post team selection to server
		var selectedTeam = $(this).attr('id');
		socket.emit("team assignment", {team: selectedTeam});

		// add player to the selected team
		player.team = selectedTeam;
		addToWaitingRoom(player, 'self');

	});

});

Crafty.scene('GameInProgress', function() {
	// show game in progress scene
	$('.custom-scene').hide();
	$('#game-in-progress').show();
});

Crafty.scene('Game', function() {

	// show the game and the stuff below it (teammates, chat)
	$('.custom-scene').hide();
	if(!mapDesignMode) { $('#below-game').show(); }

	// add the "stage" to the canvas
	Crafty.map.insert(Crafty.e('StageBg').at(0,0));

	// add edges to the map
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = x === 0 || x === Game.map_grid.width - 1 || y === 0 || y === Game.map_grid.height - 1;
			if (at_edge) {
				Crafty.e('Edge').at(x, y);
			}
		}
	}

	// add teammates to free list
	var freeTeammates = $('#free-teammates ul');
	_.each(remotePlayers, function(thisPlayer) {
		if(thisPlayer.team === player.team) {
			freeTeammates.append('<li id="player-' + thisPlayer.id + '">' + thisPlayer.username + '</li>');
		}
	});

	// set map
	Maps.map1();

	// initialize player positions
	var initPlayer;
	socket.on("init player", function(data) {

		// player character (that's you!)
		if(data.id === player.id) {
			player.entity = Crafty.e('PlayerCharacter')
									.at(data.x, data.y)
									.setTeam(player.team);
			initPlayer = player;
			Crafty.viewport.follow(player.entity, 20, 20);
		}

		// the other players
		else {
			initPlayer = remotePlayers[data.id];
			initPlayer.entity = Crafty.e('Player')
										.at(data.x, data.y)
										.setTeam(initPlayer.team);
		}

	});

	// chat message submitted
	$('form#chatForm').submit(function(e) {

		e.preventDefault();

		// get chat message
		var chatMsg = $('input#chatMsg').val();

		// add chat message to chat box
		$('input#chatMsg').val("");
		addChatMsg(chatMsg, player.username);

		// post chat message to server
		socket.emit("chat msg", chatMsg);

	});

});