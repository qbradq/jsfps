function Entity(x, y, rot, model)
{
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.rot = rot;
	this.model = model;
	this.moveSpeed = 50;
	this.attackDelayMs = 50;
	this.lastAttackTime = 0;
}

Entity.prototype =
{
	type: "Entity",
	rotate: function(amount)
	{
		this.rot += amount;
		while(this.rot > js3d.twoPI)
			this.rot -= js3d.twoPI;
		while(this.rot < 0)
			this.rot += js3d.twoPI;
	},
	move: function(x, y)
	{
		this.x += x;
		this.y += y;
	},
	die: function()
	{
		map.removeEntity(this);
	},
	attack: function()
	{
		if(this.lastAttackTime + this.attackDelayMs > thisFrameTime)
			return;
		this.lastAttackTime = thisFrameTime;
		var pPos = new Vector3D(0, 0, 0.01);
		pPos = pPos.yRotate(-this.rot, pPos);
		var p = new Projectile(pPos.x + this.x, pPos.z + this.y, this.rot, models.projectile, this);
		map.addEntity(p);
	},
	render: function()
	{
		var points = [];
		var i;

		// Apply rotation and translation to all points
		for(i = 0; i < this.model.points.length; ++i)
		{
			points[i] = this.model.points[i].yRotate(-this.rot);
			points[i].x += this.x;
			points[i].z += this.y;
		}

		// Render out all the faces
		for(i = 0; i < this.model.faces.length; i += 4)
		{
			js3d.projectTriangle(this.model.faces[i],
				points[this.model.faces[i + 1]],
				points[this.model.faces[i + 2]],
				points[this.model.faces[i + 3]]
			);
		}
	},
	collideWithEntity: function(entHit)
	{
		// We have a hit, back off the line of travel by the
		// penetration amount based on direction, plus a little extra
		// "bounce" travel to cheat our imperfect collision routine.
		if(entHit.dir == "W")
		{
			this.x = (entHit.x - this.model.bounds.x) + 0.001;
		}
		else if(entHit.dir == "E")
		{
			this.x = (entHit.x - (this.model.bounds.x +
				this.model.bounds.w)) - 0.001;
		}
		else if(entHit.dir == "S")
		{
			this.y = (entHit.y + (this.model.bounds.h -
				this.model.bounds.y)) + 0.001;
		}
		else
		{
			this.y = (entHit.y - this.model.bounds.y) - 0.001;		
		}

	},
	collideWithWall: function()
	{
	},
	update: function()
	{
		this.updateMovement();
	},
	updateMovement: function()
	{
		// Restrict movement to the move speed
		var dx = (this.x - this.lastX);
		var dy = (this.y - this.lastY);
		var distance = dx * dx + dy * dy;
		var maxMove = this.moveSpeed * frameTime;
		var i, x1, x2, y1, y2, xMod, yMod, mapHit = {}, entList = [];
		var entBounds, ent;
		var wallHit = false;
		if(distance > maxMove * maxMove)
		{
			distance = Math.sqrt(distance);
			var ratio = maxMove / distance;
			this.x = this.lastX + dx * ratio;
			this.y = this.lastY + dy * ratio;
		}

		// Handle entity collisions
		if(map.entityHitsEntity(this, entList))
		{
			for(i = 0; i < entList.length; ++i)
			{
				this.collideWithEntity(entList[i]);
			}
		}

		// Handle map collisions
		for(i = 0; i < 4; ++i)
		{
			if(i < 2)
				xMod = this.model.bounds.x;
			else
				xMod = this.model.bounds.x + this.model.bounds.w;
			if(i == 0 ||
				i == 2)
				yMod = this.model.bounds.y;
			else
				yMod = this.model.bounds.y - this.model.bounds.h;
			x1 = this.lastX + xMod;
			x2 = this.x + xMod;
			y1 = this.lastY + yMod;
			y2 = this.y + yMod;
			if(map.lineHitsWall(x1, y1, x2, y2, mapHit))
			{
				// We have a hit, back off the line of travel by the
				// penetration amount, plus a little extra "bounce"
				// travel. This allows us to cheat the imperfect
				// wall collision routine and "slide" along walls.
				if(mapHit.dir == "N" ||
					mapHit.dir == "S")
				{
					this.y -= (y2 - mapHit.y) * 1.001;
				}
				else
				{
					this.x -= (x2 - mapHit.x) * 1.001;
				}
				wallHit = true;
			}
		}
		if(wallHit)
			this.collideWithWall();
		
		// Update previous state
		this.lastX = this.x;
		this.lastY = this.y;
	}
};
