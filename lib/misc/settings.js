var settings = {
	"keys" : {up: 87,down: 83,left: 65, right: 68,},
	"soundVolume": 20,
	"levelProgress": 0,
	"timesDied": 0,
	"highestScore": 0,
	"difficulty": "normal",
};



// Retrieve the object from storage

try{
	
	if(localStorage.getItem('settings') !== null){
		settings = JSON.parse(localStorage.getItem('settings'));
	}
	console.log('settings: ', settings);
}
catch(e){
	console.log(e);
}
