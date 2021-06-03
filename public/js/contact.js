

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
    var textlog = document.getElementById("text_log");
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
