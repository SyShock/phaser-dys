/* 
 * Unlockables hook
 * Rescale map, to a pixelated and small
 * Zoom out in editor
 *
 * Mike remains a sqaure? Different enemies different oolor? It's simple, I like it!
 * Add a dark tint to it.
 * Pressure plates and levers to tiles that are removed.
 *
 * Objects for the pressure plates (done)
 * pressure plates
 * levers and keycards
 * Fix hook fluency
 * dynamic reoad unload bok on every state creation
 *
 * drone force field
 * drone pull
 * drone stun
 * */

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

var enemyUnits = [];
var worldItems = [];


var tileHits = [];
var plotting = false;


var grapple = {};
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

var drones = [];
var timesDead = 0;


var alertedEnemies = 0;
var score = 0;
var stageCallTime;

var winning;
var levelCleared;
var working;


var bounded;


/*
 *=============================================================================================================================================================
 *	
 * Global Functions
 *
 *=============================================================================================================================================================
 */

function hasDied() {
	player.player.kill();
	if (grapple)
	{
		grapple.killGrapple();
		line.start.set();
		line.end.set();
	}
	drones[0].drone.kill();
	working = false;
	game.paused = true;
}

//remove with animation
function Door() {

}

function restart()
{
	game.paused = false;
	game.state.start('inGame');
}

function scoreBoard()
{
	var timeDifference =  (game.time.now - stageCallTime)/1000;
	tmp  = document.getElementById('difficulty').value;
	if(tmp === 'normal')
		score = 100000 - ((1000*timeDifference + alertedEnemies*5000) + timesDead*3500);
	if(tmp === 'hard')
		score = (100000 - ((1000*timeDifference + alertedEnemies*5000) + timesDead*3500))*2;
	if(tmp === 'realistic')
		score = (100000 - ((1000*timeDifference + alertedEnemies*5000) + timesDead*3500))*3;
	if(tmp === 'dystopia')
		score = (100000 - ((1000*timeDifference + alertedEnemies*5000) + timesDead*3500))*4;
	if(score > settings.score){
		settings.score = score;
	}
	game.add.text(game.width - game.width/2, game.height - game.height/2,"Success!\nLevel Cleared!\nTime taken: " + timeDifference + 
			"\nAlerted enemies: " + alertedEnemies + "\nScore: " + score, {fill: "#ffffff", backgroundColor: "#000000", wordWrap: true, wordWrapWidth: 1000, align: "center",});
}


line = new Phaser.Line();
ropeLine = new Phaser.Line();
rayCastLine = new Phaser.Line();


var worldScale = 1;

/*
 *=============================================================================================================================================================
 *	
 *  World Load
 *
 *=============================================================================================================================================================
 */

var turned = false;

var inGame = {

	preload: function() {
		game.load.tilemap('map', null, maps, Phaser.Tilemap.TILED_JSON);
		game.load.image('ground_1x1', 'assets/img/tiles/ground_1x1.png');
		game.load.image('player', 'assets/img/player.png');
		game.load.image('drone', 'assets/img/drone.png');
		game.load.image('ball', 'assets/img/ball.png');
		game.load.image('grappleHook', 'assets/img/whiteArrow.png');
		game.load.json('savefile', './saves/saveslot1.json');
		game.load.crossOrigin = 'anonymous';


		game.load.spritesheet('buttonvertical', 'assets/img/button-vertical.png',64,64);
		game.load.spritesheet('buttonhorizontal', 'assets/img/button-horizontal.png',96,64);
		game.load.spritesheet('buttondiagonal', 'assets/img/button-diagonal.png',64,64);
		game.load.spritesheet('buttonfire', 'assets/img/button-round-a.png',96,96);
		game.load.spritesheet('buttonjump', 'assets/img/button-round-b.png',96,96);

	},

	create: function () {
		if (!turned){
			displayOptions('');
			turned = true;
		}
		stageCallTime = game.time.now;
		game.time.desiredFps = 60;
		alertedEnemies = 0;
		if (!difficulty)
			difficulty = normal;
		player = {};
		grappleHook = [];
		grappleHooks = null;
		worldItems = [];
		enemyUnits = [];
		drones = [];
		working = true;
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
		var savefile = game.cache.getJSON("savefile");


		map = game.add.tilemap('map');
		map.addTilesetImage('ground_1x1');

		layer = map.createLayer('Tile Layer 1');
		layer.resizeWorld();

		map.setCollisionBetween(0, 12);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = worldGravity;



		player = new Player(0, game, 'player', maps.player[0].position.x,
				maps.player[0].position.y, null, true, 0.2, 0.3, 15, 0.1);    

		player.player.checkWorldBounds = true;
		player.player.events.onOutOfBounds.add(scoreBoard, this);

		player.player.events.onKilled.add(function(){
			timesDead++;
			settings.died++;
			var timeDifference =  (game.time.now - stageCallTime)/1000;
			game.add.text(game.width - game.width/2, game.height - game.height/1.5,"You got wasted!\ntime alive: " + timeDifference + 
					"\ntimes died: " + timesDead + "\n\n(press R to restart)", {fill: "#ffffff", backgroundColor: "#000000", wordWrap: true, wordWrapWidth: 1000, align: "center"});

		},this);


		grapple = new Grapple(0,game,'grappleHook',0,0,true,0.5, player.player);


		drones.push(new Drone(0,game,"player", 200,200,difficulty.droneStats,true));

		for (var i = 0; i < maps.enemies.length; i++) {
			enemyUnits.push(new Unit(i,game,"player",maps.enemies[i].type,maps.enemies[i].position.x,maps.enemies[i].position.y,true,0.5,1));
		}

		for (var i = 0; i < maps.items.length; i++){
			//		worldItems.push(new Items(i,game,"ball", maps.items[i].position.x,maps.items[i].position.y,true,0.5,1,1,10,0.8));
		} 

		game.camera.follow(player.player);
		setKeys();

		//virtualButtons();

		player.player.shitting = "yes";
		droneStats = {
			speed: 200,
			pullVelocity: 500,
			haltmode: false,
			following: true,
		};

		worldGravity = 500;
		game.time.advancedTiming = true;

		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SCALE1;

	},

	update: function() 
	{
		if(working){

			player.update();

			grapple.update();


			game.physics.arcade.collide(player.player,layer);
			for (var i = worldItems.length - 1; i >= 0; i--)
			{
				worldItems[i].update();
				for (var j = worldItems.length - 1; j >= 0; j--) 
				{
					game.physics.arcade.collide(worldItems[i].item,worldItems[j].item);
				}
			}

			for (var i = drones.length - 1; i >= 0; i--) 
			{
				drones[i].update();
			}


			for (var i = enemyUnits.length - 1; i >= 0; i--)
			{
				enemyUnits[i].update();
				for (var j = enemyUnits.length - 1; j >= 0; j--)
				{
					game.physics.arcade.collide(enemyUnits[j].type.unit, enemyUnits[i].type.unit);
				}
			}

			if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
				worldScale += 0.05;
			}
			else if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
				worldScale -= 0.05;
			}

			// set a minimum and maximum scale value
			worldScale = Phaser.Math.clamp(worldScale, 0.25, 1);

			// set our world scale as needed
			game.world.scale.set(worldScale);
			bounded= game.world.getBounds();
			game.scale.refresh();
		}
	},

	render: function() 
	{
		setDebugValues();	
		displayDebugText();
		game.debug.text(game.time.fps, 100, 200);
		game.debug.geom(line);
	//	game.debug.geom(bounded);
		game.debug.geom(ropeLine);
	}
};

game.state.add('inGame',inGame);

