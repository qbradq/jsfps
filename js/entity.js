function Entity(x, y, rot, model)
{
	this.x = x;
	this.y = y;
	this.rot = rot;
	this.model = model;
}
Entity.prototype =
{
	render: function()
	{
		var points = [];
		var i;

		// Apply rotation and translation to all points
		for(i = 0; i < this.model.points.length; ++i)
		{
			points[i] = this.model.points[i].yRotate(this.rot);
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
	}
};

