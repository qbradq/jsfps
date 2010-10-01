function Color(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;
}
Color.prototype =
{
	scale: function(s)
	{
		if(s < 0)
			return;
		this.r = (this.r * s) | 0;
		if(this.r > 255)
			this.r = 255;
		this.g = (this.g * s) | 0;
		if(this.g > 255)
			this.g = 255;
		this.b = (this.b * s) | 0;
		if(this.b > 255)
			this.b = 255;
	}
};
