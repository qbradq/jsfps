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
var stickyMouseTrack = false;

$(window).load(function()
{
	$(document).keydown(handleKeyDown);
	$(document).keyup(handleKeyUp);
	$("#canvas").mousedown(handleMouseDown);
	$("#canvas").mouseup(handleMouseUp);
	$("#canvas").mouseout(handleMouseOut);
	$("#canvas").mousemove(handleMouseMove);
	$("#canvas").click(handleClick);
	config.init();
	if(!js3d.init())
	{
		alert("Failed to initalize the renderer.");
		return;
	}
	player = new Entity(35, -45, 0, models.player);
	player.rotate(Math.PI/2);
	js3d.clip(0.1, 130);
	map = new TileMap(tileMap);
	doFrame();
});

function handleClick(e)
{
	if(config.stickyMouse)
		stickyMouseTrack = stickyMouseTrack ? false : true;
}

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
	stickyMouseTrack = false;
}

function handleMouseMove(e)
{
	if(lastMouseX >= 0 &&
		lastMouseY >= 0 &&
		(
			mouseButtons[1] ||
			stickyMouseTrack
		)
	)
	{
		var hMove = (e.offsetX - lastMouseX) / js3d.width;
		player.rotate(hMove * Math.PI * 2 * config.mouseSpeed / 4);
	}
	lastMouseX = e.offsetX;
	lastMouseY = e.offsetY;
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
	$("#status").text(frameTime + "ms Triangles " + triangleStats + " POS " + player.x + "x" + player.y);
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
	frameTime = frameTime > 0.1 ? 0.1 : frameTime;
	lastFrameTime = thisFrameTime;
	
	// Handle user input
	for(var o in commandsHeldDown)
	{
		commands[o]();
	}
	
	// TODO Update world state
	player.update();
	if(!player.x ||
		!player.y)
	{
		alert(debug.join(', '));
	}
	
	// Render the scene
	var cOfs = new Vector3D(0, 0, -2.5).yRotate(-player.rot);
	js3d.moveCameraTo(player.x + cOfs.x, -6, player.y + cOfs.z);
	js3d.rotateCameraTo(player.rot);
	renderScene();
	
	// DEBUG
	/** /
	function testLine(x, y)
	{
		var cdt1 = new Vector3D(player.x, 0, player.y);
		var cdt2 = new Vector3D(x, 0, y);
		js3d.overlayLineSegment(Color.green, cdt1, cdt2);
		var wallHit = {};
		if(map.lineHitsWall(cdt1.x, cdt1.z, cdt2.x, cdt2.z, wallHit))
		{
			js3d.overlayPoint(Color.red, new Vector3D(wallHit.x, cdt1.y, wallHit.y));
		}
	}
	testLine(player.x, player.y + 100);
	testLine(player.x + 50, player.y + 100);
	testLine(player.x + 100, player.y + 100);
	testLine(player.x + 100, player.y + 50);
	testLine(player.x + 100, player.y);
	testLine(player.x + 100, player.y - 50);
	testLine(player.x + 100, player.y - 100);
	testLine(player.x + 50, player.y - 100);
	testLine(player.x, player.y - 100);
	testLine(player.x - 50, player.y - 100);
	testLine(player.x - 100, player.y - 100);
	testLine(player.x - 100, player.y - 50);
	testLine(player.x - 100, player.y);
	testLine(player.x - 100, player.y + 50);
	testLine(player.x - 100, player.y + 100);
	testLine(player.x - 50, player.y + 100);
	/**/
	
	setTimeout(doFrame, 0);
}
