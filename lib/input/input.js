
/*
*  Input
* 
*/

var keys = {
	up: 87,
	down: 83,
	left: 65,
	right: 68,
	volumeUp: 187,
	volumeDown: 189,
};



function setKeys(){

	W = game.input.keyboard.addKey(keys.up);
	W.onDown.add(player.jump, this);

	A = game.input.keyboard.addKey(keys.left);

	S = game.input.keyboard.addKey(keys.down);
	S.onDown.add(cancelGrapple, this);

	D = game.input.keyboard.addKey(keys.right);

	ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	ESC.onDown.add(displayMainMenu, this);

	SHIFT = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	
	CTRL = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
	CTRL.onDown.add(drone2[0].haltMode, this);


	R = game.input.keyboard.addKey(Phaser.Keyboard.R);
	R.onDown.add(restart, this);
				

	debug1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	debug1.onDown.add(setDebugMode1,this);
	debug2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	debug2.onDown.add(setDebugMode2,this);
	debug3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	debug3.onDown.add(setDebugMode3,this);
	debug4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	debug4.onDown.add(setDebugMode4,this);


	// cursors = game.input.keyboard.createCursorKeys();
	// RBUTTON = game.input.activePointer.rightButton;
	// LBUTTON = game.input.activePointer.leftButton;

	volUp = game.input.keyboard.addKey(keys.volumeUp);
	volUp.onDown.add(setVolumeUp, this);
	volDown = game.input.keyboard.addKey(keys.volumeDown);
	volDown.onDown.add(setVolumeDown, this);


	game.input.onDown.add(pointerDown, this);
	game.input.onUp.add(pointerUp, this);


}

//One time - mouse 

function pointerDown(pointer){

	if(pointer.leftButton.isDown /*&& playerStats.grappleMode*/) {
		if(!droneStats.haltmode){
			startLine();
		}
		else{
		}
	}
	if(pointer.rightButton.isDown) {
		// drone_shock();
	}

}


function pointerUp(pointer){

	if(pointer.leftButton.isUp) {

	}
	if(pointer.rightButton.isUp /*&& playerStats.grappleMode*/){
		if(!droneStats.haltmode ){
			raycast();
			fireGrapple(); 
		}
		else{
			drone2[0].pull();
		}
	}

}
