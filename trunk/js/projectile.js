function Projectile(x, y, rot, model)
{
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.rot = rot;
	this.model = model;
	this.moveSpeed = 150;
	var dVect = new Vector3D(0, 0, 1);
	dVect.yRotate(-this.rot, dVect);
	dVect = dVect.multiply(this.moveSpeed);
	this.vx = dVect.x;
	this.vy = dVect.z;
	this.damage = 1;
}
Projectile.prototype = new Entity();
Projectile.prototype.type = "Projectile";
Projectile.prototype.update = function()
{
	this.x += this.vx * frameTime;
	this.y += this.vy * frameTime;
	Entity.prototype.update.apply(this);
}
Projectile.prototype.collideWithEntity = function(entHit)
{
	switch(entHit.ent.type)
	{
		case "Mobile":
			entHit.ent.takeDamage(this.damage);
			break;
	}
	this.die();
}
Projectile.prototype.collideWithWall = function()
{
	this.die();
}
Projectile.prototype.die = function()
{
	map.addEntity(new ParticleSystem(this.x, this.y, this.model.dieColor, 20,
		6, 700, 0.0, 2));
	Entity.prototype.die.call(this);
}
