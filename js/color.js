function Color(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = 1;
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
		return this;
	}
};
Color.red = new Color(255, 0, 0);
Color.green = new Color(0, 255, 0);
Color.blue = new Color(0, 0, 255);
Color.yellow = new Color(255, 255, 0);
Color.purple = new Color(255, 0, 255);
Color.teal = new Color(0, 255, 255);
Color.white = new Color(255, 255, 255);
