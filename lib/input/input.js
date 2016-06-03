
/*
 *=========================
 * 
 * Game Input
 *
 *=========================
*/



function setKeys(){


	
	game.input.mouse.capture = true;
	//game.input.activePointer.leftButton.isDown;

	W = game.input.keyboard.addKey(settings.keys.up);
	W.onDown.add(function(){player.jump(); grapple.cancelGrapple();}, this);

	A = game.input.keyboard.addKey(settings.keys.left);
	A.onDown.add(function(){ player.events.left = true; });
	A.onUp.add(function(){ player.events.left = false; grapple.cancelGrapple();});

	S = game.input.keyboard.addKey(settings.keys.down);
	S.onDown.add(function(){grapple.cancelGrapple();});

	D = game.input.keyboard.addKey(settings.keys.right);
	D.onDown.add(function(){ player.events.right = true;});
	D.onUp.add(function(){ player.events.right = false;  grapple.cancelGrapple();});

	ESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	ESC.onDown.add(displayMainMenu, this);

	SHIFT = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	
	CTRL = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
	CTRL.onDown.add(drones[0].haltMode, this);

	SPACE = game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
	SPACE.onDown.add(nextMap);

	
	F = game.input.keyboard.addKey(Phaser.Keyboard.F);
	F.onDown.add(function(){game.scale.startFullScreen();}, this);



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
	debug5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
	debug5.onDown.add(setDebugMode5,this);

	// cursors = game.input.keyboard.createCursorKeys();
	// RBUTTON = game.input.activePointer.rightButton;
	// LBUTTON = game.input.activePointer.leftButton;

	volUp = game.input.keyboard.addKey(settings.keys.volumeUp);
	volUp.onDown.add(setVolumeUp, this);
	volDown = game.input.keyboard.addKey(settings.keys.volumeDown);
	volDown.onDown.add(setVolumeDown, this);


	game.input.onDown.add(pointerDown, this);
	game.input.onUp.add(pointerUp, this);


}

/* 
 *================================================================
 *
 * Global functions
 *  
 *
 *================================================================
 * One time - mouse
*/

function pointerDown(pointer){
    if (game.input.activePointer.withinGame){
		
	if(pointer.leftButton.isDown /*&& playerStats.grappleMode*/) {
		if(grapple.events.isReached){
			grapple.cancelGrapple();
		//if(!droneStats.haltmode){
	//	}


	}
		else{
			grapple.startLine();
		}
	if(pointer.rightButton.isDown) {
		// drone_shock();
	}
	}
	}

}


function pointerUp(pointer){
    if (game.input.activePointer.withinGame)
    {
	if(pointer.leftButton.isUp) {

	}
	if(pointer.rightButton.isUp /*&& playerStats.grappleMode*/){
		if(!droneStats.haltmode ){
			grapple.raycast();
			grapple.fireGrapple(); 
		}
		else{
			drones[0].pull();
		}
	}
	}

}



function nextMap(){
	if (levelComplete){
		settings.levelProgress++;
		localStorage.setItem('settings', JSON.stringify(settings));
	}

	if(settings.levelProgress === 0){
		game.load.json('maps', 'assets/maps/collision_test.json');
	}
	else if(settings.levelProgress === 1){
		game.load.json('maps', 'assets/maps/collision_test_1.json');
	}
}

