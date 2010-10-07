function ParticleSystem(x, y, color, amount, speed, durationMs, fadePercent,
	scale)
{
	if(config.highRes)
		amount *= 2.5;
	this.x = x;
	this.y = y;
	this.color = color;
	this.data = [];
	this.scale = scale;
	this.createTime = thisFrameTime;
	this.durationMs = durationMs;
	this.durationFalloffMs = durationMs * fadePercent;
	this.durationFalloffLengthMs = durationMs - this.durationFalloffMs;
	var i;
	for(i = 0; i < amount * 2; i += 2)
	{
		this.data[i] = new Vector3D(this.x, -4, this.y);
		this.data[i + 1] = new Vector3D(Math.random() * speed * 2 - speed,
			Math.random() * speed * 2 - speed,
			Math.random() * speed * 2 - speed);
	}
}
ParticleSystem.prototype = new Entity();
ParticleSystem.prototype.doNotCollide = true;
ParticleSystem.prototype.update = function()
{
	if(thisFrameTime > this.createTime + this.durationMs)
		return this.die();
	
	for(i = 0; i < this.data.length; i += 2)
	{
		this.data[i].x += this.data[i + 1].x * frameTime;
		this.data[i].y += this.data[i + 1].y * frameTime;
		this.data[i].z += this.data[i + 1].z * frameTime;
	}
}
ParticleSystem.prototype.render = function()
{
	var color = this.color;
	var timeAlive = thisFrameTime - this.createTime;
	var diff;
	
	if(timeAlive >= this.durationFalloffMs)
	{
		diff = this.durationFalloffLengthMs - (timeAlive -
			this.durationFalloffMs);
		if(diff < 0)
			diff = 0;
		color = new Color(color.r, color.g, color.b);
		color.a = diff / this.durationFalloffLengthMs;
	}
	for(i = 0; i < this.data.length; i += 2)
	{
		if(this.data[i].y > 0 ||
			this.data[i].y < -10)
			continue;
		js3d.projectPoint(color, this.data[i], this.scale);
	}
}
