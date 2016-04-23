/*
*
*
* AI - sight , movingTo, callBackup\
* 	raycasts to player
* 	sign cone
*
*
*	TODO: clear lines (done)
*	TODO: center line on hook (done)
*	TODO: github page (done)
* 	
*  	TODO: settings json
* 	TODO: map, event json, start points, end points, spawn points
* 	
* 	TODO: player health and falldamage
* 	TODO: pressure plates, keycards, terminals, misc
* 	TODO: doors, traps
* 	
* 	TODO: Enemy Units - health
*
* 	TODO: rope sprite, instead of line
* 	TODO: drone - moveToXY, SHIFT.onDown - moveToPointer - collision, gravity beam, shock prod
*  	TODO: Restart button
*  	TODO: RESET - restart gamestate
*  	TODO: QUIT - add button quit to menu release game object, unlink ingame.js
*
* 
* 	FIXME: shooting through walls - hook sprite small and/or player sprite large , collide with player (partially)
* 	FIXME: falling through world bounds - collideWorldBounds - player.kill() ()
* 	FIXME: game reset
* 	
* 
*/


displayOptions ("");
gameMenu();



var keys = {
	up: 87,
	down: 83,
	left: 65,
	right: 68,
	volumeUp: 187,
	volumeDown: 189,
};

var saveObject = {
	level: 5,
	highScore: 3742
};

localStorage.setItem("save", JSON.stringify(saveObject));

var game = new Phaser.Game(window.innerWidth/1.5, window.innerHeight/1.5, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


/*
*============================================================================================================================================================================
*
* Preload resources
* 
*============================================================================================================================================================================
*/

function preload() {
	// game.load.baseURL = 'http://examples.phaser.io/';
	// game.load.crossOrigin = 'anonymous';
	game.load.tilemap('map', 'maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('ground_1x1', 'img/tiles/ground_1x1.png');
	game.load.image('player', 'img/player.png');
	game.load.image('grappleHook', 'img/whiteArrow.png');
	game.load.json('keys','saves/saveslot1.json');
	game.load.json('savefile', './saves/saveslot1.json');


}

/*
*============================================================================================================================================================================
*
* Global Objects
* 
*============================================================================================================================================================================
*/

var map;
var layer;
var layerCollision;

var cursors;
var player;

var line;
var ropeLine;

var tileHits = [];
var plotting = false;

var grappleHook;
var grappleHooks;

var grapple = {
	speed: 1000,
	reload: 100,
	isCanceled: true,
	isReturned: true,
	isReturning: false,
	isReached: false,
};

var playerFlags = {

};


var drone;

var droneStats = {
	speed: 200,
};

var worldGravity = 500;
var savefile;


/*
*=============================================================================================================================================================
*	
* World Objects
*
*=============================================================================================================================================================
*/




function Player(){

	player = game.add.sprite(200, 70, 'player');
	player.scale.setTo(0.3, 0.3);
	player.anchor.set(0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.drag.set(100);
	player.body.maxVelocity.set(1000);
	player.body.mass = 1;
	player.events.onOutOfBounds.add(hasDied, this);
}

function moveLeft(){
	player.body.acceleration.x = -200;
}

function jump(){
	if(player.body.onFloor()){
		player.body.velocity.y = -200;
	}
}


function moveRight() {
	player.body.acceleration.x = 200;
}


function Grapple(){

	grappleHook = game.add.group();
	grappleHook.enableBody = true;
	grappleHook.physicsBodyType = Phaser.Physics.ARCADE;
	grappleHook.allowGravity = false;

    // grappleHook.scale.setTo(0.1,0./1);
    grappleHook.createMultiple(2, 'grappleHook');
    grappleHook.setAll('anchor.x', 0.5);
    grappleHook.setAll('anchor.y', 0.5);

}



function Drone(){

	drone = game.add.sprite(200, 70, 'player');
	drone.scale.setTo(0.1, 0.1);
	drone.anchor.set(0.5);
	game.physics.enable(drone, Phaser.Physics.ARCADE);
	drone.body.drag.set(100);
	drone.body.maxVelocity.set(1000);
	drone.body.mass = 1;
	drone.events.onOutOfBounds.add(hasDied, this);

}

function follow(){

	game.physics.arcade.moveToXY(drone, player.body.x + 16, player.body.y + 16, droneStats.speed, 500);
	game.camera.follow(player);


}

function followCursor(){

	game.physics.arcade.moveToXY(drone, game.input.activePointer.worldX, game.input.activePointer.worldY, droneStats.speed, 500);
	game.camera.follow(drone);

}

Drone.prototype.update = function (){

};


function Door(argument) {
	// body...
}




function Unit() {
	// body...
}
Unit.prototype.fire = function(first_argument) {
	// body...
};
Unit.prototype.callBackup = function(first_argument) {
	// body...
};



function setKeys(){

	W = game.input.keyboard.addKey(keys.up);
	W.onDown.add(jump, this);

	A = game.input.keyboard.addKey(keys.left);
	// A.onDown.add(moveLeft, this);

	S = game.input.keyboard.addKey(keys.down);
	S.onDown.add(cancelGrapple, this);

	D = game.input.keyboard.addKey(keys.right);
	// D.onDown.add(moveRight, this);

	ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	ESC.onDown.add(displayMainMenu, this);

	SHIFT = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	// SHIFT.onDown.add(followCursor, this);

	volUp = game.input.keyboard.addKey(keys.volumeUp);
	volUp.onDown.add(setVolumeUp, this);
	volDown = game.input.keyboard.addKey(keys.volumeDown);
	volDown.onDown.add(setVolumeDown, this);

	cursors = game.input.keyboard.createCursorKeys();
	game.input.onDown.add(startLine, this);
	game.input.onUp.add(raycast, this);


}


/*
*=============================================================================================================================================================
*	
*  World Load
*
*=============================================================================================================================================================
*/

function create() {

	var savefile = game.cache.getJSON("savefile");



	setKeys();

	line = new Phaser.Line();
	ropeLine = new Phaser.Line();

	// Map
	map = game.add.tilemap('map');
	map.addTilesetImage('ground_1x1');


	layer = map.createLayer('Tile Layer 1');
	layerCollision = map.createLayer('collision');
	layer.resizeWorld();
	layer.debug = true;

	map.setCollisionBetween(1, 12);
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = worldGravity;


    //  player settings
    Player();

    //	grapplehook
    Grapple();


    // drone
    Drone();

    game.camera.follow(player);



}

/*
*=============================================================================================================================================================
*	
* Global Functions
*
*=============================================================================================================================================================
*/

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
	if(grapple.isReturned){
		if (tileHits.length > 0)
		{
			for (var i = 0; i < tileHits.length; i++)
			{
				tileHits[i].debug = false;
			}

			layer.dirty = true;
		}

		line.start.set(player.body.x, player.body.y);

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
        	game.add.text(tileHits[i].x);
        	tileHits[i].debug = true;
        }

        layer.dirty = true;
    }

    plotting = false;   
    fireGrapple(); 
}
}

