

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
	this.player.name = index.toString();
	this.player.alpha = alpha;

	this.player.scale.setTo(scale, scale);
	if (hasPhysics){
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.immovable = false;
		if (friction) this.player.body.drag.set(friction);
		if (mass) this.player.body.mass = mass;
		if (bounce) this.player.body.bounce.setTo(bounce, bounce);
		this.player.body.maxVelocity.set(1000);


		this.playerStats = difficulty.playerStats;
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

Player.prototype.update = function(){
if(game.physics.arcade.collide(this.player, layer))
			{
			}

			if(this.player.body.onFloor())
			{
				this.player.body.acceleration.set(0);
			}
			else
			{
				this.player.body.acceleration.x = -5;
			}

			if (this.events.left)
			{
				if(this.player.body.touching.down || this.player.body.onFloor()){
					this.moveLeft();
				}
			}
			else if (this.events.right)
			{
				if(this.player.body.touching.down || this.player.body.onFloor()){
					this.moveRight();
				}
			}
			

};
