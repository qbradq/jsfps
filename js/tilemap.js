function TileMap(data)
{
	this.width = data.width;
	this.height = data.height;
	this.tiles = data.tiles;
}
TileMap.prototype =
{
	pvs: null,
	// Accessor method, determine if a world coordinate is in a wall tile
	isPointInWall: function(x, y)
	{
		return this.isWall((x / 10) | 0, (y / 10) | 0);
	},
	// Accessor method, determine if the location is a wall tile
	isWall: function(x, y)
	{
		if(x < 0 ||
			y < 0 ||
			x >= this.width ||
			y >= this.height ||
			this.tiles[y * this.width + x] <= 0)
			return false;
		return true;
	},
	// Render the map from the current camera location
	render: function()
	{
		var v1 = new Vector3D(0, 0, 0);
		var v2 = new Vector3D(0, 0, 0);
		var v3 = new Vector3D(0, 0, 0);
		var v4 = new Vector3D(0, 0, 0);
		var colorWall = new Color(16, 16, 224);
		var colorFloor = new Color(128, 128, 128);
		var dataOfs = 0;
		var o, ix, iy, tile;

		// Calculate the Potentially Visibile Set (PVS) and apply optimizations
		this.calculatePVS();

		// Now render every tile in the PVS
		for(o in this.pvs)
		{
			ix = this.pvs[o].x;
			iy = this.pvs[o].y;
			dataOfs = iy * this.width + ix;

			// Floor and ceiling
			if(this.tiles[dataOfs] == 0)
			{
				v1.x = v3.x = ix * 10;
				v2.x = v4.x = v1.x + 10;
				v3.z = v4.z = iy * -10;
				v1.z = v2.z = v3.z - 10;
				v1.y = v2.y = v3.y = v4.y = 0;
				js3d.projectTriangle(colorFloor, v1, v2, v3, true);
				js3d.projectTriangle(colorFloor, v3, v2, v4, true);
				v1.y = v2.y = v3.y = v4.y = -10;
				js3d.projectTriangle(colorFloor, v1, v3, v2, true);
				js3d.projectTriangle(colorFloor, v2, v3, v4, true);
			}
			else
			{
				// South-facing wall
				if(iy < this.height - 1 &&
					this.tiles[dataOfs + this.width] == 0)
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
					this.tiles[dataOfs - this.width] == 0)
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
					this.tiles[dataOfs - 1] == 0)
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
				if(ix < this.width - 1 &&
					this.tiles[dataOfs + 1] == 0)
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
		}
	},
	// Render the map from the current camera location, now with 150% more
	// triangles!
	renderHighRes: function()
	{
		var v1 = new Vector3D(0, 0, 0);
		var v2 = new Vector3D(0, 0, 0);
		var v3 = new Vector3D(0, 0, 0);
		var v4 = new Vector3D(0, 0, 0);
		var v5 = new Vector3D(0, 0, 0);
		var colorWall = new Color(16, 16, 224);
		var colorFloor = new Color(128, 128, 128);
		var dataOfs = 0;
		var o, ix, iy, tile;

		// Calculate the Potentially Visibile Set (PVS) and apply optimizations
		this.calculatePVS();

		// Now render every tile in the PVS
		for(o in this.pvs)
		{
			ix = this.pvs[o].x;
			iy = this.pvs[o].y;
			dataOfs = iy * this.width + ix;

			// Floor and ceiling
			if(this.tiles[dataOfs] == 0)
			{
				v1.x = v3.x = ix * 10;
				v2.x = v4.x = v1.x + 10;
				v3.z = v4.z = iy * -10;
				v1.z = v2.z = v3.z - 10;
				v5.x = v1.x + 5;
				v5.z = v3.z - 5;
				v1.y = v2.y = v3.y = v4.y = v5.y = 0;
				js3d.projectTriangle(colorFloor, v1, v2, v5, true);
				js3d.projectTriangle(colorFloor, v2, v4, v5, true);
				js3d.projectTriangle(colorFloor, v4, v3, v5, true);
				js3d.projectTriangle(colorFloor, v3, v1, v5, true);
				v1.y = v2.y = v3.y = v4.y = v5.y = -10;
				js3d.projectTriangle(colorFloor, v2, v1, v5, true);
				js3d.projectTriangle(colorFloor, v4, v2, v5, true);
				js3d.projectTriangle(colorFloor, v3, v4, v5, true);
				js3d.projectTriangle(colorFloor, v1, v3, v5, true);
			}
			else
			{
				// South-facing wall
				if(iy < this.height - 1 &&
					this.tiles[dataOfs + this.width] == 0)
				{
					v1.x = v3.x = ix * 10;
					v2.x = v4.x = v1.x + 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					v5.x = v1.x + 5;
					v5.y = - 5;
					v1.z = v2.z = v3.z = v4.z = v5.z = iy * -10 - 10;
					js3d.projectTriangle(colorWall, v1, v2, v5);
					js3d.projectTriangle(colorWall, v2, v4, v5);
					js3d.projectTriangle(colorWall, v4, v3, v5);
					js3d.projectTriangle(colorWall, v3, v1, v5);
				}
				// North-facing wall
				if(iy > 0 &&
					this.tiles[dataOfs - this.width] == 0)
				{
					v1.x = v3.x = ix * 10;
					v2.x = v4.x = v1.x + 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					v5.x = v1.x + 5;
					v5.y = - 5;
					v1.z = v2.z = v3.z = v4.z = v5.z = iy * -10;
					js3d.projectTriangle(colorWall, v2, v1, v5);
					js3d.projectTriangle(colorWall, v4, v2, v5);
					js3d.projectTriangle(colorWall, v3, v4, v5);
					js3d.projectTriangle(colorWall, v1, v3, v5);
				}
				// East-facing wall
				if(ix > 0 &&
					this.tiles[dataOfs - 1] == 0)
				{
					v1.x = v2.x = v3.x = v4.x = v5.x = ix * 10;
					v2.z = v4.z = iy * -10;
					v1.z = v3.z = v2.z - 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					v5.z = v2.z - 5;
					v5.y = -5;
					js3d.projectTriangle(colorWall, v2, v1, v5);
					js3d.projectTriangle(colorWall, v4, v2, v5);
					js3d.projectTriangle(colorWall, v3, v4, v5);
					js3d.projectTriangle(colorWall, v1, v3, v5);
				}
				// West-facing wall
				if(ix < this.width - 1 &&
					this.tiles[dataOfs + 1] == 0)
				{
					v1.x = v2.x = v3.x = v4.x = v5.x = ix * 10 + 10;
					v2.z = v4.z = iy * -10;
					v1.z = v3.z = v2.z - 10;
					v1.y = v2.y = 0;
					v3.y = v4.y = -10;
					v5.z = v2.z - 5;
					v5.y = -5;
					js3d.projectTriangle(colorWall, v1, v2, v5);
					js3d.projectTriangle(colorWall, v2, v4, v5);
					js3d.projectTriangle(colorWall, v4, v3, v5);
					js3d.projectTriangle(colorWall, v3, v1, v5);
				}
			}
		}
	},
	// Calculate the Potentially Visible Set of tiles
	calculatePVS: function()
	{
		this.pvs = {};
		
		// Temp variables
		var halfFOV = js3d.fovAngle / 2;
		var ix, iy, pxl, pxr, pyt, pyb;
		var x = js3d.cameraPosition.x;
		var y = js3d.cameraPosition.z;
		
		// View frustram left bound
		var fl =
		{
			x1: x,
			y1: y,
			x2: x + (1 * Math.sin(js3d.cameraRotation - halfFOV)),
			y2: y + (1 * Math.cos(js3d.cameraRotation - halfFOV))
		}
		// View frustram right bound
		var fr =
		{
			x1: x,
			y1: y,
			x2: x + (1 * Math.sin(js3d.cameraRotation + halfFOV)),
			y2: y + (1 * Math.cos(js3d.cameraRotation + halfFOV))
		}
		// Far clipping plane
		var cp =
		{
			x1: x + (js3d.farClip * js3d.cameraRotationSine),
			y1: y + (js3d.farClip * js3d.cameraRotationCosine)
		}
		cp.x2 = cp.x1 + (1 * Math.sin(js3d.cameraRotation - js3d.piOverTwo));
		cp.y2 = cp.y1 + (1 * Math.cos(js3d.cameraRotation - js3d.piOverTwo));

		//$("#debug").text("EYE: " + x + "," + y + " FARCLIP: " + cp.x1 + "," + cp.y1 + " to " + cp.x2 + "," + cp.y2);

		// Pre-calculate some parts of the equations that won't changes
		fl.dx = fl.x2 - fl.x1;
		fl.dy = fl.y2 - fl.y1;
		fr.dx = fr.x2 - fr.x1;
		fr.dy = fr.y2 - fr.y1;
		cp.dx = cp.x2 - cp.x1;
		cp.dy = cp.y2 - cp.y1;

		for(iy = 0; iy < this.height; ++iy)
		{
			pyt = iy * -10;
			pyb = pyt - 10;
			pxl = -10;
			pxr = 0;
			for(ix = 0; ix < this.width; ++ix)
			{
				pxl += 10;
				pxr += 10;
				
				// If all points are left of the left bound exclude it
				if((pxl - fl.x1) * fl.dy - fl.dx * (pyt - fl.y1) < 0 &&
					(pxl - fl.x1) * fl.dy - fl.dx * (pyb - fl.y1) < 0 &&
					(pxr - fl.x1) * fl.dy - fl.dx * (pyt - fl.y1) < 0 &&
					(pxr - fl.x1) * fl.dy - fl.dx * (pyb - fl.y1) < 0)
					continue;
				// Or if all points are right of the right bound exclude it
				if((pxl - fr.x1) * fr.dy - fr.dx * (pyt - fr.y1) > 0 &&
					(pxl - fr.x1) * fr.dy - fr.dx * (pyb - fr.y1) > 0 &&
					(pxr - fr.x1) * fr.dy - fr.dx * (pyt - fr.y1) > 0 &&
					(pxr - fr.x1) * fr.dy - fr.dx * (pyb - fr.y1) > 0)
					continue;
				// Or if all points are to the right of the far clipping plane
				if((pxl - cp.x1) * cp.dy - cp.dx * (pyt - cp.y1) > 0 &&
					(pxl - cp.x1) * cp.dy - cp.dx * (pyb - cp.y1) > 0 &&
					(pxr - cp.x1) * cp.dy - cp.dx * (pyt - cp.y1) > 0 &&
					(pxr - cp.x1) * cp.dy - cp.dx * (pyb - cp.y1) > 0)
					continue;
				// If we are still in the loop the tile overlapps the view frustram
				this.pvs[ix + "x" + iy] = {x: ix, y: iy, tile: this.tiles[iy * this.width + ix]};
			}
		}
	},
	// Trace a line segment through the map and return where it hit a wall,
	// if ever, in an output variable.
	lineHitsWall: function(x1, y1, x2, y2, out)
	{
		var ix, iy, tx, ty, hit, dx, dy, vertical, m, b;
		
		// Line formula variables
		if(x2 - x1 == 0)
		{
			vertical = true;
		}
		else
		{
			m = (y2 - y1) / (x2 - x1);
			b = y1 - m * x1;
		}
		
		// Trace the east / west wall intercepts
		hit = false;
		if(x1 < x2 &&
			!vertical)
		{
			for(ix = x1 % 10 == 0 ? x1 : (x1 + (10 - Math.abs(x1) % 10)) | 0; ix <= x2; ix += 10)
			{
				tx = (ix / 10) | 0;
				iy = m * ix + b;
				ty = -((iy / 10) | 0);
				if(tx < 0 ||
					ty < 0 ||
					tx >= this.width ||
					ty >= this.width ||
					this.tiles[ty * this.width + tx] > 0)
				{
					out.x = ix;
					out.y = iy;
					out.dir = "E";
					hit = true;
					break;
				}
			}
		}
		else if(x1 > x2)
		{
			for(ix = (x1 - Math.abs(x1) % 10) | 0; ix >= x2; ix -= 10)
			{
				tx = ((ix / 10) - 1) | 0;
				iy = m * ix + b;
				ty = -((iy / 10) | 0 );
				if(tx < 0 ||
					ty < 0 ||
					tx >= this.width ||
					ty >= this.width ||
					this.tiles[ty * this.width + tx] > 0)
				{
					out.x = ix;
					out.y = iy;
					out.dir = "W";
					hit = true;
					break;
				}
			}
		}
		
		// Trace the north / south wall intercepts
		if(y1 < y2)
		{
			for(iy = (y1 + Math.abs(y1) % 10) | 0; iy <= y2; iy += 10)
			{
				ty = -((iy / 10) + 1) | 0;
				if(vertical)
					ix = x1;
				else
					ix = (iy - b) / m;
				tx = (ix / 10) | 0;
				if(tx < 0 ||
					ty < 0 ||
					tx >= this.width ||
					ty >= this.width ||
					this.tiles[ty * this.width + tx] > 0)
				{
					// If we already have a it, make sure we are closer
					if(hit)
					{
						dx = (out.x - x1) * (out.x - x1) + (out.y - y1) * (out.y - y1);
						dy = (ix - x1) * (ix - x1) + (iy - y1) * (iy - y1);
						if(dx <= dy)
						{
							break;
						}
					}
					out.x = ix;
					out.y = iy;
					out.dir = "N";
					hit = true;
					break;
				}
			}
		}
		else if(y1 > y2)
		{
			for(iy = y1 % 10 == 0 ? y1 : (y1 - (10 - Math.abs(y1) % 10)) | 0; iy >= y2; iy -= 10)
			{
				ty = -((iy / 10) | 0);
				if(vertical)
					ix = x1;
				else
					ix = (iy - b) / m;
				tx = (ix / 10) | 0;
				if(tx < 0 ||
					ty < 0 ||
					tx >= this.width ||
					ty >= this.width ||
					this.tiles[ty * this.width + tx] > 0)
				{
					// If we already have a it, make sure we are closer
					if(hit)
					{	
						dx = (out.x - x1) * (out.x - x1) + (out.y - y1) * (out.y - y1);
						dy = (ix - x1) * (ix - x1) + (iy - y1) * (iy - y1);
						if(dx <= dy)
						{
							break;
						}
					}
					out.x = ix;
					out.y = iy;
					out.dir = "S";
					hit = true;
					break;
				}
			}
		}
		
		return hit;
	}
};

