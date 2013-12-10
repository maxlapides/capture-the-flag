function genGray(percent) {
	percent = (100 - percent)/100;
	var val = Math.round(255 * percent);
	return 'rgb(' + val + ',' + val + ',' + val + ')';
}

var CapColors = {
	white		: genGray(0),
	gray10		: genGray(10),
	gray20		: genGray(20),
	gray30		: genGray(30),
	gray40		: genGray(40),
	gray50		: genGray(50),
	gray60		: genGray(60),
	gray70		: genGray(70),
	gray80		: genGray(80),
	gray90		: genGray(90),
	black		: genGray(100),
	pink		: 'rgb(255, 52, 179)',
	aqua		: 'rgb(0, 255, 255)',
};