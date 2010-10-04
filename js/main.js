function TimeBegin()
{
	TimeBegin.start = new Date().getTime();
}
function TimeEnd()
{
	var end = new Date().getTime();
	return end - TimeBegin.start;
}

var map = null;
var mouseButtons = [];
var lastMouseX = -1;
var lastMouseY = -1;
var framesRendered = 0;
var fpsTimeStart = -1;
var commandsHeldDown = {};
var lastFrameTime = new Date().getTime();
var frameTime = 0;
var player = null;

$(window).load(function()
{
	$(document).keydown(handleKeyDown);
	$(document).keyup(handleKeyUp);
	$("#canvas").mousedown(handleMouseDown);
	$("#canvas").mouseup(handleMouseUp);
	$("#canvas").mouseout(handleMouseOut);
	$("#canvas").mousemove(handleMouseMove);
	config.init();
	if(!js3d.init())
	{
		alert("Failed to initalize the renderer.");
		return;
	}
	player = new Entity(50, -50, 0, models.player);
	js3d.clip(0.1, 130);
	map = new TileMap(tileMap);
	doFrame();
});

function handleMouseDown(e)
{
	mouseButtons[e.which] = true;
}

function handleMouseUp(e)
{
	mouseButtons[e.which] = false;
}

function handleMouseOut(e)
{
	for(var o in mouseButtons)
	{
		mouseButtons[o] = false;
	}
	lastMouseX = -1;
	lastMouseY = -1;
}

function handleMouseMove(e)
{
	if(mouseButtons[1] &&
		lastMoveX >= 0 &&
		lastMoveY >= 0)
	{
		var hMove = (e.offsetX - lastMoveX) / js3d.width;
		player.rotate(hMove * Math.PI * 2 * config.mouseSpeed / 4);
	}
	lastMoveX = e.offsetX;
	lastMoveY = e.offsetY;
}

function handleKeyDown(e)
{
	if(config.keyBindings[e.which])
	{
		commandsHeldDown[config.keyBindings[e.which]] = true;
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	return true;
}

function handleKeyUp(e)
{
	if(config.keyBindings[e.which])
	{
		delete(commandsHeldDown[config.keyBindings[e.which]]);
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	return true;
}

function renderScene()
{
	if(framesRendered == 0)
	{
		fpsTimeStart = new Date().getTime();
	}
	var frameStartTime = new Date().getTime();
	
	js3d.clear();
	if(config.highRes)
		map.renderHighRes();
	else
		map.render();
	var ent = new Entity(50, -20, Math.PI, models.pyramidar);
	ent.render();
	player.render();

	var triangleStats = "Processed " + js3d.trianglesProcessed + " Projected " + js3d.trianglesRasterized + " Drawn " + js3d.trianglesDrawn;
	js3d.finishFrame();
	var frameEndTime = new Date().getTime();
	var frameTime = frameEndTime - frameStartTime;
	$("#status").text(frameTime + "ms Triangles " + triangleStats);
	++framesRendered;
	if(frameEndTime - fpsTimeStart >= 250)
	{
		var fpsTime = frameEndTime - fpsTimeStart;
		$("#fps").text(Math.round((framesRendered / (fpsTime / 1000)) * 100) / 100);
		framesRendered = 0;
	}
}

function doFrame()
{
	// Time update
	var thisFrameTime = new Date().getTime();
	frameTime = (thisFrameTime - lastFrameTime) / 1000;
	lastFrameTime = thisFrameTime;
	
	// Handle user input
	for(var o in commandsHeldDown)
	{
		commands[o]();
	}
	
	// TODO Update world state
	
	// Render the scene
	js3d.moveCameraTo(player.x, -6, player.y);
	js3d.rotateCameraTo(player.rot);
	renderScene();
	
	setTimeout(doFrame, 0);
}
