function AIMobile(x, y, rot, model, hp)
{
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.rot = rot;
	this.model = model;
	this.hp = hp;
	this.aiState = "watch";
	this.aiParams = {};
	this.rotateSpeed = js3d.twoPi;
	this.moveSpeed = 35;
}
AIMobile.prototype = new Mobile();
AIMobile.prototype.maxViewDistance = 130;
AIMobile.prototype.maxViewDistance2 = AIMobile.prototype.maxViewDistance *
	AIMobile.prototype.maxViewDistance;
AIMobile.prototype.update = function()
{
	this["_ai" + this.aiState]();
	this.updateMovement();
}
AIMobile.prototype.lookAngleToEntity = function(ent)
{
	return Math.abs((new Vector3D(ent.x - this.x, 0, ent.y - this.y).worldAngle()) - this.rot);
}
AIMobile.prototype.canSeeEntity = function(ent, checkFoV)
{
	// Are we too far away to care?
	var d2 = (this.x - ent.x) * (this.x - ent.x) + (this.y - ent.y) *
		(this.y - ent.y);
	if(d2 > this.maxViewDistance2)
		return false;
	
	// Are we outside our 90 degree FoV?
	if(checkFoV &&
		this.lookAngleToEntity(ent) > js3d.piOverFour)
		return false;
	
	// Do we actually have line of sight to the player?
	if(map.lineHitsWall(this.x, this.y, ent.x, ent.y, {}))
		return false;
	
	return true;
}
AIMobile.prototype.turnTowardEntity = function(ent)
{
	// Find the absolute angle of rotation between us and this entity
	var toRotate = (new Vector3D(ent.x - this.x, 0, ent.y - this.y).worldAngle()) - this.rot;
	var absRotate = Math.abs(toRotate);
	var maxRotate = this.rotateSpeed * frameTime;
	if(absRotate > maxRotate)
		toRotate *= absRotate / maxRotate;
	this.rotate(toRotate);
}
AIMobile.prototype.moveTowardPoint = function(x, y)
{
	this.x = x;
	this.y = y;
}
AIMobile.prototype._aiwatch = function()
{
	if(!this.canSeeEntity(player, true))
		return;
	
	// We see the player. Record his location and move to attack state.
	this.aiParams.tx = player.x;
	this.aiParams.ty = player.y;
	// This prevents us from firing right away
	this.lastAttackTime = thisFrameTime;
	this.aiState = "attack";
}
AIMobile.prototype._aiattack = function()
{
	// Can we still see the player?
	if(!this.canSeeEntity(player))
	{
		this.aiState = "follow";
		return;
	}

	// If we can see the player, record his location	
	this.aiParams.tx = player.x;
	this.aiParams.ty = player.y;

	// Are we close enough in rotation?
	var lookAngle = this.lookAngleToEntity(player);
	if(lookAngle > 0.1)
	{
		this.turnTowardEntity(player);
		return;
	}
	
	// Try to attack
	this.attack();
}
AIMobile.prototype._aifollow = function()
{
	// Can we see the player now?
	if(this.canSeeEntity(player))
	{
		this.aiParams.tx = player.x;
		this.aiParams.ty = player.y;
		this.aiState = "attack";
		return;
	}
	
	// Try to move toward the last location we knew he was at
	this.moveTowardPoint(this.aiParams.tx, this.aiParams.ty);
}
