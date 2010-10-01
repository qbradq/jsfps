function TimeBegin()
{
	TimeBegin.start = new Date().getTime();
}
function TimeEnd()
{
	var end = new Date().getTime();
	return end - TimeBegin.start;
}

function main()
{
	if(!js3d.init())
	{
		alert("Failed to initalize the renderer.");
		return;
	}
	TimeBegin();
	for(var i = 0; i < 100; ++i)
	{
		js3d.rasterizeTriangle([0, 255, 0], 0, 40, 40, 40, 40, 0);
	}
	alert(TimeEnd());
	TimeBegin();
	for(var i = 0; i < 100; ++i)
	{
		js3d.rasterizeTriangle([0, 255, 0], 0, 400, 400, 400, 400, 0);
	}
	alert(TimeEnd());
}