function fireGrapple () {

	if (grapple.isReturned) //coditions to fire
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

        	game.physics.arcade.moveToXY(grappleHooks, game.input.activePointer.worldX, game.input.activePointer.worldY, grapple.speed);

        }
    }

}

function pull (body1,body2){
	if (true){ //compares mass and speed of what pulls what is detemined by mass difference
		body1.body.velocity.set(0);
		game.physics.arcade.moveToXY(player, body2.worldX, body2.worldY, grapple.speed*player.body.mass);
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



function hasDied() {
	player.kill();
}


function outOfWorld(sprite){
	if (sprite.x < 0)
	{
        // sprite.x = game.width;
        sprite.kill();
    }
    else if (sprite.x > game.width)
    {
        // sprite.x = 0;
        sprite.kill();
    }

    if (sprite.y < 0)
    {
        // sprite.y = game.height;
        sprite.kill();
    }
    else if (sprite.y > game.height)
    {
        // sprite.y = 0;
        sprite.kill();
    }

}


/*
*=============================================================================================================================================================
*	
* Per frame
*
*=============================================================================================================================================================
*/

function update() {


	if (plotting){
		line.start.set(player.body.x, player.body.y);
		line.end.set(game.input.activePointer.worldX, game.input.activePointer.worldY);
		layer.dirty = false;
	}
	else if (!grapple.isReturned){
		// game.physics.arcade.overlap(grappleHooks, layer, killGrapple());

		ropeLine.start.set(player.body.x + player.body.width/2, player.body.y + player.body.height/2);
		ropeLine.end.set(grappleHooks.body.x + grappleHook.width/2, grappleHooks.body.y + grappleHook.height/2);
	}



	if(game.physics.arcade.collide(player, layer)){
	}

	if (grappleHook && !grapple.isReturning){
		if (game.physics.arcade.collide(grappleHook, layer, pull)){
			grapple.isReached = true;
			game.physics.arcade.moveToObject(player, grappleHooks, grapple.speed);

		} 
	} 

	player.body.acceleration.set(0);

	if(grapple.isReturning){
		game.physics.arcade.moveToObject(grappleHooks, player, grapple.speed);
		game.physics.arcade.overlap(grappleHook, player, killGrapple);

	}

	if(grapple.isReached && !grapple.isReturned && !grapple.isReturning){
		game.physics.arcade.moveToObject(player, grappleHooks, grapple.speed);
	}


	if (A.isDown)
	{
		player.body.acceleration.x = -200;
	}

	else if (D.isDown)
	{
		player.body.acceleration.x = 200;
	}



	if (game.physics.arcade.overlap(grappleHook, player) && grapple.isReached){
		player.body.velocity.set(0);
		player.body.allowGravity = false;
	}

	if (SHIFT.isDown){
		followCursor();
	}
	else {
		follow();
	}

	game.physics.arcade.collide(drone, layer);
}



/*
*=============================================================================================================================================================
*	
* For Debug Text, I dunno what else...
*
*=============================================================================================================================================================
*/

function render() {

	//Debug
	
	var debugInfo =
	grapple.isCanceled + " | " +
	grapple.isReached + " | " +
	(!grapple.isReached && !grapple.isCanceled) + " | " +
	player.body.mass + "\n" + 
	"Ground: " + player.body.onFloor() + " | " +
	"Wall: " + player.body.onWall() +
	" Shift pressed: " + SHIFT.isDown;
	game.debug.text(" Game state: " + game.state.current, 100,40);
	game.debug.text(" JSON: " + savefile, 100,60);

	game.debug.text(debugInfo ,100,20);


	game.debug.geom(line);
	game.debug.geom(ropeLine);
}


