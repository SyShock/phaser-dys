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

var selectedObject;

var undo = [];

function remove(obj){
	obj.destroy();
}



function mode3(){
	try{
		tmpSprite.type.unit.destroy();
	}
	catch(e){}
	mode = 3;
	//tmpSprite.type.unit.kill();
	tmpSprite = new Items(i,game,"player",game.input.activePointer.worldX, game.input.activePointer.worldX,false,0.1);
}		

function mode2(){
	try{
		tmpSprite.item.destroy();
	}
	catch(e){}
	mode = 2;
	tmpSprite = new Unit(i,game,"player","drone",game.input.activePointer.worldX ,game.input.activePointer.worldY,false,0.3);
}

game.state.start('mapEditor');
var mapEditor = {

	preload: function() {

		game.load.tilemap('layer1', null, maps, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles', 'assets/img/tiles/ground_1x1.png');
		game.load.image('player', 'assets/img/player.png');



	},
	create: function(){


		CTRL = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
		CTRL.onDown.add(saveMap, this);

		ONE = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		TWO = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		THREE = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
		ONE.onDown.add(function(){mode = 1;}, this);
		TWO.onDown.add(mode2, this);
		THREE.onDown.add(mode3, this);

		D = game.input.keyboard.addKey(Phaser.Keyboard.D);
		D.onDown.add(removeSelected);

		P = game.input.keyboard.addKey(Phaser.Keyboard.P);
		P.onDown.add(function(){game.state.start('inGame');});

		map = game.add.tilemap('layer1');

		ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		ESC.onDown.add(displayMainMenu);




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
			let scoped = i;
			worldItems.push(new Items(i,game,"player", maps.items[i].position.x,maps.items[i].position.y,false,0.1,1,1,10,0.8));
			worldItems[i].item.inputEnabled = true;
			worldItems[i].item.events.onInputDown.add(function(){console.log(worldItems[scoped].item);});
			worldItems[i].item.events.onInputUp.add(function(){selectObject (worldItems[scoped].item);});
			console.log(scoped);

		}

		
		for (var j = 0; maps.enemies.length> j; j++)
		{
			let scope = j;
			enemyUnits.push(new Unit(i,game,"player",maps.enemies[j].type,maps.enemies[j].position.x,maps.enemies[j].position.y, false,0.3,true));
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
		if(mode===3)
		{
			tmpSprite.item.reset(game.input.activePointer.worldX,game.input.activePointer.worldY );
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
			addUnit("drone");
		}
		else if(mode===3){
			addItem('');
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


function addUnit(type){
		let tmp = enemyUnits.length;
		enemyUnits.push(new Unit(i,game,"player", type, game.input.activePointer.worldX, game.input.activePointer.worldY, false,0.3));
		enemyUnits[tmp].type.unit.inputEnabled = true;
		enemyUnits[tmp].type.unit.events.onInputDown.add(function(){console.log(enemyUnits[tmp].type.unit);});
		enemyUnits[tmp].type.unit.events.onInputUp.add(function(){selectObject (enemyUnits[tmp].type.unit);});
}
function addItem(type){
		let tmp = worldItems.length;
		worldItems.push(new Items(i,game,"player", game.input.activePointer.worldX, game.input.activePointer.worldY,false,0.1,1,1,10,0.8));
		worldItems[tmp].item.inputEnabled = true;
		worldItems[tmp].item.events.onInputDown.add(function(){console.log(worldItems[tmp].item);});
		worldItems[tmp].item.events.onInputUp.add(function(){selectObject (worldItems[tmp].item);});
}


function removeItem(){}


function selectObject(object){
	if (selectedObject)
		selectedObject.alpha = 1;
	selectedObject = object;
	object.alpha = 0.8;
	selectedObject.input.enableDrag(true);
	mode = 0;
}

function removeSelected(){
	if (mode===2){
		 removeFromArray(enemyUnits,selectedObject);
	}
	else if(mode===3){
	
		 removeFromArray(worldItems,selectedObject);
	//worldItems -= selectedObject;
	}

}


function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function removeFromArray(array,obj){
	console.log("DEKETE");
	for (var i = 0; array.length > i; i++)
		JSON.stringify(array[i]);
		JSON.stringify(obj);
	if( JSON.stringify(array[i]) === JSON.stringify(obj)){
		
	
		array.splice(i,1);
}
	else{}
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

