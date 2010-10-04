var config =
{
	init: function()
	{
		$("#resolution").change(this.resolutionChange);
		$("#fillSeams").change(this.fillSeamsChange);
		$("#mouseSpeed").change(this.mouseSpeedChange);
		this.updateUI();
	},
	mouseSpeedChange: function(e)
	{
		config.mouseSpeed = parseInt($("#mouseSpeed").val());
	},
	fillSeamsChange: function(e)
	{
		config.fillSeams = $("#fillSeams").val() == "yes";
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
		if(this.fillSeams)
			$("#fillSeams")[0].selectedIndex = 1;
		else
			$("#fillSeams")[0].selectedIndex = 0;
		$("#mouseSpeed")[0].selectedIndex = this.mouseSpeed / 2 - 1;
	},
	width: 640,
	height: 480,
	fillSeams: false,
	mouseSpeed: 8,
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
