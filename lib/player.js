// check layer block if it is hookable
// invisible square for a finish line
//
// get rotation/angle between sprite and pointer

Player = function (index, game, cachedSpriteName, startX,
		startY, playerStats,hasPhysics, scale, alpha, mass, friction, bounce){

	var x = startX;
	var y = startY;

	this.game = game;
	this.player = {};
	this.alive = true;

	this.player = game.add.sprite(x, y, cachedSpriteName);

	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)

	this.player.anchor.setTo(0.5, 0.5);
	this.player.alpha = alpha;
	this.player.name = index.toString();


	if (hasPhysics){
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.angle = game.rnd.angle();
		this.player.scale.setTo(scale, scale);
		this.player.body.immovable = false;
		this.player.body.collideWorldBounds = true;
		if (friction) this.player.body.drag.set(friction);
		if (mass) this.player.body.mass = mass;
		if (bounce) this.player.body.bounce.setTo(bounce, bounce);
		this.player.body.maxVelocity.set(this.playerStats.maxVelocity);
		this.player.checkWorldBounds = true;


		this.player.events.onOutOfBounds.add(function(){game.add.text(100,100, "YOU WON");}, this);


		this.playerStats = playerStats;
		this.events={
			left: false,
			right: false,
			grappleMode: false,
			isSeen: false,
		};
	}
};



Player.prototype.moveLeft = function (){
	this.player.body.acceleration.x = -200;
};

Player.prototype.jump = function (){
	if(this.player.body.touching.down || this.player.body.onFloor()){
		this.player.body.velocity.y = -(this.playerStats.jump);
	}
};

Player.prototype.moveRight = function () {
	this.player.body.acceleration.x = 200;
};

Player.prototype.cancelGrapple = function(){

};

Player.prototype.update = function ()
{
	if (plotting)
	{
		line.start.set(this.player.body.x, this.player.body.y);
		line.end.set(game.input.activePointer.worldX, game.input.activePointer.worldY);
		layer.dirty = false;
	}
	else if (!grapple.isReturned)
	{
		ropeLine.start.set(this.player.body.x + this.player.body.width/2, this.player.body.y + this.player.body.height/2);
		ropeLine.end.set(grappleHook.body.x + grappleHook.width/2, grappleHook.body.y + grappleHook.height/2);
	}

	if(game.physics.arcade.collide(player, layer))
	{
	}

	if (grappleHook && !grapple.isReturning)
	{
		if (game.physics.arcade.collide(grappleHook, layer, pull))
		{
			grapple.isReached = true;
			game.physics.arcade.moveToObject(player, grappleHook, grapple.pullSpeed);

		} 
		else if(game.physics.arcade.distanceBetween(player, grappleHook) > grapple.length)
		{
			returnGrapple();
		}

	} 

	if(player.body.onFloor())
	{
		player.body.acceleration.set(0);
	}
	else
	{
		player.body.acceleration.x = -1;
	}

	if(grapple.isReturning)
	{
		game.physics.arcade.moveToObject(grappleHooks, player, grapple.pullSpeed);

	};
};
