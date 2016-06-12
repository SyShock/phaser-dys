
/*
 *=========================
 * 
 * Game Input
 *
 *=========================
 */



function setKeys(){

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





	game.input.mouse.capture = true;

	W = game.input.keyboard.addKey(settings.keys.up);
	W.onDown.add(function(){moveUp();}, this);

	A = game.input.keyboard.addKey(settings.keys.left);
	A.onDown.add(function(){moveLeft(true);});
	A.onUp.add(function(){player.events.left = false;});

	S = game.input.keyboard.addKey(settings.keys.down);
	S.onDown.add(function(){grapple.cancelGrapple();});

	D = game.input.keyboard.addKey(settings.keys.right);
	D.onDown.add(function(){moveRight(true);});
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
function moveLeft(bool){
	if(bool){
		if(player.player.body.onFloor() && player.player.body.velocity.x === 0)
			player.player.body.velocity.x = -difficulty.playerStats.startSpeed;
		player.events.left = true;
		grapple.cancelGrapple();
	}
	else{
		player.events.left = false;
	}
}
function moveRight(bool){
	if(bool){
		if(player.player.body.onFloor() && player.player.body.velocity.x === 0)
			player.player.body.velocity.x = difficulty.playerStats.startSpeed;
		player.events.right = true;
		grapple.cancelGrapple();
	}
	else{
		player.events.right = false;
	}
}
function moveDown(){}
function moveUp(){player.jump(); grapple.cancelGrapple();}


var pressedId;
function pointerDown(pointer){
	if (game.input.activePointer.withinGame){

		if(pointer.leftButton.isDown) {
			if(grapple.events.isReached){
				grapple.cancelGrapple();
				//if(!droneStats.haltmode){
				//	}


			}
			else if(pointer.id !== pressedId){
				//	grapple.startLine();
			}

		}
		if(pointer.leftButton.isUp ) {
			if(pointer.id !== pressedId){
				initialY = game.input.y;
				if (game.input.x < player.player.body.x)
				{
					moveLeft(true);
				}
				else
				{
					moveRight(true);
				}
				if(grapple.events.isReached){
					//grapple.cancelGrapple();
					//if(!droneStats.haltmode){
					//	}


				}
				//else if(pointer.id !== pressedId){
				else if(player.events.grappleMode){
					grapple.startLine();
				}
			}

		}
		if(pointer.rightButton.isDown) {
			// drone_shock();
		}
	}

}


function pointerUp(pointer){
	if (game.input.activePointer.withinGame)
	{
		if(pointer.rightButton.isUp) {

		}
		if(pointer.leftButton.isDown && pointer.id !== pressedId){
			if(!droneStats.haltmode ){
				grapple.raycast();
				grapple.fireGrapple(); 
			}
			else{
				//drones[0].pull();
			}
		}
		if(pointer.leftButton.isUp){
			if(pointer.id !== pressedId){
				if (!player.player.alive)
					restart();

				lastY = game.input.y;
				if((initialY-lastY)>25){
					moveUp();
					lastY=0;
					initialY=0;
				}
				moveLeft(false);
				moveRight(false);

				if(!droneStats.haltmode && player.events.grappleMode){
					grapple.cancelGrapple();
					grapple.raycast();
					grapple.fireGrapple(); 
					player.events.grappleMode = false;
					pressedId = 99;
				}
				else{
					//drones[0].pull();
				}
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

var initialY;
var lastY;
