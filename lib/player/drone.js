/*
 *
 * Drone
 * 
 */


var Drone = function (index, game, cachedSpriteName, startX, startY, droneStats, hasPhysics, scale, health, mass, friction, bounce){


	var x = startX;
	var y = startY;

	this.game = game;
	if (health) this.health = 3;
	this.alive = true;


	this.drone = {};
	this.drone = game.add.sprite(startX, startY, cachedSpriteName);
	this.drone.scale.setTo(0.1, 0.1);
	this.drone.anchor.set(0.5);
	if (hasPhysics){
	game.physics.enable(this.drone, Phaser.Physics.ARCADE);
	this.drone.body.drag.set(100);
	this.drone.body.maxVelocity.set(800);
	this.drone.body.mass = 10;
	this.drone.body.allowGravity = false;

	this.drone.events.onOutOfBounds.add(function(){this.drone.kill();}, this);


	this.droneStats = droneStats;
	this.events = 
	{ 
		haltmode: false,
		following: true,
	};
	}
};

Drone.prototype.follow = function(object) {
	game.camera.follow(object);
	if(!this.events.haltmode){
		this.events.following = true;
		game.physics.arcade.moveToXY(this.drone, object.body.x + 16, object.body.y + 16, this.droneStats.speed, 500);
	}
};

Drone.prototype.followCursor = function(){
	this.events.following = false;
	game.camera.follow(this.drone);
	if (!this.events.haltmode)
		game.physics.arcade.moveToXY(this.drone, game.input.activePointer.worldX, game.input.activePointer.worldY, droneStats.speed, 500);
};

Drone.prototype.haltMode = function(){
	//drone2[0].drone.body.velocity.set(0);
	if(this.events.haltmode){
		this.events.haltmode = false;
	}
	else this.events.haltmode = true;
};


Drone.prototype.pull = function (){
	line.start.set(this.drone.body.x, this.drone.body.y);
	tileHits = layer.getRayCastTiles(line, 4, true, false);
	line.end.set(game.input.activePointer.worldX,game.input.activePointer.worldY);
	if(tileHits.length !== 0){

		var distanceBetween = game.physics.arcade.distanceBetween(this.drone, tileHits[0]);
		game.physics.arcade.moveToXY(this.drone, tileHits[0], droneStats.pullVelocity - distanceBetween); //divided by obj mass
		// game.physics.arcade.getObjectsUnderPointer(game.input.activePointer, worldItems[i].item, pullObj); //with raycast for collision or mouse over
	}
	// function pullObj (body1, body2){
	// 	var distanceBetween = game.physics.arcade.distanceBetween(body1, body2);
	// 		game.physics.arcade.moveToXY(body1, body2, droneStats.pullVelocity - distanceBetween); //divided by obj mass
	// 	}
};

//drone rotation, shock sprite animation, charge sound , zdhun sou`nd on contact, show sprite on collision
Drone.prototype.shock = function  () {
	// body...
};

Drone.prototype.update = function () {
	game.physics.arcade.collide(this.drone, layer);
	for (var i = 0;  i<worldItems.length; i++) {
		game.physics.arcade.collide(this.drone,worldItems[i].item);
	}
	if (SHIFT.isDown){
		this.followCursor();
	}
	else{
	this.follow(player.player);
	}
};

