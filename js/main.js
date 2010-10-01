function TimeBegin()
{
	TimeBegin.start = new Date().getTime();
}
function TimeEnd()
{
	var end = new Date().getTime();
	return end - TimeBegin.start;
}

$(window).load(function()
{
	$(document).keydown(handleKeyDown);
	$("#resolution").change(function(e)
	{
		var res = $("#resolution").val().split(',');
		js3d.resize(res[0], res[1]);
		renderScene();
	})
	if(!js3d.init())
	{
		alert("Failed to initalize the renderer.");
		return;
	}
	js3d.setLightMode("cameraCentered", {brightness: 2, ambient: .9});
	js3d.moveCameraTo(50, -5, -50);
	renderScene();
});

function handleKeyDown(e)
{
	switch(e.which)
	{
		// Look left
		case 37:
			js3d.rotateCameraBy(0, -0.2, 0);
			break;
		// Look up
		case 38:
			js3d.rotateCameraBy(0.2, 0, 0);
			break;
		// Look right
		case 39:
			js3d.rotateCameraBy(0, 0.2, 0);
			break;
		// Look down
		case 40:
			js3d.rotateCameraBy(-0.2, 0, 0);
			break;
		// Move left
		case 65:
			var m = new Vector3D(-1, 0, 0).yRotate(js3d.cameraRotation.y);
			js3d.moveCameraBy(m.x, m.y, -m.z);
			break;
		// Move right
		case 68:
			var m = new Vector3D(1, 0, 0).yRotate(js3d.cameraRotation.y);
			js3d.moveCameraBy(m.x, m.y, -m.z);
			break;
		// Move back
		case 83:
			var m = new Vector3D(0, 0, -1).yRotate(js3d.cameraRotation.y);
			js3d.moveCameraBy(-m.x, m.y, m.z);
			break;
		// Move forward
		case 87:
			var m = new Vector3D(0, 0, 1).yRotate(js3d.cameraRotation.y);
			js3d.moveCameraBy(-m.x, m.y, m.z);
			break;
		default:
			//alert(e.which);
			return true;
	}
	e.preventDefault();
	e.stopPropagation();
	renderScene();
	return false;
}

