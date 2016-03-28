/**
* jQuery plugin to destroy a webpage
* 
* @author = mentosmenno2
*/

(function ($)
{	
	//all changeable settings and variables
	$settings = {
		popupTextColor: "red",
		startCountDownTextColor: "blue",
		gameCountDownTextColor: "grey",
		scoreKeeperTextColor: "white",
		resultsTextColor: "green",
		popupFontSize: "100px",
		startCountDownFontSize: "150px",
		gameCountDownFontSize: "150px",
		scoreKeeperFontSize: "50px",
		resultsFontSize: "50px",
		scoreKeeperBackgroundColor: "black",
		gameCountDownTime: 30,
		startCountDownTime: 3
	};

	//all not user-changeable variables
	$initVars = {
		score: 0,
		mouseX: 0,
		mouseY: 0,
		time: $.now(),
		finished: false
	};

	//all functions
	$methods = {

		//initialize the application
		init: function() {
			$("*").css({
				//set cursor to crosshair so it looks more like a shooting game
				"cursor": "url(http://www.rw-designer.com/cursor-extern.php?id=42287), default",
				//disable text selecting on website (so the elements wont be selected when you click very fast)
				"-webkit-touch-callout": "none",
				"-webkit-user-select": "none",
				"-khtml-user-select": "none",
				"-moz-user-select": "none",
				"-ms-user-select": "none",
				"user-select": "none",
			});
			//disable image dragging
			$("*").attr('draggable', false);

			//create a scorelabel at the bottom-right corner of the screen to display the total score so far
			$scoreLabel = $("<label class='not-me' id='destroyPageScoreLabel'>Score: " + $initVars.score + "</label>").css({
				"text-align": "center",
				"font-size": $settings.scoreKeeperFontSize, //user defined font size
				"font-family": "Arial",
				"color": $settings.scoreKeeperTextColor, //user defined color
				"background-color": $settings.scoreKeeperBackgroundColor, //user defined backgroundcolor
				"padding": "10px",
				"pointer-events": "none", //clicks go through this element
				"position": "absolute",
				"bottom": "0px",
				"right": "0px",
				"border-top-left-radius": "5px",
				"z-index":"9999999"
			}).appendTo("body"); //add it to the body

			//create a timer lable before the game starts and while playing the game
			$timer = $("<label class='not-me' id='destroyPageTimerLabel'>" + $settings.startCountDownTime + "</label>").css({
				"text-align": "center",
				"font-size": $settings.startCountDownFontSize, //user defined font size
				"font-family": "Arial",
				"color": $settings.startCountDownTextColor, //user defined color
				"opacity": "1",
				"width": "100%",
				"pointer-events": "none", //clicks go through this element
				"position": "absolute",
				"top": "20%",
				"left": "50%",
				"margin-top": "-100px",
				"margin-left": "-50%",
				"z-index":"9999999"
			}).appendTo( "body" ); //add it to the body

			//create a label that popups when you click on an element.
			$scorePopup = $("<label class='not-me' id='destroyPageScorePopupLabel'></label>").css({
				"font-size": $settings.popupFontSize, //user defined font size
				"font-family": "Arial",
				"color": $settings.popupTextColor, //user defined color
				"pointer-events": "none", //clicks go through this element
				"position": "absolute",
				"top": "0px",
				"left": "0px",
				"display": "none"
			}).appendTo( "body" ); //add it to the body

			//runs the pre-game countdown with the user defined pre-game countdown time
			$methods.countdown($settings.startCountDownTime);

			//start recording mouse position, to display score popups next to it later.
			$( document ).on( "mousemove", function( event ) {
				$initVars.mouseX = event.pageX;
				$initVars.mouseY = event.pageY;
			});

		},

		//countdown before game starts
		countdown: function($count) {
			$methods.playAudio("http://www.soundjay.com/button/beep-07.mp3", "http://www.soundjay.com/button/beep-07.wav"); //play sound
			$("#destroyPageTimerLabel").text($count.toFixed(0)); //set countdown label text
			setTimeout(function(){
				if ($count <= 1){
					//when countdown is at 0 run function startgame
					$methods.playAudio("http://www.soundjay.com/button/beep-06.mp3", "http://www.soundjay.com/button/beep-06.wav");
					$methods.startGame();
				}
				else {
					//every second run this function again to display the time untill it reached 0
					$methods.countdown($count-1);
				}
			}, 1000);
		},

		//this function "starts" the real game
		startGame: function() {
			$initVars.time = $.now(); //reset the time variable to the current time, so the $methods.displayScore function can determain the score for your click based on the time between good clicks
			$methods.gameTimer($settings.gameCountDownTime); //start the game timer to detect when game is finished
			
			//activate the click handler for the page
			$("*").on("click", function(e) {
				e.stopPropagation(); //click events wont change anything to the parents of this element
				e.preventDefault(); //click events on for example <a href> wont work anymore.
				
				/**
				* if the clicked element has no children, then run function $methods.removeElement.
				* some tags or classes are normally counted as children, thats why i count them and equal it to "no children"
				*/
				if ($(this).children().length == $(".not-me", $(this)).length + $("br", $(this)).length + $("DOCTYPE", $(this)).length + $("title", $(this)).length + $("link", $(this)).length + $("meta", $(this)).length + $("style", $(this)).length + $("script", $(this)).length + $("noscript", $(this)).length + $("hr", $(this)).length) {
					$methods.removeElement($(this));
				}
			});
		},

		/**
		* this function counts from a user defined number to 0.
		* it displays the remaining time in the webpage
		* when count reaches 0, finish the game
		* else run this function again for 100 milliseconds
		*/
		gameTimer: function($count) {
			//chenge label text to remaining time
			$("#destroyPageTimerLabel").text($count.toFixed(1)).css({
				"color": $settings.gameCountDownTextColor,
				"font-size": $settings.gameCountDownFontSize,
				"opacity": "0.5",
				"z-index":"9999999"
			});

			//when count = 0 run $methods.finishGame. Else count down 100 milliseconds again by running this function again.
			setTimeout(function(){
				if ($count <= 0.1) {
					if ($initVars.finished == false) { //if game is not finished yet
						$methods.finishGame(); //function $methods.finishGame
					}
				}
				else {
					$methods.gameTimer($count-0.1); //run this function agai to let another 100 milliseconds pass
			}
			}, 100);
		},

		//this function runs when the time is over
		finishGame: function() {
			$initVars.finished = true; //set variable $initvars.finished to true, so we can detect if already finished
			$methods.playAudio("http://s3.amazonaws.com/pb_sfx_previews/0024_objective_achieved_06/0024_objective_achieved_06"); //play audio
			//create a new div to display your score in and the played time. Add this to the body
			$timeLeft = $settings.gameCountDownTime.toFixed(1) - $("#destroyPageTimerLabel").text();
			$scoreLabel = $("<div class='not-me' id='destroyPageResultsPage'>Your score: " + $initVars.score + " in " + $timeLeft.toFixed(1) + " seconds<br/><button id='destroyPageBackToPageBtn'>Back to webpage</button></div>").css({
				"text-align": "center",
				"font-size": $settings.resultsFontSize, //user defined font size
				"line-height": $settings.resultsFontSize,
				"font-family": "Arial",
				"color": $settings.resultsTextColor, //user defined color
				"background-color": "white",
				"pointer-events": "auto",
				"position": "absolute",
				"left": "0px",
				"top": "0px",
				"width": "100%",
				"height": "100%",
				"border-top-left-radius": "5px",
				"cursor": "auto",
				"-webkit-touch-callout": "all",
				"-webkit-user-select": "all",
				"-khtml-user-select": "all",
				"-moz-user-select": "all",
				"-ms-user-select": "all",
				"user-select": "all",
				"z-index":"9999999"
			}).appendTo("body"); //add element to the body

			//if the "back to page" button in the created div is clicked, reload page
			$("#destroyPageBackToPageBtn").on("click", function(e) {
				location.reload();
			});
		},

		//delete the given element and run the $methods.displayScore function. (if there are still elements in the body)
		removeElement: function($selector) {

			//jquery special event, learned from https://learn.jquery.com/events/event-extensions/ and with help from http://stackoverflow.com/questions/2200494/jquery-trigger-event-when-an-element-is-removed-from-the-dom
			(function($){
				$.event.special.destroyed = { //make event destroyed
					remove: function(element) {
						if (element.handler) {
							element.handler() //detect when element is removed
						}
					}
				}
			})(jQuery)

			//when element is destroyed do $methods.displayScore()
			$($selector).bind('destroyed', function() {
				$methods.playAudio("http://www.freesfx.co.uk/rx2/mp3s/5/5909_1335863657.mp3"); //play sound
				$methods.displayScore();
			})

			if (!$initVars.finished) {
				$selector.remove();
			}
			//when body contains no clickable elements finish game
			if ($("body").children().length == $(".not-me", $("body")).length + $("br", $("body")).length + $("DOCTYPE", $("body")).length + $("title", $("body")).length + $("link", $("body")).length + $("meta", $("body")).length + $("style", $("body")).length + $("script", $("body")).length + $("noscript", $("body")).length + $("hr", $("body")).length){
				$methods.finishGame();
			}
		},

		//calculate and show the score popup for this clicked element, and the current score
		displayScore: function() {
			$timeout = setTimeout(function(){}, 300); //set an empty settimeout function as variable, so it doesn't give an error when i try to stop it.
			clearTimeout($timeout); //stop the previous timeout

			//calculations to generate a score based on clicking speed
			$time = (($.now() - $initVars.time)/15).toFixed(); //$.now is current time, $initVars.time is time of previous deleted element.
			$initVars.time = $.now(); //set $initVars.time to new deleted item time
			$score = 100 - $time //calculate the final score

			//if score is negative, set it to the minimum score of 1
			if ($score <= 0) {
				$score = 1;
			}

			//show popup of received score by click
			$("#destroyPageScorePopupLabel").text($score).css({
				"left": $initVars.mouseX+10 +"px",
				"top": $initVars.mouseY+10 +"px",
				"display":"block",
				"z-index":"9999999"
			});

			//update the score variable in $initVars and update it on the screej
			$initVars.score = parseInt($initVars.score)+parseInt($score);
			$("#destroyPageScoreLabel").text("Score: " + $initVars.score);

			//after 300 milliseconds make clicked score popup invisible
			$timeout = setTimeout(function(){
				$("#destroyPageScorePopupLabel").text($score).css({
					"display":"none"
				});
			}, 300);

		},

		//function to play audio
		playAudio: function($audiomp3, $audiowav) {
			//create audio element
			$audio = $("<audio class='not-me' preload='auto' autoplay><source src='" + $audiomp3 + "' type='audio/mpeg'><source src='" + $audiowav + "' type='audio/wav'></audio>");
			$audio.load(function() { //when loaded play
				$audio.play();
			});
		}

	};

	//plugin launch function
	$.fn.destroy = function ($options)
	{	
		//change standard options to user defined options
		if ($options) {
			$settings = $.extend($settings, $options);
		}
		$(this).off(); //make the element that triggered this plugin not clickable again
		
		$methods.init(); //run the init function

		return this;
	};
})(jQuery);