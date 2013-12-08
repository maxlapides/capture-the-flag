/* global Game:true, Crafty, io, socket:true, Player, player:true, remotePlayers:true, addChatMsg, _, addToWaitingRoom */

Crafty.scene('Start', function() {

	$('.custom-scene').hide();
	$('#start').show();

	$('#start input[type=submit]').click(function(e) {

		e.preventDefault();

		var username = encodeURI($('input#username').val().trim());
		socket.emit("new player", {name: username});

		player.username = username;

		Crafty.scene('WaitingRoom');

	});

});

Crafty.scene('WaitingRoom', function() {

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
	$('.custom-scene').hide();
	$('#game-in-progress').show();
});

Crafty.scene('Game', function() {

	$('.custom-scene').hide();
	$('#below-game').show();

	Crafty.map.insert(Crafty.e('Stage').at(0,0));

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

	// initialize player positions
	var initPlayer;
	socket.on("init player", function(data) {

		// player character
		if(data.id === player.id) {
			player.entity = Crafty.e('PlayerCharacter').at(data.x, data.y);
			Crafty.viewport.follow(player.entity, 20, 20);
		}

		else {
			initPlayer = remotePlayers[data.id];
			initPlayer.entity = Crafty.e('Player').at(data.x, data.y);
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