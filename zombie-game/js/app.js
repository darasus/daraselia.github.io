/*global BLOCKS, window, document */
/*jshint loopfunc:true */

(function () {
				
    var game, spec;

    var attackDuration = 30000;
    var attackDurationTimer = attackDuration/1000;
    var numHits = 0;
	var startScreen = document.getElementById("startScreen");
	var resultScreen = document.getElementById("resultScreen");
	var numHitsView = document.getElementById("numHits");
    var startButton = document.getElementById("clk");
    var restartButton = document.getElementById("restart");
    var timer = document.getElementById("timer");
    
    spec = {
		width: 375,
		height: 560,
		scale: 1,
		bg: {
			src: "images/bg.jpg"
		},
		zombies:[{
			name: "granny",
			slices: [{
				name: "falling",
				src: "images/granny.png"
			}]
		}, {
			name: "stripper",
			slices: [{
				name: "falling",
				src: "images/stipper.png"
			}]
		}, {
			name: "skateboarder",
			slices: [{
				name: "falling",
				src: "images/skateboarder.png"
			}]
		}]
	};
    
	game = BLOCKS.game(spec);
    
    game.prepare = function () {
    
		var bg, 
			index = 0, 
			structure, 
			zombies = [],
			ground = game.height - 20,
			
			gameTapped = function (point) {
			
				var i;
				
				for (i = 0; i < zombies.length; i += 1) {

					if (zombies[i].isPointInside(point)) {
					
						zombies[i].removeMotors();
						game.addMotor("alpha", {
							object: zombies[i],
							duration: 500,
							amount: -1
						});
						game.addTicker(destroyZombies, 500, zombies[i]);
						numHits++;
					}
				}
			},
						
			destroyZombies = function (zombie) {
			
				var i;
								
				for (i = 0; i < zombies.length; i += 1) {
					if (zombie === zombies[i]) {
						zombies.splice(i, 1);
						break;
					}
				}
				game.stage.removeView(zombie);
				zombie.destroy();
				zombie = null;
			},

			dropZombie = function () {

				var zombie,
				
					melt = function () {

						game.addMotor("alpha", {
							object: zombie,
							duration: 1000,
							amount: -1,
							easing: "easeIn",
							callback: function () {
								destroyZombies(zombie);
							}
						});
						
						zombie.cropHeight = zombie.height;
						game.addMotor("cropHeight", {
							object: zombie,
							duration: 500,
							amount: -zombie.height,
							easing: "easeIn"
						});

						game.addMotor("y", {
							object: zombie,
							duration: 500,
							amount: zombie.height,
							easing: "easeIn"
						});

					};

				zombie = BLOCKS.block(spec.zombies[Math.floor(Math.random() * spec.zombies.length)]);
				zombie.layer = game.layers[2];
				game.stage.addView(zombie);
				zombies.push(zombie);

				zombie.x = Math.random() * (game.width - zombie.width);
				zombie.y = -zombie.height;

				game.addMotor("y", {
					object: zombie,
					duration: 1000,
					amount: ground,
					easing: "linear",
					callback: function () {
						game.addTicker(melt, 1000);
					}
				});

				game.addTicker(dropZombie, 600);

			};

		bg = BLOCKS.slice(spec.bg);
		bg.layer = game.layers[0];
		game.stage.addView(bg);
		game.controller.addEventListener("tap", gameTapped);
		startScreen.classList.add("visible");

		startButton.addEventListener("click", function(){
			startScreen.classList.remove("visible");
			dropZombie();
			timer.innerHTML = attackDurationTimer;
			var timerInterval = setInterval(function() {
			    timer.innerHTML = --attackDurationTimer;
			    if (attackDurationTimer <= 0) {
			       	clearInterval(timerInterval);
			    }
			}, 1000);
			setTimeout(function(){
				game.destroy();
				resultScreen.classList.add("visible");
				numHitsView.innerHTML = numHits;
			}, attackDuration);
		});
		restartButton.addEventListener("click", function(){
			location.reload();
			/*
			numHits = 0;
			resultScreen.classList.remove("visible");
			game = BLOCK.game(spec);
			dropZombie();
			timer.innerHTML = attackDurationTimer;
			var timerInterval = setInterval(function() {
			    timer.innerHTML = --attackDurationTimer;
			    if (attackDurationTimer <= 0) {
			    	timer.innerHTML = 0;
			       	clearInterval(timerInterval);
			    }
			}, 1000);
			setTimeout(function(){
				game.destroy();
				resultScreen.classList.add("visible");
				numHitsView.innerHTML = numHits;
			}, attackDuration);
*/
		});
    };
}());