var config =
{
	init: function()
	{
		$("#resolution").change(this.resolutionChange);
		$("#fillSeams").change(this.fillSeamsChange);
		$("#highRes").change(this.highResChange);
		$("#mouseSpeed").change(this.mouseSpeedChange);
		$("#stickyMouse").change(this.stickyMouseChange);
		this.updateUI();
	},
	stickyMouseChange: function(e)
	{
		config.stickyMouse = $("#stickyMouse").val() == "yes";		
	},
	mouseSpeedChange: function(e)
	{
		config.mouseSpeed = parseInt($("#mouseSpeed").val());
	},
	fillSeamsChange: function(e)
	{
		config.fillSeams = $("#fillSeams").val() == "yes";
	},
	highResChange: function(e)
	{
		config.highRes = $("#highRes").val() == "yes";
	},
	resolutionChange: function(e)
	{
		var res = $("#resolution").val().split(',');
		js3d.resize(res[0], res[1]);
		config.width = res[0];
		config.height = res[1];
	},
	updateUI: function()
	{
		if(this.width == 320)
			$("#resolution")[0].selectedIndex = 0;
		else if(this.width == 480)
			$("#resolution")[0].selectedIndex = 1;
		else if(this.width == 640)
			$("#resolution")[0].selectedIndex = 2;
		else if(this.width == 960)
			$("#resolution")[0].selectedIndex = 3;
		else if(this.width == 1280)
			$("#resolution")[0].selectedIndex = 4;
		$("#fillSeams")[0].selectedIndex = this.fillSeams ? 1 : 0;
		$("#highRes")[0].selectedIndex = this.highRes ? 1 : 0;
		$("#mouseSpeed")[0].selectedIndex = this.mouseSpeed / 2 - 1;
		$("#stickyMouse")[0].selectedIndex = this.stickyMouse ? 1 : 0;
	},
	width: 640,
	height: 480,
	fillSeams: false,
	highRes: true,
	mouseSpeed: 8,
	stickyMouse: true,
	keyBindings:
	{
		37: "lookLeft",
		38: "moveForward",
		39: "lookRight",
		40: "moveBack",
		65: "moveLeft",
		68: "moveRight",
		83: "moveBack",
		87: "moveForward"
	}
};
