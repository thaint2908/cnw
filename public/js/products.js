"use strict";
const queryString = window.location.search;

const token = document.cookie.split(';').filter(el => el.trim().startsWith('token='))[0]
    .split('=')[1];

if(token){
    const auth = document.getElementById("auth")
    const logout = document.createElement("a");
    logout.href = '/login';
    logout.innerHTML="Logout";
    logout.onclick= ()=> {
        console.log("remove token");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } ;
    auth.removeChild(auth.lastChild);
    auth.appendChild(logout);
    console.log(token);
};

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
    var dashboard = document.getElementsByClassName("dashboard")[0];

    for(var i =0; i< hiddenItems.length; i++){
        if (info !="" ){
            hiddenItems[i].style.display= "inline-block";
        }else{
            hiddenItems[i].style.display= "none";
        }
    }
    
    dashboard.style.display= (!info.role) ? "inline-block":"none";

}
setHidden();


var cate_url = "http://localhost:8080/backend/categories";

fetch(cate_url, {
    method: 'GET',
})
    .then(function (result) {
        return result.json();
    })
    .then(function (pros) {
        var array_cate = [];
        array_cate.push(`<li>
		<a href="/products?category=${pros[0].id}">${pros[0].title}</a>
		</li>`);
        for (var i = 1; i < pros.length; i++) {
            var check = 1;
            for (var j = 0; j < i; j++) {
                if (pros[i].id == pros[j].id) {
                    check = 0;
                    break;
                } else check = 1;
            }
            if (check == 1) {
                array_cate.push(`<li>
			<a href="/products?category=${pros[i].id}">${pros[i].title}</a>
			</li>`);
            }
        }
        console.log(array_cate);
        document.getElementById("list_cate").innerHTML = array_cate.toString().replace(/,/g,"");
    })

/* phan newest pro ********************************************************/
var apiUrl = "http://localhost:8080/backend/products" + queryString.replace("?category=", "/category/");
console.log(apiUrl);
fetch(apiUrl, {
    method: 'GET',
})
    .then(function (response) {
        return response.json();
    })
    .then(function (products) {
        const listing_table = document.getElementById('listProduct');

        function render_newest() {
            var temp_array = [];
            if (products.length >= 6) {
                for (var i = products.length - 1; i > products.length - 6; i--) {
                    temp_array.push(`<div class="new_product">
				<img src="${products[i].imageURL}" alt="anh so 1">
				<div class="new_contesnt">
					<div class="new_para">${products[i].summaryDescription}</div>
					<div class="new_price">${products[i].price}</div>
				</div>
			</div>`);
                }
            } else {
                for (var i = products.length - 1; i >= 0; i--) {
                    temp_array.push(`<div class="new_product">
				<img src="${products[i].imageURL}" alt="anh so 1">
				<div class="new_contesnt">
					<div class="new_para">${products[i].summaryDescription}</div>
					<div class="new_price">${products[i].price}</div>
				</div>
			</div>`);
                }
            }
            document.getElementById("list_newest_pro").innerHTML = temp_array;
        }

        render_newest();


        /* phan search pro ***********************************************************/

        var search = document.getElementById("search"); // ô check ở cả html xem n bắt được thằng id này chưa
        var search_res="";

        function showSearch() {
            listing_table.innerHTML = "";
            products.filter((temp) => { 
                return (
                    temp.name.toLowerCase().includes(search_res)
                );
            })
                .forEach((temp) => {
                    console.log(temp);
                    var list = `<div class="col-lg-6">
            <div class="product">
                <div class="product_image">
                    <img class="pro_image" src="${temp.imageURL}" alt="product 1">
                </div>
                <div class="product_body">
                    <a href="/detail?id=${temp.id}">${temp.name}</a>
                    <p>${temp.origin}</p>
                    <p>${temp.summaryDescription}</p>
                </div>
                <div class="product_footer" >
                    <div class="product_amount">
                        <i class="fa fa-graduation-cap" aria-hidden="true"></i>
                        <span>Products : ${temp.amount}</span>
                    </div>
                    <div class="product_rating">
                        <i class="fa fa-star" aria-hidden="true"></i>
                        <span>${temp.productRating.avgRating}</span>
                    </div>
                    <div class="product_price">${temp.price}</div>
                </div>
            </div>  
        </div>`;
                    listing_table.innerHTML += list;
                });
        };
        showSearch();
        search.addEventListener("input", (event) =>{
            search_res = event.target.value.toLowerCase();
            showSearch();
        });
        /*
                /* phan pagination list ********************************************************/
        let current_page = 1;
        const records_per_page = 10;

        function num_pages() {
            return Math.ceil(products.length / records_per_page);
        }

        function prev_page() {
            if (current_page > 1) {
                current_page--;
                change_page(current_page);
            }
        }

        function next_page() {
            if (current_page < num_pages()) {
                current_page++;
                change_page(current_page);
            }
        }

        function change_page(page) {
            const btn_prev = document.getElementById('btn-prev');
            const btn_next = document.getElementById('btn-next');
            const listing_table = document.getElementById('listProduct');
            let page_span = document.getElementById('page_span');

            if (page < 1) {
                page = 1;
            }
            if (page > num_pages()) {
                page = num_pages();
            }

            listing_table.innerHTML = "";

            for (let i = (page - 1) * records_per_page; i < (page * records_per_page) && i < products.length; i++) {
                if(products[i].amount <=0){
                    products[i].amount= "hết hàng";
                }
                listing_table.innerHTML += `<div class="col-lg-6">
				<div class="product">
					<div class="product_image">
						<img class="pro_image" src="${products[i].imageURL}" alt="product 1">
					</div>
					<div class="product_body">
						<a href="detail?id=${products[i].id}">${products[i].name}</a>
						<p>${products[i].origin}</p>
						<p>${products[i].summaryDescription}</p>
					</div>
					<div class="product_footer" >
						<div class="product_amount">
                            <i class="fa fa-cubes" aria-hidden="true"></i>
							<span>Số lượng : ${products[i].amount}</span>
						</div>
						<div class="product_rating">
							<i class="fa fa-star" aria-hidden="true"></i>
							<span>${(products[i].productRating.avgRating).toPrecision(2)}</span>
						</div>
						<div class="product_price">${products[i].price}</div>
					</div>
				</div>
			</div>
			`;
            }
            page_span.innerHTML = `${page}/${num_pages()}`;

            btn_prev.style.display = (page === 1) ? 'none' : 'inline-block';
            btn_next.style.display = (page === num_pages()) ? 'none' : 'inline-block';
        }

        document.getElementById('btn-prev').addEventListener('click', (e) => {
            e.preventDefault();
            prev_page();
        });

        document.getElementById('btn-next').addEventListener('click', (e) => {
            e.preventDefault();
            next_page();
        });

        change_page(1);

    })
// phan hieu ung cua front end nguoi dung;////////////////////////////////////////////////
var header = $('.header');

setHeader();
initHeaderSearch();
$(window).on('scroll', function () {
    setHeader();
});

function setHeader() {
    if ($(window).scrollTop() > 100) {
        header.addClass('scrolled');
    } else {
        header.removeClass('scrolled');
    }
}

function initHeaderSearch() {
    if ($('.search_button').length) {
        $('.search_button').on('click', function () {
            if ($('.header_search_container').length) {
                $('.header_search_container').toggleClass('active');
            }
        });
    }
}
