$(document).ready(function(){

	"use strict";
	const token = document.cookie.split(';').filter(el => el.trim().startsWith('token='))[0]
		.split('=')[1];

	if(token){
		const auth = document.getElementById("auth")
		const logout = document.createElement("a");
		logout.href = '/login';
		logout.innerHTML="Logout";
		logout.onclick= ()=> {
			document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		} ;
		auth.removeChild(auth.lastChild);
		auth.appendChild(logout);
	}
// phan thiet lap gia tri api **************************************************************
const queryString = window.location.search;
console.log(queryString.replace("?id=",""));
var proId = queryString.replace("?id=","");

var urlAPI = 'http://localhost:8080/backend/product/' + proId;
	console.log(urlAPI)
fetch(urlAPI)
	.then(function(response){
		return response.json();
	})
	.then(function(data){
		console.log(data);
		document.getElementById("hinhanh").innerHTML=`<img src="${data.imageURL}" alt="">`;
		//document.getElementById("description_pro").innerHTML=`${data.description} <br><br>${data.description}`;
		document.getElementById("name_pro").innerHTML=data.name;
		document.getElementById("origin").innerHTML=data.origin;
		document.getElementById("category").innerHTML=`<a href="/products?category=2" >${data.category.title}</a>`;

		document.getElementById("tab_des").innerHTML = 
		`<div class="tab1_title">
			${data.name}
		</div>
		<div class="tab1_content" id="description_pro">
			${data.summaryDescription} <br><br>${data.description}
		</div>`;
	});

// comment form
	const comment = document.getElementById("commentForm")
	comment.addEventListener('submit', e => {
		e.preventDefault()
		var comment = document.getElementById("comment_text").value;

		var urlComment = "http://localhost:8080/backend/product/"+proId+"/comment";
		const commentData = new FormData();
		commentData.append('content', comment);
		fetch(urlComment, {
			method: "POST",
			body: commentData
		})
			.then(() => { 
				location.href = 'http://localhost:8080/detail?id='+proId;
			})
	
		return false;
	})
// comment content;
fetch("http://localhost:8080/backend/product/"+proId+"/comments")
.then(function(result){
	return result.json();
})
.then(function(comments){
	var html = comments.map(function(comment){
		return `<li>
		<div class="comment_item d-flex flex-row align-items-start jutify-content-start">
			<div class="comment_image"><div><img src="${comment.user.imageURL}" alt=""></div></div>
			<div class="comment_content">
				<div class="comment_title_container d-flex flex-row align-items-center justify-content-start">
					<div class="comment_author"><a href="#">${comment.user.email}</a></div>
					<div class="comment_rating"><div class="rating_r rating_r_4"><i></i><i></i><i></i><i></i><i></i></div></div>
					<div class="comment_time ml-auto">just now</div>
				</div>
				<div class="comment_text">
					<p>${comment.content}</p>
				</div>
				<div class="comment_extras d-flex flex-row align-items-center justify-content-start">
					<div class="comment_extra comment_likes"><a href="#"><i class="fa fa-heart" aria-hidden="true"></i><span>0</span></a></div>
					<div class="comment_extra comment_reply"><a href="#"><i class="fa fa-reply" aria-hidden="true"></i><span>Reply</span></a></div>
				</div>
			</div>
		</div>
	</li>`;
	})
	document.getElementById("comment_list").innerHTML= html.join("");
})

// Add to cart
	const amount = document.getElementById("amountForm")
	amount.addEventListener('submit', e => {
		e.preventDefault()
		var amount = Number(document.getElementById("amount_input").value);
		var proId = queryString.replace("?id=","");
		 
		const amountData = new FormData();
		amountData.append('quantity', amount);
		amountData.append('productId', proId);	
		fetch("http://localhost:8080/backend/cart", {
			method: "POST",
			body: amountData
		})
			.then( () => { 
				alert(amount + "Bạn đã thêm một sản phẩm vào giỏ hàng.</br> Hãy tham khảo các sản phẩm khác ^^ !!!");
				location.href = 'http://localhost:8080/products';
			})
	
		return false;
	})

// review rating
fetch("http://localhost:8080/backend/product/"+proId+"/rates")
.then(function(response){
	return response.json();
})
.then(function(ratings){
	let count_1 = 0;
	let count_2 = 0;
	let count_3 = 0;
	let count_4 = 0;
	let count_5 = 0;
	for(var i=0; i< ratings.length; i++){
		if(ratings[i].rating == 1) count_1++;
		else if(ratings[i].rating == 2) count_2++;
		else if(ratings[i].rating == 3) count_3++;
		else if(ratings[i].rating == 4) count_4++;
		else count_5++;
	}
	let sum = count_1 + 2*count_2 + 3*count_3 + 4*count_4 + 5*count_5;
	var temp = (!ratings.length)? 0 : (sum/ratings.length); 

	document.getElementById("total_rating").innerHTML = 
	`<div class="review_rating">
	<div class="review_rating_num">${(temp).toPrecision(2)}</div>
	<div class="review_rating_stars">
		<div class="rating_r rating_r_4"><i></i><i></i><i></i><i></i><i></i></div>
	</div>
	<div class="review_rating_text">(${ratings.length} Ratings)</div>
</div>
<div class="review_rating_bars">
	<ul>
		<li><span>5 Star</span><div class="review_rating_bar"><div style="width:${count_5*100/ratings.length}%;"></div></div></li>
		<li><span>4 Star</span><div class="review_rating_bar"><div style="width:${count_4*100/ratings.length}%;"></div></div></li>
		<li><span>3 Star</span><div class="review_rating_bar"><div style="width:${count_3*100/ratings.length}%;"></div></div></li>
		<li><span>2 Star</span><div class="review_rating_bar"><div style="width:${count_2*100/ratings.length}%;"></div></div></li>
		<li><span>1 Star</span><div class="review_rating_bar"><div style="width:${count_1*100/ratings.length}%;"></div></div></li>
	</ul>
</div>`
})

// rating star
const ratingStars = [...document.getElementsByClassName("rating__star")];
const ratingResult = document.querySelector(".rating__result");
printRatingResult(ratingResult);
function executeRating(stars, result) {
   const starClassActive = "rating__star fa fa-star ";
   const starClassUnactive = "rating__star fa fa-star-o";
   const starsLength = stars.length;
   let i;
   stars.map((star) => {
      star.onclick = () => {
         i = stars.indexOf(star);
		console.log(i+1);
         if (star.className.indexOf(starClassUnactive) !== -1) {
			const starData = new FormData();
			starData.append('rating', (i+1));
			fetch("http://localhost:8080/backend/product/"+proId+"/rate", {
				method: "POST",
				body: starData
			})
			.then(()=>{
				var proId = queryString.replace("?id=","");
				location.href = 'http://localhost:8080/detail?id='+proId;
			})
            printRatingResult(result, i + 1);
            for (i; i >= 0; --i) stars[i].className = starClassActive;
         } else {
            printRatingResult(result, i);
            for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
         }
      };
   });
}
function printRatingResult(result, num = 0) {
   result.textContent = `${num}/5`;
}
executeRating(ratingStars, ratingResult);



// render right products
fetch(urlAPI) // fetch API
	.then(function(response){
		return response.json();
	})
	.then(function(right_pro_info){
		getRightData(right_pro_info);
	});

	function getRightData(right_pro_info){
		document.getElementById("proid").innerHTML=right_pro_info.id;
		document.getElementById("amount").innerHTML=right_pro_info.amount;
		document.getElementById("nguongoc").innerHTML=right_pro_info.origin;
		document.getElementById("phanloai").innerHTML=right_pro_info.category.title;
	}


// phan hieu ung user cho front-end*******************************************************************

function initMenu(){
			var tag = $('#tag');
			for(var i = 0; i < tag.length; i++){
				tag[i].onclick = function(){
					if(menuActive){
						closeMenu();
					}else{
						openMenu();
						$(document).one('click', function cls(e){
							if($(e.target).hasClass('menu_mm')){
								$(document).one('click', cls);
							}else{
								closeMenu();
							}
						});
					}
				};
			}
	}

	function openMenu(){
		menu.addClass('active');
		menuActive = true;
	}

	function closeMenu(){
		menu.removeClass('active');
		menuActive = false;
	}
initMenu();
//phan co gian menu ***************************
var header = $('.header');

function setHeader(){
	if($(window).scrollTop()>100){
		header.addClass('scrolled');
	}
	else{
		header.removeClass('scrolled');
	}
}
$(document).on('scroll', function(){
	setHeader();
});

setHeader();

// phan chuyen tab 'mo ta, comment, ratting'**********
function initTabs() {
		if($('.tab_item').length)
		{
			$('.tab_item').on('click', function()
			{
				$('.tab_item').removeClass('active');
				$(this).addClass('active');
				var clickedIndex = $('.tab_item').index(this);
				var panels = $('.tab_des');
				panels.removeClass('active');
				$(panels[clickedIndex]).addClass('active');
			});
		}
	}
initTabs();


});
	
