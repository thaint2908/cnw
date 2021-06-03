$(document).ready(function() {
    "user strict";
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
// Detach token ***************************************/
    function detachToken(){
        return document.cookie.split(';').filter(el => el.trim().startsWith('token='))[0].split('=')[1];
    }
// Decode Token to infoUser***********************************/
    function decodeToken(){
        const token = detachToken();
        function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        };
        return parseJwt(token);
    }
    
    console.log(decodeToken().userId);
    var info = decodeToken();
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
    

//******************************************** */
    const imgEdit = document.getElementById('myFileInput');
    imgEdit.addEventListener('change',  (e) => {
        console.log(e.target.files);
        const newAvatar = e.target.files[0];
        const avtData = new FormData;
        avtData.append("image",newAvatar);
        const url = "/backend/user/avatar/" + decodeToken().userId;
        fetch(url, {
            method: "PUT",
            body: avtData,
        })
            .then(result => {
                console.log(result)})
            .catch(err => {
                console.log(err)});
        setTimeout(function () { window.location.reload();},1000)
    });


    /*********************************/


    let userUrl = 'http://localhost:8080/backend/admin/user/' + decodeToken().userId ;
    console.log(userUrl);
    let head = new Headers();
    head.append('Authorization', `Bearer ${detachToken()}`);
    console.log(detachToken());

    let req = new Request(userUrl, {
        method: 'GET',
        mode: 'cors',
        headers: head
    });

    var tmp;
    fetch(req)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            tmp = data;
            document.getElementById("fn").innerHTML=data.firstName;
            document.getElementById("ln").innerHTML=data.lastName;
            document.getElementById("email").innerHTML=data.email;
            document.getElementById("imgAvatar").src = data.imageURL;
            document.getElementById("pn").innerHTML=data.phoneNumber;
            document.getElementById("addr").innerHTML=data.address;
            let date_tmp = data.dateOfBirth.split("-");
            data.dateOfBirth = date_tmp[2] + "/" + date_tmp[1] + "/" + date_tmp[0];
            document.getElementById("dob").innerHTML=data.dateOfBirth;
        });


    var urlAPI = 'http://localhost:8080/backend/products?page=1';
    var array = [];
    fetch(urlAPI)
        .then(function(products){
            return products.json();
        })
        .then(function(products){
            console.log(products);
            var listHistory = document.querySelector('#list_pro_history');
            array = products;

            var list_pro_his = products.map(function(product){
                return `
            <div class="col-md-3 mb-5">
                <div class="card h-100">
                <div class="card-body">
                    <img style="height:210px; width:100%;" src="${product.imageURL.value}" alt="anh san pham">
                    <p>ten san pham</p>
                    <a style="float:right;" class="price" href="#">${product.price.value} vnd</a>
                </div>
                <div class="card-footer">
                    <a href="#" class="btn btn-primary btn-sm">More Info</a>
                    <a style="float:right;" href="#" class="btn btn-warning btn-sm">Delete History</a>
                </div>
                </div>
            </div>
            `
            });
            listHistory.innerHTML = list_pro_his.join('');
            console.log(array);
        })

// phan hieu ung phia khach hang ********************************************************************

    document.getElementById("editBtn").onclick = function(){
        document.getElementById("fn").innerHTML = `<input type="text" class="form-control" id="firstNameInput" value="${tmp.firstName}">`;
        document.getElementById("ln").innerHTML = `<input type="text" class="form-control" id="lastNameInput" value="${tmp.lastName}">`;
       // document.getElementById("email").innerHTML = `<input type="email" class="form-control" id="emailInput" value="${tmp.email}">`;
        document.getElementById("pn").innerHTML = `<input type="text" class="form-control" id="phoneNumberInput" value="${tmp.phoneNumber}">`;
        document.getElementById("addr").innerHTML = `<input type="text" class="form-control" id="addressInput" value="${tmp.address}">`;
        let date_tmp = tmp.dateOfBirth.split("/");
        let date = date_tmp[2] + "-" + date_tmp[1] + "-" + date_tmp[0];
        document.getElementById("dob").innerHTML = `<input type="date" class="form-control" id="dateOfBirthInput" value="${date}">`;
        document.getElementById("editBtn").style.display = "none";
        document.getElementById("saveBtn").style.display = "inline-flex";
        document.getElementById("cancelBtn").style.display = "inline-flex";
    }

    document.getElementById("cancelBtn").onclick = function(){
        document.getElementById("fn").innerHTML = tmp.firstName;
        document.getElementById("ln").innerHTML = tmp.lastName;
        document.getElementById("email").innerHTML = tmp.email;
        document.getElementById("pn").innerHTML = tmp.phoneNumber;
        document.getElementById("addr").innerHTML = tmp.address;
        document.getElementById("dob").innerHTML = tmp.dateOfBirth;
        document.getElementById("editBtn").style.display = "block";
        document.getElementById("cancelBtn").style.display = "none";
        document.getElementById("saveBtn").style.display = "none";
    }

    document.getElementById("saveBtn").onclick = async function(){
        let url = "/backend/admin/editUser/" + decodeToken().userId;    /*putUser Controller thêm req.params.userId, req.body.address
                                                                        sửa req.email thành req.body.email
                                                                        sửa điều kiện update id: userId
                                                                        sửa câu lệnh update     if (lastName) {
                                                                                                    user = {
                                                                                                        ...user,
                                                                                                        lastName: lastName,
                                                                                                    }
                                                                                                }
                                                                                                các câu lệnh khác tương tự
                                                                    */
        let userFormData = new FormData;
        userFormData.append("firstName", document.getElementById("firstNameInput").value);
        userFormData.append("lastName", document.getElementById("lastNameInput").value);
        //userFormData.append("email", document.getElementById("emailInput").value);
        //userFormData.append('imageUrl',document.getElementById("myFileInput").files[0]);
        userFormData.append("phoneNumber", document.getElementById("phoneNumberInput").value);
        userFormData.append("dateOfBirth", document.getElementById("dateOfBirthInput").value);
        userFormData.append("address", document.getElementById("addressInput").value);
        await fetch(url, {
            method: "PUT",
            body: userFormData
        });
        window.location.reload();
    }

    document.getElementById("changeBtn").onclick = function(){
        document.getElementById("password_modal").style.display = "inline-flex";
    }

    document.getElementById("saveChange").onclick = async function(){
        let changePasswordForm = new FormData();
        let url = "/backend/admin/changePassword/" + decodeToken().userId;

        changePasswordForm.append("currentPassword", document.getElementById("currentPassword").value);
        changePasswordForm.append("newPassword", document.getElementById("newPassword").value);
        changePasswordForm.append("reNewPassword", document.getElementById("reNewPassword").value);
        let change = await fetch(url, {
            method: "POST",
            body: changePasswordForm
        }).then(res => res.json());
        if (change.token) {
            alert("Your password has been successfully changed");
            location.href='/user';
        } else {
            alert("Failed to change password");
            document.getElementById("currentPassword").innerHTML = "";
            document.getElementById("newPassword").innerHTML = "";
            document.getElementById("reNewPassword").innerHTML = "";
        }
    }

    document.getElementById("cancelChange").onclick = function(){
        document.getElementById("password_modal").style.display = "none";
    }

    window.onclick = function(e){
        if(e.target == document.getElementById("password_modal")){
            document.getElementById("password_modal").style.display = "none";
        }
    }

//phan co gian menu *****************
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


});