var currentMenu = "menu";
function displayOptions(menuId){


	// menuId = "#" + menuId;
	var duration = 250;
	// alert(document.getElementById(currentMenu));
	var outDoc = document.getElementById(currentMenu);
	var inDoc = document.getElementById(menuId);

	var opacity = 1;

	if(outDoc){
		var fadeOutInterval = setInterval(function(){
			outDoc.style.opacity = opacity;
			outDoc.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
			opacity -= 0.05;
			if (opacity <= 0){
				outDoc.style.display = "none";
				if(inDoc){
					fadeIn(inDoc);
				}
				clearInterval(fadeOutInterval);

			}
		},10);
	}


	else{
		fadeIn(inDoc);
	}


	function fadeIn(doc){
		opacity = 0;
		doc.style.display = "block";
		doc.style.opacity = 0;
		var fadeInInterval = setInterval(function(){
			doc.style.opacity = opacity;
			doc.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
			opacity += 0.05;
			if (opacity >= 1){
				clearInterval(fadeInInterval);
			}
		},10);
	}
	currentMenu = menuId;
}


function showHelp() {
	displayOptions("menuHelp");

	var canvas = document.getElementById("menuHelp");
	canvas.onclick = function(){
		displayOptions("menu");
		canvas.onclick = null;
	};
}



/*
*
*	settings from json
*
*
* 
*/

//keys = keysTemp;

var settings = {
	keys: {	up: 87,down: 83,left: 65, right: 68,} ,
	volume: 20,
	progress: 0,
};


var settingsTemp = settings;



/*
*	Controls
*
*
*
*/




/*
* File save/load
*
*/

function download(filename, text) {
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);

	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		pom.dispatchEvent(event);
	}
	else {
		pom.click();
	}
}


function addToMenu(menuId, msg ,onPress, id){
	var menu = document.getElementById(menuId);
	// displayError(menuId);
	// displayError(menu);
	var newSpawn = document.createElement("button"); 
	var text = document.createTextNode(msg);

	newSpawn.appendChild(text);  
	newSpawn.setAttribute("onClick", onPress);
	newSpawn.setAttribute("id", id);
	menu.appendChild(newSpawn);

}

function removeFromMenu(menuId, id){
	var menu = document.getElementById(menuId);
	var target = document.getElementById(id);
	menu.removeChild(target);
	
}


var optionsAdded = false;

function gameMenu(){
	if(!optionsAdded){
		addToMenu("menu","Reset", "game.state.start('default',true,true)", "resetButton");
		addToMenu("menu","Quit", "gameQuit();", "quitButton");
		optionsAdded = true;
	}
}

function gameQuit(){
	if(optionsAdded){
		dynamicUnload('./lib/ingame.js','js');
		game.destroy();
		removeFromMenu("menu", "resetButton");
		removeFromMenu("menu", "quitButton");
		optionsAdded = false;
	}
}

function mapMenu(){

}







function setKey(action){

	displayError("Key set for " + action,1);
	window.addEventListener('keydown',set,false);


	function set(e) {
		displayError("Keycode is: " + e.keyCode,1);
		keys[action] = e.keyCode;
		window.removeEventListener('keydown',set,false);
	}	
}


function loadSave(){
	JSON.parce();
}

function save() {
	JSON.stringify();
}

function setVolumeUp() {
	settings.volume += 10;
	displayError(settings.volume );
	soundCloud.setVolume(settings.volume);
}
function setVolumeDown() {
	settings.volume -= 10;
	displayError(settings.volume );
	soundCloud.setVolume(settings.volume);
}