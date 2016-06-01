
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
		addToMenu("menu","Reset", "working = false; game.state.restart(true,true);", "resetButton");
		addToMenu("menu","Quit", "gameQuit();", "quitButton");
		optionsAdded = true;
	}
}

function gameQuit(){
	game.paused = false;
	if(optionsAdded){
		game.state.start('menu');
		removeFromMenu("menu", "resetButton");
		removeFromMenu("menu", "quitButton");
		optionsAdded = false;
	}
}

function mapMenu(){

	if(!optionsAdded){
		addToMenu("menu","Save & Download Map", "saveMap();", "saveButton");
		addToMenu("menu","Quit", "mapQuit();", "quitButton");
		addToMenu("menu","Resize Map", "resizeMap()", "resizeButton");
		optionsAdded = true;
	}
}

function mapQuit() {
		game.paused = false;
	if(optionsAdded){
		game.state.start('menu');
		removeFromMenu("menu", "saveButton");
		removeFromMenu("menu", "quitButton");
		removeFromMenu("menu", "sizeButton");
		optionsAdded = false;

	}
}

function setKey(action){

	displayError("Key set for " + action,1);
	window.addEventListener('keydown',set,false);
	

	function set(e) {
		displayError("Keycode is: " + e.keyCode,1);
		settings.keys[action] = e.keyCode;
		window.removeEventListener('keydown',set,false);

		localStorage.setItem('settings', JSON.stringify(settings));
	}	
}



var reader;
var maps;



// load map json
function loadMap(evt){
	reader = new FileReader();
	console.log(evt);
	reader.readAsText(evt.target.files[0]);
	reader.onerror = function(e)
	{
		console.log(evt.target.error.code);
	};
	reader.onloadstart = function(e)
	{
	};
	reader.onload = function(e)
	{
		var data = reader.result;
		console.log(data);
		maps = JSON.parse(data);
	};

}


//load savefile, which is also a json
function loadSave(evt){
	reader = new FileReader();
	console.log(evt);
	reader.readAsText(evt.target.files[0]);
	reader.onerror = function(e)
	{
		console.log(evt.target.error.code);
	};
	reader.onloadstart = function(e)
	{
	};
	reader.onload = function(e)
	{
		var data = reader.result;
		console.log(data);
		settings = JSON.parse(data);
	};	
}



//saves current settings
function save() {
	var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings));
	var a = document.createElement('a');
	a.href = 'data:' + data;
	a.download = 'savefile.json';
	a.innerHTML = 'download JSON';
	a.click();
}


function setVolumeUp() 
{
	settings.volume += 10;
	displayError(settings.volume );
	soundCloud.setVolume(settings.volume);
}
function setVolumeDown()
{
	settings.volume -= 10;
	displayError(settings.volume );
	soundCloud.setVolume(settings.volume);
}


function setDifficulty()
{
	tmp  = document.getElementById('difficulty').value;
	if(tmp === 'normal')
		difficulty=normal;
	if(tmp === 'hard')
		difficulty = hard;
	if(tmp === 'realistic')
		difficulty = realistic;
	if(tmp === 'dystopia')
		difficulty = dystopia;

	settings.difficulty = tmp;
	localStorage.setItem('settings', JSON.stringify(settings));
	console.log(difficulty);
}

function play(){
	try {
		console.log(maps);
		gameMenu();
		game.state.start('inGame');
	}
	catch(e){
		console.log(e);
	}
}


function playMap(){
	try {	
		game.state.start('inGame');
	}
	catch(e){
	}
	if (!maps){
		displayError("Please select a map...");
	}
}


function levelEditor(){
	try{
		game.state.start('mapEditor');
	}
	catch(e){}

	if (!maps)
	{
		displayError("Please select a map...");
	}

}

function newMap(){
	try{
		game.load.json("maps", "./assets/maps/collision_test.json");
		game.state.start('mapEditor');
	}
	catch(e){}

}

var menuShown = false;
function displayMainMenu() {
	if (!menuShown){
		displayOptions("menu");
		menuShown = true;
	}
	else{
		displayOptions("");
		menuShown = false;
	}
}

var sprite;
var menuState = {
	preload: function(){
		game.load.image('background', 'assets/img/introducing-the-default-wallpapers-of-the-gnome-3-18-desktop-environment-485512-6.jpg');
		if(!maps)
			game.load.json('maps', 'assets/maps/collision_test.json');
	},
	create: function(){
		maps = game.cache.getJSON("maps", true);
		sprite = game.add.sprite(0, 0,'background');
	},
};








var turned = false;

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example');
game.state.add("menu",menuState);
game.state.start('menu');

