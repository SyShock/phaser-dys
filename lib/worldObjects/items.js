var Items = function (index, game, cachedSpriteName, startX, startY, hasPhysics, scale, health, mass, friction, bounce) {
	var x = startX;
	var y = startY;

	this.game = game;
	if (health) this.health = 3;
	this.item = {};
	this.alive = true;

	this.item = game.add.sprite(x, y, cachedSpriteName);

	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)

	this.item.name = index.toString();

		this.item.scale.setTo(scale, scale);
	if(hasPhysics){
		game.physics.enable(this.item, Phaser.Physics.ARCADE);
	this.item.anchor.setTo(0.5, 0.5);
		this.item.body.immovable = false;
		this.item.body.collideWorldBounds = true;
		this.item.angle = game.rnd.angle();


		if (friction) this.item.body.drag.set(friction);
		if (mass) this.item.body.mass = mass;
		if (bounce) this.item.body.bounce.setTo(bounce, bounce);
		this.item.body.maxVelocity.set(1000);
	}



	this.lastPosition = { x: x, y: y };//for the animation
};

//all the rendering per frame
Items.prototype.update = function () {   
	game.physics.arcade.collide(this.item, layer);
	game.physics.arcade.collide(this.item, player);
	if (this.item.x !== this.lastPosition.x || this.item.y !== this.lastPosition.y) {
		// this.item.play('move')
		this.item.rotation = Math.PI + game.physics.arcade.angleToXY(this.item, this.lastPosition.x, this.lastPosition.y);
	} else {
		// this.item.play('stop')
	}

	// this.lastPosition.x = this.item.x;
	// this.lastPosition.y = this.item.y;
};

