var normal = {
	enemyStats:
	{
		enemySpeed: 150,
		reaction: 1000,
		sightRange: 1000,
		fieldOfVision: 45,

	},
	playerStats:
	{
		slowmotion: true,
		startSpeed: 100,
		jump: 250,
		speed: 300,
	},
	droneStats:
	{
		speed: 100,
	},

	grappleStats:
	{
		throwSpeed: 800,
		pullSpeed: 800,
		reload: 100,
		length: 500,
	},
};

var hard = {
	enemyStats:
	{
		speed:200,
		reaction: 500,
		sightRange: 1000,
		fieldOfVision: 75,
	},
	playerStats:
	{
		startSpeed: 100,
		slowmotion:true,
		speed:150,
		jump:250
	},
	droneStats:
	{

	},
	grappleStats:
	{
		throwSpeed: 800,
		pullSpeed: 800,
		reload: 100,
		length: 500,
	},
};

var realistic = {
	enemyStats:
	{
		speed:200,
		reaction: 350,
		sightRange: 1000,
		fieldOfVision: 90,
	},
	playerStats:
	{
		slowmotion:false,
		startSpeed: 100,
		speed:300,
		jump:200
	},
	droneStats:
	{

	},
	grappleStats:
	{
		throwSpeed: 800,
		pullSpeed: 800,
		reload: 100,
		length: 500,
	},
};
var dystopia = {
	enemyStats:
	{
		speed:250,
		reaction: 200,
		sightRange: 1000,
		fieldOfVision: 120,
	},
	playerStats:
	{
		slowmotion:false,
		startSpeed: 100,
		speed:300,
		jump:200
	},
	droneStats:
	{

	},
	grappleStats:
	{
		throwSpeed: 800,
		pullSpeed: 800,
		reload: 100,
		length: 500,
	},
};

console.log(settings.difficulty);
var difficulty = window[settings.difficulty];
console.log(difficulty);

