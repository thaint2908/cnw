

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

var now = new Date();
var dd = now.getDate();
var mm = now.getMonth() + 1;
var yyyy = now.getFullYear();

if (dd < 10) {
    dd = "0" + dd;
}

if (mm < 10) {
    mm = "0" + mm;
}
// date.max = yyyy + "-" + mm + "-" + dd;

const signup = document.getElementById('signupForm');
signup.addEventListener('submit',e =>{
    e.preventDefault()

    const loginData = new FormData

    const firstName = document.getElementById("signup_firstName").value;
    const address = document.getElementById("signup_address").value;
    const lastName = document.getElementById("signup_lastName").value;
    const email = document.getElementById("signup_email").value;
    const password = document.getElementById("signup_password").value;
    const phoneNumber = document.getElementById("signup_phoneNumber").value;
    const image = document.getElementById("signup_image").files[0];
    const dateOfBirth = document.getElementById("signup_dateOfBirth").value;
    loginData.append('firstName', firstName);
    loginData.append('lastName', lastName);
    loginData.append('email', email);
    loginData.append('password', password);
    loginData.append('phoneNumber', phoneNumber);
    loginData.append('image', image);
    loginData.append('address', address);
    loginData.append('dateOfBirth', dateOfBirth);
    fetch("http://localhost:8080/backend/auth/signup", {
        method: "POST",
        body: loginData
    })
        .then(function (response) {
            return response.json()
        })
        .then(data => {
            if(data.message){
                alert("Signup was successful");
                location.href = "http://localhost:8080/login"
            } else {
                alert("Signup was failed");
                email.innerHTML = "";
                password.innerHTML = "";
            }
        })
})