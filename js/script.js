'use strict'

window.onload = function(){
	
	setTimeout(function(){
		var game = new canvas_rpg_game();
		game.ready();
	}, 0);
}

function canvas_rpg_game(){
	var self = this;
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	
	var map = [];	
	
	var img = document.getElementById("map");	
	var sand = document.getElementById("sand");	
	var water = document.getElementById("water");	
	var grass = document.getElementById("grass");
	var character = document.getElementById("rabbit");
	
	var how_many_i = 0;
	var how_many_j = 0;
	var w, sand_w, water_w, grass_w = 0
	var h, sand_h, water_h, grass_h = 0;
	var tiles = 0;	
	
	var character_pos_x = 0;
	var character_pos_y = 0;
	
	this.ready = function(){
		self.main_structure();
		self.create_map(how_many_i, how_many_j, w, h);
		self.draw_map();
		self.draw_character();
		self.draw_character_movement();
		
		$(window).on('resize', function(){
			  self.main_structure();
			  self.draw_map();
		});
	}	
	
	this.main_structure = function(){
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight; 
		
		console.warn('how_many_i', how_many_i);
		console.warn('how_many_j', how_many_j);
		
		how_many_i = Math.floor(canvas.width/img.width)-12;
		how_many_j = Math.floor(canvas.height/img.width)-6;
		
		w = 160
		h = 160;
		
		water_w = 1200;
		water_h = 1200;
		
		grass_w = 1200;
		grass_h = 1200;
		
		sand_w = 1200;
		sand_h = 1200;
		
		tiles = 40;
	}
	
	this.draw_map = function(){	
	console.warn('map', map);
		var k = -1;	
		for(var i=0; i<how_many_i; i++){
			for(var j=0; j<how_many_j; j++){				
				ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = 0;	
				k++				
				if(map[k] == 0){
					//water
					var clip_x = 0;
					var clip_y = 0;	
					console.warn('000', clip_x, clip_y, water_w, water_h, i*tiles, j*tiles, w, h);
					ctx.drawImage(water, clip_x, clip_y, water_w, water_h, i*tiles, j*tiles, w, h);
				} else if(map[k] == 1){
					//land
					var clip_x = 24;
					var clip_y = 0;	
					console.warn('001', clip_x, clip_y, grass_w, grass_h, i*tiles, j*tiles, w, h);
					ctx.drawImage(grass, clip_x+50, clip_y+50, grass_w+50, grass_h+50, i*tiles, j*tiles, w, h);
				} else {
					var clip_x = 0;
					var clip_y = 0;	
					console.warn('002', clip_x, clip_y, sand_w, sand_h, i*tiles, j*tiles, w, h);
					ctx.drawImage(sand, clip_x+15, clip_y+15, sand_w+15, sand_h+15, i*tiles, j*tiles, w, h);
				}			
				
			}
		}

		ctx.font = "30px courier new";
		ctx.fillStyle = "red";
		ctx.fillText("Hello World", 10, 50);		
	}
	
	this.create_map = function(how_many_i, how_many_j, w, h){
		console.warn('how_many_i1', how_many_i);
		console.warn('how_many_j2', how_many_j);
		console.warn('w, h', w, h);
		
		var k = -1;
		for(var i=0; i<how_many_i; i++){
			for(var j=0; j<how_many_j; j++){
				k++
				if(Math.floor(Math.random()*2) == 0){
					map[k] = 0; // water
				} else {
					map[k] = 1; //land
				} 
			}
		}
		
		// create land and sea		
		for(var i = 0; i < map.length; i++){
			if(neighbours(map[i], i, how_many_i) <4){
				if(map[i] == 0){
					map[i] = 1;
				} else {
					map[i] = 0;
				}				
			}			
		}
		
		//create sand
		for(var i = 0; i < map.length; i++){
			check_shore(map[i], i, map.length)
		}
	}
	
	this.draw_character = function(){		
		var random_pos_character = 0;
		while(map[random_pos_character] == 0){
		  random_pos_character = Math.floor(Math.random() * (map.length - 1));		  
		}		
		
		var k = -1;
		for(var i=0; i<how_many_i; i++){
			for(var j=0; j<how_many_j; j++){
				k++
				if(k == random_pos_character){
					console.warn('random_pos_character', random_pos_character, i, j);
					ctx.drawImage(character, 55, 10, 40, 40, 40*i, 40*j, 40, 40);
					character_pos_x = 40*i;
					character_pos_y = 40*j;
				}
			}
		}			
	}
	
	this.draw_character_movement = function(){
		console.warn('pos1', character_pos_x, character_pos_y);
		document.onkeydown = checkKey;
	}	
	
	function checkKey(e) {	
		if (e.keyCode == '38') {
			console.warn('up');
			character_pos_x = character_pos_x;
			character_pos_y = character_pos_y-40;
			move(character_pos_x, character_pos_y);
		}
		else if (e.keyCode == '40') {
			console.warn('down');
			character_pos_x = character_pos_x;
			character_pos_y = character_pos_y+40;
			move(character_pos_x, character_pos_y);
		}
		else if (e.keyCode == '37') {
			console.warn('left');
			character_pos_x = character_pos_x-40;
			character_pos_y = character_pos_y;
			move(character_pos_x, character_pos_y);
		}
		else if (e.keyCode == '39') {
			console.warn('right');
			character_pos_x = character_pos_x+40;
			character_pos_y = character_pos_y;
			move(character_pos_x, character_pos_y);
		}
	}
	
	function move(character_pos_x, character_pos_y){
		console.warn('pos', character_pos_x, character_pos_y);	
		self.draw_map();	
		ctx.drawImage(character, 55, 10, 40, 40, character_pos_x, character_pos_y, 40, 40);
	}
	
	function neighbours(value, i){
		var amount = 0;
				
		if(map[i-how_many_j-1] == value){
			amount++
		}
		if(map[i-how_many_j] == value){
			amount++
		}
		if(map[i-how_many_j+1] == value){
			amount++
		}
		if(map[i-1] == value){
			amount++
		}
		if(map[i+1] == value){
			amount++
		}
		if(map[i+how_many_j-1] == value){
			amount++
		}
		if(map[i+how_many_j] == value){
			amount++
		}
		if(map[i+how_many_j+1] == value){
			amount++
		}		
		
		return amount;
	}

	function check_shore(value, i){		
		if(map[i] == 1){
			//console.warn('map-iii', i);
			if(map[i-how_many_j-1] == 0 || map[i-how_many_j] == 0 || map[i-how_many_j+1] == 0 || map[i-1] == 0 || map[i+1] == 0 || map[i+how_many_j-1] == 0 || map[i+how_many_j] == 0 || map[i+how_many_j+1] == 0){
				//console.warn('map-iii', i, map[i-how_many_j-1] == 0 , map[i-how_many_j] == 0 , map[i-how_many_j+1] == 0 , map[i-1] == 0 , map[i+1] == 0 , map[i+how_many_j-1] == 0 , map[i+how_many_j] == 0 , map[i+how_many_j+1] == 0);
				map[i] = 2
			}			
		}
	}

	
	
}