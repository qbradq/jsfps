var commands =
{
	lookLeft: function()
	{
		player.rotate(-Math.PI * 2 * frameTime);
	},
	moveForward: function()
	{
		var m = new Vector3D(0, 0, 100 * frameTime).yRotate(js3d.cameraRotation);
		player.move(-m.x, m.z);
	},
	lookRight: function()
	{
		player.rotate(Math.PI * 2 * frameTime);
	},
	moveBack: function()
	{
		var m = new Vector3D(0, 0, -100 * frameTime).yRotate(js3d.cameraRotation);
		player.move(-m.x, m.z);
	},
	moveLeft: function()
	{
		var m = new Vector3D(-100 * frameTime, 0, 0).yRotate(js3d.cameraRotation);
		player.move(m.x, -m.z);
	},
	moveRight: function()
	{
		var m = new Vector3D(100 * frameTime, 0, 0).yRotate(js3d.cameraRotation);
		player.move(m.x, -m.z);
	}
};
