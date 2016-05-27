var Unit = function (index, game, cachedSpriteName,type, startX, startY, hasPhysics ,scale, alpha, conscious, mass, friction, bounce){
	this.type = type;
	if(type === "drone")
		this.type = new HostileDrone(index, game, cachedSpriteName,type, startX, startY, hasPhysics, scale, alpha, conscious, mass, friction, bounce);
	else if(type === "officer")
		this.type = new Officer(index, game, cachedSpriteName,type, startX, startY, hasPhysics, scale, conscious, mass, friction, bounce);
	else if(type === "sentry")
		this.type = new Sentry(index, game, cachedSpriteName,type, startX, startY, hasPhysics, scale, conscious, mass, friction, bounce);



	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)
	// if (appendFunction) obj.activate = appendFunction(); //glue external function to namespace
};


Unit.prototype.update = function() {

	this.type.update();
};


var Officer = function(index, game, cachedSpriteName,type, startX, start, scale, conscious, lineOfSight, coneOfVision, mass, friction, bounce)
{
	var x = startX;
	var y = startY;
	this.game = game;
	if (conscious) this.conscious = true;

	this.unit = unit;
	this.alive = true;
	this.unit = game.add.sprite(x, y, cachedSpriteName);

	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)
	this.unit.anchor.setTo(0.5, 0.5);
	this.unit.name = index.toString();

	//this.hasSeenPlayer = false;
	//
	game.physics.enable(this.unit, Phaser.Physics.ARCADE);
	this.unit.scale.setTo(scale, scale);
	this.unit.body.immovable = false;
	this.unit.body.collideWorldBounds = true;
	if (friction) this.unit.body.drag.set(friction);
	if (mass) this.unit.body.mass = mass;
	if (bounce) this.unit.body.bounce.setTo(bounce, bounce);
	this.unit.body.maxVelocity.set(1000);

	this.hasBeenAlerted = false;
	this.lastSeenPosition = { x: x, y: y };
	this.lastPosition = { x: x, y: y };//for the animation
	this.timer = 0;
	this.coneOfVision = difficulty.enemyStats.fieldOfVision*Math.PI/180;
};

Officer.prototype.update = function(){
	game.physics.arcade.collide(this.unit,layer);
	game.physics.arcade.collide(this.unit,drones[0].drone);
	game.physics.arcade.collide(this.unit,player.player,hasDied);
	if (Math.abs(game.physics.arcade.angleBetween(player.player, this.unit)) - Math.abs(this.unit.rotation) < this.coneOfVision){
		if(timeOut(game,difficulty.enemyStats.reaction,this)){
		}
	}
};

Officer.prototype.fire = function(object){

};

Officer.prototype.callBackUp = function(){
	for (var i = 0; i<2; i++)
		enemyUnits.push(new Unit(i,game,"player", "drone", maps.spawnPoint.position.x, maps.spawnPoint.position.y, true,0.3, true));
	for (var i = 0; i<1; i++)
		enemyUnits.push(new Unit(i,game,"player", "drone", maps.spawnPoint.position.x, maps.spawnPoint.position.y, true,0.3, true));
};

Officer.prototype.goTo = function(x,y){
	game.physics.arcade.moveToXY(this.unit, x, y, difficulty.enemyStats.speed);
};

Officer.prototype.patrolTo = function(x, y, delay){

};

Officer.prototype.searchFor = function(){
	this.unit.rotation = Math.rnd(1,4);
};



var Sentry =  function(index, game, cachedSpriteName,type, startX, startY, scale, conscious){
	var x = startX;
	var y = startY;
	this.game = game;
	if (conscious) this.conscious = true;
	this.unit = unit;
	this.alive = true;
	this.unit = game.add.sprite(x, y, cachedSpriteName);

	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)

	this.unit.anchor.setTo(0.5, 0.5);
	this.unit.name = index.toString();

	this.hasBeenAlerted = false;
	game.physics.enable(this.unit, Phaser.Physics.ARCADE);
	this.unit.angle = game.rnd.angle();
	this.unit.scale.setTo(scale, scale);
	this.unit.body.immovable = false;
	this.unit.body.collideWorldBounds = true;
	if (friction) this.unit.body.drag.set(friction);
	if (mass) this.unit.body.mass = mass;
	if (bounce) this.unit.body.bounce.setTo(bounce, bounce);
	//this.unit.body.maxVelocity.set(1000);

	this.lastSeenPosition = { x: x, y: y };
	this.lastPosition = { x: x, y: y };//for the animation
	this.timer = 0;
	this.coneOfVision = coneOfVision*Math.PI/180;
	this.sawPlayer= false;
};


Sentry.prototype.update = function(){

};




