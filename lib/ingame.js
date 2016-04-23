/*
*
*
* AI - sight , movingTo, callBackup\
* 	raycasts to player
* 	sign cone
*
*
*	TODO: clear lines
*	TODO: center line on hook
*	TODO: github page
*
* 	TODO: rope sprite, instead of line
* 	TODO: drone
* 	
* 	
* 
*/


displayOptions ("");

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


var worldGravity = 500;


/*
*=============================================================================================================================================================
*	
* World Objects
*
*=============================================================================================================================================================
*/


function Player(objectName){

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

function Drone(objectName){

}


function Unit(objectName) {
	// body...
}
Unit.prototype.fire = function(first_argument) {
	// body...
};
Unit.prototype.callBackup = function(first_argument) {
	// body...
};



function setKeys(){

	W = game.input.keyboard.addKey(Phaser.Keyboard.W);
	W.onDown.add(jump, this);

	A = game.input.keyboard.addKey(Phaser.Keyboard.A);
	// A.onDown.add(moveLeft, this);

	S = game.input.keyboard.addKey(Phaser.Keyboard.S);
	S.onDown.add(cancelGrapple, this);

	D = game.input.keyboard.addKey(Phaser.Keyboard.D);
	// D.onDown.add(moveRight, this);

	ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	ESC.onDown.add(displayMainMenu, this);


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
    player = game.add.sprite(200, 70, 'player');
    player.scale.setTo(0.1, 0.1);
    player.anchor.set(0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.drag.set(100);
    player.body.maxVelocity.set(1000);
    player.body.mass = 1;


    //	grapplehook
    grappleHook = game.add.group();
    grappleHook.enableBody = true;
    grappleHook.physicsBodyType = Phaser.Physics.ARCADE;
    grappleHook.allowGravity = false;

    // grappleHook.scale.setTo(0.1,0./1);
    grappleHook.createMultiple(2, 'grappleHook');
    grappleHook.setAll('anchor.x', 0.5);
    grappleHook.setAll('anchor.y', 0.5);


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

        	grappleHooks.reset(player.body.x + player.width/2, player.body.y + player.height/2);
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
		// game.physics.arcade.overlap(grappleHooks, layer, cancelGrapple);

		ropeLine.start.set(player.body.x, player.body.y);
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



	if (game.physics.arcade.overlap(grappleHook, player)){
		player.body.velocity.set(0);
		player.body.allowGravity = false;
	}


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
	"Wall: " + player.body.onWall() ;

	game.debug.text(debugInfo ,100,10);


	game.debug.geom(line);
	game.debug.geom(ropeLine);
}


