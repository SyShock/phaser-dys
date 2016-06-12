   // create our virtual game controller buttons 

function virtualButtons() {



    buttonjump = game.add.button(1100, 450, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    buttonjump.fixedToCamera = true;  //our buttons should stay on the same place  
    buttonjump.events.onInputOver.add(function(){pressedId = game.input.activePointer.id;});
    buttonjump.events.onInputOut.add(function(){pressedId = game.input.activePointer.id;});
    buttonjump.events.onInputDown.add(function(){aimMode();});
    buttonjump.events.onInputUp.add(function(){pressedId = 99;});

    buttonfire = game.add.button(900, 450, 'buttonfire', null, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    buttonfire.events.onInputOver.add(function(){pressedId = game.input.activePointer.id;});
    buttonfire.events.onInputOut.add(function(){pressedId = game.input.activePointer.id;});
    buttonfire.events.onInputDown.add(function(){controlDrone();});
    buttonfire.events.onInputUp.add(function(){pressedId = game.input.activePointer.id;});        

/*    buttonleft = game.add.button(50, 500, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){moveLeft(true);});
    buttonleft.events.onInputOut.add(function(){moveLeft(false);});
    buttonleft.events.onInputDown.add(function(){moveLeft(true);});
    buttonleft.events.onInputUp.add(function(){moveLeft(false);});
*/
	
    buttonScreen = game.add.button(0, 0, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonScreen.fixedToCamera = true;
    buttonScreen.events.onInputOver.add(function(){fullScreenMode();});
    buttonScreen.events.onInputOut.add(function(){fullScreenMode();});
    buttonScreen.events.onInputDown.add(function(){fullScreenMode();});
    buttonScreen.events.onInputUp.add(function(){fullScreenMode();});

	/*
    buttonbottomleft = game.add.button(32, 536, 'buttondiagonal', null, this, 6, 4, 6, 4);
    buttonbottomleft.fixedToCamera = true;
    buttonbottomleft.events.onInputOver.add(function(){});
    buttonbottomleft.events.onInputOut.add(function(){});
    buttonbottomleft.events.onInputDown.add(function(){});
    buttonbottomleft.events.onInputUp.add(function(){});
	*/
/*
    buttonright = game.add.button(170, 500, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){moveRight(true);});
    buttonright.events.onInputOut.add(function(){moveRight(false);});
    buttonright.events.onInputDown.add(function(){moveRight(true);});
    buttonright.events.onInputUp.add(function(){moveRight(false);});
*/
	/*
    buttonbottomright = game.add.button(160, 536, 'buttondiagonal', null, this, 7, 5, 7, 5);
    buttonbottomright.fixedToCamera = true;
    buttonbottomright.events.onInputOver.add(function(){});
    buttonbottomright.events.onInputOut.add(function(){});
    buttonbottomright.events.onInputDown.add(function(){});
    buttonbottomright.events.onInputUp.add(function(){});
	*/
/*    buttondown = game.add.button(120, 550, 'buttonvertical', null, this, 0, 1, 0, 1);
    buttondown.fixedToCamera = true;
    buttondown.events.onInputOver.add(function(){release(true);});
    buttondown.events.onInputOut.add(function(){release(false);});
    buttondown.events.onInputDown.add(function(){release(true);});
    buttondown.events.onInputUp.add(function(){release(false);});
*/
	function moveLeft(bool){
		player.events.left=bool;
		if(bool)
			pressedId = game.input.activePointer.id;
		else
		pressedId = 99;
	}
	function moveRight(bool){
		player.events.right=bool;
		if(bool)
		pressedId = game.input.activePointer.id;
		else
		pressedId = 99;
	}
	function jump(){
		player.jump();
		pressedId = game.input.activePointer.id;
	}
	function release(bool){
		if (bool){
		grapple.cancelGrapple();
		pressedId = game.input.activePointer.id;
		}
		else
			pressedId = 99;
	}
	function aimMode(){ //on first touch; timer; on second fire
			if(player.events.grappleMode){
				grapple.forceCancelGrapple();
				player.events.grappleMode = false;
				pressedId = 99;
			}
			else{
				player.events.grappleMode = true;
				pressedId = game.input.activePointer.id;
		}
	}

	function controlDrone(){
		if(!droneMode){
			droneMode=true;
			pressedId = game.input.activePointer.id;
		}
		else if(droneMode){
			droneMode=false;
			pressedId = 99;
		}
	}
}
	function fullScreenMode(){
		game.scale.forceOrientation(true);
		game.scale.startFullScreen();
		layer.resizeWorld();
   }
