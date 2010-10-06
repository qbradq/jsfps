var js3d =
{
	canvas: null,
	context: null,
	width: 640,
	height: 480,
	halfWidth: 0,
	letterBoxHeight: 0,
	fovAngle: 0,
	eyeDistance: 0,
	cameraPosition: null,
	cameraRotation: null,
	cameraRotationSine: null,
	cameraRotationCosine: null,
	nearClip: 0.1,
	farClip: 1000,
	farClipFalloff: 900,
	farClipFalloffLength: 100,
	radiansToDegrees: Math.PI / 180,
	rasterList: [],
	trianglesProcessed: 0,
	trianglesRasterized: 0,
	trianglesDrawn: 0,
	twoPI: Math.PI * 2,
	piOverTwo: Math.PI / 2,
	// Initialize the 3D renderer
	init: function()
	{
		this.width = config.width;
		this.height = config.height;
		this.cameraPosition = new Vector3D(0, 0, 0);
		this.cameraRotation = 0;
		this.cameraRotationSine = Math.sin(0);
		this.cameraRotationCosine = Math.cos(0);
		this.moveCameraTo(0, 0, 0);
		this.rotateCameraTo(0, 0, 0);
		this.canvas = document.getElementById("canvas");
		if(!this.canvas ||
			!this.canvas.getContext)
			return false;
		this.canvas.style.backgroundColor = "#000000";
		this.context = this.canvas.getContext("2d");
		if(!this.context)
			return false;
		this.resize(this.width, this.height);
		this.fov(this.piOverTwo);
		this.clear();
		return true;
	},
	// Set the Field of View to an angle in degrees
	fov: function(angle)
	{
		this.fovAngle = angle;
		this.eyeDistance = 1 / Math.tan(angle / 2);
	},
	// Set near and far clip planes
	clip: function(near, far)
	{
		this.nearClip = near;
		this.farClip = far;
		this.farClipFalloff = far * 0.6;
		this.farClipFalloffLength = far * 0.4;
	},
	// Resize the screen
	resize: function(width, height)
	{
		this.width = width;
		this.height = height;
		this.halfWidth = (width / 2) | 0;
		this.letterBoxHeight = ((width - height) / 2) | 0;
		this.canvas.width = width;
		this.canvas.height = height;
	},
	// Clear the screen
	clear: function()
	{
		this.context.clearRect(0, 0, this.width, this.height);
	},
	// Move the camera to an absolute position
	moveCameraTo: function(x, y, z)
	{
		this.cameraPosition.x = x;
		this.cameraPosition.y = y;
		this.cameraPosition.z = z;
	},
	// Move camera relative to the current position
	moveCameraBy: function(x, y, z)
	{
		this.moveCameraTo(this.cameraPosition.x + x,
			this.cameraPosition.y + y, this.cameraPosition.z + z);
	},
	// Rotate the camera to absolute rotations
	rotateCameraTo: function(r)
	{
		while(r < 0){r += this.twoPI;}
		while(r >= this.twoPI){r -= this.twoPI;}
		this.cameraRotation = r;
		this.cameraRotationSine = Math.sin(r);
		this.cameraRotationCosine = Math.cos(r);
	},
	// Rotate the camera relative to the current rotation
	rotateCameraBy: function(r)
	{
		this.rotateCameraTo(this.cameraRotation + r);
	},
	// Rasterize a triangle onto the screen
	rasterizeTriangle: function(color, v1, v2, v3, zIndex)
	{
		// Back face culling
		if((v3.x - v2.x) * (v1.y - v2.y) - (v1.x - v2.x) * (v3.y - v2.y) > 0)
			return;
		
		// Off-screen culling
		var left = v1.x < v2.x ? v1.x : v2.x;
		left = left < v3.x ? left : v3.x;
		var right = v1.x > v2.x ? v1.x : v2.x;
		right = right > v3.x ? right : v3.x;
		var top = v1.y < v2.y ? v1.y : v2.y;
		top = top < v3.y ? top : v3.y;
		var bottom = v1.y > v2.y ? v1.y : v2.y;
		bottom = bottom > v3.y ? bottom : v3.y;
		if(left >= this.width ||
			right < 0 ||
			top >= this.height ||
			bottom < 0)
			return;
		
		// Push the triangle information to the raster list for later
		// Z-ordering and rendering.
		this.rasterList.push({zIndex: zIndex, v1: v1, v2: v2, v3: v3, color: color});
		++this.trianglesDrawn;
	},
	// Call after the frame is finished rendering to actually draw the
	// scene.
	finishFrame: function()
	{
		var i, t;
		this.rasterList.sort(this.zBufferSort);
		for(i = 0; i < this.rasterList.length; ++i)
		{
			t = this.rasterList[i];
			this.context.fillStyle = 'rgb(' + t.color.r + ',' + t.color.g + ',' + t.color.b + ')';
			if(config.fillSeams)
				this.context.strokeStyle = this.context.fillStyle;
			this.context.beginPath();
			this.context.moveTo(t.v1.x, t.v1.y);
			this.context.lineTo(t.v2.x, t.v2.y);
			this.context.lineTo(t.v3.x, t.v3.y);
			this.context.lineTo(t.v1.x, t.v1.y);
			this.context.fill();
			if(config.fillSeams)
				this.context.stroke();
		}
		this.rasterList = [];
		this.trianglesProcessed = 0;
		this.trianglesRasterized = 0
		this.trianglesDrawn = 0;
	},
	zBufferSort: function(a, b)
	{
		return b.zIndex - a.zIndex;
	},
	// Create a new vector that is translated and rotated for the camera
	cameraTranslatePoint: function(v)
	{
		var cos = this.cameraRotationCosine;
		var sin = this.cameraRotationSine;
		var pos = this.cameraPosition;
		return new Vector3D(
			cos * (v.x - pos.x) - sin * (v.z - pos.z),
			v.y - pos.y,
			cos * (v.z - pos.z) + sin * (v.x - pos.x)
		);
	},
	// Projects the passed-in vector to the screen. THIS MODIFIED THE
	// PASSED-IN VECTOR!
	projectPoint: function(v)
	{
		v.z = this.eyeDistance / v.z;
		v.x = ((v.x * v.z) + 1) * this.halfWidth;
		v.y = ((v.y * v.z) + 1) * this.halfWidth - this.letterBoxHeight;
	},
	// Immediatley rasterizes a "point" to the display without going through
	// the triangle buffer. Use this after calling finishFrame().
	overlayPoint: function(color, v1)
	{
		v1 = this.cameraTranslatePoint(v1);
		if(v1.z <= this.nearClip)
			return;
		if(v1.z >= this.farClip)
			return;
		this.projectPoint(v1);
		this.context.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
		this.context.fillRect(v1.x - 2, v1.y - 2, 4, 4);
	},
	// Immediatley rasterizes a line to the display without going through the
	// triangle buffer. Use this after calling finishFrame().
	overlayLineSegment: function(color, v1, v2)
	{
		v1 = this.cameraTranslatePoint(v1);
		v2 = this.cameraTranslatePoint(v2);
		if(v1.z <= this.nearClip &&
			v2.z <= this.nearClip)
			return;
		if(v1.z >= this.farClip &&
			v2.z >= this.farClip)
			return;
		if(v1.z <= this.nearClip)
			v1.z = this.nearClip;
		if(v2.z <= this.nearClip)
			v2.z = this.nearClip;
		this.projectPoint(v1);
		this.projectPoint(v2);
		this.context.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
		this.context.beginPath();
		this.context.moveTo(v1.x, v1.y);
		this.context.lineTo(v2.x, v2.y);
		this.context.stroke();
	},
	// Project a triangle to the screen and rasterize it
	projectTriangle: function(color, v1, v2, v3, firstPass)
	{
		++this.trianglesProcessed;
		
		// Apply camera translation and near / far clipping
		v1 = this.cameraTranslatePoint(v1);
		v2 = this.cameraTranslatePoint(v2);
		v3 = this.cameraTranslatePoint(v3);
		if(v1.z <= this.nearClip &&
			v2.z <= this.nearClip &&
			v3.z <= this.nearClip)
			return;
		if(v1.z >= this.farClip &&
			v2.z >= this.farClip &&
			v3.z >= this.farClip)
			return;

		// Centroid of the triangle
		var centroid = new Vector3D(
			(v1.x + v2.x + v3.x) / 3,
			(v1.y + v2.y + v3.y) / 3,
			(v1.z + v2.z + v3.z) / 3
		);

		// If the "first pass" parameter is set we add 10,000 to the zIndex to
		// help ensure it will be rendered in a group with all other "first
		// pass" triangles. This mechanism is used for the floors and ceilings
		// and helps avoid some of the graphical glitches that come from using
		// the Painter's Algorithm without a Z-Buffer.
		var zIndex = centroid.z;
		if(firstPass)
			zIndex += 10000;

		/*// Linear attenuation
		var distance = centroid.length();
		var lightLevel = 1 / distance;
		lightLevel *= 10;*/
		
		var distance = centroid.length();
		var lightLevel = 1 - distance / this.farClip;
		if(lightLevel < 0)
			lightLevel = 0;

		// Diffuse lighting, 30%
		var normal = v3.subtract(centroid).cross(v1.subtract(centroid)).normalize();
		var lightAngle = centroid.invert().normalize();
		var cosAngle = normal.dot(lightAngle);
		lightLevel = (lightLevel * .7) + (lightLevel * .3) * cosAngle;

		/*// Far clip falloff
		var diff;
		if(distance >= this.farClipFalloff)
		{
			diff = this.farClipFalloffLength - (distance - this.farClipFalloff);
			if(diff < 0)
				diff = 0;
			lightLevel *= diff / this.farClipFalloffLength;
		}*/
		
		// Scale the color value
		color = new Color(color.r, color.g, color.b);
		color.scale(lightLevel);

		// Near clip adjustment
		if(v1.z <= this.nearClip)
			v1.z = this.nearClip;
		if(v2.z <= this.nearClip)
			v2.z = this.nearClip;
		if(v3.z <= this.nearClip)
			v3.z = this.nearClip;

		// Project the points to the screen and rasterize the triangle
		this.projectPoint(v1);
		this.projectPoint(v2);
		this.projectPoint(v3);
		this.rasterizeTriangle(color, v1, v2, v3, zIndex);
		
		++this.trianglesRasterized;
	}
};

