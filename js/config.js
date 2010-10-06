var config =
{
	init: function()
	{
		$("#resolution").change(this.resolutionChange);
		$("#fillSeams").change(this.fillSeamsChange);
		$("#highRes").change(this.highResChange);
		$("#mouseSpeed").change(this.mouseSpeedChange);
		$("#stickyMouse").change(this.stickyMouseChange);
		$("#keyBinding").change(this.keyBindingChange);
		this.keyBindings = this.keyBindingSets["Modern FPS"];
		this.loadFromLocalStorage();
		this.updateUI();
	},
	kill: function()
	{
		this.saveToLocalStorage();
	},
	loadFromLocalStorage: function(e)
	{
		var configJson;
		
		// Try local storage first
		if(window.localStorage)
		{
			configJson = window.localStorage.config;
		}
		// Then cookies, which do not work on local file systems in Chrome :D
		else
		{
			configJson = readCookie('config');
		}
		if(!configJson)
			return;
		var c = JSON.parse(configJson);
		for(var o in c)
		{
			this[o] = c[o];
		}
		this.keyBindings = this.keyBindingSets[this.keyBindings];
	},
	saveToLocalStorage: function(e)
	{
		var keyBindingString = "Modern FPS";
		
		for(var o in this.keyBindingSets)
		{
			if(this.keyBindings == this.keyBindingSets[o])
				keyBindingString = o;
		}
		
		var c = JSON.stringify({
			width: this.width,
			height: this.height,
			fillSeams: this.fillSeams,
			highRes: this.highRes,
			mouseSpeed: this.mouseSpeed,
			stickyMouse: this.stickyMouse,
			keyBindings: keyBindingString
		});
		
		// Try local storage first
		if(window.localStorage)
		{
			window.localStorage.config = c;
		}
		// Then cookies
		else
		{
			createCookie('config', c, 365);
		}
	},
	keyBindingChange: function(e)
	{
		config.keyBindings = config.keyBindingSets[$("#keyBinding").val()];
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
		if(this.keyBindings == this.keyBindingSets["Modern FPS"])
			$("#keyBinding")[0].selectedIndex = 0;
		else if(this.keyBindings == this.keyBindingSets["Classic QWERTY"])
			$("#keyBinding")[0].selectedIndex = 1;
	},
	width: 640,
	height: 480,
	fillSeams: false,
	highRes: true,
	mouseSpeed: 8,
	stickyMouse: true,
	keyBindings: null,
	keyBindingSets:
	{
		"Modern FPS":
		{
			32: "attack",
			37: "lookLeft",
			39: "lookRight",
			38: "moveForward",
			87: "moveForward",
			40: "moveBack",
			83: "moveBack",
			65: "moveLeft",
			68: "moveRight"
		},
		"Classic QWERTY":
		{
			32: "attack",
			37: "lookLeft",
			39: "lookRight",
			38: "moveForward",
			40: "moveBack",
			81: "moveBack",
			87: "moveLeft",
			69: "moveRight"
		}
	},
	keyNames:
	{
		32: "Spacebar",
		37: "Left",
		38: "Up",
		39: "Right",
		40: "Down",
		65: "A",
		68: "D",
		69: "E",
		81: "Q",
		83: "S",
		87: "W"
	},
	commandNames:
	{
		attack: "Attack",
		lookLeft: "Look Left",
		lookRight: "Look Right",
		moveForward: "Move Forward",
		moveBack: "Move Backward",
		moveLeft: "Move Left",
		moveRight: "Move Right"
	}
};
