/*
*
* real-time tracking
*
*/

function setDebugMode1(){
	debugMode = 1;
}function setDebugMode2(){
	debugMode = 2;
}function setDebugMode3(){
	debugMode = 3;
}function setDebugMode4(){
	debugMode = 4;
}function setDebugMode5(){
	debugMode = 5;
}

function setDebugValues(){
	
	var separator = " | ";

	debugInfo =
	(!grapple.isReached && !grapple.isCanceled) + separator +
	player.player.body.mass + "\n" + 
	"Ground: " + player.player.body.onFloor() + separator +
	"Wall: " + player.player.body.onWall() + separator +
	"Enemy1 " + enemyUnits[0].type.timer + separator +
	"Enemy2 " + enemyUnits[1].type.timer + separator +
	"Enemy3 " + enemyUnits[2].type.timer + separator +
	"Angle " + enemyUnits[0].type.coneOfVision + separator;




	debugKeys =
	" Shift pressed: " + SHIFT.isDown + " \ " +
	"Difficulty " + difficulty.enemyStats.reaction + 
	"Difficulty " + difficulty + 
	"angle between: " + game.physics.arcade.angleToPointer(player.player, game.input.activePointer) + " | " + 
	"dsa " + (Math.abs(game.physics.arcade.angleBetween(enemyUnits[2].type.unit, player.player)) - Math.abs(enemyUnits[2].type.unit.rotation));



	debugStates = "grapple - " + 
	"canceled: " + grapple.events.isCanceled + separator +
	"reached: " + grapple.events.isReached + separator +
	"going: " + (!grapple.events.isReached && !grapple.events.isCanceled) + separator + 
	"returned: " + grapple.events.isReturned + separator +
	"returning: " + grapple.events.isReturning + separator +
	"angle to: " + game.physics.arcade.angleBetween(player.player, enemyUnits[2].type.unit);



	debugGameState = 
	game.debug.text(game.time.fps, 100, 200) + separator +
	"Game state: " + game.state.current + separator;

	debugNone = null;
}

function displayDebugText(){

	if(debugMode===1){
		game.debug.text(debugInfo ,100,100);

	}
	if(debugMode===2){
		game.debug.text(debugKeys ,100,100);

	}
	if(debugMode===3){
		game.debug.text(debugStates ,100,100);

	}
	if(debugMode===4){
		game.debug.text(debugGameState ,100,100);

	}
	if (debugMode === 5){

	}
}
