function Mobile(x, y, rot, model, hp)
{
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.rot = rot;
	this.model = model;
	this.hp = hp;
}
Mobile.prototype = new Entity();
Mobile.prototype.type = "Mobile";
Mobile.prototype.collideWithEntity = function(entHit)
{
	switch(entHit.ent.type)
	{
		case "Projectile":
			this.takeDamage(entHit.ent.damage);
			break;
		case "Mobile":
			Entity.prototype.collideWithEntity.call(this, entHit);
			break;
	}
}
Mobile.prototype.takeDamage = function(amount)
{
	this.hp -= amount;
	if(this.hp <= 0)
		this.die();
}
Mobile.prototype.die = function()
{
	map.removeEntity(this);
}
