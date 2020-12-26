var tmpStore;
var layerArrays = [];


var tmpStore;
var layerArrays = [];
var map;
var layer;
var marker;
var currentTile;
var cursors;
var tmpSprite;
var player;
var enemyUnits = [];
var num = 0;
var worldItems = [];
var mode = 0;
var subMode = 0;
var selectedObject;
var undo = [];

var winZone = [];
var checkZone = [];


var rectangle = {};
var drawing = false;

var color1;
var color2;


var mapEditor = {
	preload: function() {

		game.load.tilemap('layer1', null, maps, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles', 'assets/img/tiles/ground_1x1.png');
		game.load.image('player', 'assets/img/player.png');
		game.load.image('drone', 'assets/img/drone.png');
		game.load.image('ball', 'assets/img/ball.png');
	},
	create: function(){
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
		mapMenu();
		editorKeys();



		if (!turned){
			displayOptions('');
			turned = true;
		}


		var layerArrays = [];
		tmpSprite = {};
		player = {};
		enemyUnits = [];
		num = 0;
		worldItems = [];
		mode = 0;
		selectedObject = {};
		undo = [];
		winZone = [];
		checkZone = [];


		for (var i = 0; maps.items.length> i; i++)
		{	
			let scoped = i;
			worldItems.push(new Items(i, game, "player", maps.items[i].position.x, maps.items[i].position.y, false, 0.1, 1, 1, 10, 0.8));
			worldItems[i].item.inputEnabled = true;
			worldItems[i].item.events.onInputDown.add(function(){console.log(worldItems[scoped].item);});
			worldItems[i].item.events.onInputUp.add(function(){selectObject (worldItems[scoped].item);});
			console.log(scoped);

		}
		for (var j = 0; maps.enemies.length> j; j++)
		{
			let scope = j;
			enemyUnits.push(new Unit(j,game,"player",maps.enemies[j].type,maps.enemies[j].position.x,maps.enemies[j].position.y, false,0.3,true));

			console.log(enemyUnits[j].index);	
			enemyUnits[j].type.unit.inputEnabled = true;
			enemyUnits[j].type.unit.events.onInputDown.add(function(){selectObject (enemyUnits[scope]);});
			//	enemyUnits[j].type.unit.events.onInputUp.add();

		}
		enemyCount = enemyUnits.length;

		player = new Player(0, game, 'player', maps.player[0].position.x,
				maps.player[0].position.y, difficulty.playerStats,false, 0.3);
		player.player.inputEnabled = true;
		player.player.events.onInputDown.add(function(){selectObject (player);});

		for (var i = 0; i<maps.winpoint.length; i++){
			winZone.push(new Phaser.Rectangle(maps.winpoint[i].position.x, maps.winpoint[i].position.y, maps.winpoint[i].width, maps.winpoint[i].height));
		}

		for (var i = 0; i<maps.checkpoint.length; i++){
			checkZone.push(new Phaser.Rectangle(maps.checkpoint[i].position.x, maps.checkpoint[i].position.y, maps.checkpoint[i].width, maps.checkpoint[i].height));
		}
	},

	update: function(){
		if(mode===1)
		{
			marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
			marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
		}
		if(mode===2)
		{
			tmpSprite.type.unit.reset(game.input.activePointer.worldX,game.input.activePointer.worldY );
		}
		if(mode===3)
		{
			tmpSprite.item.reset(game.input.activePointer.worldX,game.input.activePointer.worldY );

		}

		if (cursors.left.isDown)
		{
			game.camera.x -= 4;
		}
		else if (cursors.right.isDown)
		{
			game.camera.x += 4;
		}

		if (cursors.up.isDown)
		{
			game.camera.y -= 4;
		}
		else if (cursors.down.isDown)
		{
			game.camera.y += 4;
		}

		if (drawing){
			rectangle.resize(game.input.activePointer.worldX - rectangle.x, game.input.activePointer.worldY - rectangle.y);
		}

		if (tileMode){
			addTile();
		}


	},
	render: function(){
		game.debug.text('Left-click to paint. Shift + Left-click to select tile. Arrows to scroll.', 32, 32, '#efefef');
		game.debug.text(mode, 33, 52, '#efefef');
		game.debug.text(subMode, 50, 52, '#efefef');
		game.debug.text(game.input.activePointer.leftButton.isUp, 31, 72, '#efefef');
		game.debug.text(drawing, 52, 72, '#efefef');
		game.debug.geom(rectangle);
		for (var i = 0; i < winZone.length; i++)
			game.debug.geom(winZone[i],'rgba(200,200,100,0.4)');

		for (var i = 0; i < checkZone.length; i++)
			game.debug.geom(checkZone[i], 'rgba(200,100,100,0.4)');

	}
};


game.state.add('mapEditor',mapEditor);

//One time - mouse 




function addTile(){
	if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
	{
		currentTile = map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y));
	}
	else
	{
		if (map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)) != currentTile)
		{
			map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y));
		}
	}





