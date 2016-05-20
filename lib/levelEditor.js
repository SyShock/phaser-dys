var tmpStore;
var layerArrays = [];

function selectObject(object){
	if (selectedObject)
		selectedObject.alpha = 1;
	selectedObject = object;
	object.alpha = 0.8;
	selectedObject.draggable = true;
}

function removeSelected(){
	selectedObject.destroy();

}

function saveMap(){
	// layer.dump();
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
	for (var i = 0; enemyUnits.length > i; i++){
		maps.enemies[i].position.x = enemyUnits[i].x;
		maps.enemies[i].position.y = enemyUnits[i].y;
		//	mapstuff.enemies[i].position.type = enemyUnits[i].y;
	}

	for (var i = 0; worldItems.length > i; i++){
		maps.items[i].position.x = worldItems[i].x;
		maps.items[i].position.y = worldItems[i].y;
		//mapstuff.items[i].position.type = worldItems[i].y;
	}



	console.log(JSON.stringify(maps));


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

var selectedObject;

var undo = [];

function remove(obj){
	obj.destroy();
}

game.state.start('mapEditor');
var mapEditor = {

	preload: function() {

		game.load.tilemap('desert', null, maps, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles', 'assets/img/tiles/ground_1x1.png');
		game.load.image('player', 'assets/img/player.png');



	},
	create: function(){


		CTRL = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
		CTRL.onDown.add(saveMap, this);

		ONE = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		TWO = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		THREE = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
		ONE.onDown.add(function(){mode = 1; tmpSprite.type.unit.kill();}, this);
		TWO.onDown.add(function(){mode = 2;}, this);
		THREE.onDown.add(function(){mode = 3; tmpSprite.type.unit.kill();}, this);

		D = game.input.keyboard.addKey(Phaser.Keyboard.D);
		D.onDown.add(removeSelected);

		P = game.input.keyboard.addKey(Phaser.Keyboard.P);
		P.onDown.add(function(){game.state.start('inGame');});

		map = game.add.tilemap('desert');






		map.addTilesetImage('ground_1x1', 'tiles');

		currentTile = map.getTile(2, 3);

		layer = map.createLayer('Tile Layer 1');

		layer.resizeWorld();

		marker = game.add.graphics();
		marker.lineStyle(2, 0x000000, 1);
		marker.drawRect(0, 0, 32, 32);

		cursors = game.input.keyboard.createCursorKeys();
		
		for (var i = 0; maps.items.length> i; i++)
		{	
			var scoped = i;
			worldItems.push(new Items(i,game,"player", maps.items[i].position.x,maps.items[i].position.y,false,0.1,1,1,10,0.8));
			worldItems[scoped].item.inputEnabled = true;
			worldItems[scoped].item.events.onInputDown.add(function(){console.log(worldItems[scoped].item);});
			worldItems[scoped].item.events.onInputUp.add(function(){selectObject (worldItems[scoped].item);});

		}

		
		for (var j = 0; maps.enemies.length> j; j++)
		{
			var scope = j;
			enemyUnits.push(new Unit(i,game,"player",maps.enemies[j].type,maps.enemies[j].position.x,maps.enemies[j].position.y, false,0.3));
			enemyUnits[j].type.unit.inputEnabled = true;
			enemyUnits[j].type.unit.events.onInputDown.add(function(){console.log(enemyUnits[scope].type.unit);});
			enemyUnits[j].type.unit.events.onInputUp.add(function(){selectObject (enemyUnits[scope].type.unit);});

		}

		player = game.add.sprite(maps.player[0].position.x, maps.player[0].position.y, 'player');
		player.inputEnabled = true;
		//  player.input.enableDrag( false, true );
		//	player.events.onInputOver.add(function(){console.log(player);});
		//   player.events.onInputOut.add(function(){console.log(player);});
		player.events.onInputDown.add(function(){console.log(player);});
		player.events.onInputUp.add(remove);

		tmpSprite = new Unit(i,game,"player","drone",game.input.activePointer.x,game.input.activePointer.y, false,0.3);


		game.input.onDown.add(pointerDown, this);
		game.input.onUp.add(pointerUp, this);

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
			//tmpSprite.x = game.input.activePointer.worldX;
			//tmpSprite.y = game.input.activePointer.worldY;
		}


		if (game.input.mousePointer.isDown)
		{
			if (mode===1)
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
	},
	render: function(){
		game.debug.text('Left-click to paint. Shift + Left-click to select tile. Arrows to scroll.', 32, 32, '#efefef');
		game.debug.text(mode, 33, 52, '#efefef');

	}
};


//One time - mouse 

function pointerDown(pointer){

	if(pointer.leftButton.isDown) { //get the selected sprite
		if(mode===2){
			enemyUnits.push(new Unit(i,game,"player",maps.enemies[j].type,maps.enemies[j].position.x,maps.enemies[j].position.y, false,0.3));
			enemyUnits[j].type.unit.inputEnabled = true;
			enemyUnits[j].type.unit.events.onInputDown.add(function(){console.log(enemyUnits[scope].type.unit);});
			enemyUnits[j].type.unit.events.onInputUp.add(function(){selectObject (enemyUnits[scope].type.unit);});


			console.log(enemyUnits[num]);
			num++;

		}
		else{
		}
	}
	if(pointer.rightButton.isDown) {
	}
}

function pointerUp(pointer){

	if(pointer.leftButton.isUp) {

	}
	if(pointer.rightButton.isUp){
	}
}

game.state.add("mapEditor",mapEditor);
game.state.start("mapEditor");
mapMenu();
