function editorKeys(){
	MODE1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	MODE2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	MODE3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	MODE4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	MODE5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
	MODE1.onDown.add(mode1, this);
	MODE2.onDown.add(mode2, this);
	MODE3.onDown.add(mode3, this);
	MODE4.onDown.add(mode4, this);
	//	MODE5.onDown.add(mode5, this);

	D = game.input.keyboard.addKey(Phaser.Keyboard.D);
	D.onDown.add(removeSelected);

	P = game.input.keyboard.addKey(Phaser.Keyboard.P);
	P.onDown.add(function(){game.state.start('inGame');});


	ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	ESC.onDown.add(displayMainMenu);

	SAVEKEY = game.input.keyboard.addKey(Phaser.Keyboard.S);
	SAVEKEY.onDown.add(saveKey);

	cursors = game.input.keyboard.createCursorKeys();

	game.input.onDown.add(_pointerDown, this);	
	game.input.onUp.add(_pointerUp, this);


	ONE = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	TWO = game.input.keyboard.addKey(Phaser.Keyboard.W);
	THREE = game.input.keyboard.addKey(Phaser.Keyboard.E);
	FOUR = game.input.keyboard.addKey(Phaser.Keyboard.R);
	
	ONE.onDown.add(onePressed);
	TWO.onDown.add(twoPressed);
	THREE.onDown.add(threePressed);
	FOUR.onDown.add(fourPressed);


	game.input.mouse.mouseWheelCallback = mouseWheel;


		map = game.add.tilemap('layer1');
		map.addTilesetImage('ground_1x1', 'tiles');
		currentTile = map.getTile(2, 3);
		layer = map.createLayer('Tile Layer 1');
		layer.resizeWorld();

		marker = game.add.graphics();
		marker.lineStyle(2, 0x000000, 1);
		marker.drawRect(0, 0, 32, 32);
}


function mouseWheel(event) {
  if(game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
			worldScale += 0.05;
		}
		else {
			worldScale -= 0.05;
		}

		// set a minimum and maximum scale value
		worldScale = Phaser.Math.clamp(worldScale, 0.25, 1);

		// set our world scale as needed
		game.world.scale.set(worldScale);


  
}

//on keypress - mode selection

function onePressed(){
	subMode = 1;
	if(mode===1){

	}

	else if(mode===2){
		tmpSprite = new Unit(i,game,"player","drone",game.input.activePointer.worldX ,game.input.activePointer.worldY,false,0.3);
	}

	else if(mode===3){

	}

	else if(mode===4){
		tmpSprite = new Player(i,game,"player",game.input.activePointer.worldX, game.input.activePointer.worldX,false,0.1);
	}
}

function twoPressed(){
	subMode = 2;
	if(mode===1){

	}
	else if(mode===2){
		tmpSprite = new Unit(i,game,"player","officer",game.input.activePointer.worldX ,game.input.activePointer.worldY,false,0.3);

	}
	else if(mode===3){

	}
	else if(mode===4){

	}
}

function threePressed(){
	subMode = 3;
	if(mode===1){

	}
	else if(mode===2){

		tmpSprite = new Unit(i,game,"player","sentry",game.input.activePointer.worldX ,game.input.activePointer.worldY,false,0.3);
	}
	else if(mode===3){

	}
	else if(mode===4){

	}
}


function fourPressed(){
	subMode = 4;
	if(mode===1){

	}
	else if(mode===2){

		tmpSprite = new Unit(i,game,"player","drone",game.input.activePointer.worldX ,game.input.activePointer.worldY,false,0.3);
	}
	else if(mode===3){

	}
	else if(mode===4){

	}
}





function mode4(){
	if(tmpSprite.type){
		tmpSprite.type.unit.destroy();
	}
	else if(tmpSprite.item){
		tmpSprite.item.destroy();
	}
	mode = 4;	
}


function mode3(){
	if(tmpSprite.type){
		tmpSprite.type.unit.destroy();
	}
	mode = 3;
	//tmpSprite.type.unit.kill();
	tmpSprite = new Items(i,game,"player",game.input.activePointer.worldX, game.input.activePointer.worldX,false,0.1);
}		

function mode2(){
	if(tmpSprite.item){
		tmpSprite.item.destroy();
	}
	mode = 2;
	tmpSprite = new Unit(i,game,"player","drone",game.input.activePointer.worldX ,game.input.activePointer.worldY,false,0.3);
}


