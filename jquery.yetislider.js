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
			images = viewer.find('img'),
			height = [],
			width = [],
			biggestWidth = null,
			biggestHeight = null;
		
		(function initSlider(){

			//wait for images to finish loading
			$(window).load(function(){

				$.each(images, function(index, image){
       				height.push(image.height);
       				width.push(image.width);
   			 	});
   			 	
   			 	biggestWidth = Math.max.apply(null, width);
   			 	biggestHeight = Math.max.apply(null, height);
  				
  				viewer.css({'height': biggestHeight, 'width': biggestWidth});

  				viewer.append('<div class="yeti-wrapper"/>');
  				viewerWrapper = $('.yeti-wrapper');
  				viewerWrapper.css({'width': (biggestWidth * images.length)});
  				images.appendTo(viewerWrapper);


  				
/*  				var prev = '<a href="#" id="prevBtn">Prev</a>';
  				var next = '<a href="#" id="nextBtn">Next</a>';
  				var position = viewer.position();
  				var posRight = biggestWidth - 85;*/
/*  				
  				viewerWrapper.prepend(prev);
				viewerWrapper.prepend(next);*/

				var prevBtn = $('#prevBtn');
				var nextBtn = $('#nextBtn');
				//nextBtn.css({'left':posRight});

				var leftPos = viewer.scrollLeft();
				

				// set up controls for previous button
				prevBtn.on('click', function(e){
					e.preventDefault();
					
					viewer.animate({scrollLeft: leftPos - biggestWidth}, 400);
					if(leftPos > 0){
						leftPos -= biggestWidth;
						if(leftPos === 0){
						prevBtn.css({'opacity': 0.5, 'cursor': 'not-allowed'});
						}
					}

					if(leftPos <= viewerWrapper.width() - biggestWidth){
						nextBtn.css({'opacity': 1, 'cursor': 'auto'});
					}
					
				});
				
				// set up controlers for next btn
				nextBtn.on('click', function(e){
					e.preventDefault();
					
					viewer.animate({scrollLeft: leftPos + biggestWidth}, 400);
					leftPos += biggestWidth;
					
					if(leftPos >= biggestWidth){
						prevBtn.css({'opacity': 1, 'cursor': 'auto'});
					}

					if(leftPos >= viewerWrapper.width() - biggestWidth){
						
						nextBtn.css({'opacity': 0.5, 'cursor': 'not-allowed'});
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