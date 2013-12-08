function addToWaitingRoom(player, cssClass) {
	$('#waiting-room li#player-' + player.id).remove();

	var listItem = "";
	listItem += '<li id="player-' + player.id + '"' + (cssClass ? ' class="cssClass"' : "") + '>';
	listItem += player.username;
	listItem += '</li>';

	$('#waiting-room ul#team-'+player.team).append(listItem);
}