var HostileDrone =  function(index, game, cachedSpriteName,type, startX, startY, hasPhysics, scale, alpha, conscious, lineOfSight, coneOfVision, mass, friction, bounce){
	var x = startX;
	var y = startY;
	this.game = game;
	if (conscious) this.conscious = true;
	this.unit = {};
	this.alive = true;
	this.index = index;
	this.unit = game.add.sprite(x, y, 'drone');
	 this.unit.scale.setTo(scale, scale);
		this.unit.alpha = alpha;

	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)


	if(hasPhysics){
		game.physics.enable(this.unit, Phaser.Physics.ARCADE);
		
		this.unit.anchor.setTo(0.5, 0.5);
		this.unit.name = index.toString();
		this.unit.angle = game.rnd.angle();

		this.unit.body.immovable = false;
		this.unit.body.allowGravity = false;
		this.unit.body.collideWorldBounds = true;
		if (friction) this.unit.body.drag.set(friction);
		if (mass) this.unit.body.mass = mass;
		if (bounce) this.unit.body.bounce.setTo(bounce, bounce);

		this.lastPosition = { x: x, y: y };//for the animation
		this.timer = 0;
		this.alertTimer = 0;
		this.coneOfVision = difficulty.enemyStats.fieldOfVision*Math.PI/180;
		this.sightRange = difficulty.enemyStats.sightRange;

		this.seesPlayer = false;
		this.hasBeenAlerted = false;
		this.aknowladgedPlayer = false;
		//this.ghost = new Phaser.Rectangle(player.player.body.x,player.player.body.y,player.player.width,player.player.height);
		this.ghost = new Player(0, game, 'player', player.player.body.x,
		player.player.body.y, null,false, 0.2);
		this.patrol = new Unit(0,game,'drone','drone',x,y,false,0.4,0.3);
	}
};


HostileDrone.prototype.chase = function(object){
	//this.lastSeenPosition.x = object.body.x;
	//this.lastSeenPosition.y = object.body.y;
	//this.ghost.x = object.body.x;
	//this.ghost.y = object.body.y;
	this.ghost.player.reset(object.body.x,object.body.y);
	//game.physics.arcade.moveToXY(this.unit,object.body.x,object.body.y, difficulty.enemyStats.speed);
};

HostileDrone.prototype.goTo = function(x,y){
	this.unit.rotation = game.physics.arcade.angleToXY(this.unit, x,y);
	game.physics.arcade.moveToXY(this.unit, x, y, difficulty.enemyStats.speed);
};


HostileDrone.prototype.update = function(){
	tileHits = getReycastToObject(this.unit, player.player);
	hasSeenPlayer(tileHits, this, game);

	
	game.physics.arcade.collide(this.unit,layer);
	game.physics.arcade.collide(this.unit,drones[0].drone);
	game.physics.arcade.collide(this.unit,player.player,hasDied);
	for (var i = 0; worldItems.length > i; i++){
		game.physics.arcade.collide(this.unit,worldItems[i].item);

	}




	if (this.sightRange > game.physics.arcade.distanceBetween(this.unit,player.player) &&  Math.abs(game.physics.arcade.angleBetween(player.player, this.unit)) - Math.abs(this.unit.rotation) < this.coneOfVision ){
		if(timeOut(this,difficulty.enemyStats.reaction,"timer")){
			if (!this.hasBeenAlerted){
				alertedEnemies++;
				this.hasBeenAlerted = true;
			}
			this.chase(player.player);
			this.aknowladgedPlayer = true;
			this.patrol.type.unit.reset(this.unit.body.x,this.unit.body.y);

			this.timer = 0;

		}
	}
	//repeating
	if(this.aknowladgedPlayer)
	{
		this.goTo(this.ghost.player.x,this.ghost.player.y);
		if (getOverlap(this.unit,this.ghost.player)){
			console.log("reached");
			if(timeOut(this,2000,"alertTimer")){
				console.log("returnning");
				this.aknowladgedPlayer = false;
				this.alertTimer = 0;

			}
		}
	}
	else if(!this.aknowladgedPlayer){
		if(getOverlap(this.unit, this.patrol.type.unit)){
			
		}
		else{this.goTo(this.patrol.type.unit.x,this.patrol.type.unit.y);}
	}

};


function getReycastToObject(object1,object2){
	rayCastLine.start.set(object1.body.x+object1.width/2, object1.body.y+object1.height/2);
	rayCastLine.end.set(object2.body.x+object2.width/2, object2.body.y+object2.height/2);
	tileHits = layer.getRayCastTiles(rayCastLine, 4, true, false);
	return tileHits;
}


function hasSeenPlayer(tileHits, object, game)
{
	if (!tileHits[0])
	{
		if (object.timer === 0)
		{
			object.timer = game.time.now + difficulty.enemyStats.reaction;
		}
		this.seesPlayer = true;
	}
	else if (tileHits[0])
	{
		object.timer = 0;
	}
}


function timeOut(object,time,timer){
	if(object[timer] === 0){
			object[timer] = game.time.now + difficulty.enemyStats.reaction;
	}

	else if (object[timer] !== 0 && game.time.now > object[timer]+time)
	{
		return true;
	}
	return false;
}

function getOverlap(body1,body2){
	var bounds1 = body1.getBounds();
	var bounds2 = body2.getBounds();
	//console.log(Phaser.Rectangle.intersects(bounds1, bounds2));
	return Phaser.Rectangle.intersects(bounds1, bounds2);
}
