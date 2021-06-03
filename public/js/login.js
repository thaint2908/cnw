

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
    
    // dashboard.style.display= (!info.role) ? "inline-block":"none";

}
setHidden();


var login_form = document.getElementById("login_form");
var sign_up_form = document.getElementById("sign_up_form");
var login_bc = document.getElementById("login_bc");
var date = document.getElementById("dateOfBirth");

const login = document.getElementById("loginForm")
login.addEventListener('submit', e => {
    e.preventDefault()
    var username = document.getElementById("username_login").value;
    var password = document.getElementById("password_login").value;
     
    const loginData = new FormData();
    loginData.append('email', username);
    loginData.append('password', password);
    fetch("http://localhost:8080/backend/auth/login", {
        method: "POST",
        body: loginData
    })
        .then(function (response) {
            return response.json()
        })
        .then(data => { 
            if (data.token) {
                document.cookie = `token=${data.token}; expires=${1800000}; path=/;`
                alert("Login was successful");
                location.href = 'http://localhost:8080/index';
            } else {
                alert("Login was failed");
                username.innerHTML = "";
                password.innerHTML = "";
            }
        })

    return false;
})

