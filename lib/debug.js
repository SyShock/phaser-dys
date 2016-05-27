/*
*
* debug
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
}

function setDebugValues(){
	debugInfo =
	(!grapple.isReached && !grapple.isCanceled) + " | " +
	player.player.body.mass + "\n" + 
	"Ground: " + player.player.body.onFloor() + " | " +
	"Wall: " + player.player.body.onWall() + " | " +
	"Enemy1 " + enemyUnits[0].type.timer + " | " +
	"Enemy2 " + enemyUnits[1].type.timer + " | " +
	"Enemy3 " + enemyUnits[2].type.timer + " | " +
	"Angle " + enemyUnits[0].type.coneOfVision + " | ";




	debugKeys =
	" Shift pressed: " + SHIFT.isDown + " \ " +
	"Difficulty " + difficulty.enemyStats.reaction + 
	"Difficulty " + difficulty;




	debugStates = "grapple - " + 
	"canceled: " + grapple.events.isCanceled + " | " +
	"reached: " + grapple.events.isReached + " | " +
	"going: " + (!grapple.events.isReached && !grapple.events.isCanceled) + " | " + 
	"returned: " + grapple.events.isReturned + " | " +
	"returning: " + grapple.events.isReturning + " | " +
	"angle to: " + game.physics.arcade.angleBetween(player.player, enemyUnits[2].type.unit);



	debugGameState = 
	"Game state: " + game.state.current +
 	" JSON: " + savefile;
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
}
