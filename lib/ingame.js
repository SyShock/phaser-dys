displayOptions ("");
gameMenu();





var menuShown = false;
function displayMainMenu() {
	if (!menuShown){
		displayOptions("menu");
		menuShown = true;
	}
	else{
		displayOptions("");
		menuShown = false;
	}
}

function startLine(pointer) {
	if(grapple.isReturned && player.alive){
		if (tileHits.length > 0)
		{
			for (var i = 0; i < tileHits.length; i++)
			{
			}

			layer.dirty = true;
		}

		line.start.set(player.body.x + player.width/2, player.body.y + player.height/2);

		plotting = true;

	}
}

function raycast(pointer) {

	if (grapple.isReturned){
		tileHits = layer.getRayCastTiles(line, 4, true, false);

		if (tileHits.length > 0)
		{
			//  Just so we can visually see the tiles
			for (var i = 0; i < tileHits.length; i++)
			{
			//	game.add.text(tileHits[i].x);
				//tileHits[i].debug = true;
			}

			layer.dirty = true;
		}

		plotting = false;
	}
}







function hasDied() {
	player.kill();
	if (grappleHooks)
	{
		killGrapple();
	line.start.set();
	line.end.set();
	}
}





var saveObject = {
	level: 5,
	highScore: 3742
};

localStorage.setItem("save", JSON.stringify(saveObject));

var Hello;
var working = true;

var debugMode;
var debugInfo;
var debugKeys;
var debugStates;
var debugGameState;


var map;
var layer;
var layerCollision;


var line;
var ropeLine;

var rayCastLine;

var unit;
var enemyUnits = [];
var worldItems = [];

var item;

var tileHits = [];
var plotting = false;

var grappleHook;
var grappleHooks;

var grapple = {
	throwSpeed: 800,
	pullSpeed: 800,
	reload: 100,
	length: 500,
	isCanceled: true,
	isReturned: true,
	isReturning: false,
	isReached: false,
};
var players = [];
var player;
var playerStats = {
	jump: 250,
	left: false,
	right: false,
	grappleMode: false,
	isSeen: false,
};

var worldGravity = 500;
var savefile;

var whatever;
var drone2 = [];

/*
 *=============================================================================================================================================================
 *	
 * World Objects
 *
 *=============================================================================================================================================================
 */

