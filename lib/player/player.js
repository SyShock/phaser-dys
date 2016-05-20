

Player = function (index, game, cachedSpriteName, startX,
		startY, playerStats,hasPhysics, scale, mass, friction, bounce){

	var x = startX;
	var y = startY;

	this.game = game;
	this.player = player;
	this.alive = true;

	this.player = game.add.sprite(x, y, cachedSpriteName);

	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)

	this.player.anchor.setTo(0.5, 0.5);
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


	//	this.player.events.onOutOfBounds.add(function(){this.player.kill();}, this);


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
