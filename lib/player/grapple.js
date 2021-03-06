var Grapple = function(index,game,cachedSprite,startx,starty,hasPhysics,scale, attachedTo){

	var x = startx;
	var y = starty;

	this.grappleHook = {};
	this.grappleHook = game.add.sprite(x,y,cachedSprite);
	this.grappleHook.scale.setTo(scale,scale);
	this.grappleHook.kill();

	this.attachedTo = attachedTo;
	this.grappleHook.anchor.setTo(0.5, 0.5);

	if(hasPhysics){
		game.physics.enable(this.grappleHook, Phaser.Physics.ARCADE);
		this.grappleHook.body.allowGravity = false;

	}


	this.events = {
		isCanceled: true,
		isReturned: true,
		isReturning: false,
		isReached: false,
		isEnemyHooked: false,
	};
	this.grappleStats = {
		throwSpeed: 800,
		pullSpeed: 800,
		reload: 100,
		length: 500,
	};

	if (difficulty.grappleStats)
		this.grappleStats = difficulty.grappleStats;

};





Grapple.prototype.startLine = function(pointer) {
	if(this.events.isReturned && this.attachedTo.alive){

		line.start.set(this.attachedTo.body.x + this.attachedTo.width/2, this.attachedTo.body.y + this.attachedTo.height/2);
		line.end.set(game.input.activePointer.worldX, game.input.activePointer.worldY);
		plotting = true;

	}
};

Grapple.prototype.raycast = function(pointer) {

	if (this.events.isReturned){
		tileHits = layer.getRayCastTiles(line, 4, true, false);

		if (tileHits.length > 0)
		{
			line.end.set(tileHits[0].x, tileHits[0].y);
			//  Just so we can visually see the tiles
			/*for (var i = 0; i < tileHits.length; i++)
			  {
			//	game.add.text(tileHits[i].x);
			//tileHits[i].debug = true;
			}*/

			layer.dirty = true;
		}

		plotting = false;
	}
};


Grapple.prototype.fireGrapple = function() {

	if (this.events.isReturned && this.attachedTo.alive) //coditions to fire
	{

		line.end.set();
		line.start.set();

		this.events.isReturned = false;
		this.events.isReturning = false;
		this.events.isReached = false;
		this.events.isEnemyHooked = false;

		this.grappleHook.reset(player.player.body.x + player.player.body.width/2, player.player.body.y + player.player.body.height/2);
		this.grappleHook.rotation = game.physics.arcade.angleToPointer(this.grappleHook);
		this.grappleHook.body.allowGravity = false;
		this.grappleHook.revive(1); // gets the nonexisten/dead sprite

		game.physics.arcade.moveToXY(this.grappleHook, game.input.activePointer.worldX, game.input.activePointer.worldY, this.grappleStats.throwSpeed);
		this.grappleHook.body.velocity.x += player.player.body.velocity.x;
		this.grappleHook.body.velocity.y += player.player.body.velocity.y;

	}

};

Grapple.prototype.pull =  function(body1,body2){
	if (true){ //show mass and speed of what pulls what is detemined by mass difference
		//	body1.body.velocity.set(0);	
		game.physics.arcade.moveToObject(body1, body2, this.grappleStats.pullSpeed);
	}
};

Grapple.prototype.cancelGrapple = function(){
	if (this.events.isReached){
		this.attachedTo.body.allowGravity = true;	
		this.attachedTo.body.acceleration.set(0);
		this.events.isCanceled = true;

		this.returnGrapple();
	}
};

Grapple.prototype.forceCancelGrapple = function(){

		this.attachedTo.body.allowGravity = true;	
		this.attachedTo.body.acceleration.set(0);
		this.events.isCanceled = true;

		this.returnGrapple();
};


Grapple.prototype.returnGrapple = function(){
	this.events.isReturning = true;
};

Grapple.prototype.killGrapple = function(){
	this.events.isReturning = false;
	this.events.isReturned = true;
	this.events.isReached = false;
	this.grappleHook.kill();

	ropeLine.start.set();
	ropeLine.end.set();
};


Grapple.prototype.update = function(){
	if (plotting)
	{
		line.start.set(this.attachedTo.body.x+ this.attachedTo.width/2, this.attachedTo.body.y + this.attachedTo.height/2);
		line.end.set(game.input.activePointer.worldX, game.input.activePointer.worldY);
		layer.dirty = false;
	}
	else if (!this.events.isReturned)
	{
		ropeLine.start.set(this.attachedTo.body.x + this.attachedTo.body.width/2, this.attachedTo.body.y + this.attachedTo.body.height/2);
		ropeLine.end.set(this.grappleHook.body.x + this.grappleHook.width/2, this.grappleHook.body.y + this.grappleHook.height/2);


		if (!this.events.isReturning)
		{
			if (game.physics.arcade.collide(this.grappleHook, layer))
			{
				this.events.isReached = true;
				this.grappleHook.body.allowGravity = false;
				this.grappleHook.body.velocity.set(0);

			} 
			else if(game.physics.arcade.distanceBetween(this.attachedTo, this.grappleHook) > this.grappleStats.length)
			{
				this.returnGrapple();
			}



			if(this.events.isReached)
			{	
				if (this.events.isEnemyHooked){
					this.pull(this.attachedTo,enemyUnits[whatTo].type.unit);
					this.pull(enemyUnits[whatTo].type.unit,this.attachedTo);
				}

				else{
					this.pull(this.attachedTo,this.grappleHook);
				}

				if (game.physics.arcade.overlap(this.grappleHook, this.attachedTo))
				{
					//console.log("why");
					this.attachedTo.body.velocity.set(0);
					this.attachedTo.body.allowGravity = false;
				}
			} 

		}

		else if(this.events.isReturning)
		{
			game.physics.arcade.moveToObject(this.grappleHook, this.attachedTo, this.grappleStats.pullSpeed);
			if(game.physics.arcade.overlap(this.grappleHook, this.attachedTo)){
				this.killGrapple();
			}

		}



		for (var i = 0; enemyUnits.length > i; i++) 
			if (game.physics.arcade.collide(this.grappleHook, enemyUnits[i].type.unit))
			{
				whatTo = i;
				this.events.isEnemyHooked = true;
				this.events.isReached = true;
				this.grappleHook.body.allowGravity = false;
				this.grappleHook.body.velocity.set(0);
			}



	}
};