//set an object to be player
playe = function (obj,cachedSprite){
	obj.scale.setTo(0.3, 0.3);
	obj.anchor.set(0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	obj.body.drag.set(300);
	obj.body.maxVelocity.set(1000);
	obj.body.mass = 1;

	obj.moveLeft = function (){
		player.body.acceleration.x = -200;
	};

	obj.jump = function (){
		if(player.body.touching.down || player.body.onFloor()){
			player.body.velocity.y = -(playerStats.jump);
		}
	};

	obj.moveRight = function () {
		player.body.acceleration.x = 200;
	};

	return obj;
};





function Grapple(){

	grappleHook = game.add.group();
	grappleHook.enableBody = true;

	grappleHook.physicsBodyType = Phaser.Physics.ARCADE;
	grappleHook.allowGravity = false;

	grappleHook.createMultiple(2, 'grappleHook');
	grappleHook.setAll('anchor.x', 0.5);
	grappleHook.setAll('anchor.y', 0.5);

}

function fireGrapple () {

	if (grapple.isReturned && player.alive) //coditions to fire
	{
		line.start.set();
		line.end.set();
		grappleHooks = grappleHook.getFirstDead(); // gets the nonexisten/dead sprite
		if(grappleHooks){
			grappleHooks.scale.setTo(0.5,0.5);
			grapple.isReturned = false;
			grapple.isReturning = false;
			grapple.isReached = false;

			grappleHooks.reset(player.body.x + player.body.width/2, player.body.y + player.body.height/2);
			grappleHooks.body.allowGravity = false;
			grappleHooks.rotation = game.physics.arcade.angleToPointer(grappleHooks);

			game.physics.arcade.moveToXY(grappleHooks, game.input.activePointer.worldX, game.input.activePointer.worldY, grapple.throwSpeed + (Math.abs(player.body.velocity.x) + player.body.velocity.y)/2);

		}
	}

}

function pull (body1,body2){
	if (true){ //compares mass and speed of what pulls what is detemined by mass difference
		body1.body.velocity.set(0);
		game.physics.arcade.moveToXY(player, body2.worldX, body2.worldY, grapple.pullSpeed);
		player.body.allowGravity = false;
		grapple.isCanceled = false;
		grapple.isReached = true;
	}


}

function cancelGrapple(){
	if (grapple.isReached){
		player.body.allowGravity = true;	
		player.body.acceleration.set(0);
		grapple.isCanceled = true;
		playerStats.grappleMode=false;

		returnGrapple();
	}

}


function returnGrapple(){
	grapple.isReturning = true;
}

function killGrapple(){
	grapple.isReturning = false;
	grapple.isReturned = true;
	grappleHooks.kill();

	ropeLine.start.set();
	ropeLine.end.set();
}


//remove with animation
function Door() {

}

function restart()
{
	game.state.start('inGame');
}

var winning;
var levelCleared;
	
function scoreBoard()
{
	levelCleared = true;
	timeScore = new Phaser.Rectangle(0, 550, 800, 50);
	pointsScore = new Phaser.Rectangle(1, 550, 800, 50);
	var timeDifference =  (game.time.now - stageCallTime)/1000;
	winning = 
	{	0: game.add.text(100,100,"Level Cleared!"),
		1: game.add.text(game.width - game.width/2, game.height - game.height/1.5,"Time taken: " + timeDifference, {fill: "#ffffff", backgroundColor: "#000000", wordWrap: true, wordWrapWidth: 1000, align: "center",})
	};
}

line = new Phaser.Line();
ropeLine = new Phaser.Line();
rayCastLine = new Phaser.Line();


var stageCallTime;

/*
 *=============================================================================================================================================================
 *	
 *  World Load
 *
 *=============================================================================================================================================================
 */

var inGame = {

	preload: function() {
		working=false;
		game.load.tilemap('map', null, maps, Phaser.Tilemap.TILED_JSON);
		game.load.json('mapstuff', 'assets/maps/collision_test.json');
		game.load.image('ground_1x1', 'assets/img/tiles/ground_1x1.png');
		game.load.image('player', 'assets/img/player.png');
		game.load.image('grappleHook', 'assets/img/whiteArrow.png');
		game.load.json('keys','saves/saveslot1.json');
		game.load.json('savefile', './saves/saveslot1.json');


		game.load.spritesheet('buttonvertical', 'assets/img/button-vertical.png',64,64);
		game.load.spritesheet('buttonhorizontal', 'assets/img/button-horizontal.png',96,64);
		game.load.spritesheet('buttondiagonal', 'assets/img/button-diagonal.png',64,64);
		game.load.spritesheet('buttonfire', 'assets/img/button-round-a.png',96,96);
		game.load.spritesheet('buttonjump', 'assets/img/button-round-b.png',96,96);

	},

	create: function () {
		stageCallTime = game.time.now;
		levelCleared = false;
		if (!difficulty)
			difficulty = normal;
		player = null;
		grappleHook = [];
		grappleHooks = null;
		worldItems = [];
		enemyUnits = [];
		drone2 = [];
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
		var savefile = game.cache.getJSON("savefile");


		// Map
		map = game.add.tilemap('map');
		map.addTilesetImage('ground_1x1');

		layer = map.createLayer('Tile Layer 1');
		layerCollision = map.createLayer('collision');
		layer.resizeWorld();

		map.setCollisionBetween(1, 12);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = worldGravity;


		mapstuff = game.cache.getJSON("mapstuff", true);

		player = game.add.sprite(mapstuff.player[0].position.x, mapstuff.player[0].position.y, 'player');    
		playe(player,"player");

		player.checkWorldBounds = true;
		player.events.onOutOfBounds.add(scoreBoard, this);


		//for (var i = 0; i<1; i++)
		//players.push(Player(0,game,"player",mapstuff.player[0].position.x, mapstuff.player[0].position.y,normal.playerStats,true,0.1,10,100,1));
		//	grapplehook
		Grapple();


		drone2.push(new Drone(0,game,"player", 200,200,difficulty.droneStats,true));

		for (var i = 0; i < mapstuff.enemies.length; i++) {
			enemyUnits.push(new Unit(i,game,"player",mapstuff.enemies[i].type,mapstuff.enemies[i].position.x,mapstuff.enemies[i].position.y,0.3,1,difficulty.enemyStats.sightRange,difficulty.enemyStats.fieldOfVision));
		}

		for (var i = 0; i < mapstuff.items.length; i++){
			worldItems.push(new Items(i,game,"player", mapstuff.items[i].position.x,mapstuff.items[i].position.y,true,0.1,1,1,10,0.8));
		} 

		game.camera.follow(player);
		setKeys();
		//virtualButtons();




		grapple = {
			throwSpeed: 800,
			pullSpeed: 800,
			reload: 100,
			length: 500,
			isCanceled: true,
			isReturned: true,
			isReturning: false,
			isReached: false,
		};
		playerStats = {
			jump: 250,
			left: false,
			right: false,
			grappleMode: false,
			isSeen: false,
		};


		droneStats = {
			speed: 200,
			pullVelocity: 500,
			haltmode: false,
			following: true,
		};

		worldGravity = 500;

		working=true;



	},


	/*
	 *=============================================================================================================================================================
	 *	
	 * Per frame
	 *
	 *=============================================================================================================================================================
	 */

	update: function() 
	{
		if(working)
		{


			if (plotting)
			{
				line.start.set(player.body.x, player.body.y);
				line.end.set(game.input.activePointer.worldX, game.input.activePointer.worldY);
				layer.dirty = false;
			}
			else if (!grapple.isReturned)
			{
				ropeLine.start.set(player.body.x + player.body.width/2, player.body.y + player.body.height/2);
				ropeLine.end.set(grappleHooks.body.x + grappleHooks.width/2, grappleHooks.body.y + grappleHooks.height/2);
			}



			if(game.physics.arcade.collide(player, layer))
			{
			}

			if (grappleHooks && !grapple.isReturning)
			{
				if (game.physics.arcade.collide(grappleHook, layer, pull))
				{
					grapple.isReached = true;
					game.physics.arcade.moveToObject(player, grappleHooks, grapple.pullSpeed);

				} 
				else if(game.physics.arcade.distanceBetween(player, grappleHooks) > grapple.length)
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
				game.physics.arcade.overlap(grappleHook, player, killGrapple);

			}

			if(grapple.isReached && !grapple.isReturned && !grapple.isReturning)
			{
				game.physics.arcade.moveToObject(player, grappleHooks, grapple.pullSpeed);
			}



			if (A.isDown || playerStats.left)
			{
				if(player.body.touching.down || player.body.onFloor()){
					player.moveLeft();
				}
			}
			else if (D.isDown || playerStats.right)
			{
				if(player.body.touching.down || player.body.onFloor()){
					player.moveRight();
				}
			}



			if (game.physics.arcade.overlap(grappleHook, player) && grapple.isReached)
			{
				player.body.velocity.set(0);
				player.body.allowGravity = false;
			}

			if (SHIFT.isDown)
			{
				drone2[0].followCursor();
			}
			else
			{
				if(drone2[0])
					drone2[0].follow(player);
			}

			//for (var i = 



			//for (var i = 


			for (var i = worldItems.length - 1; i >= 0; i--)
			{
				worldItems[i].update();
				for (var j = worldItems.length - 1; j >= 0; j--) 
				{
					game.physics.arcade.collide(worldItems[i].item,worldItems[j].item);
				}
			}

			for (var i = drone2.length - 1; i >= 0; i--) 
			{
				drone2[i].update();
			}


			for (var i = enemyUnits.length - 1; i >= 0; i--)
			{
				enemyUnits[i].update();
				for (var j = enemyUnits.length - 1; j >= 0; j--)
				{
					game.physics.arcade.collide(enemyUnits[j].type.unit, enemyUnits[i].type.unit);
				}
			}

			if(!player.alive)
			{

				game.add.text(100,100,"You got wasted", {backGround:"#ffffff",fill:"#000000"});

			}
		//	game.scale.setGameSize(window.innerWidth, window.innerHeight);
		}
	},



	/*
	 *=============================================================================================================================================================
	 *	
	 * For Debug Text, I dunno what else...
	 *
	 *=============================================================================================================================================================
	 */



	render: function() 
	{



		setDebugValues();	
		displayDebugText();

		game.debug.geom(line);
		game.debug.geom(ropeLine);
		}
};

game.state.add('inGame',inGame);
	game.state.start('inGame');
