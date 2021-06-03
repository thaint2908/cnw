$(document).ready(function()
{
	"use strict";

	
	function decodeToken(){
		var cookie = document.cookie;
		if(cookie!=""){
		const token = document.cookie.split(';').filter(el => el.trim().startsWith('token='))[0].split('=')[1];
		function parseJwt (token) {
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
			return JSON.parse(jsonPayload);
		};
	
		return parseJwt(token);
		}else{
			return document.cookie;
		}
	}
	var info = decodeToken();
	console.log(info);
	
	
	function setHidden(){
		var hiddenItems = document.querySelectorAll("#hidden_item");
		var butmore = document.getElementById("but_more");
		var textlog = document.getElementById("text_log");
		var dashboard = document.getElementsByClassName("dashboard")[0];

		for(var i =0; i< hiddenItems.length; i++){
			if (info !="" ){
				hiddenItems[i].style.display= "inline-block";
				butmore.style.display= "inline-block";
				textlog.innerHTML = "LogOut"
			}else{
				hiddenItems[i].style.display= "none";
				butmore.style.display= "none";
			}
		}
		
		dashboard.style.display= (!info.role) ? "inline-block":"none";

	}
	setHidden();

// pop list ******************************************/
fetch("http://localhost:8080/backend/featureProduct")
.then((response)=> {
	return response.json()
})
.then((pros)=>{
	var htmls =[];
		for (var i =0; i<9; i++){
		htmls.push( `<div class="col-lg-4 product_col">
		<div class="product">
			<div class="product_image"><img src="${pros[i].imageURL}" alt=""></div>
			<div class="product_body">
				<h3 class="product_title"><a href="/product">${pros[i].name}</a></h3>
				<div class="product_teacher">${pros[i].origin}</div>
				<div class="product_text">
					<p>${pros[i].summaryDescription}</p>
				</div>
			</div>
			<div class="product_footer">
				<div class="product_footer_content d-flex flex-row align-items-center justify-content-start">
					<div class="product_info">
						<i class="fa fa-cubes" aria-hidden="true"></i>
						<span>${pros[i].amount} sản phẩm</span>
					</div>
					<div class="product_info">
						<i class="fa fa-star" aria-hidden="true"></i>
						<span>${pros[i].productRating.avgRating.toPrecision(2)}/5 Ratings</span>
					</div>
					<div class="product_price ml-auto">VND ${pros[i].price}</div>
				</div>
			</div>
		</div>
	</div>`)
		}
		document.getElementById("list_pop").innerHTML= htmls.toString().replace(/,/g, "");
})


	var header = $('.header');
	var menuActive = false;
	var menu = $('.menu');
	var burger = $('.hamburger');
	var ctrl = new ScrollMagic.Controller();

	setHeader();
	$(window).on('resize', function()
	{
		setHeader();
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initMenu();
	initHeaderSearch();
	initHomeSlider();
	initMilestones();

	/* 

	2. Set Header

	*/

	function setHeader()
	{
		if($(window).scrollTop() > 100){
			header.addClass('scrolled');
		}else{
			header.removeClass('scrolled');
		}
	}

	/* 

	3. Bonus menu

	*/

	function initMenu()
	{
		if($('.menu').length)
		{
			var menu = $('.menu');
			if($('.hamburger').length)
			{
				burger.on('click', function()
				{
					if(menuActive)
					{
						closeMenu();
					}
					else
					{
						openMenu();

						$(document).one('click', function cls(e)
						{
							if($(e.target).hasClass('menu_mm'))
							{
								$(document).one('click', cls);
							}
							else
							{
								closeMenu();
							}
						});
					}
				});
			}
		}
	}

	function openMenu()
	{
		menu.addClass('active');
		menuActive = true;
	}

	function closeMenu()
	{
		menu.removeClass('active');
		menuActive = false;
	}

	/* 

	4. Search

	*/

	function initHeaderSearch()
	{
		if($('.search_button').length)
		{
			$('.search_button').on('click', function()
			{
				if($('.header_search_container').length)
				{
					$('.header_search_container').toggleClass('active');
				}
			});
		}
	}

	/* 

	5. Slide 

	*/

	function initHomeSlider()
	{
		if($('.home_slider').length)
		{
			var homeSlider = $('.home_slider');
			homeSlider.owlCarousel(
			{
				items:1,
				loop:true,
				autoplay:true,
				nav:false,
				dots:false,
				smartSpeed:1200
			});

			if($('.home_slider_prev').length)
			{
				var prev = $('.home_slider_prev');
				prev.on('click', function()
				{
					homeSlider.trigger('prev.owl.carousel');
				});
			}

			if($('.home_slider_next').length)
			{
				var next = $('.home_slider_next');
				next.on('click', function()
				{
					homeSlider.trigger('next.owl.carousel');
				});
			}
		}
	}

	/* 

	6. auto numbers

	*/

	function initMilestones()
	{
		if($('.milestone_counter').length)
		{
			var milestoneItems = $('.milestone_counter');

	    	milestoneItems.each(function(i)
	    	{
	    		var ele = $(this);
	    		var endValue = ele.data('end-value');
	    		var eleValue = ele.text();

	    		var signBefore = "";
	    		var signAfter = "";

	    		if(ele.attr('data-sign-before'))
	    		{
	    			signBefore = ele.attr('data-sign-before');
	    		}

	    		if(ele.attr('data-sign-after'))
	    		{
	    			signAfter = ele.attr('data-sign-after');
	    		}

	    		var milestoneScene = new ScrollMagic.Scene({
		    		triggerElement: this,
		    		triggerHook: 'onEnter',
		    		reverse:false
		    	})
		    	.on('start', function()
		    	{
		    		var counter = {value:eleValue};
		    		var counterTween = TweenMax.to(counter, 4,
		    		{
		    			value: endValue,
		    			roundProps:"value", 
						ease: Circ.easeOut, 
						onUpdate:function()
						{
							document.getElementsByClassName('milestone_counter')[i].innerHTML = signBefore + counter.value + signAfter;
						}
		    		});
		    	})
			    .addTo(ctrl);
	    	});
		}
	}

	
});