function renderScene()
{
	TimeBegin();
	js3d.clear();
	/* * /
	TimeBegin();
	for(var i = 0; i < 100; ++i)
	{
		js3d.rasterizeTriangle([0, 255, 0], new Vector3D(0, 40, 0), new Vector3D(40, 40, 0), new Vector3D(40, 0, 0));
	}
	alert(TimeEnd());
	TimeBegin();
	for(var i = 0; i < 100; ++i)
	{
		js3d.rasterizeTriangle([0, 255, 0], new Vector3D(0, 400, 0), new Vector3D(400, 400, 0), new Vector3D(400, 0, 0));
	}
	alert(TimeEnd());
	TimeBegin();
	for(var i = 0; i < 100; ++i)
	{
		js3d.projectTriangle(new Color(255, 0, 0), new Vector3D(0, 0, 10), new Vector3D(10, 0, 10), new Vector3D(0, -10, 10));
	}
	alert(TimeEnd());
	*/
	/*
	TimeBegin();
	var v1 = new Vector3D(-10, 0, 10);
	var v2 = new Vector3D(10, 0, 10);
	var v3 = new Vector3D(-10, 0, 20);
	var v4 = new Vector3D(10, 0, 20);
	var color = new Color(255, 32, 0);
	for(var i = 0; i < 13; ++i)
	{
		js3d.projectTriangle(color, v1, v2, v3);
		js3d.projectTriangle(color, v3, v2, v4);
		v1.z += 10;
		v2.z += 10;
		v3.z += 10;
		v4.z += 10;
	}
	v1 = new Vector3D(-5, -10, 10);
	v2 = new Vector3D(5, -10, 10);
	v3 = new Vector3D(-5, -15, 10);
	v4 = new Vector3D(5, -15, 10);
	var v5 = new Vector3D(-15, -10, 15);
	var v6 = new Vector3D(15, -10, 15);
	js3d.projectTriangle(color, v1, v2, v3);
	//js3d.projectTriangle(color, v1, v2, v3);
	js3d.projectTriangle(color, v3, v2, v4);
	js3d.projectTriangle(color, v5, v1, v3);
	js3d.projectTriangle(color, v2, v6, v4);
	*/
	/*
	var v1 = new Vector3D(0, 0, 0);
	var v2 = new Vector3D(0, 0, 0);
	var v3 = new Vector3D(0, 0, 0);
	var v4 = new Vector3D(0, 0, 0);
	var color = new Color(128, 255, 0);
	var dataOfs = 0;
	for(var iy = 0; iy < testHeightMap.height - 1; ++iy)
	{
		v3.z = iy * -10;
		v4.z = v3.z;
		v1.z = v3.z - 10;
		v2.z = v1.z;
		for(var ix = 0; ix < testHeightMap.width - 1; ++ix)
		{
			
			v1.x = ix * 10;
			v3.x = v1.x;
			v2.x = v1.x + 10;
			v4.x = v2.x;
			dataOfs = iy * testHeightMap.width + ix;
			v1.y = -testHeightMap.heightMap[dataOfs + testHeightMap.width];
			v2.y = -testHeightMap.heightMap[dataOfs + testHeightMap.width + 1];
			v3.y = -testHeightMap.heightMap[dataOfs];
			v4.y = -testHeightMap.heightMap[dataOfs + 1];
			js3d.projectTriangle(color, v1, v2, v3);
			js3d.projectTriangle(color, v3, v2, v4);
		}
	}
	*/
	var v1 = new Vector3D(0, 0, 0);
	var v2 = new Vector3D(0, 0, 0);
	var v3 = new Vector3D(0, 0, 0);
	var v4 = new Vector3D(0, 0, 0);
	var colorWall = new Color(16, 16, 224);
	var colorFloor = new Color(128, 128, 128);
	var dataOfs = 0;
	for(var iy = 0; iy < tileMap.height; ++iy)
	{
		for(var ix = 0; ix < tileMap.width; ++ix)
		{
			// Floor and ceiling
			if(tileMap.tiles[dataOfs] == 0)
			{
				v1.x = v3.x = ix * 10;
				v2.x = v4.x = v1.x + 10;
				v3.z = v4.z = iy * -10;
				v1.z = v2.z = v3.z - 10;
				v1.y = v2.y = v3.y = v4.y = 0;
				js3d.projectTriangle(colorFloor, v1, v2, v3);
				js3d.projectTriangle(colorFloor, v3, v2, v4);
				v1.y = v2.y = v3.y = v4.y = -10;
				js3d.projectTriangle(colorFloor, v1, v3, v2);
				js3d.projectTriangle(colorFloor, v2, v3, v4);
			}
			else
			{
				// South-facing wall
				if(iy < tileMap.height - 1 &&
					tileMap.tiles[dataOfs + tileMap.width] == 0)
				{
					v1.x = v3.x = ix * 10;
					v2.x = v4.x = v1.x + 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					v1.z = v2.z = v3.z = v4.z = iy * -10 - 10;
					js3d.projectTriangle(colorWall, v1, v2, v3);
					js3d.projectTriangle(colorWall, v3, v2, v4);
				}
				// North-facing wall
				if(iy > 0 &&
					tileMap.tiles[dataOfs - tileMap.width] == 0)
				{
					v1.x = v3.x = ix * 10;
					v2.x = v4.x = v1.x + 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					v1.z = v2.z = v3.z = v4.z = iy * -10;
					js3d.projectTriangle(colorWall, v1, v3, v2);
					js3d.projectTriangle(colorWall, v2, v3, v4);
				}
				// East-facing wall
				if(ix > 0 &&
					tileMap.tiles[dataOfs - 1] == 0)
				{
					v1.x = v2.x = v3.x = v4.x = ix * 10;
					v2.z = v4.z = iy * -10;
					v1.z = v3.z = v2.z - 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					js3d.projectTriangle(colorWall, v1, v3, v2);
					js3d.projectTriangle(colorWall, v2, v3, v4);
				}
				// West-facing wall
				if(ix < tileMap.width - 1 &&
					tileMap.tiles[dataOfs + 1] == 0)
				{
					v1.x = v2.x = v3.x = v4.x = ix * 10 + 10;
					v2.z = v4.z = iy * -10;
					v1.z = v3.z = v2.z - 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					js3d.projectTriangle(colorWall, v1, v2, v3);
					js3d.projectTriangle(colorWall, v3, v2, v4);
				}
			}
			++dataOfs;
		}
	}

	var triangleStats = "P " + js3d.trianglesProcessed + " R " + js3d.trianglesRasterized + " D " + js3d.trianglesDrawn;
	js3d.finishFrame();
	var frameTime = TimeEnd();
	$("#status").text(frameTime + "ms Total: " + triangleStats);
}

