function TileMap(data)
{
	this.width = data.width;
	this.height = data.height;
	this.tiles = data.tiles;
}
TileMap.prototype =
{
	pvs: null,
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
	}
};