function saveMap(){
	var test = map.copy(1, 1, 10, 10, layer);    
	for (var i = 0; i < map.layers.length; i++) {
		var layerArray = [];
		console.log(map.layers[i]);
		tmpStore = map.layers[i];
		for (var l = 0; tmpStore.data.length > l; l++){
			for (var j = 0; tmpStore.data[0].length > j; j++){
				if (tmpStore.data[l][j].index === -1)
					layerArray.push(0);
				else
					layerArray.push(tmpStore.data[l][j].index);
			}
		}
		maps.layers[i].data = layerArray;
		console.log(layerArray);
	}

	for( var i = 0; enemyUnits.length > maps.enemies.length; i++){
		maps.enemies.push({"type":'',"position":{"x":0,"y":0}});
	}
	for (var i = 0; enemyUnits.length > i; i++){
		maps.enemies[i].type = 'drone';
		maps.enemies[i].position.x = enemyUnits[i].type.unit.x;
		maps.enemies[i].position.y = enemyUnits[i].type.unit.y;
		//	mapstuff.enemies[i].position.type = enemyUnits[i].y;
	}


	for( var i = 0; worldItems.length > maps.items.length; i++){
		maps.items.push({});
	}
	for (var i = 0; worldItems.length > i; i++){
		maps.items[i].type = '';
		maps.items[i].position.x = worldItems[i].item.x;
		maps.items[i].position.y = worldItems[i].item.y;
		//mapstuff.items[i].position.type = worldItems[i].y;
	}
	//for (var i = 0
	maps.player[0].position.x = player.player.x;
	maps.player[0].position.y = player.player.y;

	for (var i = 0; i<winZone.length; i++){
		maps.winpoint[i].position.x = winZone[i].x;
		maps.winpoint[i].position.y = winZone[i].y;
		maps.winpoint[i].width = winZone[i].width;
		maps.winpoint[i].height = winZone[i].height;
	}


	for (var i = 0; i<checkZone.length; i++){
		maps.checkpoint[i].position.x = checkZone[i].x;
		maps.checkpoint[i].position.y = checkZone[i].y;
		maps.checkpoint[i].width = checkZone[i].width;
		maps.checkpoint[i].height = checkZone[i].height;
	}

	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(maps));
	var a = document.createElement('a');
	a.href = 'data:' + data;
	a.download = 'map.json';
	a.innerHTML = 'download JSON';
	a.click();
}

function resizeMap()
{
	var size = window.prompt("X and Y values: ", "valX,valY");
	if (size !== null) {
		sub = size.split(",");
		console.log(sub[0]);
		game.scale.setGameSize(sub[0],sub[1]);

	}
}

function saveKey(){
	if(game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)){
		saveMap();
	}
}



function addPlayer(){
	player = new Player(0, game, 'player', game.input.activePointer.worldX,
			game.input.activePointer.worldY, difficulty.playerStats,false, 0.3);
	player.player.inputEnabled = true;
	player.player.events.onInputDown.add(function(){selectObject (player);});
}
