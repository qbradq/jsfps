function TileMap(data)
{
	this.width = data.width;
	this.height = data.height;
	this.tiles = data.tiles;
	this.entities = [];
}
TileMap.prototype =
{
	pvs: null,
	pvsEntities: null,
	// Add an entity to this map
	addEntity: function(ent)
	{
		this.entities.push(ent);
	},
	// Remove an entity from this map   
	removeEntity: function(ent)
	{
		var idx = this.entities.indexOf(ent);
		if(idx < 0)
			return;
		this.entities.splice(idx, 1);
	},
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
	// Update all entities
	update: function()
	{
		var i;
		
		for(i = 0; i < this.entities.length; ++i)
		{
			this.entities[i].update();
		}
	},
	// High-level wrapper for rendering operations
	render: function()
	{
		this.calculatePVS();
		if(config.highRes)
			this.renderHighRes();
		else
			map.renderLowRes();
		this.renderEntities();
	},
	// Render all of the entities on the map that are within the view frustrum
	renderEntities: function()
	{
		var i;
		
		for(i = 0; i < this.pvsEntities.length; ++i)
		{
			this.pvsEntities[i].render();
		}
		//$("#debug").text(this.pvsEntities.length);
	},
	// Render the map from the current camera location
	renderLowRes: function()
	{
		var v1 = new Vector3D(0, 0, 0);
		var v2 = new Vector3D(0, 0, 0);
		var v3 = new Vector3D(0, 0, 0);
		var v4 = new Vector3D(0, 0, 0);
		var colorWall = new Color(16, 16, 224);
		var colorFloor = new Color(128, 128, 128);
		var dataOfs = 0;
		var o, ix, iy, tile;

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
		this.pvsEntities = [];
		
		// Temp variables
		var halfFOV = js3d.fovAngle / 2;
		var ix, iy, pxl, pxr, pyt, pyb, i, ent;
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
		
		// Add map locations that are within the frustram
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
		
		// Add entities that are within the frustram
		for(i = 0; i < this.entities.length; ++i)
		{
			ent = this.entities[i];
			if(ent.model &&
				ent.model.renderBounds)
			{
				pyt = ent.y + ent.model.renderBounds.y;
				pyb = pyt + ent.model.renderBounds.h;
				pxl = ent.x + ent.model.renderBounds.x;
				pxr = pxl + ent.model.renderBounds.w;
				//alert(pyl + "," + pyt + " " + pyr + "," + pyb);

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
			}
			// If we are still in the loop the entitie's bounding rectangle
			// overlapps the view frustram, so add it to the list
			this.pvsEntities.push(ent);
		}
	},
	// Trace the movement of an entity and return what entities it hits, if
	// any.
	entityHitsEntity: function(sourceEnt, out)
	{
		var hit = false;
		var m, b, i;
		var ent, bounds, el, er, et, eb, sl, sr, st, sb;
		var sbl, sbr, sbt, sbb;
		var sx, sy, vx, vy, ofsX, ofsY;
		var outVar;
		
		// Velocity of source entity
		sx = sourceEnt.lastX;
		sy = sourceEnt.lastY;
		vx = sourceEnt.x - sourceEnt.lastX;
		vy = sourceEnt.y - sourceEnt.lastY;

		// Quick exclusion bounds of entity movement
		sl = sx + sourceEnt.model.bounds.x;
		sr = sl + sourceEnt.model.bounds.w;
		st = sy + sourceEnt.model.bounds.y;
		sb = st - sourceEnt.model.bounds.h;
		sbl = vx < 0 ? sl + vx : sl;
		sbr = vx < 0 ? sr : sr + vx;
		sbt = vy < 0 ? st : st + vy;
		sbb = vy < 0 ? sb + vy : sb;

		// Line formula variables
		if(vx != 0)
		{
			m = vy / vx;
			b = sy - m * sx;
		}
		
		// y = m * x + b
		// x = (y - b) / m
		for(i = 0; i < this.entities.length; ++i)
		{
			// Exclude the source entity
			ent = this.entities[i];
			if(ent == sourceEnt ||
				ent.doNotCollide)
				continue;
			
			// Quick bounds exclusion
			bounds = ent.model.bounds;
			el = ent.x + bounds.x;
			er = el + bounds.w;
			et = ent.y + bounds.y;
			eb = et - bounds.h;
			if(sbr < el ||
				sbl > er ||
				sbb > et ||
				sbt < eb)
				continue;

			// East-moving test
			if(vx > 0)
			{
				ofsY = (m * el + b) - sy;
				if(sb + ofsY <= et &&
					st + ofsY >= eb)
				{
					outVar = {ent: ent, dir: "E", x: el, y: sy + ofsY, pen: sr - el};
					hit = true;
				}
			}
			// West-moving test
			else if(vx < 0)
			{
				ofsY = (m * er + b) - sy;
				//alert(ofsY + ": " + sb + "+" + ofsY + " >= " + et + " && " + st + "+" + ofsY + " <= " + eb);
				if(sb + ofsY <= et &&
					st + ofsY >= eb)
				{
					outVar = {ent: ent, dir: "W", x: er, y: sy + ofsY, pen: er - sl};
					hit = true;
				}
			}
			// South-moving test
			if(vy < 0)
			{
				if(vx == 0)
					ofsX = 0;
				else
					ofsX = ((et - b) / m) - sx;
				if(sl + ofsX <= er &&
					sr + ofsX >= el)
				{
					if(hit == false ||
						outVar.pen > st - eb)
					{
						outVar = {ent: ent, dir: "S", x: sx + ofsY, y: et};
					}
					hit = true;
				}
			}
			// North-moving test
			else if(vy > 0)
			{
				if(vx == 0)
					ofsX = 0;
				else
					ofsX = ((eb - b) / m) - sx;
				if(sl + ofsX <= er &&
					sr + ofsX >= el)
				{
					if(hit == false ||
						outVar.pen > eb - st)
					{
						outVar = {ent: ent, dir: "N", x: sx + ofsY, y: eb};
					}
					hit = true;
				}
			}
		}
		
		if(hit)
			out.push(outVar);
		return hit;
	},
	// Trace a line segment and return what entities it hits, if any.
	// WORKING!!!
	lineHitsEntity: function(sourceEnt, x1, y1, x2, y2, out)
	{
		var m, b, i;
		var ent, bounds, bl, br, bt, bb, ll, lr, lt, lb, lx, ly;
		var hit = false;
		ll = x1 < x2 ? x1 : x2;
		lr = x1 < x2 ? x2 : x1;
		lt = y1 > y2 ? y1 : y2;
		lb = y1 > y2 ? y2 : y1;
		
		// Line formula variables
		if(x2 != x1)
		{
			m = (y2 - y1) / (x2 - x1);
			b = y1 - m * x1;
		}
		
		// y = m * x + b
		// x = (y - b) / m
		
		for(i = 0; i < this.entities.length; ++i)
		{
			ent = this.entities[i];
			if(ent == sourceEnt)
				continue;
			bounds = ent.model.bounds;
			bl = ent.x + bounds.x;
			br = bl + bounds.w;
			bt = ent.y + bounds.y;
			bb = bt - bounds.h;
			
			// Simple rect test to exclued
			if(lr < bl ||
				ll > br ||
				lb > bt ||
				lt < bb)
				continue;
			
			// Left wall test
			if(x1 < x2 &&
				ll <= bl &&
				lr >= bl)
			{
				ly = m * bl + b;
				if(ly <= bt &&
					ly >= bb)
				{
					out.push(ent);
					hit = true;
					continue;
				}
			}
			// Right wall test
			else if(x1 > x2 &&
				ll <= br &&
				lr >= br)
			{
				ly = m * br + b;
				if(ly <= bt &&
					ly >= bb)
				{
					out.push(ent);
					hit = true;
					continue;
				}
			}
			// Bottom wall test
			if(y1 < y2 &&
				lb <= bb &&
				lt >= bb)
			{
				if(x1 == x2)
					lx = x1;
				else
					lx = (bb - b) / m;
				if(lx >= bl &&
					lx <= br)
				{
					out.push(ent);
					hit = true;
					continue;
				}
			}
			// Top wall test
			else if(y1 > y2 &&
				lb <= bt &&
				lt >= bt)
			{
				if(x1 == x2)
					lx = x1;
				else
					lx = (bt - b) / m;
				if(lx >= bl &&
					lx <= br)
				{
					out.push(ent);
					hit = true;
					continue;
				}
			}
		}
		return hit;
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
		
		// y = m * x + b
		// x = (y - b) / m
		
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

