function BoundingBox(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
BoundingBox.prototype =
{
	// Determine if this bounding box is overlapping a wall tile
	isInWall: function(x, y)
	{
		var left = Math.floor((this.x + x) / 10);
		var right = Math.floor((this.x + this.w + x) / 10);
		var top = Math.floor((this.y + y) / 10);
		var bottom = Math.floor((this.y + this.y + y) / 10);
		var ix, iy;
		
		for(iy = top; iy <= bottom; ++iy)
		{
			for(ix = left; ix <= right; ++ix)
			{
				if(map.isWall(ix, iy))
					return true;
			}
		}
		return false;
	}
};
