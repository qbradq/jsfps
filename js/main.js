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

$(window).load(function()
{
	$(document).keydown(handleKeyDown);
	$("#resolution").change(function(e)
	{
		var res = $("#resolution").val().split(',');
		js3d.resize(res[0], res[1]);
	})
	if(!js3d.init())
	{
		alert("Failed to initalize the renderer.");
		return;
	}
	js3d.clip(0.1, 130);
	js3d.moveCameraTo(50, -6, -50);
	map = new TileMap(tileMap);
	renderScene();
});

function handleKeyDown(e)
{
	switch(e.which)
	{
		// Look left
		case 37:
			js3d.rotateCameraBy(-0.2);
			break;
		// Move forward
		case 38:
		case 87:
			var m = new Vector3D(0, 0, 1).yRotate(js3d.cameraRotation);
			js3d.moveCameraBy(-m.x, m.y, m.z);
			break;
		// Look right
		case 39:
			js3d.rotateCameraBy(0.2);
			break;
		// Move back
		case 40:
		case 83:
			var m = new Vector3D(0, 0, -1).yRotate(js3d.cameraRotation);
			js3d.moveCameraBy(-m.x, m.y, m.z);
			break;
		// Move left
		case 65:
			var m = new Vector3D(-1, 0, 0).yRotate(js3d.cameraRotation);
			js3d.moveCameraBy(m.x, m.y, -m.z);
			break;
		// Move right
		case 68:
			var m = new Vector3D(1, 0, 0).yRotate(js3d.cameraRotation);
			js3d.moveCameraBy(m.x, m.y, -m.z);
			break;
		default:
			//alert(e.which);
			return true;
	}
	e.preventDefault();
	e.stopPropagation();
	return false;
}

function renderScene()
{
	TimeBegin();
	js3d.clear();

	map.render();
	var ent = new Entity(50, -20, 0, models.pyramidar);
	ent.render(); 

	var triangleStats = "P " + js3d.trianglesProcessed + " R " + js3d.trianglesRasterized + " D " + js3d.trianglesDrawn;
	js3d.finishFrame();
	var frameTime = TimeEnd();
	$("#status").text(frameTime + "ms Total: " + triangleStats);
	
	setTimeout(renderScene, 0);
}

