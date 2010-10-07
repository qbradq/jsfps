function ParticleSystem(x, y, color, density, speed)
{
	this.x = x;
	this.y = y;
	this.color = color;
}
ParticleSystem.prototype = new Entity();
ParticleSystem.prototype.update = function()
{
}
ParticleSystem.prototype.render = function()
{
}
