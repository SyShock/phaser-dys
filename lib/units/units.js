var Unit = function (index, game, cachedSpriteName,type, startX, startY, scale, hasPhysics, conscious, lineOfSight, coneOfVision, mass, friction, bounce){
	this.type = type;
	if(type === "drone")
		this.type = new HostileDrone(index, game, cachedSpriteName,type, startX, startY, hasPhysics, scale, conscious, lineOfSight, coneOfVision , mass, friction, bounce);
	else if(type === "officer")
		this.type = new Officer(index, game, cachedSpriteName,type, startX, startY, scale, conscious, lineOfSight , mass, friction, bounce);
	else if(type === "sentry")
		this.type = new Sentry(index, game, cachedSpriteName,type, startX, startY, scale, conscious, lineOfSight , mass, friction, bounce);



	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)
	// if (appendFunction) obj.activate = appendFunction(); //glue external function to namespace
};


Unit.prototype.update = function() {
	tileHits = getReycastToObject(this.type.unit, player);
	hasSeenPlayer(tileHits, this.type,game);

	this.type.update();
};




function  getReycastToObject(object1,object2){
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
			object.lastSeenPosition ={
				x: player.body.x,
				y: player.body.y
			};

		}
		playerStats.isSeen = true;
		//this.hasSeenPlayer = true;

	}
	else if (tileHits[0])
	{
		playerStats.isSeen = false;
		object.timer = 0;
	}
}


function alertTimeOut(){
}


function timeOut(game,time,object){
	if (object.timer !== 0 && game.time.now > object.timer+time)
	{
		return true;
	}
	return false;
}

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

	this.lastSeenPosition = { x: x, y: y };
	this.lastPosition = { x: x, y: y };//for the animation
	this.timer = 0;
	this.coneOfVision = difficulty.enemyStats.fieldOfVision*Math.PI/180;
};

Officer.prototype.update = function(){
	game.physics.arcade.collide(this.unit,layer);
	game.physics.arcade.collide(this.unit,drone2[0].drone);
	game.physics.arcade.collide(this.unit,player,hasDied);
	if (Math.abs(game.physics.arcade.angleBetween(player, this.unit)) - Math.abs(this.unit.rotation) < this.coneOfVision){
		if(timeOut(game,difficulty.enemyStats.reaction,this)){
		}
	}
};

Officer.prototype.fire = function(object){

};

Officer.prototype.callBackUp = function(){

};

Officer.prototype.goTo = function(x,y){
	game.physics.arcade.moveToXY(this.unit, x, y, difficulty.enemyStats.speed);
};

Officer.prototype.patrolTo = function(x, y, delay){

};

Officer.prototype.searchFor = function(){
	this.unit.rotation = Math.rnd(1,4);
};



var Sentry =  function(index, game, cachedSpriteName,type, startX, startY, scale, conscious, lineOfSight, coneOfVision){
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




var HostileDrone =  function(index, game, cachedSpriteName,type, startX, startY, hasPhysics, scale, conscious, lineOfSight, coneOfVision, mass, friction, bounce){
	var x = startX;
	var y = startY;
	this.game = game;
	if (conscious) this.conscious = true;
	this.unit = {};
	this.alive = true;
	this.unit = game.add.sprite(x, y, cachedSpriteName);

	// this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
	// this.player.animations.add('stop', [3], 20, true)

	this.unit.scale.setTo(scale, scale);

	if(hasPhysics){
		game.physics.enable(this.unit, Phaser.Physics.ARCADE);
		
	this.unit.anchor.setTo(0.5, 0.5);
	this.unit.name = index.toString();
		this.unit.angle = game.rnd.angle();

		this.unit.body.immovable = false;
		this.unit.body.collideWorldBounds = true;
		if (friction) this.unit.body.drag.set(friction);
		if (mass) this.unit.body.mass = mass;
		if (bounce) this.unit.body.bounce.setTo(bounce, bounce);

		this.lastSeenPosition = { x: x, y: y };
		this.lastPosition = { x: x, y: y };//for the animation
		this.timer = 0;
		this.coneOfVision = difficulty.enemyStats.fieldOfVision*Math.PI/180;
		this.sightRange = difficulty.enemyStats.sightRange;
		this.sawPlayer = false;
	}
};


HostileDrone.prototype.chase = function(object){
	this.unit.rotation = game.physics.arcade.angleBetween(object, this.unit);
	this.lastSeenPosition.x = object.body.x;
	this.lastSeenPosition.y = object.body.y;
	game.physics.arcade.moveToXY(this.unit,object.body.x,object.body.y, difficulty.enemyStats.speed);
};

HostileDrone.prototype.goTo = function(x,y){
	//this.unit.rotation = game.physics.arcade.angleBetween(object, this.unit);
	game.physics.arcade.moveToXY(this.unit, x, y, difficulty.enemyStats.speed);
};


HostileDrone.prototype.update = function(){
	game.physics.arcade.collide(this.unit,layer);
	game.physics.arcade.collide(this.unit,drone2[0].drone);
	game.physics.arcade.collide(this.unit,player,hasDied);
	if (this.sightRange > game.physics.arcade.distanceBetween(this.unit,player) &&  Math.abs(game.physics.arcade.angleBetween(player, this.unit)) - Math.abs(this.unit.rotation) < this.coneOfVision ){
		if(timeOut(game,difficulty.enemyStats.reaction,this)){
			this.chase(player);
			this.sawPlayer = true;
		}
	}
	if(this.sawPlayer)
	{
		this.goTo(this.lastSeenPosition.x,this.lastSeenPosition.y);
	}

};
