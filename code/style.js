const canvas = document.getElementById('snake_game');
const context = canvas.getContext('2d');


let speed = 7; // The interval will be seven times a second

//Tiles on the game board
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
//Snake attributes
let snake_HeadX = 10;
let snake_HeadY= 10;
const snake_Parts = []; //we make it constant because we won't remove the array we only modify its content
let tailLenght = 2;
//Apple attributes
let appleX = 5;
let appleY = 5;
//Parameters of position modifications of the snake
let xVelocity = 0;
let yVelocity = 0;

let score = 0;
const gulp_sound = new Audio("potion_a.wav");
const gameOver_sound = new Audio("smb2_perdu.wav");

class SnakePart{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

function drawGame(){
	changeSnakePosition();
	let result = isGameOver();
	
	if(result){
		return;
	}
		
	clearScreen();
	
	checkAppleCollision();
	drawScore();
	drawSnake();
	drawApple();
	setTimeout(drawGame, 1000/speed); //update screen 7 times a second 
}

function isGameOver(){
	let gameOver = false;
	
	if(yVelocity == 0 && xVelocity == 0){
		return false;
	}
	
	//walls
	/*
	if(snake_HeadX < 0){
		gameOver = true;
	}
	else if(snake_HeadX >= tileCount){
		gameOver = true
	}
		
	else if(snake_HeadY < 0){
		gameOver = true
	}
		
	else if(snake_HeadY >= tileCount){
		gameOver = true
	}
	*/
	for(let i=0; i<snake_Parts.length;i++){
		let part = snake_Parts[i];
		if(part.x == snake_HeadX && part.y == snake_HeadY){
			gameOver = true;
			break;
		}
	}
		
	if(gameOver){
		context.fillStyle = 'white';
		context.font = "50px Verdana"
		context.fillText("GAME OVER!", canvas.width/10, canvas.height/2);
		gameOver_sound.play();
		drawRetryButton();
		
	}
		
	return gameOver;
}

function clearScreen(){
	context.fillStyle = 'black'; //make screen black
	context.fillRect(0,0,canvas.clientWidth, canvas.clientHeight); //black color start from 0px left, right to canvas width and height
}

function drawSnake(){
	context.fillStyle = 'red';
	for(let i = 0; i < snake_Parts.length; i++){
		let part = snake_Parts[i];
		context.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
	}
	
	snake_Parts.push(new SnakePart(snake_HeadX, snake_HeadY)); //put an item next to the snake head at the end of the list
	while(snake_Parts.length > tailLenght){
		snake_Parts.shift(); //remove the furthers item from the snake parts if we have more than our tailLenght
	}
	
	context.fillStyle = 'orange';
	context.fillRect(snake_HeadX * tileCount, snake_HeadY * tileCount, tileSize, tileSize);
	
	if(snake_HeadX < 0){
		snake_HeadX = tileCount;
	}
	else if(snake_HeadY < 0){
		snake_HeadY = tileCount;
	}
	else if(snake_HeadX > tileCount){
		snake_HeadX = 0;
	}
	else if(snake_HeadY > tileCount){
		snake_HeadY = 0;
	}
}

function drawApple(){
	context.fillStyle = 'green';
	context.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function drawRetryButton(){
	//create your shape data in a Path2D object
	const path = new Path2D();
	path.rect(250, 350, 200, 100);
	path.rect(25,72,32,32);
	path.closePath();

	//draw your shape data to the context
	context.fillStyle = "#FFFFFF";
	context.fillStyle = "rgba(225,225,225,0.5)";
	context.fill(path);
	context.lineWidth = 2;
	context.strokeStyle = "#000000";
	context.stroke(path);
}

function checkAppleCollision(){
	if(appleX == snake_HeadX && appleY == snake_HeadY){
		for(let i = 0; i < snake_Parts.length; i++){
			let part = snake_Parts[i];
			let numberX = Math.floor(Math.random() * tileCount);
			let numberY = Math.floor(Math.random() * tileCount);
			if(numberX != part.x && numberY != part.y){
				appleX = numberX;
				appleY = numberY;
			}
		}
		 
		tailLenght++;
		score++;
		gulp_sound.play();
	}
}

function changeSnakePosition(){
	snake_HeadX = snake_HeadX + xVelocity;
	snake_HeadY = snake_HeadY + yVelocity;
}

document.body.addEventListener('keydown', keyDown);



function keyDown(event){
	/*Keycode to remember:
	arrow up : 38
	arrow down : 40
	arrow left : 37
	arrow right : 39
*/
	if(event.keyCode == 38){
		if(yVelocity == 1)
			return;
		yVelocity = -1;
		xVelocity = 0;
	}
	if(event.keyCode == 40){
		if(yVelocity == -1)
			return;
		yVelocity = 1;
		xVelocity = 0;
	}
	if(event.keyCode == 37){
		if(xVelocity == 1)
			return;
		yVelocity = 0;
		xVelocity = -1;
	}
	if(event.keyCode == 39){
		if(xVelocity == -1)
			return;
		yVelocity = 0;
		xVelocity = 1;
	}
}

function drawScore(){
	context.fillStyle = 'white';
	context.font = "12px Verdana";
	context.fillText("Score : " + score, canvas.width - 70, 10);
}

function getXY(canvas, event){ //adjust mouse click to canvas coordinates
	const rect = canvas.getBoundingClientRect();
	const y = event.clientY - rect.top;
	const x = event.clientX - rect.left;
	return {x:x, y:y};
}

document.addEventListener("click",  function (e) {
	const XY = getXY(canvas, e);
	//use the shape data to determine if there is a collision
	if(context.isPointInPath(path, XY.x, XY.y)) {
		// Do Something with the click
		reload();
	}
}, false)

drawGame();