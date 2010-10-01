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
	radiansToDegrees: Math.PI / 180,
	rasterList: [],
	trianglesProcessed: 0,
	trianglesRasterized: 0,
	tiranglesDrawn: 0,
	// Initialize the 3D renderer
	init: function()
	{
		this.cameraPosition = new Vector3D(0, 0, 0);
		this.cameraRotation = new Vector3D(0, 0, 0);
		this.cameraRotationSine = new Vector3D(0, 0, 0);
		this.cameraRotationCosine = new Vector3D(0, 0, 0);
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
		this.fov(90);
		this.clear();
		this.setLightMode("cameraCentered", {max: 200});
		return true;
	},
	// Set the Field of View to an angle in degrees
	fov: function(angle)
	{
		this.fovAngle = angle;
		var angleInRads = angle * (Math.PI / 180);
		this.eyeDistance = 1 / Math.tan(angleInRads / 2);
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
	rotateCameraTo: function(x, y, z)
	{
		this.cameraRotation.x = x;
		this.cameraRotation.y = y;
		this.cameraRotation.z = z;
		this.cameraRotationSine.x = Math.sin(this.cameraRotation.x);
		this.cameraRotationSine.y = Math.sin(this.cameraRotation.y);
		this.cameraRotationSine.z = Math.sin(this.cameraRotation.z);
		this.cameraRotationCosine.x = Math.cos(this.cameraRotation.x);
		this.cameraRotationCosine.y = Math.cos(this.cameraRotation.y);
		this.cameraRotationCosine.z = Math.cos(this.cameraRotation.z);
	},
	// Rotate the camera relative to the current rotation
	rotateCameraBy: function(x, y, z)
	{
		this.rotateCameraTo(this.cameraRotation.x + x,
			this.cameraRotation.y + y, this.cameraRotation.z + z);
	},
	// Rasterize a triangle onto the screen
	rasterizeTriangle: function(color, v1, v2, v3)
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
		this.rasterList.push({zIndex: (v1.z + v2.z + v3.z) / 3, v1: v1, v2: v2, v3: v3, color: color});
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
			this.context.strokeStyle = this.context.fillStyle;
			this.context.beginPath();
			this.context.moveTo(t.v1.x, t.v1.y);
			this.context.lineTo(t.v2.x, t.v2.y);
			this.context.lineTo(t.v3.x, t.v3.y);
			this.context.lineTo(t.v1.x, t.v1.y);
			this.context.fill();
			this.context.stroke();
		}
		this.rasterList = [];
		this.trianglesProcessed = 0;
		this.trianglesRasterized = 0
		this.tiranglesDrawn = 0;
	},
	zBufferSort: function(a, b)
	{
		return a.zIndex - b.zIndex;
	},
	// Create a new vector that is translated and rotated for the camera
	cameraTranslatePoint: function(v)
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
	cameraRotatePoint: function(v)
	{
		var cos = this.cameraRotationCosine;
		var sin = this.cameraRotationSine;
		var pos = new Vector3D(0, 0, 0);
		return new Vector3D(
			cos.y * (sin.z * (v.y - pos.y) + cos.z * (v.x - pos.x)) - sin.y * (v.z - pos.z),
			sin.x * (cos.y * (v.z - pos.z) + sin.y * (sin.z * (v.y - pos.y) + cos.z * (v.x - pos.x))) + cos.x * (cos.z * (v.y - pos.y) - sin.z * (v.x - pos.x)),
			cos.x * (cos.y * (v.z - pos.z) + sin.y * (sin.z * (v.y - pos.y) + cos.z * (v.x - pos.x))) - sin.x * (cos.z * (v.y - pos.y) - sin.z * (v.x - pos.x))
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
	// Project a triangle to the screen and rasterize it
	projectTriangle: function(color, v1, v2, v3)
	{
		++this.trianglesProcessed;
		
		// Apply camera translation and near clipping
		v1 = this.cameraTranslatePoint(v1);
		v2 = this.cameraTranslatePoint(v2);
		v3 = this.cameraTranslatePoint(v3);
		if(v1.z <= this.nearClip &&
			v2.z <= this.nearClip &&
			v3.z <= this.nearClip)
			return;
		if(v1.z <= this.nearClip)
			v1.z = this.nearClip;
		if(v2.z <= this.nearClip)
			v2.z = this.nearClip;
		if(v3.z <= this.nearClip)
			v3.z = this.nearClip;
			
		// Apply lighting
		color = this.lightMode(color, v1, v2, v3);
		
		// Project the points to the screen and rasterize the triangle
		this.projectPoint(v1);
		this.projectPoint(v2);
		this.projectPoint(v3);
		this.rasterizeTriangle(color, v1, v2, v3);
		
		++this.trianglesRasterized;
	},
	/* Lighting functions
	 * 
	 * INTERFACE
	 * 
	 * Parameters:
	 * color		The origional color of the face
	 * v1, v2, v3	The verticies of the face
	 * 
	 * Returns:
	 * A new color object representing the color that should be used
	 * for this face.
	 */
	lightingFunctions:
	{
		// Dungeon crawler-style lighting
		cameraCentered: function(color, v1, v2, v3)
		{
			var p = this.lightParams;
			
			var centroid = new Vector3D(
				(v1.x + v2.x + v3.x) / 3,
				(v1.y + v2.y + v3.y) / 3,
				(v1.z + v2.z + v3.z) / 3
			);

			// Linear attenuation
			var distance = centroid.length();
			var intensity = 1 / distance;

			/*
			// Difuse lighting
			var normal = v3.subtract(centroid).cross(v1.subtract(centroid)).normalize();
			var lightAngle = centroid.invert().normalize();
			var cosAngle = normal.dot(lightAngle);
			//alert(cosAngle);
			*/
			
			// Scale the color value
			var ret = new Color(color.r, color.g, color.b);
			ret.scale(intensity * p.brightness + p.ambient);
			return ret;
		}
	},
	// Lighting function pointer
	lightMode: null,
	lightParams: null,
	setLightMode: function(mode, params)
	{
		if(this.lightingFunctions.hasOwnProperty(mode))
		{
			this.lightMode = this.lightingFunctions[mode];
			this.lightParams = params;
		}
		else
			throw new Error("Invalid light mode " + mode);
	}
};
