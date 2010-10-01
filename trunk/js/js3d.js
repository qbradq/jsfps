var js3d =
{
	canvas: null,
	context: null,
	width: 640,
	height: 480,
	cameraPosition: null,
	cameraRotation: null,
	cameraRotationSine: null,
	cameraRotationCosine: null,
	init: function()
	{
		this.cameraPosition = new Vector3D(0, 0, 0);
		this.cameraRotation = new Vector3D(0, 0, 0);
		this.cameraRotationSine = new Vector3D(0, 0, 0);
		this.cameraRotationCosine = new Vector3D(0, 0, 0);
		this.setCameraLocation(new Vector3D(0, 0, 0));
		this.setCameraRotation(new Vector3D(0, 0, 0));
		this.canvas = document.getElementById("canvas");
		if(!this.canvas ||
			!this.canvas.getContext)
			return false;
		this.canvas.style.backgroundColor = "#000000";
		this.context = this.canvas.getContext("2d");
		if(!this.context)
			return false;
		this.clear();
		return true;
	},
	clear: function()
	{
		this.context.clearRect(0, 0, 640, 480);
	},
	setCameraLocation: function(v)
	{
		this.cameraPosition.x = v.x;
		this.cameraPosition.y = v.y;
		this.cameraPosition.z = v.z;
	},
	setCameraRotation: function(v)
	{
		this.cameraRotation.x = v.x;
		this.cameraRotation.y = v.y;
		this.cameraRotation.z = v.z;
		this.cameraRotationSine.x = Math.sin(this.cameraRotation.x);
		this.cameraRotationSine.y = Math.sin(this.cameraRotation.y);
		this.cameraRotationSine.z = Math.sin(this.cameraRotation.z);
		this.cameraRotationCosine.x = Math.cos(this.cameraRotation.x);
		this.cameraRotationCosine.y = Math.cos(this.cameraRotation.y);
		this.cameraRotationCosine.z = Math.cos(this.cameraRotation.z);
	},
	rasterizeTriangle: function(color, x1, y1, x2, y2, x3, y3)
	{
		// TODO Back-face culling
		
		// TODO Investigate off-screen performance and culling
		
		// TODO Do pixel fixation and bleed
		
		this.context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.lineTo(x3, y3);
		this.context.lineTo(x1, y1);
		this.context.fill();
	},
	projectPoint: function(v)
	{
		var cos = this.cameraRotationCosine;
		var sin = this.cameraRotationSine;
		var pos = this.cameraPosition;
		return new Vector3D(
			cos.y * (sin.z * (v.y - pos.y) + cos.z * (v.x - pos.x)) - sin.y * (v.z - pos.z),
			sin.x * (cos.y * (v.z - pos.z) + sin.y * (sin.z * (v.y - pos.y) + cos.z * (v.x - pos.x))) + cos.x * (cos.z * (v.y - pos.y) - sin.z * (v.x - pos.x)),
			cos.x * (cos.y * (v.z - pos.z) + sin.y * (sin.z * (v.y - pos.y) + cos.z * (v.x - pos.x))) - sin.x * (cos.z * (v.y - pos.y) - sin.z * (v.x - pos.x))
		);
	},
	projectTriangle: function(color, v1, v2, v3)
	{
		v1 = projectPoint(v1);
		v2 = projectPoint(v2);
		v3 = projectPoint(v3);
		
	}
};
