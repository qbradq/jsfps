function Entity(x, y, rot, model)
{
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.rot = rot;
	this.model = model;
	this.moveSpeed = 50;
}

Entity.prototype =
{
	rotate: function(amount)
	{
		this.rot += amount;
	},
	move: function(x, y)
	{
		this.x += x;
		this.y += y;
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
	update: function()
	{
		// Restrict movement to the move speed
		var dx = (this.x - this.lastX);
		var dy = (this.y - this.lastY);
		var distance = dx * dx + dy * dy;
		var maxMove = this.moveSpeed * frameTime;
		var i, x1, x2, y1, y2, xMod, yMod, mapHit = {};
		if(distance > maxMove * maxMove)
		{
			distance = Math.sqrt(distance);
			var ratio = maxMove / distance;
			this.x = this.lastX + dx * ratio;
			this.y = this.lastY + dy * ratio;
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
				yMod = this.model.bounds.y + this.model.bounds.h;
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
			}
		}
		
		// Update previous state
		this.lastX = this.x;
		this.lastY = this.y;
	}
};
