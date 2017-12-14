//Ain't Gonna Work on Saturday- Saturday is the Jewish Sabbath, known as "Shabbos",
//it is the Jewish day of rest- and as such, my website will not run if it is Saturday
function Shabbosredirect(){
				window.location.href = "http://www.chabad.org/library/article_cdo/aid/633659/jewish/What-Is-Shabbat.htm";
				console.log("Shabbos!")
	        }
//checks if it's Saturday
var now = new Date();
if (now.getDay()===6) {
	var answer= prompt("It is Shabbos today! You are being redirected.");
	//allows to override the redirect if you type "shabbos is over"
	if (answer==="shabbos is over"){
		alert("Shavuah Tov!");
		console.log("Shavuah tov");
	}
	else Shabbosredirect();
}
//if it's not, it will tell you how many days until Shabbos
else console.log(6-now.getDay()+" days until Shabbos!");

//We often play games very late at night, this will not allow you to play between 1am and 6am
function Bedtimeredirect(){
		window.location.href = "https://sleepjunkies.com/blog/video-games-sleep-habits/";
		alert("Go to sleep!")
}
//checks time
var currentTime = new Date();
console.log(currentTime)
console.log(currentTime.getHours()+":"+currentTime.getMinutes())
if(currentTime.getHours()<6 && currentTime.getHours()>=2 ){
	document.write("It's too late to be playing!");
	Bedtimeredirect();
}
else console.log("not between 1:30am-6:30am");

//The actual game code starts here

//create canvas
const canvas=document.getElementById('tetris');
const context= canvas.getContext('2d');
//create next piece canvas
const nextCanvas = document.getElementById('next');
const nextPieceContext= nextCanvas.getContext('2d');

//scale game by 20
context.scale(20,20);
//scale next piece by 50
nextPieceContext.scale(50,50);

function arenaSweep(){
	let rowCount=1;
	outer: for (let y=arena.length-1; y>0; --y){
		for(let x=0; x<arena[y].length; ++x){
			if(arena[y][x]===0){
				continue outer;
			}
		}
		//when row gets cleared, play this sound
		success.play();
		//takes row out at y and fills it with 0
		const row= arena.splice(y,1)[0].fill(0);
		//put it back on top
		arena.unshift(row);
		++y;
			player.score+=rowCount*10;
			rowCount*=2;
	}
}

//checking if it collides with the walls or the bottom of the canvas or with any other pieces
function collide(arena,player){
	const [m, o]=[player.matrix, player.pos];
	for(let y=0; y<m.length; ++y){
		for(let x=0; x<m[y].length; ++x){
			if(m[y][x]!==0 && (arena[y+o.y] && arena[y+o.y][x+o.x])!==0){
				return true;
			}
		}
	}
	return false;
}

//saves already placed pieces
function createMatrix(w,h){
	const matrix=[];
	while(h--){
		matrix.push(new Array(w).fill (0));
	}
	return matrix;
}

function createPiece(type){
	if(type==='T'){
		return [
			[0,0,0],
			[1,1,1],
			[0,1,0],
		];
	}
	else if(type==='O'){
		return [
			[2,2],
			[2,2],
		];
	}
	else if(type==='L'){
		return [
			[0,3,0],
			[0,3,0],
			[0,3,3],
		];
	}
	else if(type==='J'){
		return [
			[0,4,0],
			[0,4,0],
			[4,4,0],
		];
	}
	else if(type==='I'){
		return [
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
		];
	}
	else if(type==='S'){
		return [
			[0,6,6],
			[6,6,0],
			[0,0,0],
		];
	}
	else if(type==='Z'){
		return [
			[7,7,0],
			[0,7,7],
			[0,0,0],
		];
	}
	else if(type==='Q'){
		return [
			[8,8,0],
			[8,8,8],
			[0,0,0],
		];
	}
	else if(type==='U'){
		return [
			[9,0,9],
			[9,9,9],
			[0,0,0],
		];
	}
	else if(type==='R'){
		return [
			[0,10,10],
			[10,10,10],
			[0,0,0],
		];
	}
	else if(type==='R'){
		return [
			[0,10,10],
			[10,10,10],
			[0,0,0],
			[0,0,0],
		];
	}
}

