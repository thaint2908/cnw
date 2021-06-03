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


fetch( "http://localhost:8080/backend/carts")
    .then(function(response){
        return response.json();
    })
    .then(function(cart_items){
        var list_cart = document.getElementById("list_cart");
        var totalPrice = 0;
        var totalPro =0;
        var htmls = [];
        for(var i =0; i< cart_items.length; i++){
            htmls.push(`<div class="basket-product">
            <div class="item">
              <div class="product-image">
                <img src="${cart_items[i].product.imageURL}" alt="Placholder Image 2" class="product-frame">
              </div>
              <div class="product-details">
                <h1><strong><span class="item-quantity">${cart_items[i].quantity} x </span>${cart_items[i].product.name}</strong></h1>
                <p>${cart_items[i].product.summaryDescription}</p>
                <p><strong>So luong con lai: ${cart_items[i].product.amount}</strong></p>
                <p>Xuat su: ${cart_items[i].product.origin}</p>
              </div>
            </div>
            <div class="price">${"  "+ cart_items[i].product.price}</div>
            <div class="quantity">
              <input type="number" value="${cart_items[i].quantity}" min="1" class="quantity-field">
            </div>
            <div class="subtotal">${"  "+cart_items[i].quantity * cart_items[i].product.price}</div>
            <div class="remove">
              <button id="deleteButton">Remove</button>
            </div>
          </div>`);

            totalPrice += cart_items[i].quantity * cart_items[i].product.price;
            totalPro += cart_items[i].quantity;
        }

        console.log(totalPro);
        document.getElementById("total_pro").innerHTML = totalPro;
        document.getElementById("basket-subtotal").innerHTML= "  "+ totalPrice;
        document.getElementById("basket-total").innerHTML= " "+totalPrice;
        list_cart.innerHTML= htmls.toString().replace(",","");

        return cart_items;
    })
    .then((cart_items)=>{
        console.log(cart_items);
        var button = document.querySelectorAll("#deleteButton");
        for(var i =0; i<button.length; i++){
            button[i].addEventListener('click', e =>{
                var tempId = cart_items[i].productId;
                e.preventDefault();
                fetch("http://localhost:8080/backend/cart/"+tempId,{
                    method : "DELETE"
                })
                    .then( () => {
                        location.href = "http://localhost:8080/cart";
                    })
                return false;
            });
            break;
        }
    })

//print bill for check out ***********************************///////////\
var bill_content = document.getElementById("modal_checkout");
fetch("http://localhost:8080/backend/carts")
.then((response)=>{
    return response.json();
})
.then((products)=>{
    var htmls = products.map((data)=>{
        return `<ul style="display: inline-grid;">
        <li><Strong>Name of Product :</Strong>${data.product.name}</li>
        <li><Strong>Unit Price : </Strong>${data.product.price}</li>
        <li><Strong>Quantity : </Strong>${data.quantity}</li>
        <li><Strong>Origin :   </Strong>${data.product.origin}</li>
        <li><Strong>Date time :    </Strong>${data.updatedAt}</li>
    </ul>
    <p>---------------------------------------------------</p>`
    });
    
    bill_content.innerHTML=htmls.join("");
})

document.getElementById("pay_button").addEventListener('click', e =>{
    e.preventDefault();
    fetch("http://localhost:8080/backend/order",{
        method : "POST"
    })
    .then(()=>{
        location.href = "http://localhost:8080/index";
        alert("Cam on ban da mua hang");
    })
    return false;
})



// change in js***************************************/
var promoCode;
var promoPrice;
var fadeTime = 300;
$('.quantity input').change(function() {
    updateQuantity(this);
});
$('.remove button').click(function() {
    removeItem(this);
});
$(document).ready(function() {
    updateSumItems();
});
function recalculateCart(onlyTotal) {
    var subtotal = 0;

    $('.basket-product').each(function() {
        subtotal += parseFloat($(this).children('.subtotal').text());
    });
    var total = subtotal;
    if (onlyTotal) {
        $('.total-value').fadeOut(fadeTime, function() {
            $('#basket-total').html(total.toFixed(2));
            $('.total-value').fadeIn(fadeTime);
        });
    } else {
        $('.final-value').fadeOut(fadeTime, function() {
            $('#basket-subtotal').html(subtotal.toFixed(2));
            $('#basket-total').html(total.toFixed(2));
            if (total == 0) {
                $('.checkout-cta').fadeOut(fadeTime);
            } else {
                $('.checkout-cta').fadeIn(fadeTime);
            }
            $('.final-value').fadeIn(fadeTime);
        });
    }
}

function updateQuantity(quantityInput) {
    var productRow = $(quantityInput).parent().parent();
    var price = parseFloat(productRow.children('.price').text());
    var quantity = $(quantityInput).val();
    var linePrice = price * quantity;

    productRow.children('.subtotal').each(function() {
        $(this).fadeOut(fadeTime, function() {
            $(this).text(linePrice.toFixed(2));
            recalculateCart();
            $(this).fadeIn(fadeTime);
        });
    });

    productRow.find('.item-quantity').text(quantity);
    updateSumItems();
}

function updateSumItems() {
    var sumItems = 0;
    $('.quantity input').each(function() {
        sumItems += parseInt($(this).val());
    });
    $('.total-items').text(sumItems);
}

function removeItem(removeButton) {
    var productRow = $(removeButton).parent().parent();
    productRow.slideUp(fadeTime, function() {
        productRow.remove();
        recalculateCart();
        updateSumItems();
    });
}

// phan hieu ung user cho front-end*******************************************************************

function initMenu(){
    var tag = $('#tag');
    for(var i = 0; i < tag.length; i++){
        tag[i].onclick = function(){
            if(menuActive){
                closeMenu();
            }
            else{
                openMenu();

                $(document).one('click', function cls(e){
                    if($(e.target).hasClass('menu_mm')){
                        $(document).one('click', cls);
                    }
                    else{
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
function initTabs()
{
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