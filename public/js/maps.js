/* global Crafty */

var whiteJailPos = {};
var blackJailPos = {};

var Maps = {

	map1: function() {
	
		// creating Obstacles

		// white barrier
		Crafty.e('Obstacle').at(34, 11).setSize(2, 18);
		// black barrier
		Crafty.e('Obstacle').at(124, 11).setSize(2, 18);
		
		// creating Hiding Zones
		
		// white pyramid zones
		// 1 layer
		Crafty.e('HidingZone').at(40, 19).setSize(2, 2);
		// 2 layer
		Crafty.e('HidingZone').at(47, 15).setSize(2, 2);
		Crafty.e('HidingZone').at(47, 23).setSize(2, 2);
		// 3 layer
		Crafty.e('HidingZone').at(54, 11).setSize(2, 2);
		Crafty.e('HidingZone').at(54, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(54, 27).setSize(2, 2);
		// 4 layer
		Crafty.e('HidingZone').at(61, 7).setSize(2, 2);
		Crafty.e('HidingZone').at(61, 15).setSize(2, 2);
		Crafty.e('HidingZone').at(61, 23).setSize(2, 2);
		Crafty.e('HidingZone').at(61, 31).setSize(2, 2);
		// 5 layer
		Crafty.e('HidingZone').at(68, 3).setSize(2, 2);
		Crafty.e('HidingZone').at(68, 11).setSize(2, 2);
		Crafty.e('HidingZone').at(68, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(68, 27).setSize(2, 2);
		Crafty.e('HidingZone').at(68, 35).setSize(2, 2);
		// black pyramid zones
		// 1 layer
		Crafty.e('HidingZone').at(118, 19).setSize(2, 2);
		// 2 layer
		Crafty.e('HidingZone').at(111, 15).setSize(2, 2);
		Crafty.e('HidingZone').at(111, 23).setSize(2, 2);
		// 3 layer
		Crafty.e('HidingZone').at(104, 11).setSize(2, 2);
		Crafty.e('HidingZone').at(104, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(104, 27).setSize(2, 2);
		// 4 layer
		Crafty.e('HidingZone').at(97, 7).setSize(2, 2);
		Crafty.e('HidingZone').at(97, 15).setSize(2, 2);
		Crafty.e('HidingZone').at(97, 23).setSize(2, 2);
		Crafty.e('HidingZone').at(97, 31).setSize(2, 2);
		// 5 layer
		Crafty.e('HidingZone').at(90, 3).setSize(2, 2);
		Crafty.e('HidingZone').at(90, 11).setSize(2, 2);
		Crafty.e('HidingZone').at(90, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(90, 27).setSize(2, 2);
		Crafty.e('HidingZone').at(90, 35).setSize(2, 2);
		// white top corner
		Crafty.e('HidingZone').at(3, 3).setSize(2, 2);
		Crafty.e('HidingZone').at(8, 3).setSize(2, 2);
		Crafty.e('HidingZone').at(3, 8).setSize(2, 2);
		// white bottom corner
		Crafty.e('HidingZone').at(3, 35).setSize(2, 2);
		Crafty.e('HidingZone').at(8, 35).setSize(2, 2);
		Crafty.e('HidingZone').at(3, 30).setSize(2, 2);
		// black top corner
		Crafty.e('HidingZone').at(155, 3).setSize(2, 2);
		Crafty.e('HidingZone').at(150, 3).setSize(2, 2);
		Crafty.e('HidingZone').at(155, 8).setSize(2, 2);
		// black bottom corner
		Crafty.e('HidingZone').at(155, 35).setSize(2, 2);
		Crafty.e('HidingZone').at(150, 35).setSize(2, 2);
		Crafty.e('HidingZone').at(155, 30).setSize(2, 2);

				
		// creating Safe Zones
		
		// White Flag
		Crafty.e('SafeZone').at(28, 17).setSize(6, 6);
		// Black Flag
		Crafty.e('SafeZone').at(126, 17).setSize(6, 6);

		// creating Flags

		// White
		Crafty.e('Flag').at(32, 19).setSize(2, 2).setColor("white");
		// Black
		Crafty.e('Flag').at(126, 19).setSize(2, 2).setColor("black");
		
		// creating Jails
		
		// White
		Crafty.e('JailWall').at(1, 15).setSize(10, 1).setTeam("white");
		Crafty.e('JailWall').at(10, 15).setSize(1, 10).setTeam("white");
		Crafty.e('JailWall').at(1, 25).setSize(10, 1).setTeam("white");
		// Black
		Crafty.e('JailWall').at(149, 15).setSize(10, 1).setTeam("black");
		Crafty.e('JailWall').at(149, 15).setSize(1, 10).setTeam("black");
		Crafty.e('JailWall').at(149, 25).setSize(10, 1).setTeam("black");
		
		// set jail positions
		whiteJailPos = {x: 5, y: 10};
		blackJailPos = {x: 154, y: 10};
	},

	map2: function() {

			
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

		// White Flag
		Crafty.e('SafeZone').at(1, 1).setSize(5, 5);
		// Black Flag
		Crafty.e('SafeZone').at(154, 34).setSize(5, 5);

		// creating Flags

		// White
		Crafty.e('Flag').at(3, 3).setSize(1, 1).setColor("white");
		// Black
		Crafty.e('Flag').at(156, 36).setSize(1, 1).setColor("black");
		
		// creating Jails
		
		// White
		Crafty.e('JailWall').at(1, 29).setSize(10, 1).setTeam("white");
		Crafty.e('JailWall').at(10, 29).setSize(1, 10).setTeam("white");
		// Black
		Crafty.e('JailWall').at(149, 1).setSize(1, 10).setTeam("black");
		Crafty.e('JailWall').at(149, 10).setSize(10, 1).setTeam("black");

		// set jail positions
		whiteJailPos = {x: 5, y: 35};
		blackJailPos = {x: 155, y: 5};
	},
	
	map3: function() {
		
		// creating Obstacles

		// white side inner triple
		Crafty.e('Obstacle').at(68, 8).setSize(2, 6);
		Crafty.e('Obstacle').at(68, 17).setSize(2, 6);
		Crafty.e('Obstacle').at(68, 26).setSize(2, 6);
		// black side inner triple
		Crafty.e('Obstacle').at(90, 8).setSize(2, 6);
		Crafty.e('Obstacle').at(90, 17).setSize(2, 6);
		Crafty.e('Obstacle').at(90, 26).setSize(2, 6);
		// white side middle double
		Crafty.e('Obstacle').at(48, 10).setSize(2, 8);
		Crafty.e('Obstacle').at(48, 22).setSize(2, 8);
		// black side middle double
		Crafty.e('Obstacle').at(110, 10).setSize(2, 8);
		Crafty.e('Obstacle').at(110, 22).setSize(2, 8);
		// white side outer triple
		Crafty.e('Obstacle').at(28, 8).setSize(2, 6);
		Crafty.e('Obstacle').at(28, 17).setSize(2, 6);
		Crafty.e('Obstacle').at(28, 26).setSize(2, 6);
		// black side outer triple
		Crafty.e('Obstacle').at(130, 8).setSize(2, 6);
		Crafty.e('Obstacle').at(130, 17).setSize(2, 6);
		Crafty.e('Obstacle').at(130, 26).setSize(2, 6);
		
		// creating Hiding Zones
		
		// white side inner zones
		Crafty.e('HidingZone').at(58, 14).setSize(2, 2);
		Crafty.e('HidingZone').at(58, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(58, 24).setSize(2, 2);
		// black side inner zones
		Crafty.e('HidingZone').at(100, 14).setSize(2, 2);
		Crafty.e('HidingZone').at(100, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(100, 24).setSize(2, 2);
		// white side outer zones
		Crafty.e('HidingZone').at(38, 14).setSize(2, 2);
		Crafty.e('HidingZone').at(38, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(38, 24).setSize(2, 2);
		Crafty.e('HidingZone').at(33, 16).setSize(2, 2);
		Crafty.e('HidingZone').at(33, 22).setSize(2, 2);
		Crafty.e('HidingZone').at(43, 16).setSize(2, 2);
		Crafty.e('HidingZone').at(43, 22).setSize(2, 2);
		// black side outer zones
		Crafty.e('HidingZone').at(120, 14).setSize(2, 2);
		Crafty.e('HidingZone').at(120, 19).setSize(2, 2);
		Crafty.e('HidingZone').at(120, 24).setSize(2, 2);
		Crafty.e('HidingZone').at(115, 16).setSize(2, 2);
		Crafty.e('HidingZone').at(115, 22).setSize(2, 2);
		Crafty.e('HidingZone').at(125, 16).setSize(2, 2);
		Crafty.e('HidingZone').at(125, 22).setSize(2, 2);
		
		// creating Safe Zones
		
		// White Flag
		Crafty.e('SafeZone').at(9, 8).setSize(5, 5);
		// Black Flag
		Crafty.e('SafeZone').at(146, 27).setSize(5, 5);

		// creating Flags

		// White
		Crafty.e('Flag').at(11, 10).setSize(1, 1).setColor("white");
		// Black
		Crafty.e('Flag').at(148, 29).setSize(1, 1).setColor("black");
		
		// creating Jails
		
		// White
		Crafty.e('JailWall').at(6, 25).setSize(10, 1).setTeam("white");
		Crafty.e('JailWall').at(6, 25).setSize(1, 10).setTeam("white");
		Crafty.e('JailWall').at(16, 25).setSize(1, 10).setTeam("white");
		Crafty.e('JailWall').at(6, 35).setSize(11, 1).setTeam("white");
		// Black
		Crafty.e('JailWall').at(143, 15).setSize(11, 1).setTeam("black");
		Crafty.e('JailWall').at(153, 5).setSize(1, 10).setTeam("black");
		Crafty.e('JailWall').at(143, 5).setSize(1, 10).setTeam("black");
		Crafty.e('JailWall').at(143, 5).setSize(11, 1).setTeam("black");
		
		// set jail positions
		whiteJailPos = {x: 11, y: 30};
		blackJailPos = {x: 148, y: 10};
	},
	
	map4: function() {
		
		// creating Obstacles

		// middle rectangle
		Crafty.e('Obstacle').at(74, 17).setSize(1, 6);
		Crafty.e('Obstacle').at(74, 17).setSize(12, 1);
		Crafty.e('Obstacle').at(86, 17).setSize(1, 6);
		Crafty.e('Obstacle').at(74, 23).setSize(13, 1);
		// top L
		Crafty.e('Obstacle').at(56, 8).setSize(48, 1);
		Crafty.e('Obstacle').at(56, 8).setSize(1, 13);
		// bottom L
		Crafty.e('Obstacle').at(56, 31).setSize(48, 1);
		Crafty.e('Obstacle').at(103, 19).setSize(1, 13);
		// white side C
		Crafty.e('Obstacle').at(34, 11).setSize(1, 18);
		Crafty.e('Obstacle').at(22, 11).setSize(12, 1);
		Crafty.e('Obstacle').at(22, 28).setSize(12, 1);
		// black side C
		Crafty.e('Obstacle').at(125, 11).setSize(1, 18);
		Crafty.e('Obstacle').at(125, 11).setSize(12, 1);
		Crafty.e('Obstacle').at(125, 28).setSize(12, 1);
		
		
		// creating Hiding Zones
		
		// large inner zones
		Crafty.e('HidingZone').at(59, 11).setSize(4, 4);
		Crafty.e('HidingZone').at(97, 25).setSize(4, 4);
		// white side top
		Crafty.e('HidingZone').at(31, 5).setSize(2, 2);
		Crafty.e('HidingZone').at(25, 5).setSize(2, 2);
		// white side bottom
		Crafty.e('HidingZone').at(31, 33).setSize(2, 2);
		Crafty.e('HidingZone').at(25, 33).setSize(2, 2);
		// black side top
		Crafty.e('HidingZone').at(127, 5).setSize(2, 2);
		Crafty.e('HidingZone').at(133, 5).setSize(2, 2);
		// black side bottom
		Crafty.e('HidingZone').at(127, 33).setSize(2, 2);
		Crafty.e('HidingZone').at(133, 33).setSize(2, 2);
		
		// creating Safe Zones
		
		// White Flag
		Crafty.e('SafeZone').at(28, 17).setSize(6, 6);
		// Black Flag
		Crafty.e('SafeZone').at(126, 17).setSize(6, 6);

		// creating Flags

		// White
		Crafty.e('Flag').at(32, 19).setSize(2, 2).setColor("white");
		// Black
		Crafty.e('Flag').at(126, 19).setSize(2, 2).setColor("black");
		
		// creating Jails
		
		// White
		Crafty.e('JailWall').at(1, 15).setSize(10, 1).setTeam("white");
		Crafty.e('JailWall').at(10, 15).setSize(1, 10).setTeam("white");
		Crafty.e('JailWall').at(1, 25).setSize(10, 1).setTeam("white");
		// Black
		Crafty.e('JailWall').at(149, 15).setSize(10, 1).setTeam("black");
		Crafty.e('JailWall').at(149, 15).setSize(1, 10).setTeam("black");
		Crafty.e('JailWall').at(149, 25).setSize(10, 1).setTeam("black");
		
		// set jail positions
		whiteJailPos = {x: 5, y: 10};
		blackJailPos = {x: 154, y: 10};
	}

};