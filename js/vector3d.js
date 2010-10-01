function Vector3D(x, y, z)
{
	this.x = x !== undefined ? x : 0;
	this.y = y !== undefined ? y : 0;
	this.z = z !== undefined ? z : 0;
}
Vector3D.prototype =
{
	add: function(b)
	{
		return new Vector3D(this.x + b.x, this.y + b.y, this.z + b.z);
	},
	subtract: function(b)
	{
		return new Vector3D(this.x - b.x, this.y - b.y, this.z - b.z);
	},
	multiply: function(scalar)
	{
		return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
	},
	scale: function(b)
	{
		return new Vector3D(this.x * b.x, this.y * b.y, this.z * b.z);
	},
	length: function()
	{
		return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	},
	dot: function(b)
	{
		return this.x * b.x + this.y * b.y + this.z * b.z;
	},
	cross: function(b)
	{
		return new Vector3D(this.y * b.z - b.y * this.z,
			b.x * this.z - this.x * b.z,
			this.x * b.y - b.x * this.y);
	},
	angleFrom: function(b)
	{
		var dot = this.x * b.x + this.y * b.y + this.z * b.z;
		var mod1 = this.x * this.x + this.y * this.y + this.z * this.z;
		var mod2 = b.x * b.x + b.y * b.y + b.z * b.z;
		var mod = Math.sqrt(mod1) * Math.sqrt(mod2);
		if(mod === 0) return null;
		var theta = dot / mod;
		if(theta < -1) return Math.acos(-1);
		if(theta > 1) return Math.acos(1);
		return Math.acos(theta);
	}
};
