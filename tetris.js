const canvas=document.getElementById('tetris');
const context= canvas.getContext('2d');


//scale everything by 20
context.scale(20,20);

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

function playerReset(){
	const pieces='ILJOTSZQU';
	player.matrix=createPiece(pieces[pieces.length*Math.random()|0]);
	player.pos.y=0;
	player.pos.x=(arena[0].length/2|0)-(player.matrix[0].length/2|0);
	if(collide(arena,player)){
		gameOver();
	}
}


function gameOver(){
	alert('Game Over! Your Score was: '+ player.score);
	arena.forEach(row=>row.fill(0));
	whats_high_score();
	player.score=0;
	updateScore();

}

function playerRotate(dir){
	const pos = player.pos.x;
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

let dropCounter=0;
let dropInterval=1000;

let speed=document.getElementById('speed');
speed.onchange=  e => dropInterval=e.target.value

//dropInterval=target.value

let lastTime=0;
function update(time=0){
	const deltatime=time-lastTime;
	lastTime=time;

	dropCounter+=deltatime
	// if(pause_button.onclick =)
	if(dropCounter>dropInterval){
		playerDrop();
	}

	draw();
	requestAnimationFrame(update);
}

function updateScore(){
	document.getElementById('score').innerText = player.score;
}
const colors=[
	null,
	'#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
    '#B8BEC6',
    '#E20909',
]

const arena= createMatrix(12,20);

const player = {
	pos:{x:0, y:0},
	matrix:null,
	score: 0,
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
});

function restart(){
	const pieces='ILJOTSZQU';
	player.matrix=createPiece(pieces[pieces.length*Math.random()|0]);
	player.pos.y=0;
	player.pos.x=(arena[0].length/2|0)-(player.matrix[0].length/2|0);
		arena.forEach(row=>row.fill(0));
		player.score=0;
		updateScore();
}

function whats_high_score(){
	var high_score;
	if(player.score>high_score){
		localStorage.setItem('high_score',player.score);
	}
	updateHighScore();
	
}

function updateHighScore(){
	document.getElementById('highscorelist').innerText = "Current High Score: "+localStorage.getItem("high_score");
}

//  function pause(){
// // 	dropInterval=5000;
// alert("Game Paused."+" Your score is "+player.score)
//  }

// function play(){
// 	dropInterval=1000;
// }

let restart_button = document.getElementById('restart')
restart_button.onclick = restart;

// let pause_button = document.getElementById('pause')
// pause_button.onclick = pause;

// let play_button = document.getElementById('play')
// play_button.onclick = play;

var music = new Howl({
  src: ['arcade_music.wav'],
  autoplay: true,
  loop: true,
  volume: 0.5,
  onend: function() {
    console.log('Finished!');
  }
});

var success = new Howl({
  src: ['success_sound.wav'],
});

playerReset();
updateScore();
update();