function mode1(){
	if(tmpSprite.type){
		tmpSprite.type.unit.destroy();
	}
	if(tmpSprite.item){
		tmpSprite.item.destroy();
	}
	mode = 1;
}



function drawRectangle(){
	var pointer = game.input.activePointer;
	rectangle = new Phaser.Rectangle(pointer.worldX, pointer.worldY,0,0);
	drawing = true;
}



function selectObject(object){
	//if (selectedObject)
	//	selectedObject.alpha = 1;

	selectedObject = object;
	mode = 0;

	if(selectedObject.type){
		console.log(selectedObject.index);
		selectedObject.type.unit.alpha = 0.8;
		selectedObject.type.unit.input.enableDrag(true);

	}
	else if(selectedObject.item){
		selectedObject.item.alpha = 0.8;
		selectedObject.item.input.enableDrag(true);
	}

	else if(selectedObject.player){
		selectedObject.player.alpha = 0.8;
		selectedObject.player.input.enableDrag(true);
	}
}

function removeSelected(){
	if (selectedObject.type){
		console.log(selectedObject.index);
		removeFromArray(enemyUnits,selectedObject);
		refresh();

	}
	else if(selectedObject.item){
		removeFromArray(worldItems,selectedObject);

	}

}


function removeFromArray(array,obj){
	for (var i = 0; array.length > i; i++){

		console.log(array[i].index);
		if (array[i].index === obj.index){
			array[i].type.unit.destroy();
			array.splice(i,1);

		}
	}
}



var enemyCount;
function addUnit(type){
	let tmp = enemyCount;
	enemyUnits.push(new Unit(tmp,game,"player", type, game.input.activePointer.worldX, game.input.activePointer.worldY, false,0.3));
	enemyUnits[tmp].type.unit.inputEnabled = true;
	enemyUnits[tmp].type.unit.events.onInputDown.add(function(){selectObject (enemyUnits[tmp]);});
	enemyCount++;
	//	enemyUnits[tmp].type.unit.events.onInputUp.add();

}
function addItem(type){
	let tmp = worldItems.length;
	worldItems.push(new Items(tmp,game,"player", game.input.activePointer.worldX, game.input.activePointer.worldY,false,0.1,1,1,10,0.8));
	worldItems[tmp].item.inputEnabled = true;
	worldItems[tmp].item.events.onInputDown.add(function(){selectObject (worldItems[tmp]);});
	worldItems[tmp].item.events.onInputUp.add();
}


function refresh(){
	for (var p = 0; p < enemyUnits.length + 1; p++){
		let tmp = p;
		enemyUnits[tmp].type.unit.events.onInputDown.dispose();
		enemyUnits[tmp].type.unit.events.onInputDown.add(function(){selectObject (enemyUnits[tmp]);});
		console.log("reassigning " + tmp);
	}
}


//on click with selected mode

var tileMode = false;

function _pointerDown(pointer){

	if(pointer.leftButton.isDown) { //get the selected sprite

		if (mode===1){
			tileMode = true;
		}
		else if(mode===2){
			if(subMode===1){
				addUnit("drone");
			}
			else if (subMode===2){

			}
			else if (subMode===3){

			}
		}
		else if(mode===3){
			addItem('');
		}
		else if(mode===4){
			if(subMode===1){

			}
			if(subMode===2){

			}
			if(subMode===3){
				drawRectangle();
			}
			if(subMode===4){
				drawRectangle();
			}
		}
	}
	if(pointer.rightButton.isDown) {
	}
}


//on release

function _pointerUp(pointer){

	if(pointer.leftButton.isDown) {
		if (mode === 1){
			tileMode = false;
		}
		else if(mode === 2){
		
		}
		else if(mode === 3){
		
		}
		else if(mode===4){
			if(subMode===1){
			player.player.destroy();
			addPlayer();
			}
			if(subMode===2){

			}
			if(subMode===3){
				drawing = false;
				if(rectangle.width > 20)
				winZone.push(new Phaser.Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height));
			}
			if(subMode===4){
				drawing = false;
				if(rectangle.width > 20)
				checkZone.push(new Phaser.Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height));
			}
		}
	}

	if(pointer.rightButton.isDown){
		for (var i = 0; i<winZone.length; i++){
			if(winZone[i].contains(game.input.activePointer.x, game.input.activePointer.y)){
				winZone.splice(i,1);	
			}
		}
		for (var i = 0; i<checkZone.length; i++){
			if(checkZone[i].contains(game.input.activePointer.x, game.input.activePointer.y)){
				checkZone.splice(i,1);	
			}	
		}
	}
}