//general draw function
function draw(){
	context.fillStyle='#000';
	context.fillRect(0,0,canvas.width, canvas.height);
	drawMatrix(arena, {x:0, y:0});
	drawMatrix(player.matrix, player.pos);
}

//draw the piece
function drawMatrix(matrix, offset){
	matrix.forEach((row, y) =>{
		row.forEach((value,x) =>{
			if(value!==0){
				context.fillStyle=colors[value];
				context.fillRect(x+offset.x, y+offset.y, 1, 1);
			}
		});
	});
}

function merge(arena, player){
	player.matrix.forEach((row, y)=> {
		row.forEach((value, x) =>{
			if(value!==0){
				arena[y+player.pos.y][x+player.pos.x]= value;
			}
		});
	});
}

function playerDrop(){
	//check if music is playing, if not, play it
	if(music.playing()==false) music.play();
	//the rest of this function starts dropping the piece
	player.pos.y++;
	if(collide(arena,player)){
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter=0;
}

function playerMove(dir){
	player.pos.x+=dir;
	if(collide(arena,player)){
		player.pos.x-=dir;
	}
}

function get_random_piece() {
	const pieces='ILJOTSZQUR';
	return createPiece(pieces[pieces.length*Math.random()|0]);
}

function updatePieces() {
	if (player.matrix === null) {
		player.matrix  = get_random_piece();
		player.nextPiece = get_random_piece();
	} else {
		player.matrix = player.nextPiece;
		player.nextPiece = get_random_piece();
	}
}

function updateText() {
	nextPieceContext.fillStyle='#202028';
	nextPieceContext.fillRect(0,0,nextCanvas.width, nextCanvas.height);
	player.nextPiece.forEach((row, y) =>{
		row.forEach((value,x) =>{
			if(value!==0){
				nextPieceContext.fillStyle=colors[value];
				nextPieceContext.fillRect(x, y, 1, 1);
			}
		});
	});
}

function playerReset(){
	updatePieces();
	updateText();
	//resets the player back to first position, putting the piece in the top, center
	player.pos.y=0;
	player.pos.x=(arena[0].length/2|0)-(player.matrix[0].length/2|0);
	if(collide(arena,player)){
		gameOver();
	}
}

//what happens when you lose
function gameOver(){
	music.stop();
	game_over.play();
	if(player.score>localStorage.getItem("high_score"))
		alert('Game Over! Your Score was: '+ player.score+'\nHigh Score: '+localStorage.getItem("high_score")+'\nNew High Score: '+ player.score);
	else
		alert('Game Over! Your Score was: '+ player.score+'\nHigh Score: '+localStorage.getItem("high_score"));
	//wipes board
	arena.forEach(row=>row.fill(0));
	whats_high_score();
	player.score=0;
	updateScore();
}

//rotating the current piece
function playerRotate(dir){
	const pos = player.pos.x;
	//what to do if pieces will go into each other's space
	let offset=1;
	rotate(player.matrix, dir);
	while(collide(arena, player)){
		player.pos.x+=offset;
		offset= -(offset+(offset>0?1:-1));
		if(offset>player.matrix[0].length){
			rotate(player.matrix,-dir);
			player.pos.x=pos;
			return;
		}
	}
}

//the actual rotation of the piece- transposing the matrix by switching
//rows and columns to rotate the piece properly
function rotate(matrix, dir){
	for(let y=0; y<matrix.length; ++y){
		for(let x=0; x<y; ++x){
			[
				matrix[x][y],
				matrix[y][x],
			]
				=
			[
				matrix[y][x],
				matrix[x][y],
			];
		}
	}
	if(dir>0){
		matrix.forEach(row=>row.reverse());
	}
	else{
		matrix.reverse();
	}
}

//pieces drop 1 space every 1 sec
let dropCounter=0;
let dropInterval=1000;

let speed=document.getElementById('speed');
speed.onchange=  e => dropInterval=e.target.value


let lastTime=0;

function update(time=0){
	const deltatime=time-lastTime;
	lastTime=time;
	dropCounter+=deltatime
	if(dropCounter>dropInterval){
		playerDrop();
	}
	//keep track of pause state
	if(player.pause==false){
		draw();
		requestAnimationFrame(update);
	}
}

//get HS from memory
function updateScore(){
	document.getElementById('score').innerText = player.score;
}

//correspond to numbers on game pieces
const colors=[
	null,
	//1- pink- T
	'#FF0D72',
	//2- light blue- O
    '#0DC2FF',
    //3- light green- L
    '#0DFF72',
    //4- purple-ish- J
    '#F538FF',
    //5- orange- I
    '#FF8E0D',
    //6- yellow- S
    '#FFE138',
    //7- darker blue- Z
    '#3877FF',
    //8- gray-ish- Q
    '#B8BEC6',
    //9- red- U
    '#E20909',
    //10
    '#FFFFFF',
]

const arena= createMatrix(12,20);

//Player keeps track of current piece
const player = {
	pos:{x:0, y:0},
	matrix:null,
	nextPiece: null,
	score: 0,
	pause: false
}

//key controls
document.addEventListener('keydown', event=>{
	//if left arrow is clicked, move to the left
	if(event.keyCode===37){
		playerMove(-1);
	}
	//if right arrow is clicked, move to the right
	else if(event.keyCode===39){
		playerMove(+1);
	}
	//if down arrow is clicked, move down
	else if(event.keyCode===40){
		playerDrop();
	}
	//if 'Q' is clicked, rotate to the left
	else if(event.keyCode===81){
		playerRotate(-1);
	}
	//if 'W' is clicked, rotate to the right
	else if(event.keyCode===87){
		playerRotate(1);
	}
	//if 'P' is clicked, pause
	else if(event.keyCode===80){
		playtopause();
		if(player.pause == true){
			player.pause=false;
			music.play();
			update();
		}
		else{
			player.pause=true
			music.pause();
		}
	console.log(player)
	}
	//if 'R' is clicked, pause
	else if(event.keyCode===82){
		restart();
	}
	//if "E" is clicked, exchange for new piece
	else if(event.keyCode===69){
		if(player.score>=10){
			player.score-=10;
			updateScore();
			playerReset();
		}
	}
});

//restart button restarts the game
function restart(){
	changestart();
	music.stop();
		arena.forEach(row=>row.fill(0));
		player.score=0;
		playGame();
}

//changes start/restart button
function changestart(){
	if(document.getElementById("restart").value=="Start") document.getElementById("restart").value="Restart";
}

//changes play/pause button
function playtopause(){
	if(document.getElementById("pause").value=="Pause") document.getElementById("pause").value="Play";
	else document.getElementById("pause").value="Pause";
}

//checks the HS
function whats_high_score(){
	var high_score = localStorage.getItem("high_score")
	high_score = high_score || 0
	if(player.score>high_score){
		localStorage.setItem('high_score',player.score);
		high_score = player.score
	}
	updateHighScore(high_score);

}

//updates HS
function updateHighScore(high_score){
	document.getElementById('highscorelist').innerText = "\nCurrent High Score: "+high_score;
}

let restart_button = document.getElementById('restart')
restart_button.onclick = restart;


let pause_button = document.getElementById('pause')
pause_button.onclick = function(){
	playtopause();
	if(player.pause == true){
		player.pause=false
		music.play();
		update()
	}
	else{
		player.pause=true
		music.pause();
	}
	console.log(player)
}

var music = new Howl({
  src: ['arcade_music.wav'],
  autoplay: false,
  loop: true,
  volume: 0.5,
  onend: function() {
    console.log('Finished!');
  }
});

var success = new Howl({
  src: ['success_sound.wav'],
});

var game_over = new Howl({
  src: ['game_over.wav'],
});

function playGame(){
	playerReset();
	updateScore();
	update();
	whats_high_score();
}