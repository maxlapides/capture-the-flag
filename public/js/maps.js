/* global Crafty */

var whiteJailPos = {};
var blackJailPos = {};

var Maps = {

	map1: function() {

		// creating Obstacles

		// large side walls (left)
		Crafty.e('Obstacle').at(35, 7).setSize(40, 2);
		Crafty.e('Obstacle').at(35, 31).setSize(40, 2);
		// connecting short verticals (left)
		Crafty.e('Obstacle').at(73, 9).setSize(2, 6);
		Crafty.e('Obstacle').at(73, 25).setSize(2, 6);
		// large side walls (right)
		Crafty.e('Obstacle').at(85, 7).setSize(40, 2);
		Crafty.e('Obstacle').at(85, 31).setSize(40, 2);
		// connecting short verticals (right)
		Crafty.e('Obstacle').at(85, 9).setSize(2, 6);
		Crafty.e('Obstacle').at(85, 25).setSize(2, 6);
		// large horizontal middle walls
		Crafty.e('Obstacle').at(75, 13).setSize(10, 2);
		Crafty.e('Obstacle').at(75, 25).setSize(10, 2);
		// white side center square
		Crafty.e('Obstacle').at(50, 16).setSize(7, 1);
		Crafty.e('Obstacle').at(50, 23).setSize(7, 1);
		Crafty.e('Obstacle').at(50, 16).setSize(1, 7);
		Crafty.e('Obstacle').at(56, 16).setSize(1, 7);
		// black side center square
		Crafty.e('Obstacle').at(103, 16).setSize(7, 1);
		Crafty.e('Obstacle').at(103, 23).setSize(7, 1);
		Crafty.e('Obstacle').at(103, 16).setSize(1, 7);
		Crafty.e('Obstacle').at(109, 16).setSize(1, 7);

		// creating Hiding Zones

		// outer zones, near dividing line (clockwise starting in top left)
		Crafty.e('HidingZone').at(76, 9).setSize(2, 2);
		Crafty.e('HidingZone').at(82, 9).setSize(2, 2);
		Crafty.e('HidingZone').at(82, 29).setSize(2, 2);
		Crafty.e('HidingZone').at(76, 29).setSize(2, 2);
		// inner zones, top/white side
		Crafty.e('HidingZone').at(60, 10).setSize(2, 2);
		Crafty.e('HidingZone').at(45, 10).setSize(2, 2);
		// inner zones, bottom/white side
		Crafty.e('HidingZone').at(60, 28).setSize(2, 2);
		Crafty.e('HidingZone').at(45, 28).setSize(2, 2);
		// inner zones, top/black side
		Crafty.e('HidingZone').at(98, 10).setSize(2, 2);
		Crafty.e('HidingZone').at(113, 10).setSize(2, 2);
		// inner zones, bottom/black side
		Crafty.e('HidingZone').at(98, 28).setSize(2, 2);
		Crafty.e('HidingZone').at(113, 28).setSize(2, 2);
		
		// creating Safe Zones

		// creating Safe Zones (to contain the jails)

		// White
		Crafty.e('SafeZone').at(1, 1).setSize(5, 5);
		// Black
		Crafty.e('SafeZone').at(154, 34).setSize(5, 5);

		// creating Flags

		// White
		Crafty.e('Flag').at(3, 3).setSize(1, 1).setColor("white");
		// Black
		Crafty.e('Flag').at(156, 36).setSize(1, 1).setColor("black");

		// set jail positions
		whiteJailPos = {x: 1, y: 39};
		blackJailPos = {x: 159, y: 1};

	},

	map2: function() {


	}

};