/* yetiSlider 
*  version: 0.0.1
*  author: Brandan Majeske
*  Date: Feb 7, 2014
*/

(function ( $ ) {
 
	$.fn.yetislider = function(options){

		// Default Settings
	    var defaults = {
			'autoscroll': true,
			'touch': true,
			'fade': false,
			'speed': 'super-slow' // fast, medium, slow, default is super-slow
	    };
	    // extend options with the default settings
	    var options = $.extend( {}, defaults, options );

		// add yetislider css to the head
		var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = 'css/yetistyles.css';    
			document.getElementsByTagName('head')[0].appendChild(link);

		//set size of the slider viewer
		var viewer = $('.yetislider'),
			viewerWidth = viewer.width(),
			images = viewer.find('img'),
			height = [],
			width = [],
			biggestWidth = null,
			biggestHeight = null;
		
		(function initSlider(){

			//wait for images to finish loading
			$(window).load(function(){

				// Ideally the images should be the same height and width
				$.each(images, function(index, image){
       				
					if(image.width > viewerWidth){
  						image.width = viewerWidth;
  					}
       				height.push(image.height);
       				width.push(image.width);
   			 	});


   			 	biggestWidth = Math.max.apply(null, width);
   			 	biggestHeight = Math.max.apply(null, height);
  			

  				viewer.css({'height': biggestHeight, 'width': biggestWidth});
  				viewer.append('<div class="yeti-wrapper"/>');
  				viewerWrapper = $('.yeti-wrapper');
  				viewerControls = $('.yeti-controls');
  				viewerWrapper.css({'width': (biggestWidth * images.length)});
 				images.appendTo(viewerWrapper);


  				
  				var prev = '<a href="#" class="yeti-controlBtn" id="prevBtn"></a>',
	  				next = '<a href="#" class="yeti-controlBtn" id="nextBtn"></a>';
					$(prev).appendTo(viewerControls);
					$(next).appendTo(viewerControls);
					viewerControls.css({'top': (biggestHeight/2) + 25});


				var prevBtn = $('#prevBtn');
				var nextBtn = $('#nextBtn');
				//nextBtn.css({'left':posRight});

				var leftPos = viewer.scrollLeft();
				

				// set up controls for previous button
				prevBtn.on('click', function(e){

					if(leftPos === 0) {
						return false;
					}

					e.preventDefault();
					
					viewer.animate({scrollLeft: leftPos - biggestWidth}, 200);
					if(leftPos > 0){
						leftPos -= biggestWidth;
						if(leftPos === 0){
						prevBtn.css({'opacity': 0.5, 'cursor': 'not-allowed'});
						}
					}

					if(leftPos <= viewerWrapper.width() - biggestWidth){
						nextBtn.css({'opacity': 1, 'cursor': 'auto'});
					}
						
					// if Fade option is true
					if(options.fade === true){	
						viewerWrapper.stop().animate({'opacity':0},0).animate({'opacity':1},1800);
					}

				});
				
				// set up controlers for next btn
				nextBtn.on('click', function(e){
					e.preventDefault();
					
					viewer.animate({scrollLeft: leftPos + biggestWidth}, 200);
					if(leftPos != viewerWrapper.width() - biggestWidth){
						leftPos += biggestWidth;
						console.log(leftPos);
					} else {
						console.log('no more pics foo!');
						return false;
					}


					if(leftPos >= biggestWidth){
						prevBtn.css({'opacity': 1, 'cursor': 'auto'});
					}

					if(leftPos >= viewerWrapper.width() - biggestWidth){
						
						nextBtn.css({'opacity': 0.5, 'cursor': 'not-allowed'});

					}

					// if Fade option is true
					if(options.fade === true){
						if(leftPos != viewerWrapper.width()){
							viewerWrapper.stop().animate({'opacity':0},0).animate({'opacity':1},1800);
						} 
					}
				});

				// ** Autoscroll controls ** //

				if(options.autoscroll === true){

					var counter = 1,
						numImg = images.length,
						interval = options.interval,
						leftPos = viewer.scrollLeft();
						speed = options.speed;
					
					switch(speed)
						{
						case 'fast':
						  	speed = 6000; // 6 sec
						  	break;
						case 'medium':
						  	speed = 8000; // 8 sec
						  	break;
						case 'slow':
							speed = 10000; // 10 sec
							break;
						default:
						  	speed = 12000; // 12 sec
						};



					// AutoScroll function to advance slider
					function autoScrollStart(){
							
							// advance slider and 
							if(counter < numImg || leftPos < viewerWrapper.width() - biggestWidth){
								viewer.animate({scrollLeft: leftPos + biggestWidth}, 400);
								leftPos += biggestWidth;
								counter += 1;
								
							} else {
							// move slider back to start and reset counter and leftPos
								viewer.animate({scrollLeft: 0 }, 400);
								leftPos = 0;
								counter = 0;
							}
					};

					// Create a timer that calls AutoScrollStart at an interval
					var timer = setInterval(autoScrollStart, speed);

					// When viewer is hovered clear the interval on timer
					// Update control css on hover
					viewer.hover(function(){
							if(leftPos === 0){
								prevBtn.css({'opacity': 0.5, 'cursor': 'not-allowed'});
							} else {
								prevBtn.css({'opacity': 1, 'cursor': 'auto'});
							}
							
							nextBtn.css({'opacity': 1});
							clearInterval(timer);

					}, function(){
					// restart the timer, calling autoscroll at an interval
					    	timer = setInterval(autoScrollStart, speed);		
					    	prevBtn.css({'opacity': 0});
							nextBtn.css({'opacity': 0});
					});

					$('.yeti-controlBtn').hover(function(){
							// check position of slides, if no previous slides available, disable prev btn
							if(leftPos === 0){
								prevBtn.css({'opacity': 0.5, 'cursor': 'not-allowed'});
							} else {
								prevBtn.css({'opacity': 1, 'cursor': 'auto'});
							}
							
							// Check position of the slides, disable the nextBtn if no new slides available
							if(leftPos >= viewerWrapper.width() - biggestWidth){
						
							nextBtn.css({'opacity': 0.5, 'cursor': 'not-allowed'});
							} else {
								nextBtn.css({'opacity': 1});
							}
							clearInterval(timer);
							
						console.log('over the buttons');
					}, function(){
						prevBtn.css({'opacity': 0});
						nextBtn.css({'opacity': 0});
						timer = setInterval(autoScrollStart, speed);
					});
					    		
				} // End Auto Scroll

				// ** Touch Events ** //

				if(options.touch === true){
				
					var touchMe = $('.touchme'),
						direction = null;

					touchMe.css({'display':'block', 'height': '2em', 'background-color':'pink'});

					viewer.on('touchstart', function(e){
						e.preventDefault();
						lastPosition = e.originalEvent.touches[0].pageX;
						touchMe.html(lastPosition);
					});

					viewer.on('touchmove', function(e){
						e.preventDefault();
						currentPosition = e.originalEvent.touches[0].pageX;


						// Depending on direction of swipe, move slide position
						if(currentPosition < lastPosition){

							direction = 'right';
							touchMe.html('right');

						} else {

							direction = 'left';
							touchMe.html('left');
						}
						lastPosition = currentPosition;
						if(options.autoscroll){
							clearInterval(timer);
						}	
					});

					viewer.on('touchend', function(e){
						e.preventDefault();

						if(direction === 'right'){
							viewer.animate({scrollLeft: leftPos + biggestWidth}, 400);
							leftPos += biggestWidth;
						}

						if(direction === 'left'){
							// Move Left 
							viewer.animate({scrollLeft: leftPos - biggestWidth}, 400);
							
							if(leftPos > 0){
								leftPos -= biggestWidth;
							}
						}

						if(options.autoscroll === true){
							timer = setInterval(autoScrollStart, speed);
						}
					});

				} // end Touch
				
			}); // Window Load

		})();

		
 	}; // end $.fn.yetislider

}( jQuery ));